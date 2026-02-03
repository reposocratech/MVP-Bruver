 //funcion invalidate date

export  const buildDate = (date, time) => {
    const [h, m, s] = time.split(':')
    const d = new Date(date)
    d.setHours(h, m, s || 0)
    return d
  }

  export const formatDate = (startDate)=>{
    console.log("lllllllllllllllllllllllllllll", typeof(startDate));
    
    let month = "01";
    switch (startDate.split(" ")[1]) {
      case  "Feb": 
      month = "02" 
      break
      case  "Mar": 
      month = "03" 
      break
      case  "Apr": 
      month = "04" 
      break;
      case  "May": 
      month = "05" 
      break;
      case  "Jun": 
      month = "06" 
      break;
      case  "Aug": 
      month = "08"
      break;
      case  "Jul": 
      month = "07"
      break;
      case  "Sep": 
      month = "09"
      break;
      case  "Oct": 
      month = "10"
      break;
      case  "Nov": 
      month = "11"
      break;
      case  "Dec": 
      month = "12"
      break;
    
      default:
        break;
    }
    return `${startDate.split(" ")[3]}-${month}-${startDate.split(" ")[2]}`
  }