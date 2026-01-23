import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verifyToken = (req, res, next) => {
  const tokenBeared = req.headers.authorization;

  if (!tokenBeared) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const token = tokenBeared.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No autorizado" });
  }

  jwt.verify(token, process.env.SECRET_TOKEN_KEY, (err, result) => {
    if (err) {
      return res.status(401).json({ message: "No autorizado" });
    } else {
      req.user_id = result.user_id;
      next();
    }
  });
};

export default verifyToken;
