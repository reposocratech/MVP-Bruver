import express from "express";
import petController from "./pet.controller.js";
import verifyToken from "../../middlewares/verifyToken.js";

const router = express.Router();

router.get("/mine", verifyToken, petController.getMine);
router.post("/", verifyToken, petController.create);
router.delete("/:petId", verifyToken, petController.remove);

export default router;
