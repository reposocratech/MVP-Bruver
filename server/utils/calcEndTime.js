import dayjs from 'dayjs'

export const calculateEndTime = (startTime, durationMinutes) => {
  return dayjs(`1970-01-01T${startTime}`).add(durationMinutes, 'minute').format('HH:mm:ss');
}