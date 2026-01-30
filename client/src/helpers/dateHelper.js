
import { getMondayOfWeek } from "./getMondayHelper.js";



/* export const getDateFromDayId = (dayId, baseDate = dayjs()) => {
  // Lunes de la semana de baseDate
  const sunday = baseDate.startOf("week").add(1, "day");

  return sunday.add(dayId - 1, "day");
}; */

export const getDateFromDayId = (dayId, date) => {
  // Lunes de la semana que se está mostrando en el calendario
  const monday = getMondayOfWeek(date);

  return monday.add(dayId - 1, "day");
};