import express from "express";
import appointmentController from "./appointment.controller.js";
import verifyToken from "../../middlewares/verifyToken.js";

const router = express.Router();

// Citas del usuario logueado
router.get("/mine", verifyToken, appointmentController.getMine);

// Citas generales
router.get("/getGeneralAppoiment",verifyToken, appointmentController.getGeneralAppoiment);
router.get("/getAdminAppoiment/:employeeId", verifyToken, appointmentController.getAdminAppoiment)
router.put("/updateAppointment/:appointmentId", verifyToken, appointmentController.updateAppointment)
router.delete("/deleteAppointment/:appointmentId", verifyToken, appointmentController.deleteAppointment)

export default router;
