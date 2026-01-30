import userDal from './user.dal.js';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { sendEmail, sendContactEmail } from '../../services/emailService.js';
import { generateToken } from '../../utils/jwtUtils.js';
import { compareString } from '../../utils/bcryptUtils.js';
import { generarContrasena } from '../../utils/generarPassAle.js';

class UserController {
  register = async (req, res) => {
    try {
      const { name_user, last_name, phone, email, address, province, city, password } = req.body;
      
      let hashedPass = await bcrypt.hash(password, 10);
      
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
      
      const token = generateToken({ email }, process.env.SECRET_TOKEN_KEY, { expiresIn: "1d" });
      
      const html = `
      <h1>Bienvenido a Brüver</h1>
      <p>Hola ${name_user}, gracias por registrarte.</p>
      <p>Por favor, verifica tu cuenta aquí:</p>
      <a href="${process.env.BACKEND_URL}/user/verifyEmail/${token}">Verificar mi cuenta</a>
      <p>Este enlace expira en 24 horas.</p>
      `;
      
      try {
        await sendEmail(email, html);
      } catch (error) {
        console.log('Error al enviar email:', error);
      }
<<<<<<< HEAD

      res.status(201).json({ message: "Registro completado. Revisa tu correo para verificar la cuenta." });

=======
      
      res.status(201).json({ message: "Registro completado. Revisa tu correo para verificar la cuenta." });
>>>>>>> 39c4229de4ba00c9ec08f005aab9941524b3a10b
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al registrar el usuario' });
    }
  };
  
  verifyEmail = async (req, res) => {
    try {
      const { token } = req.params;
      
      const tokenVerified = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
      
      await userDal.verifyEmail(tokenVerified.email);
      
      res.redirect(`${process.env.FRONTEND_URL}/login`);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'No se pudo verificar el email' });
    }
  };
  
  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      
      let result = await userDal.findUserByEmail(email);
      
      if (result.length === 0) {
        res.status(401).json({ message: 'El email no existe' });
      } else if (result[0].is_confirmed === 0) {
        res.status(401).json({ message: 'Primero verifica tu email' });
      } else {
        let match = await compareString(password, result[0].password);
        
        if (match === false) {
          res.status(401).json({ message: 'Contraseña incorrecta' });
        } else {
          const token = generateToken({ user_id: result[0].user_id });
          res.status(200).json({ message: 'Login ok', token });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al iniciar sesión' });
    }
  };
  
  userByToken = async (req, res) => {
    try {
      const { user_id } = req;
      
      const result = await userDal.userByToken(user_id);
      
      res.status(200).json({ message: "Usuario cargado", user: result[0] });
<<<<<<< HEAD

=======
>>>>>>> 39c4229de4ba00c9ec08f005aab9941524b3a10b
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al cargar el usuario' });
    }
  };
  
  /* update */
  updateProfile = async (req, res) => {
    try {
      //Este código es para pasar todos los datos a string
      const editUserData = typeof req.body === 'string' 
        ? JSON.parse(req.body) 
        : req.body;
      
      const { name_user, last_name, phone, province, city, address } = editUserData;
      const { user_id } = req;

      let values = [name_user, last_name, phone, province, city, address, user_id];
      
      if(req.file) {
        values = [name_user, last_name, phone, province, city, address, req.file.filename, user_id];
      }
      
      await userDal.updateProfile(values);
      const result = await userDal.userByToken(user_id);

      res.status(200).json({
        message: "update ok",
        user: result[0],
        newAvatar: req.file?.filename
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al actualizar el perfil', error: error.message });
    }
  }

  /* borrado logico */
  deleteLogic = async (req, res) => {
    try {
      const { user_id } = req;

      let values = [user_id];

      await userDal.deleteLogic(values);

      res.status(200).json({ message: 'borrado lógico ok' });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;

      const result = await userDal.findUserByEmail(email);

      if (result.length === 0) {
        res.status(404).json({ message: 'El email no está registrado' });
      } else {
        let passGenerada = generarContrasena();
        let hashedPass = await bcrypt.hash(passGenerada, 10);

        await userDal.updatePassword(hashedPass, email);

        const html = `
          <h1>Recuperación de contraseña</h1>
          <p>Tu nueva contraseña es: ${passGenerada}</p>
        `;

        await sendEmail(email, html);

        res.status(200).json({ message: 'Nueva contraseña enviada al correo' });
      }
<<<<<<< HEAD
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: 'Error al enviar el correo de recuperación' });
    }
  };

  sendContact = async (req, res) => {
    try {
      const { nombre, telefono, email, mensaje } = req.body;

      await sendContactEmail({ nombre, telefono, email, mensaje });

      res.status(200).json({ message: 'Mensaje enviado' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al enviar el mensaje' });
=======
    };
    
    sendContact = async (req, res) => {
      try {
        const { nombre, telefono, email, mensaje } = req.body;
        
        await sendContactEmail({ nombre, telefono, email, mensaje });
        
        res.status(200).json({ message: "Mensaje enviado" });
      } catch (error) {
        console.log(error);
      res.status(500).json({ message: "Error al enviar el mensaje" });
>>>>>>> 39c4229de4ba00c9ec08f005aab9941524b3a10b
    }
  };
  
  // Obtener trabajadores (type = 2)
  getWorkers = async (req, res) => {
    try {
      const workers = await userDal.getUsersByType(2);
      res.status(200).json({ workers });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error al obtener trabajadores" });
    }
  };
  
  // Obtener clientes (type = 3)
  getClients = async (req, res) => {
    try {
      const clients = await userDal.getUsersByType(3);
      res.status(200).json({clients });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error al obtener clientes" });
    }
  };

  // Obtener admins (type = 1)
  getAdmins = async (req, res) => {
    try {
      const admins = await userDal.getUsersByType(1);
      res.status(200).json({ admins });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error al obtener admins" });
    }
  };

  // Cambiar el tipo de usuario a admin (type = 1)
  makeAdmin = async (req, res) => {
    try {
      const { id } = req.params;
      await userDal.updateUserType(id, 1);
      res.status(200).json({ message: "Usuario actualizado a admin" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error al actualizar el usuario" });
    }
  };
  
  // Cambiar el tipo de usuario a trabajador (type = 2)
  makeWorker = async (req, res) => {
    try {
      const { id } = req.params;
      await userDal.updateUserType(id, 2);
      res.status(200).json({ message: "Usuario actualizado a trabajador" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error al actualizar el usuario" });
    }
  };
  
}

export default new UserController();
