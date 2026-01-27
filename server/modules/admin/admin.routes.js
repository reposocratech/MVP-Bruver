import express from "express";
import AdminController from "./admin.controller.js";
import verifyToken from "../../middlewares/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, AdminController.getAdminProfile)

export default router;