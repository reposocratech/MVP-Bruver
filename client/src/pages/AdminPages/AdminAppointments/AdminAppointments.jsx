import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import "../AdminProfile/AdminProfile.css";
import { CalendarCitas } from "../../../components/CalendarCitas/CalendarCitas";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { fetchData } from "../../../helpers/axiosHelper";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext/AuthContext.js";
import { buildDate } from "../../../helpers/buildDateHelper.js";




dayjs.extend(isoWeek);

const AdminAppointments = () => {
  const [view, setView] = useState('week');
  const [date, setDate] = useState(new Date());
  const [appoiment, setAppoiment] = useState([])

  const { token } = useContext(AuthContext)
 const {adminId} = useParams()

  useEffect(() => {
    const fetcTest = async () => {
      try {
        const res = await fetchData(`appointment/getAdminAppoiment/${adminId}`, "get", null, token)
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

  const navigate = useNavigate();


  return (
    <section className="admin-section">
      <h2 className="title">Mis citas (Admin)</h2>
      <CalendarCitas
        view={view}
        date={date}
        events={allEvents}
        setView={setView}
        setDate={setDate}
      />
      <div className="back-btn-center">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <span className="arrow">←</span>ATRÁS
        </button>
      </div>
    </section>
  );
};

export default AdminAppointments;
