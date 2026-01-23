import { sendEmail } from '../../services/emailService.js';
import userDal from './user.dal.js';
import bcrypt from "bcrypt";
import { generateToken } from '../../utils/jwtUtils.js';

class UserController {
    register = async (req, res) => {
      try {
        const {name_user, last_name, phone, email, province, city, password} = req.body;
        
        let hashedPass = await bcrypt.hash(password, 10);
        let result = await userDal.register([name_user, last_name || null, phone, email, province || null, city || null, hashedPass]);
        
        const token = generateToken( email, process.env.SECRET_PASSWORD, {expiresIn: '15m'} );
        const html = `<h1>Bienvenido a Brüver</h1>
        <p>Hola ${name_user}, tu registro ha sido completado exitosamente.</p>
        <a href="http://localhost:4000/login/${token}">Iniciar sesión</a>`;
        
            try {
             await sendEmail(email, html, token);
             } catch (err) {
              console.error("Error al enviar email de bienvenida:", err);
              }
             res.status(200).json(result);
        
      } catch (error) {
        console.log(error);
        res.status(500).json(error);
      }
    }

    login = async (req, res) => {
      try {
        const { email } = req.body;
        let result = await userDal.login(email);
        res.status(200).json(result);
      } catch (error) {
        console.log(error);
        res.status(500).json(error);
      }
    }

    getProfile = async (req, res) => {
      try {
        let userId = req.user_id;
        let result = await userDal.getProfileById(userId);
        
        if (!result || result.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
        res.status(200).json({
          ok: true,
          user: result[0],
        });
        } catch (error) {
        console.log(error);
        res.status(500).json(error);
      }
    }
  }

export default new UserController();
        
