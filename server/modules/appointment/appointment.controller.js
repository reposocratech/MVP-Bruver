import { calculateEndTime } from "../../utils/calcEndTime.js";
import appointmentDal from "./appointment.dal.js";

class AppointmentController {
  // 1) Citas del usuario logueado (cliente)
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
