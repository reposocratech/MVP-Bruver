import { calculateEndTime } from '../../utils/calcEndTime.js';
import appointmentDal from './appointment.dal.js';
import { sendConfirmAppointment, sendCancelAppointment } from '../../services/emailService.js';
import userDal from '../user/user.dal.js';

class AppointmentController {
  //Citas del usuario logueado
  getMine = async (req, res) => {
    try {
      //
      const userId = req.user_id;

      const appointments = await appointmentDal.getMine(userId);

      // si funciona perfe
      res.status(200).json({ appointments });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al cargar tus citas' });
    }
  };

  // 2) Citas generales (ej: admin/empleados)
  getGeneralAppoiment = async (req, res) => {
    try {
      const result = await appointmentDal.getGenaralAppoiment();

      res.status(200).json({
        message: 'Citas generales cargadas',
        result,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al cargar citas generales' });
    }
  };

  getAdminAppoiment = async (req, res) => {
    const { employeeId } = req.params;
    try {
      const result = await appointmentDal.getAdminAppoiment(employeeId);
      res.status(200).json({
        message: 'oki',
        result,
      });
    } catch (error) {
      console.log(error);
    }
  };

  createQuickAppointment = async (req, res) => {
    try {
      const { user_id } = req;

      const {
        client_name,
        phone,
        hair,
        specie,
        service_id,
        supplement_ids,
        appointment_date,
        start_time,
        duration_minutes,
        total_price,
        observations,
      } = req.body;

      if (!appointment_date || !start_time) {
        return res
          .status(400)
          .json({ message: 'Falta appointment_date o start_time' });
      }

      const isCat = String(specie) === '2';

      // Permitimos duración y precio enviados incluso para gatos
      const dur = Number(duration_minutes || 0);
      const price = Number(total_price || 0);

      const baseServiceId = service_id || null;
      const extrasArray = Array.isArray(supplement_ids) ? supplement_ids : [];

      //Crear cita
      const created = await appointmentDal.createQuickAppointment({
        created_by_user_id: user_id,
        employee_user_id: user_id,
        appointment_date,
        start_time,
        duration_minutes: dur,
        total_price: price,
        guest_name: client_name || null,
        guest_phone: phone || null,
        guest_hair: hair || null,
        observations: observations || null,
      });

      //Vincular servicios
      await appointmentDal.insertServicesForAppointment(
        created.appointment_id,
        baseServiceId,
        extrasArray,
      );

      return res
        .status(201)
        .json({ message: 'Cita rápida creada', result: created });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error al crear cita rápida' });
    }
  };

  /* EMPLEADO */
  createClientAppointment = async (req, res) => {
    try {
      const { user_id } = req;

      // Datos
      const {
        client_user_id,
        pet_id,
        service_id,
        supplement_ids,
        employee_user_id,
        appointment_date,
        start_time,
        duration_minutes,
        total_price,
        observations,
      } = req.body;

      const clientId = client_user_id || user_id;

      //Validaciones
      if (!clientId || !pet_id || !appointment_date || !start_time) {
        return res.status(400).json({ message: 'Faltan datos obligatorios' });
      }

      //Normalizar
      const dur = Number(duration_minutes || 0);
      const price = Number(total_price || 0);
      const st = start_time.length === 5 ? `${start_time}:00` : start_time;
      const employeeId = employee_user_id || user_id;

      const overlap = await appointmentDal.checkOverlap(
        employeeId,
        appointment_date,
        st,
        dur,
      );
      if (overlap && overlap.length > 0) {
        return res
          .status(409)
          .json({ message: 'El empleado ya tiene una cita en ese horario' });
      }

      const extrasArray = Array.isArray(supplement_ids) ? supplement_ids : [];

      //Crear cita
      const created = await appointmentDal.createClientAppointment({
        created_by_user_id: user_id,
        employee_user_id: employeeId,
        client_user_id: clientId,
        pet_id,
        appointment_date,
        start_time: st,
        duration_minutes: dur,
        total_price: price,
        observations: observations || null,
      });

      //Vincular servicios si vienen
      await appointmentDal.insertServicesForAppointment(
        created.appointment_id,
        service_id || null,
        extrasArray,
      );

      // Obtener email del cliente
      let destinatario = null;
      try {
        const userRes = await userDal.userByToken(clientId);
        if (userRes && userRes.length > 0) {
          destinatario = userRes[0].email;
        }
      } catch (error) {
        console.log('Error obteniendo email del cliente:', error);
      }

      /* Email de verificación */
      const instagramUrl = 'https://instagram.com/bruver_oficial';
      const whatsappUrl = 'https://wa.me/34TU_NUMERO'; // ej: https://wa.me/34600111222
      const html = `
     <div style="background:#f4efe8;padding:30px 12px;">
     <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:18px;padding:28px;font-family:Raleway,Arial,sans-serif;color:#3a2f2a;">
 
       <h1 style="margin:0 0 10px 0;font-family:Lora,Georgia,serif;font-size:28px;color:#6bb3a7;text-align:center;">
         ¡Gracias por contar con Brüver!
       </h1>
 
       <p style="margin:0 0 14px 0;font-size:16px;line-height:1.5;text-align:center;">
         Esta es la confirmación de tu cita. A continuación, podrás ver los datos:
       </p>

       <p style="margin:0 0 18px 0;font-size:16px;line-height:1.5;text-align:center;">
       Fecha: ${appointment_date}
       </p>
       <p style="margin:0 0 18px 0;font-size:16px;line-height:1.5;text-align:center;">
      Hora de inicio: ${start_time}h
       </p>
       <p style="margin:0 0 18px 0;font-size:16px;line-height:1.5;text-align:center;">
        Duración: ${duration_minutes} minutos
       </p>
       <p style="margin:0 0 18px 0;font-size:16px;line-height:1.5;text-align:center;">
       Precio:  ${total_price}€
       </p>
       
 
       <div style="text-align:center;margin:20px 0 18px 0;">

       </div>
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
      if (destinatario) {
        try {
          await sendConfirmAppointment(destinatario, html);
        } catch (error) {
          console.log('Error al enviar email:', error);
        }
      } else {
        console.log(
          'No se encontró email del destinatario, no se envía correo',
        );
      }

      return res.status(201).json({ message: 'Cita creada', result: created });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: 'Error al crear cita de cliente' });
    }
  };

  /* CITA QUE PIDE EL CLIENTE */
  clientCreateAppointment = async (req, res) => {
    try {
      const { user_id } = req;

      // Datos
      const {
        client_user_id,
        pet_id,
        service_id,
        supplement_ids,
        employee_user_id,
        appointment_date,
        start_time,
        duration_minutes,
        total_price,
        observations,
      } = req.body;

      const clientId = client_user_id || user_id;

      //Validaciones
      if (!clientId || !pet_id || !appointment_date || !start_time) {
        return res.status(400).json({ message: 'Faltan datos obligatorios' });
      }

      //Normalizar
      const dur = Number(duration_minutes || 0);
      const price = Number(total_price || 0);
      const st = start_time.length === 5 ? `${start_time}:00` : start_time;
      const employeeId = employee_user_id || user_id;

      const overlap = await appointmentDal.checkOverlap(
        employeeId,
        appointment_date,
        st,
        dur,
      );
      if (overlap && overlap.length > 0) {
        console.log("******************", overlap)
        return res
          .status(409)
          .json({ message: 'El empleado ya tiene una cita en ese horario' });
      }

      const extrasArray = Array.isArray(supplement_ids) ? supplement_ids : [];

      //Crear cita
      const created = await appointmentDal.clientCreateAppointment({
        created_by_user_id: user_id,
        employee_user_id: employeeId,
        client_user_id: clientId,
        pet_id,
        appointment_date,
        start_time: st,
        duration_minutes: dur,
        total_price: price,
        observations: observations || null,
      });

      //Vincular servicios si vienen
      await appointmentDal.insertServicesForAppointment(
        created.appointment_id,
        service_id || null,
        extrasArray,
      );

      
      // Obtener email del cliente
      let destinatario = null;
      try {
        const userRes = await userDal.userByToken(clientId);
        if (userRes && userRes.length > 0) {
          destinatario = userRes[0].email;
        }
      } catch (error) {
        console.log('Error obteniendo email del cliente:', error);
      }

       /* Email de verificación */
      const instagramUrl = 'https://instagram.com/bruver_oficial';
      const whatsappUrl = 'https://wa.me/34TU_NUMERO'; // ej: https://wa.me/34600111222
      const html = `
     <div style="background:#f4efe8;padding:30px 12px;">
     <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:18px;padding:28px;font-family:Raleway,Arial,sans-serif;color:#3a2f2a;">
 
       <h1 style="margin:0 0 10px 0;font-family:Lora,Georgia,serif;font-size:28px;color:#6bb3a7;text-align:center;">
         ¡Gracias por contar con Brüver!
       </h1>
 
       <p style="margin:0 0 14px 0;font-size:16px;line-height:1.5;text-align:center;">
         Esta es la confirmación de tu cita. A continuación, podrás ver los datos:
       </p>

       <p style="margin:0 0 18px 0;font-size:16px;line-height:1.5;text-align:center;">
       Fecha: ${appointment_date}
       </p>
       <p style="margin:0 0 18px 0;font-size:16px;line-height:1.5;text-align:center;">
      Hora de inicio: ${start_time}h
       </p>
       <p style="margin:0 0 18px 0;font-size:16px;line-height:1.5;text-align:center;">
        Duración: ${duration_minutes} minutos
       </p>
       <p style="margin:0 0 18px 0;font-size:16px;line-height:1.5;text-align:center;">
       Precio:  ${total_price}€
       </p>
       
 
       <div style="text-align:center;margin:20px 0 18px 0;">

       </div>
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
      if (destinatario) {
        try {
          await sendConfirmAppointment(destinatario, html);
        } catch (error) {
          console.log('Error al enviar email:', error);
        }
      } else {
        console.log(
          'No se encontró email del destinatario, no se envía correo',
        );
      }

      return res.status(201).json({ message: 'Cita creada', result: created });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: 'Error al crear cita de cliente' });
    }
  };

  //el creado para cualquier cita por id
  getByUserId = async (req, res) => {
    try {
      const userId = req.params.id;
      const appointments = await appointmentDal.getMine(userId);
      res.status(200).json({ appointments });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: 'Error al cargar las citas del usuario' });
    }
  };

  updateAppointment = async (req, res) => {
    try {
      const { appointmentId } = req.params;
      const {
        appointment_date,
        start_time,
        duration,
        total_price,
        status,
        employee_user_id,
      } = req.body;
      const end_time = calculateEndTime(start_time, duration);

      const values = [
        appointment_date,
        start_time,
        end_time,
        employee_user_id,
        total_price,
        status,
        appointmentId,
      ];

      await appointmentDal.updateAppointment(values);

      const [updatedAppointment] = await appointmentDal
        .getAdminAppoiment(employee_user_id)
        .then((results) =>
          results.filter((a) => a.appointment_id == appointmentId),
        );

      res.status(200).json({
        message: 'cita editada',
        result: updatedAppointment,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  deleteAppointment = async (req, res) => {
    try {
      const { appointmentId } = req.params;

      // 1. Obtener los datos de la cita antes de borrarla
      const { appointmentData, deleteResult } = await appointmentDal.deleteAppointment(appointmentId);

      // 2. Enviar respuesta de borrado
      res.status(200).json({
        message: 'cita borrada',
        result: deleteResult,
      });

      // 3. Si hay datos de la cita, obtener el email del cliente y enviar el correo
      if (appointmentData && appointmentData.client_user_id) {
        let destinatario = null;
        try {
          const userRes = await userDal.userByToken(appointmentData.client_user_id);
          if (userRes && userRes.length > 0) {
            destinatario = userRes[0].email;
          }
        } catch (error) {
          console.log('Error obteniendo email del cliente:', error);
        }

        // Formatear fecha y hora
        const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
        const fechaObj = new Date(appointmentData.appointment_date);
        const diaSemana = diasSemana[fechaObj.getDay()];
        const dia = String(fechaObj.getDate()).padStart(2, '0');
        const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
        const anio = fechaObj.getFullYear();
        // Hora: tomar solo hh:mm de start_time
        let hora = appointmentData.start_time;
        if (typeof hora === 'string' && hora.length >= 5) {
          hora = hora.slice(0,5);
        }

        const fechaFormateada = `${diaSemana}, ${dia}/${mes}/${anio}`;
        const horaFormateada = `${hora}h`;

        const instagramUrl = 'https://instagram.com/bruver_oficial';
        const whatsappUrl = 'https://wa.me/34TU_NUMERO'; // ej: https://wa.me/34600111222
        const html = `
       <div style="background:#f4efe8;padding:30px 12px;">
       <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:18px;padding:28px;font-family:Raleway,Arial,sans-serif;color:#3a2f2a;">
   
         <h1 style="margin:0 0 10px 0;font-family:Lora,Georgia,serif;font-size:28px;color:#6bb3a7;text-align:center;">
           Su cita ha sido cancelada
         </h1>
   
         <p style="margin:0 0 14px 0;font-size:16px;line-height:1.5;text-align:center;">
           Le confirmamos que su cita el día <b>${fechaFormateada}</b> a la hora <b>${horaFormateada}</b> con Brüver ha sido cancelada.<br>¡Esperamos verte pronto!
         </p>
   
         <div style="text-align:center;margin:20px 0 18px 0;">

         </div>
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
        if (destinatario) {
          console.log('Enviando email de cancelación a:', destinatario);
          try {
            await sendCancelAppointment(destinatario, html);
          } catch (error) {
            console.log('Error al enviar email:', error);
          }
        } else {
          console.log(
            'No se encontró email del destinatario, no se envía correo',
          );
        }
      } else {
        console.log('No se encontró la cita o el client_user_id para enviar el email de cancelación.');
      }

    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  getWorkerAppoiment = async (req, res) => {
    const { employeeId } = req.params;
    try {
      const result = await appointmentDal.getWorkerAppoiment(employeeId);
      res.status(200).json({
        message: 'oki',
        result,
      });
    } catch (error) {
      console.log(error);
    }
  };
  // Historial citas usuario (presente, pasadas y futuras)
  getAllByUserId = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await appointmentDal.getAllByUserId(id);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: 'Error al cargar el historial de citas del usuario' });
    }
  };
}

export default new AppointmentController();
