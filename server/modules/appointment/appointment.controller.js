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
        appointments: result,
      }
    );
    } 
    catch (error)
    {
      console.log(error);
      res.status(500).json({ message: "Error al cargar citas generales" });
    }
  };
}

export default new AppointmentController();
