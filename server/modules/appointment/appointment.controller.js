import { calculateEndTime } from "../../utils/calcEndTime.js";
import appointmentDal from "./appointment.dal.js";
import userDal from "../user/user.dal.js";

class AppointmentController {
  //Citas del usuario logueado
  getMine = async (req, res) => {
    try {
      // 
      const userId = req.user_id;

      const appointments = await appointmentDal.getMine(userId);

      // si funciona perfe
      res.status(200).json({ appointments });
    } 
    catch (error) 
    {
      console.log(error);
      res.status(500).json({ message: "Error al cargar tus citas" });
    }
  };

  // 2) Citas generales (ej: admin/empleados)
  getGeneralAppoiment = async (req, res) => {
    try {
      const result = await appointmentDal.getGenaralAppoiment();

      res.status(200).json({
        message: "Citas generales cargadas",
         result,
      }
    );
    } 
    catch (error)
    {
      console.log(error);
      res.status(500).json({ message: "Error al cargar citas generales" });
    }
  };

  getAdminAppoiment = async(req, res)=>{
    const {employeeId} = req.params
    try {
      const result = await appointmentDal.getAdminAppoiment(employeeId)
      res.status(200).json({
        message:"oki",
        result
      })
    } catch (error) {
      console.log(error);
      
    }
  }
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
      observations
    } = req.body;

    if (!appointment_date || !start_time) {
      return res.status(400).json({ message: "Falta appointment_date o start_time" });
    }

    const isCat = String(specie) === "2";

    const dur = isCat ? 0 : Number(duration_minutes || 0);
    const price = isCat ? 0 : Number(total_price || 0);

    const baseServiceId = isCat ? null : (service_id || null);
    const extrasArray = isCat ? [] : (Array.isArray(supplement_ids) ? supplement_ids : []);

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
      extrasArray
    );

    return res.status(201).json({ message: "Cita rápida creada", result: created });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error al crear cita rápida" });
  }
};


  createClientAppointment = async (req, res) => {
  try {
    const { user_id } = req;

    // Datos
    const {
      client_user_id,
      pet_id,
      service_id,
      supplement_ids,
      appointment_date,
      start_time,
      duration_minutes,
      total_price,
      observations
    } = req.body;

    //Validaciones
    if (!client_user_id || !pet_id || !appointment_date || !start_time) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    //Normalizar
    const dur = Number(duration_minutes || 0);
    const price = Number(total_price || 0);

    const extrasArray = Array.isArray(supplement_ids) ? supplement_ids : [];

    //Crear cita
    const created = await appointmentDal.createClientAppointment({
      created_by_user_id: user_id,
      employee_user_id: user_id,
      client_user_id,
      pet_id,
      appointment_date,
      start_time,
      duration_minutes: dur,
      total_price: price,
      observations: observations || null,
    });

    //Vincular servicios si vienen
    await appointmentDal.insertServicesForAppointment(
      created.appointment_id,
      service_id || null,
      extrasArray
    );

    return res.status(201).json({ message: "Cita creada", result: created });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error al crear cita de cliente" });
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
      res.status(500).json({ message: "Error al cargar las citas del usuario" });
    }
  };
  updateAppointment = async(req, res) => {
  try {
    const { appointmentId } = req.params;
    const { appointment_date, start_time, duration, total_price, employee_user_id } = req.body;
    const end_time = calculateEndTime(start_time, duration);

    const values = [appointment_date, start_time, end_time, employee_user_id, total_price, appointmentId];

    await appointmentDal.updateAppointment(values);

    const [updatedAppointment] = await appointmentDal.getAdminAppoiment(employee_user_id)
      .then(results => results.filter(a => a.appointment_id == appointmentId));

    res.status(200).json({
      message: "cita editada",
      result: updatedAppointment
    });

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

  deleteAppointment = async(req, res)=>{
    try {
      const {appointmentId} = req.params
      let result = await appointmentDal.deleteAppointment(appointmentId)
      res.status(200).json({
        message: "cita borrada",
        result
      })
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }

}

export default new AppointmentController();
