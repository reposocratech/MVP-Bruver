import express from "express";
import petController from "./pet.controller.js";
import verifyToken from "../../middlewares/verifyToken.js";

const router = express.Router();

router.get("/mine", verifyToken, petController.getMine);
router.post("/", verifyToken, petController.create);
router.delete("/:petId", verifyToken, petController.remove);

//  traer 1 mascota por id (del usuario logueado)
router.get("/:petId", verifyToken, petController.getOne);

// editar mascota (del usuario logueado)
router.put("/:petId", verifyToken, petController.edit);

export default router;
