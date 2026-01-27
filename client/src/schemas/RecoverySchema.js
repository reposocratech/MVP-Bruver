import {z} from "zod";

 export const recoverySchema = z.object({
    email: z.email("Email no válido")
 }) 