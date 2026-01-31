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
        let { name_user, last_name, phone, email, address, province, city, password, type } = req.body;
        // Si type es null o undefined, asignar 3 (cliente)
        if (type === null || type === undefined) {
          type = 3;
        }
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
          type
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

      res.status(201).json({ message: "Registro completado. Revisa tu correo para verificar la cuenta." });

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
 
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al cargar el usuario' });
    }
  };
  
  updateProfile = async (req, res) => {
    try {
      
      const { user_id } = req;
      const { name_user, last_name, phone, province, city, address }  = JSON.parse(req.body.editUser);
      

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
        
        res.status(200).json({ message: "Mensaje enviado" });
      } catch (error) {
        console.log(error);
      res.status(500).json({ message: "Error al enviar el mensaje" });

    }
  };
  
 
  
}

export default new UserController();
