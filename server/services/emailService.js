import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});

transporter.verify()
               .then(() => console.log("Listo para enviar correos"))
               .catch((err) => console.error("Error al verificar transporter:", err));

export const sendEmail = async (email, html, token) => {
  console.log(email, html, token);
  
  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Registro completado",
      text: "Su registro ha sido completado exitosamente.",
      html: html
    });
    console.log("Email enviado:", result);
    return result;
  } catch (error) {
    console.error("Error al enviar email:", error);
    throw error;
  }
}