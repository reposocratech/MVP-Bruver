import dayjs from "dayjs";

export const getMondayOfWeek = (baseDate) => {
  const d = dayjs(baseDate);
  const day = d.day(); // 0 (domingo) - 6 (sábado)

  // Convertimos domingo (0) a 7
  const normalizedDay = day === 0 ? 7 : day;

  // Restamos para llegar al lunes
  return d.subtract(normalizedDay - 1, "day");
};
