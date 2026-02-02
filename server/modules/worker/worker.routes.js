import express from "express";
import workerController from "./worker.controller.js";
import verifyToken from "../../middlewares/verifyToken.js";

const router = express.Router();

router.get("/clients", verifyToken, workerController.searchClients);
router.get("/pets/:clientId", verifyToken, workerController.getClientPets);
router.get(`/getAllWorkers`, verifyToken, workerController.getAllWorkers)

export default router;
