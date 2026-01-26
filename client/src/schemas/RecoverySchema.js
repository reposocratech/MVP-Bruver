import {z} from "zod";

 export const recoverySchema = z.object({
    email: z.email("Email no válido"),
    password: z
      .string().min(1, "La contraseña es obligatoria")
 }) 