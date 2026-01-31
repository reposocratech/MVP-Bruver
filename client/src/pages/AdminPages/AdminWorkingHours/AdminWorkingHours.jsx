import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import '../AdminProfile/AdminProfile.css';
import { CalendarWorkingHours } from '../../../components/CalendarWorkingHours/CalendarWorkingHours';
import { ModalWorkingHours } from '../../../components/Modal/ModalWorkingHours/ModalWorkingHours';
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { AuthContext } from '../../../contexts/AuthContext/AuthContext';
import { fetchData } from '../../../helpers/axiosHelper.js';
import { getDateFromDayId } from '../../../helpers/dateHelper.js';



dayjs.extend(isoWeek);

const AdminWorkingHours = () => {
  const [view, setView] = useState('week')
  const [date, setDate] = useState(new Date())
  const [schedule, setSchedule] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { adminId } = useParams()
  const { token } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSchedule = async () => {
      const res = await fetchData(
        `availability/getWorkingHours/${adminId}`,
        'get',
        null,
        token
      )
      setSchedule(res.data.result)
    }
    fetchSchedule()
  }, [])
  

  const handleSelectSlot = async ({ start, end }) => {
    console.log(start, end);
    
  try {
    const startDayjs = dayjs(start);

    const data = {
      user_id: adminId,
      day_id: startDayjs.isoWeekday(),
      start_time: startDayjs.format('HH:mm:ss'),
      end_time: dayjs(end).format('HH:mm:ss'),
    }

    const res = await fetchData(
      'availability/newAvailability',
      'POST',
      data,
      token
    )

    setSchedule(prev => [
      ...prev,
      {
        availability_id: res.data.result.insertId,
        ...data
      }
    ]);
  } catch (error) {
    console.error(error);
    alert("Error al crear el horario");
  }
  }
  // Seleccionar evento
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    console.log(event);
    
  };



  // Guardar cambios

  const handleSaveEvent = async (availability_id, start, end) => {
    const startDayjs = dayjs(start)
    const endDayjs = dayjs(end)

    const data = {
      day_id: startDayjs.isoWeekday(),
      start_time: startDayjs.format('HH:mm:ss'),
      end_time: endDayjs.format('HH:mm:ss'),
    }

    await fetchData(
      `availability/editAvailability/${availability_id}`,
      'PUT',
      data,
      token
    )

    setSchedule(prev =>
      prev.map(e =>
        e.availability_id === availability_id
          ? { ...e, ...data }
          : e
      )
    )

    setIsModalOpen(false)
  }

  const handleDeleteEvent = async availability_id => {
    await fetchData(
      `availability/delAvailability/${availability_id}`,
      'DELETE',
      null,
      token
    )

    setSchedule(prev =>
      prev.filter(e => e.availability_id !== availability_id)
    )

    setIsModalOpen(false)
  }

  const buildDateTime = (dayId, time) => {
    const [h, m, s] = time.split(':')
    return getDateFromDayId(dayId, date)
      .hour(+h)
      .minute(+m)
      .second(+s || 0)
      .toDate()
  }

  //mapeo de horario disponible
  const eventsMap = schedule?.map((item) => ({
    id: item.availability_id,
    title: 'Disponible',
    start: buildDateTime(item.day_id, item.start_time),
    end: buildDateTime(item.day_id, item.end_time),
   
  }));

  const allEvents = [...eventsMap]

  

  return (
    <section className="admin-working-hours-page">
      <h2 className="title">Horario laboral (Admin)</h2>

      <CalendarWorkingHours
        view={view}
        date={date}
        events={allEvents}
        setView={setView}
        setDate={setDate}
        handleSelectSlot={handleSelectSlot}
        handleSelectEvent={handleSelectEvent}
        toolbar={false}
      />

      {isModalOpen && selectedEvent && (
        <ModalWorkingHours
          show={isModalOpen}
          setShow={setIsModalOpen}
          selectedEvent={selectedEvent}
          handleSave={handleSaveEvent}
          handleDelete={handleDeleteEvent}
        />
      )}

      <div className="back-btn-center">
        <button className="back-btn" onClick={() => navigate(-1)}>
          VOLVER
        </button>
      </div>
    </section>
  )
  
};
export default AdminWorkingHours