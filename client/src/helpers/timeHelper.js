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
  // Probamos con y sin segundos (HH:mm y HH:mm:ss)
  const p1 = dayjs(`${d} ${t}`);
  if (p1.isValid()) return p1;
  const tWithSec = t.length === 5 ? `${t}:00` : t;
  const p2 = dayjs(`${d} ${tWithSec}`);
  return p2.isValid() ? p2 : null;
};
