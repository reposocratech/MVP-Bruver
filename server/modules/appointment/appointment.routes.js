import express from "express";
import appointmentController from "./appointment.controller.js";
import verifyToken from "../../middlewares/verifyToken.js";

const router = express.Router();

// Citas del usuario logueado
router.get("/mine", verifyToken, appointmentController.getMine);

// Citas de cualquier usuario por id
router.get("/user/:id", verifyToken, appointmentController.getByUserId);

// Citas generales
router.get("/getGeneralAppoiment",verifyToken, appointmentController.getGeneralAppoiment);
router.get("/getAdminAppoiment/:employeeId", verifyToken, appointmentController.getAdminAppoiment)
router.put("/updateAppointment/:appointmentId", verifyToken, appointmentController.updateAppointment)
router.delete("/deleteAppointment/:appointmentId", verifyToken, appointmentController.deleteAppointment)

router.post("/quick", verifyToken, appointmentController.createQuickAppointment);
router.post("/client", verifyToken, appointmentController.createClientAppointment);
router.post("/create", verifyToken, appointmentController.createClientAppointment);

export default router;
