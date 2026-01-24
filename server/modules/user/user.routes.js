import express from "express";
import userController from "./user.controller.js";
import verifyToken from "../../middlewares/verifyToken.js";

const router = express.Router();

router.post("/register", userController.register);

router.get("/profile", verifyToken, userController.getProfile);

router.post("/login", userController.login);

export default router;
