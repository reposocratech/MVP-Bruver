import React, { useEffect, useState, useContext } from "react"
import { useNavigate, useParams } from "react-router"
import "../AdminProfile/AdminProfile.css"
import { CalendarCitas } from "../../../components/CalendarCitas/CalendarCitas"
import dayjs from "dayjs"
import isoWeek from "dayjs/plugin/isoWeek"
import { fetchData } from "../../../helpers/axiosHelper"
import { AuthContext } from "../../../contexts/AuthContext/AuthContext.js"
import { buildDate } from "../../../helpers/buildDateHelper.js"

dayjs.extend(isoWeek)

const AdminAppointments = () => {
  const [view, setView] = useState("week")
  const [date, setDate] = useState(new Date())
  const [appoiment, setAppoiment] = useState([])

  const { token } = useContext(AuthContext)
  const { adminId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetcTest = async () => {
      try {
        const res = await fetchData(
          `appointment/getAdminAppoiment/${adminId}`,
          "get",
          null,
          token
        )
        setAppoiment(res.data.result)
      } catch (error) {
        console.log(error)
      }
    }
    fetcTest()
  }, [])

  const eventsMap = appoiment.map((elem) => ({
    id: elem.appointment_id,
    title: elem.employee_name,
    start: buildDate(elem.appointment_date, elem.start_time),
    end: buildDate(elem.appointment_date, elem.end_time),
    resourceId: elem.employee_user_id,
    data: { x: 10 }
  }))

  return (
    <section className="admin-section">
      <h2 className="title">Mis citas (Admin)</h2>
      <CalendarCitas
        view={view}
        date={date}
        events={eventsMap}
        setView={setView}
        setDate={setDate}
      />
      <div className="back-btn-center">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <span className="arrow">VOLVER</span>
        </button>
      </div>
    </section>
  )
}

export default AdminAppointments
