import express from "express";
import serviceController from "./service.controller.js";
import verifyToken from "../../middlewares/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, serviceController.getServicesBySize); 
router.get("/getServiceByPetId/:petId", verifyToken, serviceController.getServiceByPetId);

export default router;