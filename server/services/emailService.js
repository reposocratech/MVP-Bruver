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


export const sendContactEmail = async ({ nombre, telefono, email, mensaje }) => {
  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // correo fijo donde se reciben
      subject: "Nuevo mensaje desde formulario de contacto",
      text: `
        Nombre: ${nombre}
        Teléfono: ${telefono}
        Email: ${email}

        Mensaje:
        ${mensaje}
      `,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong><br/>${mensaje}</p>
      `
    });

    console.log("Email de contacto enviado");
    return result;
  } catch (error) {
    console.error("Error al enviar email de contacto:", error);
    throw error;
  }
};



export const sendEmail = async (email, html) => {

  
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

export const sendConfirmAppointment = async (email, html) => {

  
  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Cita confirmada",
      text: "Su cita ha sido confirmada con éxito.",
      html: html
    });
    console.log("Email enviado:", result);
    return result;
  } catch (error) {
    console.error("Error al enviar email:", error);
    throw error;
  }
}


export const sendCancelAppointment = async (email, html) => {
    
  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Cita cancelada",
      text: "Su cita ha sido cancelada con éxito.",
      html: html
    });
    console.log("Email enviado:", result);
    return result;
  } catch (error) {
    console.error("Error al enviar email:", error);
    throw error;
  }
}
