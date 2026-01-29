import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  /* email: z.string().email("Email no válido"), */
  email:z.string().min(1, "Debe introducir un correo"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});
