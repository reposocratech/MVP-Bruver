import dayjs from 'dayjs';


export const mergeIntervals = (arr) => {
  if (!arr || arr.length === 0) return [];

  // Normalizamos a dayjs y ordenamos por start
  const sorted = arr
    .map(a => ({ start: dayjs(a.start), end: dayjs(a.end) }))
    .sort((x, y) => x.start.valueOf() - y.start.valueOf());

  const merged = [];
  // Iteramos con un bucle clásico por índice para mayor claridad
  for (let i = 0; i < sorted.length; i++) {
    const cur = sorted[i];

    if (merged.length === 0) {
      merged.push({ start: cur.start, end: cur.end });
    } else {
      const last = merged[merged.length - 1];
      // Si se solapan o son contiguos, extendemos el último intervalo
      if (cur.start.valueOf() <= last.end.valueOf()) {
        last.end = cur.end.isAfter(last.end) ? cur.end : last.end;
      } else {
        merged.push({ start: cur.start, end: cur.end });
      }
    }
  }
  return merged;
};

export const parseDateTime = (d, t) => {
  if (!d || !t) return null; // faltan datos

  // Normalizamos la fecha (puede venir como Date, YYYY-MM-DD o ISO con hora)
  const baseDate = dayjs(d);
  const datePart = baseDate.isValid()
    ? baseDate.format('YYYY-MM-DD')
    : String(d).split('T')[0];

  // Normalizamos la hora (acepta HH:mm o HH:mm:ss)
  const timePart =
    typeof t === 'string'
      ? t.length === 5
        ? `${t}:00`
        : t
      : dayjs(t).format('HH:mm:ss');

  const combined = dayjs(`${datePart} ${timePart}`);
  return combined.isValid() ? combined : null;
};
