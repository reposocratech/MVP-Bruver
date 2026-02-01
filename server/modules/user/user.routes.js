import express from "express";
import userController from "./user.controller.js";
import verifyToken from "../../middlewares/verifyToken.js";
import { uploadImage } from '../../middlewares/multer.js';

const router = express.Router();

router.post("/register", userController.register);
router.get("/verifyEmail/:token", userController.verifyEmail);

router.post("/login", userController.login);
router.get("/userByToken", verifyToken, userController.userByToken);

router.put("/profile", verifyToken, uploadImage("picturesGeneral"), userController.updateProfile);
router.put("/delete", verifyToken, userController.deleteLogic);

router.post("/forgotPassword", userController.forgotPassword);
router.post("/", userController.sendContact);

router.get("/workers", userController.getWorkers);
router.get("/clients", userController.getClients);
router.get("/admins", userController.getAdmins);





export default router;

