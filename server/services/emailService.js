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
      to: process.env.EMAIL_USER, 
      subject: "Nuevo mensaje desde formulario de contacto",
      text: `
        Nombre: ${nombre}
        Teléfono: ${telefono}
        Email: ${email}

        Mensaje:
        ${mensaje}
      `,
      html: `
        <div style="background:#f4efe8;padding:30px 12px;">
          <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:18px;padding:28px;font-family:Raleway,Arial,sans-serif;color:#3a2f2a;">

            <h1 style="margin:0 0 10px 0;font-family:Lora,Georgia,serif;font-size:26px;color:#6bb3a7;text-align:center;">
              Nuevo mensaje recibido
            </h1>

            <p style="margin:0 0 18px 0;font-size:15px;line-height:1.5;text-align:center;color:#6a5a50;">
              Te han enviado un mensaje desde el formulario de contacto.
            </p>

            <div style="background:#fbf8f4;border:1px solid rgba(0,0,0,0.06);border-radius:14px;padding:16px 16px;margin:18px 0;">
              <p style="margin:0 0 10px 0;font-size:14px;line-height:1.5;">
                <strong style="color:#6bb3a7;">Nombre:</strong> ${nombre}
              </p>
              <p style="margin:0 0 10px 0;font-size:14px;line-height:1.5;">
                <strong style="color:#6bb3a7;">Teléfono:</strong> ${telefono}
              </p>
              <p style="margin:0 0 10px 0;font-size:14px;line-height:1.5;">
                <strong style="color:#6bb3a7;">Email:</strong> ${email}
              </p>

              <div style="margin-top:14px;">
                <p style="margin:0 0 8px 0;font-size:14px;line-height:1.5;">
                  <strong style="color:#6bb3a7;">Mensaje:</strong>
                </p>

                <div style="white-space:pre-wrap;background:#ffffff;border:1px solid rgba(0,0,0,0.06);border-radius:12px;padding:12px;font-size:14px;line-height:1.6;color:#3a2f2a;">
                  ${mensaje}
                </div>
              </div>
            </div>

            <div style="text-align:center;margin:18px 0 8px 0;">
              <a href="mailto:${email}"
                style="display:inline-block;background:#6bb3a7;color:#ffffff;text-decoration:none;font-weight:700;
                      padding:12px 22px;border-radius:999px;font-size:14px;">
                Responder por email
              </a>
            </div>
            </div>
        </div>
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
