import { z } from 'zod';

export const createAppointmentSchema = z.object({
  pet_id: z.number().positive({ message: 'pet_id inválido' }),
  employee_user_id: z.number().positive({ message: 'employee_user_id inválido' }),
  service_id: z.number().nullable().optional(),
  supplement_ids: z.array(z.number()).optional(),
  appointment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Formato de fecha inválido' }),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, { message: 'Formato de hora inválido (HH:mm)' }),
  duration_minutes: z.number().min(1, { message: 'Duración inválida' }),
  total_price: z.number().min(0).optional(),
  observations: z.string().nullable().optional(),
  cleaning_service_id: z.number().nullable().optional(),
});