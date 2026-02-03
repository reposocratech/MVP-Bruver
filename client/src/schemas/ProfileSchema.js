import { z } from "zod";

export const profileSchema = z.object({
  name_user: z
    .string()
    .min(3, 'El nombre debe tener entre 3 y 50 caracteres')
    .max(50, 'El nombre debe tener menos de 50 caracteres'),
  email: z.email('Email no válido'),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  phone: z
    .string() 
    .min(1, 'Teléfono requerido')
    .regex(/^\+?[0-9\s-]{9,15}$/, 'Solo +, números, espacios, guiones')
    .refine(
        (phone) => {
        const digits = phone.replace(/\D/g, ''); 
        return digits.length >= 9 && digits.length <= 20;
      },
      { message: "El número de dígitos debe estar entre 9 y 15" },
    ),
});
