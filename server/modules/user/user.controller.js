// 1) Importamos funciones de email (registro/recuperación/contacto)
import { sendEmail, sendContactEmail } from "../../services/emailService.js";

// 2) Importamos el DAL (la capa que habla con la base de datos)
import userDal from "./user.dal.js";

// 3) Librerías para cifrar contraseña y verificar tokens
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// 4) Utilidades del proyecto (token, comparar contraseña, generar contraseña aleatoria)
import { generateToken } from "../../utils/jwtUtils.js";
import { compareString } from "../../utils/bcryptUtils.js";
import { generarContrasena } from "../../utils/generarPassAle.js";

class UserController {
  // 1) REGISTRO: crea un usuario en BD y manda email de verificación
  register = async (req, res) => {
    try {
      // 1.1) Datos que llegan desde el frontend
      const { name_user, last_name, phone, email, address, province, city, password } = req.body;

      // 1.2) Ciframos la contraseña antes de guardarla
      let hashedPass = await bcrypt.hash(password, 10);

      // 1.3) Guardamos el usuario en la BD (DAL)
      await userDal.register([
        name_user,
        last_name || null,
        phone,
        email,
        address || null,
        province || null,
        city || null,
        hashedPass,
      ]);

      // 1.4) Creamos un token para verificar el email (expira en 1 día)
      const token = generateToken({ email }, process.env.SECRET_TOKEN_KEY, { expiresIn: "1d" });

      // 1.5) HTML del email con el link de verificación (total mente editable)
      const html = `
        <h1>Bienvenido a Brüver</h1>
        <p>Hola ${name_user}, gracias por registrarte.</p>
        <p>Verifica tu cuenta aquí:</p>
        <a href="${process.env.BACKEND_URL}/user/verifyEmail/${token}">Verificar mi cuenta</a>
        <p>Este enlace expira en 24 horas.</p>
      `;

      try {
        await sendEmail(email, html);
      } catch (err) {
        console.log("Error al enviar email", err);
      }

      // respuesta del front
      res.status(200).json({
        message: "Registro completado. Revisa tu correo para verificar la cuenta.",
      });
    } 
    catch (error) 
    {
      console.log(error);
      res.status(500).json({ message: "Error al registrar el usuario" });
    }
  };

  // 2) VERIFICAR EMAIL: confirma la cuenta y redirige al login del frontend
  verifyEmail = async (req, res) => {
    try {
      // 2.1) Sacamos el token de la URL
      const { token } = req.params;

      // 2.2) Verificamos el token 
      const tokenVerified = jwt.verify(token, process.env.SECRET_TOKEN_KEY);

      // Marcamos en BD el usuario como confirmado (is_confirmed = 1)
      await userDal.verifyEmail(tokenVerified.email);

      res.redirect(`${process.env.FRONTEND_URL}/login`);
    } 
    catch (error) 
    {
      console.log(error);
      res.status(500).json({ message: "No se pudo verificar el email" });
    }
  };

  // 3) LOGIN: comprueba usuario, confirmación y contraseña, y devuelve token
  login = async (req, res) => {
    const { email, password } = req.body;

    try {
      // 3.1) Buscamos el usuario por email
      let result = await userDal.findUserByEmail(email);

      //  Si no existe
      if (result.length === 0) {
        return res.status(401).json({ message: "El email no existe" });
      }

      // Si no está confirmado por email
      if (result[0].is_confirmed === 0) {
        return res.status(401).json({ message: "Primero verifica tu email" });
      }

      // Comparamos la contraseña escrita con la cifrada en BD
      let match = await compareString(password, result[0].password);

      if (!match) {
        return res.status(401).json({ message: "Contraseña incorrecta" });
      }

      const token = generateToken({ user_id: result[0].user_id });
      res.status(200).json({ message: "Sesión iniciada", token });
    } 
    catch (error) 
    {
      console.log(error);
      res.status(500).json({ message: "Error al iniciar sesión" });
    }
  };

  // 4) devuelve los datos del usuario logueado
  userByToken = async (req, res) => {
    
    const { user_id } = req;

    try {
    
      const result = await userDal.userByToken(user_id);

      res.status(200).json({ message: "Usuario cargado", user: result[0] });
    } 
    catch (error) 
    {
      res.status(500).json({ message: "Error al cargar el usuario" });
    }
  };

  // 5)actualiza datos del usuario 
  updateProfile = async (req, res) => {
    const { user_id } = req;
    const { name_user, last_name, phone, province, city, address } = req.body;

    try {

      if(req.file){
        let values=[name_user, last_name, phone, province, city, address, req.file.filename, user_id];
      }

      // 5) Actualizamos en BD
      await userDal.updateProfile(values);


      //Volvemos a pedir el usuario actualizado
      const result = await userDal.userByToken(user_id);

      // Devolvemos el usuario actualizado
      res.status(200).json({ message: "Perfil actualizado", user: result[0] });
    } 
    catch (error) 
    {
      console.log(error);
      res.status(500).json({ message: "Error al actualizar el perfil" });
    }
  };

  // 6) borrado lógico del usuario (is_deleted = 1)
  deleteLogic = async (req, res) => {
    const { user_id } = req;

    try {
      await userDal.deleteLogic(user_id);
      res.status(200).json({ message: "Perfil eliminado (borrado lógico)" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error al eliminar el perfil" });
    }
  };

  // 7) genera contraseña nueva y la manda por correo
  forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
      // Comprobamos si existe el email
      const result = await userDal.findUserByEmail(email);

      if (result.length === 0) {
        return res.status(404).json({ message: "El email no está registrado" });
      }

      // Generamos contraseña y la ciframos
      let passGenerada = generarContrasena();
      let hashedPass = await bcrypt.hash(passGenerada, 10);

      // Guardamos la nueva contraseña en BD
      await userDal.updatePassword(hashedPass, email);

      // Enviamos la nueva contraseña por email
      const html = `
        <h1>Recuperación de contraseña</h1>
        <p>Tu nueva contraseña es: ${passGenerada}</p>
      `;

      await sendEmail(email, html);

      
      res.status(200).json({ message: "Nueva contraseña enviada al correo" });
    } 
    catch (error) 
    {
      console.log(error);
      res.status(500).json({ message: "Error al enviar el correo de recuperación" });
    }
  };

  // 8) CONTACTO: manda email de contacto desde el formulario
  sendContact = async (req, res) => {
    try {
      
      const { nombre, telefono, email, mensaje } = req.body;

      await sendContactEmail({ nombre, telefono, email, mensaje });

      res.status(200).json({ message: "Mensaje enviado" });
    }
     catch (error) 
     {
      console.error(error);
      res.status(500).json({ message: "Error al enviar el mensaje" });
    }
  };
}

export default new UserController();
