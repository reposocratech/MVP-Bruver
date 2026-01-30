 //funcion invalidate date

export  const buildDate = (date, time) => {
    const [h, m, s] = time.split(':')
    const d = new Date(date)
    d.setHours(h, m, s || 0)
    return d
  }