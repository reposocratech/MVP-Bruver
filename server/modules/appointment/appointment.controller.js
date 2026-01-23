import appointmentDal from "./appointment.dal.js";

class AppointmentController {
  getMine = async (req, res) => {
    try {
      let userId = req.user_id;

      let result = await appointmentDal.getMine(userId);

      res.status(200).json({
        ok: true,
        appointments: result,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };
}

export default new AppointmentController();
