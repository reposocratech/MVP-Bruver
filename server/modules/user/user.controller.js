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

        const existingUser = await userDal.findUserByEmail(email);
        if (existingUser.length > 0) {
          return res.status(409).json({ message: 'El email ya está registrado' });
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
      

      const verifyUrl = `${process.env.BACKEND_URL}/user/verifyEmail/${token}`;
      const instagramUrl = "https://instagram.com/bruver_oficial";
      const whatsappUrl = "https://wa.me/34TU_NUMERO"; // ej: https://wa.me/34600111222

      const html = `
    <div style="background:#f4efe8;padding:30px 12px;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:18px;padding:28px;font-family:Raleway,Arial,sans-serif;color:#3a2f2a;">

      <h1 style="margin:0 0 10px 0;font-family:Lora,Georgia,serif;font-size:28px;color:#6bb3a7;text-align:center;">
        Bienvenido a Brüver
      </h1>

      <p style="margin:0 0 14px 0;font-size:16px;line-height:1.5;text-align:center;">
        Hola <strong>${name_user}</strong>, gracias por registrarte.
      </p>

      <p style="margin:0 0 18px 0;font-size:16px;line-height:1.5;text-align:center;">
        Por favor, verifica tu cuenta aquí:
      </p>

      <div style="text-align:center;margin:20px 0 18px 0;">
        <a href="${verifyUrl}"
           style="display:inline-block;background:#6bb3a7;color:#ffffff;text-decoration:none;font-weight:700;
                  padding:12px 22px;border-radius:999px;font-size:15px;">
          Verificar mi cuenta
        </a>
      </div>

      <p style="margin:0;font-size:13px;color:#6a5a50;text-align:center;">
        Este enlace expira en 24 horas.
      </p>

      <hr style="border:none;border-top:1px solid rgba(0,0,0,0.08);margin:22px 0;" />

      <p style="margin:0 0 10px 0;font-size:14px;color:#6a5a50;text-align:center;">
        Síguenos en redes
      </p>

      <div style="text-align:center;font-size:14px;">
        <a href="${instagramUrl}" style="color:#6bb3a7;text-decoration:none;font-weight:700;margin:0 10px;">
          Instagram
        </a>
        <a href="${whatsappUrl}" style="color:#6bb3a7;text-decoration:none;font-weight:700;margin:0 10px;">
          WhatsApp
        </a>
      </div>

    </div>
  </div>
`;

      
      try {
        await sendEmail(email, html);
      } catch (error) {
        console.log('Error al enviar email:', error);
      }

      res.status(201).json({ message: "Registro completado. Revisa tu correo para verificar la cuenta." });

    } catch (error) {
      if (error?.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'El email ya está registrado' });
      }
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

   // Obtener trabajadores (type = 2)
  getWorkers = async (req, res) => {
    try {
      const result = await userDal.getUsersByType(2, 1);
      res.status(200).json({ workers: result });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error al obtener trabajadores" });
    }
  };
  
  // Obtener clientes (type = 3)
  getClients = async (req, res) => {
    try {
      const result = await userDal.getUsersByType(3);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error al obtener clientes" });
    }
  };

  // Obtener admins (type = 1)
  getAdmins = async (req, res) => {
    try {
      const result = await userDal.getUsersByType(1, 1);
      res.status(200).json({ admins: result });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error al obtener admins" });
    }
  };
  
 
  
}

export default new UserController();
