import {useNavigate} from "react-router"
import { useContext, useEffect, useState} from 'react'
import { fetchData } from '../../../helpers/axiosHelper'
import { AuthContext } from '../../../contexts/AuthContext/AuthContext'
import { CalendarGeneral } from '../../../components/CalendarGeneral/CalendarGeneral'

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { buildDate } from '../../../helpers/buildDateHelper.js'

dayjs.extend(customParseFormat)

const GeneralCalendarPage = () => {
  const [view, setView] = useState('day') 
  const [date, setDate] = useState(new Date())
  const [appoiment, setAppoiment] = useState([])

   const { token } = useContext(AuthContext) 
   const navigate = useNavigate()

  useEffect(() => {
    const fetcTest = async () => {
      try {
        const res = await fetchData("appointment/getGeneralAppoiment", "get", null, token)
        setAppoiment(res.data.result)

      } catch (error) {
        console.log(error);

      }
    }
    fetcTest();
  }, [])

 


  //eventos en el calendario mapeados
  const eventsMap = appoiment.map((elem) => ({
    id: elem.appointment_id,
    title: elem.employee_name,
    start: buildDate(elem.appointment_date, elem.start_time),
    end: buildDate(elem.appointment_date, elem.end_time),
    resourceId: elem.employee_user_id,
    data: { x: 10 }
  }));

  const allEvents = [...eventsMap]

   //trabajadores que aparecen en la tabla 
  const workers = [
    { id: 2, title: 'Juan' },
    { id: 3, title: 'Maria' },
  ]

  

  return (
    <>
      <section className="calendar-general">
        <CalendarGeneral
          events={allEvents}
          workers={workers}
          view={view}
          date={date}
          onViewChange={setView}
          onDateChange={setDate}
        />
      </section>
      <div className="back-btn-center">
        <button className="back-btn" type="button" onClick={() => navigate(-1)}>
          <span className="arrow">VOLVER</span>
        </button>
      </div>
    </>
  )
}

export default GeneralCalendarPage