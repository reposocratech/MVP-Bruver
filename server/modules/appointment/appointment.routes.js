import express from "express";
import appointmentController from "./appointment.controller.js";
import verifyToken from "../../middlewares/verifyToken.js";

const router = express.Router();

router.get("/mine", verifyToken, appointmentController.getMine);
router.get("/getGeneralAppoiment",  appointmentController.getGeneralAppoiment)

export default router;
