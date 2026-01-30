import express from "express";
import userController from "./user.controller.js";
import verifyToken from "../../middlewares/verifyToken.js";
import { uploadImage } from '../../middlewares/multer.js';

const router = express.Router();

router.post("/register", userController.register);
router.get("/verifyEmail/:token", userController.verifyEmail);

router.post("/login", userController.login);
router.get("/userByToken", verifyToken, userController.userByToken);

router.put("/profile", verifyToken, uploadImage("clients"), userController.updateProfile);
router.put("/delete", verifyToken, userController.deleteLogic);

router.post("/forgotPassword", userController.forgotPassword);
router.post("/contact", userController.sendContact);

// Endpoints para obtener trabajadores, clientes y admins para separarlos por las tablas de administración
router.get("/workers", userController.getWorkers);
router.get("/clients", userController.getClients);
router.get("/admins", userController.getAdmins);
// Endpoint para cambiar el tipo de usuario a 1 (hacer admin)
router.put("/makeAdmin/:id", userController.makeAdmin);
// Endpoint para cambiar el tipo de usuario a 2 (hacer trabajador)
router.put("/makeWorker/:id", userController.makeWorker);



export default router;

