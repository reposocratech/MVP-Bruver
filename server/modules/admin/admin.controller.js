import adminDal from './admin.dal.js';
import { generateToken } from '../../utils/jwtUtils.js';
import { sendEmail } from '../../services/emailService.js';
import { generarContrasena } from '../../utils/generarPassAle.js';
import bcrypt from 'bcrypt';

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
      let {
        name_user,
        last_name,
        phone,
        email,
        address,
        province,
        city,
        password,
        type,
      } = req.body;

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

      const token = generateToken({ email }, process.env.SECRET_TOKEN_KEY, {
        expiresIn: '1d',
      });

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
              Hola <strong>${name_user}</strong>, tu cuenta fue creada por un administrador.
            </p>

            <p style="margin:0 0 18px 0;font-size:16px;line-height:1.5;text-align:center;">
              Tu contraseña temporal es: <strong>${tempPassword}</strong>
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

      res
        .status(201)
        .json({
          message:
            'Registro completado. Revisa tu correo para verificar la cuenta.',
        });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al registrar el usuario' });
    }
  };

  // Obtener trabajadores (type = 2)
  getWorkers = async (req, res) => {
    try {
      const result = await adminDal.getUsersByType(2);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al obtener trabajadores' });
    }
  };

  // Obtener clientes (type = 3)
  getClients = async (req, res) => {
    try {
      const result = await adminDal.getUsersByType(3);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al obtener clientes' });
    }
  };

  // Obtener admins (type = 1)
  getAdmins = async (req, res) => {
    try {
      const result = await adminDal.getUsersByType(1);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al obtener admins' });
    }
  };

  // Cambiar el tipo de usuario a admin (type = 1)
  makeAdmin = async (req, res) => {
    try {
      const { id } = req.params;
      await adminDal.updateUserType(id, 1);
      res.status(200).json({ message: 'Usuario actualizado a admin' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
  };

  // Cambiar el tipo de usuario a trabajador (type = 2)
  makeWorker = async (req, res) => {
    try {
      const { id } = req.params;
      await adminDal.updateUserType(id, 2);
      res.status(200).json({ message: 'Usuario actualizado a trabajador' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
  };

  getUserById = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await adminDal.getUserById(id);
      if (!result || result.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.status(200).json({ user: result[0] });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al obtener usuario por id' });
    }
  };

  editUserById = async (req, res) => {
    try {
      const { id } = req.params;
      const { name_user, last_name, phone, province, city, address, client_code } = JSON.parse(req.body.editUser);
      let values = [name_user, last_name, phone, province, city, address, client_code, id];
      if (req.file) {
        values = [name_user, last_name, phone, province, city, address, client_code, req.file.filename, id];
      }

      await adminDal.editUserById(values);
      const result = await adminDal.getUserById(id);

      res.status(200).json({
        message: 'update ok',
        user: result[0],
        newAvatar: req.file?.filename,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({
          message: 'Error al actualizar el usuario',
          error: error.message,
        });
    }
  };
  
  // Delete logico y switch entre is_deleted (0 y 1)
  updateUserStatus = async (req, res) => {
    try {
      const { id, status } = req.params;
      if (status !== '0' && status !== '1') {
        return res.status(400).json({ message: 'Error de status' });
      }
      await adminDal.updateUserIsDeleted(id, status);
      res.status(200).json({ message: `Estado actualizado a ${status}` });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al actualizar el estado', error: error.message });
    }
  };

}

export default new AdminController();
