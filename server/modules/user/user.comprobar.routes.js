import express from "express";
import { generateToken } from "../../utils/jwtUtils.js";

const router = express.Router();


router.get("/dev-token/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    const token = generateToken(Number(userId));
    res.status(200).json({ ok: true, token });
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
