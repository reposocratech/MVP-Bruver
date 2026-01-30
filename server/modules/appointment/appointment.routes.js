import express from "express";
import appointmentController from "./appointment.controller.js";
import verifyToken from "../../middlewares/verifyToken.js";

const router = express.Router();

// Citas del usuario logueado
router.get("/mine", verifyToken, appointmentController.getMine);

// Citas generales
router.get("/getGeneralAppoiment",verifyToken, appointmentController.getGeneralAppoiment);

export default router;
