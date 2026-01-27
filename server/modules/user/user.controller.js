import { sendEmail } from '../../services/emailService.js';
import userDal from './user.dal.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/jwtUtils.js';

import { sendContactEmail } from "../../services/emailService.js";

import jwt from 'jsonwebtoken';
import { compareString } from '../../utils/bcryptUtils.js';
import { generarContrasena } from '../../utils/generarPassAle.js';


class UserController {

  register = async (req, res) => {
    try {
      const { name_user, last_name, phone, email, province, city, password } =
        req.body;

      let hashedPass = await bcrypt.hash(password, 10);
      let result = await userDal.register([
        name_user,
        last_name || null,
        phone,
        email,
        province || null,
        city || null,
        hashedPass,
      ]);

      const token = generateToken({email}, process.env.SECRET_TOKEN_KEY, {expiresIn: '1d'});
      const html = `<h1>Bienvenido a Brüver</h1>
        <p>Hola ${name_user}, gracias por registrarte.</p>
        <p>Por favor, verifica tu cuenta haciendo clic en el siguiente enlace:</p>
        <a href="${process.env.BACKEND_URL}/user/verifyEmail/${token}">Verificar mi cuenta</a>
        <p>Este enlace expira en 24 horas.</p>`;

      try {
        await sendEmail(email, html);
      } catch (err) {
        console.log("Error al enviar email", err);
      }
        res.status(200).json({message:"Registro completo, verifica tu correo"});

    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  verifyEmail = async (req, res) => {
    try {
      const { token } = req.params;
      const tokenVerified = jwt.verify(token, process.env.SECRET_TOKEN_KEY);

      let result = await userDal.verifyEmail(tokenVerified.email);
      res.redirect(`${process.env.FRONTEND_URL}/login`);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error de verificación' });
    }
  };

  login = async (req, res) => {
    const {email, password} = req.body;

    try {
      let result = await userDal.findUserByEmail(email);
      if(result.length === 0){
        res.status(401).json({message:"Email no existe"});
      }
      else if(result[0].is_confirmed === 0){
        res.status(401).json({message:"Por favor, verifica tu email"});
      }
      else{
        let match = await compareString(password, result[0].password);
        if(!match){
          res.status(401).json({message:"Contraseña incorrecta"});
        }else{
          const token = generateToken({user_id:result[0].user_id})
          res.status(200).json({message: "login correcto", token});
        }
    } 
    }catch (error) {
      console.log("****", error);
      res.status(500).json(error);
    }
  };
      

  userByToken = async (req, res) => {
    const {user_id} = req;
    console.log(user_id);
    try {
      const result = await userDal.userByToken(user_id);
      res.status(200).json({message:"ok", user: result[0]});
    } catch (error) {
      res.status(500).json(error);
    }
  }

    

   forgotPassword = async (req, res) => {
     const {email} = req.body;
     try {
       const result = await userDal.findUserByEmail(email);
      if(result.length === 0){
        res.status(404).json({message:"Email no registrado"});
      }else{
        let passGenerada = generarContrasena()
        let hashedPass = await bcrypt.hash(passGenerada, 10);
        const result = await userDal.updatePassword(hashedPass, email)
        const html = `<h1>Correo de recuperación de contraseña</h1>
        <p>Tu nueva contraseña es: ${passGenerada} </p>
        <p>Este enlace expira en 24 horas.</p>`;
        await sendEmail(email, html);
        res.status(200).json({message: "Correo enviado correctamente"});
      }
    
    } catch (error) {
      console.log(error);
      res.status(500).json({message: "Error al enviar el correo"});
    }
  }  
        




        

       
      
      
   
     
  
  
    

// getProfile = async (req, res) => {
//     try {
//       let userId = req.user_id;
//       let result = await userDal.getProfileById(userId);

//       if (!result || result.length === 0) {
//         return res.status(404).json({ message: 'Usuario no encontrado' });
//       }
//       res.status(200).json({
//         ok: true,
//         user: result[0],
//       });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json(error);
//     }
//   }

    sendContact = async (req, res) => {
      try {
        const { nombre, telefono, email, mensaje } = req.body;

        await sendContactEmail({ nombre, telefono, email, mensaje });

        res.json({ ok: true });
      } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false });
      }
    };
  
  };





export default new UserController();