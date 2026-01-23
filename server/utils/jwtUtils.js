import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (userId) => {
  let payload = {user_id: userId};
  return jwt.sign(payload, process.env.SECRET_TOKEN_KEY, {expiresIn:"2d"})
}