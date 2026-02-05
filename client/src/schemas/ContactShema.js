import { z } from "zod";

export const contactSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio")
    .regex(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/, "El nombre solo puede contener letras"),

  telefono: z
    .string()
    .min(1, "El teléfono es obligatorio")
    .regex(/^\+?[0-9\s-]{9,15}$/, 'Solo +, números, espacios, guiones'),

  email: z.string().email("Email no válido"),

  mensaje: z.string().min(1, "El mensaje es obligatorio"),
});
