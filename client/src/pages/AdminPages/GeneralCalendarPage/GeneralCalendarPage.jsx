import { useNavigate } from "react-router"
import { useContext, useEffect, useState } from 'react'
import { fetchData } from '../../../helpers/axiosHelper'
import { AuthContext } from '../../../contexts/AuthContext/AuthContext'
import { CalendarGeneral } from '../../../components/CalendarGeneral/CalendarGeneral'

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { buildDate } from '../../../helpers/buildDateHelper.js'
import ModalSeeAppointment from "../../../components/Modal/ModalSeeAppointment/ModalSeeAppointment.jsx"

dayjs.extend(customParseFormat)

const GeneralCalendarPage = () => {
  const [view, setView] = useState('day')
  const [date, setDate] = useState(new Date())
  const [appoiment, setAppoiment] = useState([])
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showSeeModal, setShowSeeModal] = useState(false);

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

  //selec un evento para editar o eliminar
  const handleSelectEvent = (event) => {
    setSelectedAppointment(event);
    setShowSeeModal(true);
  };

  //editar una cita ya creada
  const updateAppointment = async (updatedData) => {
    try {
      const res = await fetchData(
        `appointment/updateAppointment/${updatedData.id}`,
        'put',
        updatedData,
        token,
      );

      const updated = res.data.result;

      setAppoiment((prev) =>
        prev.map((app) => {
          if (app.appointment_id !== updated.appointment_id) return app;

          const start = new Date(
            `${updated.appointment_date}T${updated.start_time}`,
          );
          const durationMinutes = updated.duration ?? 0;
          const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

          return {
            ...app,
            ...updated,
            start,
            end,
          };
        }),
      );
    } catch (error) {
      console.error('Error actualizando cita', error);
    }
  };

  //eliminar una cita ya creada
  const deleteAppointment = async (appointmentId) => {
    try {
      await fetchData(
        `appointment/deleteAppointment/${appointmentId}`,
        'DELETE',
        null,
        token,
      );

      setAppoiment((prev) =>
        prev.filter((app) => app.appointment_id !== appointmentId),
      );
      setShowSeeModal(false);
    } catch (error) {
      console.error('Error eliminando cita', error);
    }
  };

  //eventos en el calendario mapeados
  const eventsMap = appoiment.map((elem) => ({
    id: elem.appointment_id,

    title: elem.client_name
      ? `${elem.client_name} ${elem.client_lastname ?? ''}`.trim()
      : elem.guest_name,

    start: buildDate(elem.appointment_date, elem.start_time),
    end: buildDate(elem.appointment_date, elem.end_time),
    resourceId: elem.employee_user_id,

    employee_name: elem.employee_name,
    employee_lastname: elem.employee_lastname,

    client_name: elem.client_name,
    client_lastname: elem.client_lastname,

    created_by_name: elem.created_by_name,
    created_by_type: elem.created_by_type,

    guest_name: elem.guest_name,
    guest_phone: elem.guest_phone,
    observations: elem.observations,

    status: elem.status,
    total_price: elem.total_price,

  }));

  const allEvents = [...eventsMap]

  //trabajadores que aparecen en la tabla 
  const workers = Array.from(
    new Map(
      appoiment.map(elem => [
        elem.employee_user_id,
        {
          id: elem.employee_user_id,
          title: elem.employee_name
        }
      ])
    ).values()
  )


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
          onSelectEvent={handleSelectEvent}
        />
      </section>

      {showSeeModal && (
        <ModalSeeAppointment
          appointment={selectedAppointment}
          onClose={() => setShowSeeModal(false)}
          onUpdate={updateAppointment}
          onDelete={deleteAppointment}
        />
      )}

      <div className="back-btn-center">
        <button className="back-btn" type="button" onClick={() => navigate(-1)}>
          <span className="arrow">VOLVER</span>
        </button>
      </div>
    </>
  )
}

export default GeneralCalendarPage