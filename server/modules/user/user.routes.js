import express from "express";
import userController from "./user.controller.js";
import verifyToken from "../../middlewares/verifyToken.js";

const router = express.Router();

router.post("/register", userController.register);
router.get("/verifyEmail/:token", userController.verifyEmail);

router.post("/login", userController.login);
router.get("/userByToken", verifyToken, userController.userByToken);

router.put("/profile", verifyToken, userController.updateProfile);
router.put("/delete", verifyToken, userController.deleteLogic);

router.post("/forgotPassword", userController.forgotPassword);
router.post("/contact", userController.sendContact);

export default router;

