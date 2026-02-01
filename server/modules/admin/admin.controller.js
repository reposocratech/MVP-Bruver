import adminDal from "./admin.dal.js";
import { generateToken } from "../../utils/jwtUtils.js";
import { sendEmail } from "../../services/emailService.js";
import { generarContrasena } from "../../utils/generarPassAle.js";
import bcrypt from "bcrypt";



class AdminController {

  getAdminProfile = async (req, res) => {
    const { user_id } = req;
    console.log(user_id);

    try {
      const result = await adminDal.getAdminById(user_id);
      res.status(200).json({ ok: true, user: result[0] });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  createUser = async (req, res) => {
    try {
      let { name_user, last_name, phone, email, address, province, city, password, type } = req.body;

      // Si type es null o undefined, asignar 3 (cliente)
      // if (type === null || type === undefined) {
      //   type = 3;
      // }

      const tempPassword = password || generarContrasena();
      const hashedPass = await bcrypt.hash(tempPassword, 10);

      await adminDal.createUser([
        name_user,
        last_name || null,
        phone,
        email,
        address || null,
        province || null,
        city || null,
        hashedPass,
        type,
      ]);

      const token = generateToken({ email }, process.env.SECRET_TOKEN_KEY, { expiresIn: "1d" });

      const html = `
      <h1>Bienvenido a Brüver</h1>
      <p>Hola ${name_user}, tu cuenta fue creada por un administrador.</p>
      <p>Tu contraseña temporal es: <strong>${tempPassword}</strong></p>
      <p>Por favor, verifica tu cuenta aquí:</p>
      <a href="${process.env.BACKEND_URL}/user/verifyEmail/${token}">Verificar mi cuenta</a>
      <p>Este enlace expira en 24 horas.</p>
      `;

      try {
        await sendEmail(email, html);
      } catch (error) {
        console.log("Error al enviar email:", error);
      }

      res.status(201).json({ message: "Registro completado. Revisa tu correo para verificar la cuenta." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error al registrar el usuario" });
    }
  };

       // Obtener trabajadores (type = 2)
  getWorkers = async (req, res) => {
    try {
      const result = await adminDal.getUsersByType(2);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error al obtener trabajadores" });
    }
  };
  
  // Obtener clientes (type = 3)
  getClients = async (req, res) => {
    try {
      const result = await adminDal.getUsersByType(3);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error al obtener clientes" });
    }
  };

  // Obtener admins (type = 1)
  getAdmins = async (req, res) => {
    try {
      const result = await adminDal.getUsersByType(1);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error al obtener admins" });
    }
  };

  // Cambiar el tipo de usuario a admin (type = 1)
  makeAdmin = async (req, res) => {
    try {
      const { id } = req.params;
      await adminDal.updateUserType(id, 1);
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
      await adminDal.updateUserType(id, 2);
      res.status(200).json({ message: "Usuario actualizado a trabajador" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error al actualizar el usuario" });
    }
  };

}

export default new AdminController();
