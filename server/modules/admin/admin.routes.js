import express from "express";
import verifyToken from "../../middlewares/verifyToken.js";
import adminController from "./admin.controller.js";


const router = express.Router();

router.get("/getAdmin", verifyToken, adminController.getAdminProfile)
router.post("/createUser", adminController.createUser)


// Endpoints para obtener trabajadores, clientes y admins para separarlos por las tablas de administración
router.get("/workers", adminController.getWorkers);
router.get("/clients", adminController.getClients);
router.get("/admins", adminController.getAdmins);

// Endpoint para cambiar el tipo de usuario a 1 (hacer admin)
router.put("/makeAdmin/:id", adminController.makeAdmin);

// Endpoint para cambiar el tipo de usuario a 2 (hacer trabajador)
router.put("/makeWorker/:id", adminController.makeWorker);

export default router;