import { z } from 'zod';

export const registerSchema = z
  .object({
    name_user: z
      .string()
      .min(3, 'El nombre debe tener entre 3 y 50 caracteres')
      .max(50, 'El nombre debe tener menos de 50 caracteres'),
    email: z.email('Email no válido'),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
        'Contraseña no es segura, debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo',
      ),
    rep_password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
        'La contraseña no coincide',
      ),
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
  })

  .refine((data) => data.password === data.rep_password, {
    message: 'Error en la contraseña',
    path: "Contraseña confimada"
  });
