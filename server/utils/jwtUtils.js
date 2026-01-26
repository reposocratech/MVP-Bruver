import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//lo hacemos dinamico para poder usar diferentes payloads como email o id

export const generateToken = (payload, secret = process.env.SECRET_TOKEN_KEY, options = {expiresIn: "2d"}) => {
  return jwt.sign(payload, secret, options);
}