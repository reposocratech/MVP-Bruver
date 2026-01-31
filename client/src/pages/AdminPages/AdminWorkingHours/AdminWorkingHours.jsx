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
  const [view, setView] = useState('week');
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedule, setSchedule] = useState([]);

  const { adminId } = useParams()
  const { token } = useContext(AuthContext);


  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetchData(`availability/getWorkingHours/${adminId}`, "get", null, token)
        setSchedule(res.data.result)
        console.log("que horario laboral nos llega 2", res.data.result);
      } catch (error) {
        console.log(error);

      }
    }
    fetchSchedule();
  }, [])



  const navigate = useNavigate();

  // Crear evento
  const handleSelectSlot = async ({ start, end }) => {
    console.log(start, end);
    
  try {
    const startDayjs = dayjs(start);

    const data = {
      user_id: adminId,
      day_id: startDayjs.isoWeekday(),
      start_time: startDayjs.format("HH:mm:ss"),
      end_time: dayjs(end).format("HH:mm:ss"),
    };

    const res = await fetchData(
      "availability/newAvailability",
      "POST",
      data,
      token
    );

    setSchedule(prev => [
      ...prev,
      {
        availability_id: res.data.availability_id,
        ...data
      }
    ]);
  } catch (error) {
    console.error(error);
    alert("Error al crear el horario");
  }
};


  // Seleccionar evento
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };



  // Guardar cambios
 const handleSaveEvent = async (availability_id, start, end) => {
  const startDayjs = dayjs(start);
  const endDayjs = dayjs(end);

  const day_id = startDayjs.isoWeekday(); // 1=lunes 
  const start_time = startDayjs.format("HH:mm:ss");
  const end_time = endDayjs.format("HH:mm:ss");

  const data = {day_id, start_time, end_time }

  try {
    await fetchData(
      `availability/editAvailability/${availability_id}`,
      "PUT",
      data,
      token
    );

  
    setSchedule(prev =>
      prev.map(elem =>
        elem.availability_id === availability_id
          ? { ...elem, day_id, start_time, end_time }
          : elem
      )
    );

    setIsModalOpen(false);
  } catch (error) {
    console.log(error);
  }
};


  // Eliminar evento
  const handleDeleteEvent = async (availability_id) => {
    if (!window.confirm("¿Eliminar este evento?")) return;

    console.log("que ide nos llega en availability_id", availability_id);


    try {
      let res = await fetchData(`availability/delAvailability/${availability_id}`, 'DELETE', null, token)

     
      setSchedule(schedule.filter(elem => elem.availability_id !== availability_id))

      setIsModalOpen(false);
    } catch (error) {
      console.log(error);

    }

  };

  //no la pude sacar fuer, diferente
  const buildDateTime = (dayId, time) => {
    if (!dayId || !time) return null;

    const [h, m, s] = time.split(":");

    return getDateFromDayId(dayId, date)
      .hour(Number(h))
      .minute(Number(m))
      .second(Number(s || 0))
      .toDate();
  };



  //mapeo de horario disponible
  const eventsMap = schedule.map((item) => ({
    id: item.availability_id,
    title: "Disponible",
    start: buildDateTime(item.day_id, item.start_time),
    end: buildDateTime(item.day_id, item.end_time),
  }));

  const allEvents = [...eventsMap]



  return (
    <section className="admin-section">
      <h2 className="title">Horario laboral (Admin)</h2>
      <div>
        <CalendarWorkingHours
          view={view}
          date={date}
          events={allEvents}
          setView={setView}
          setDate={setDate}
          handleSelectSlot={handleSelectSlot}
          handleSelectEvent={handleSelectEvent}
        />

        {isModalOpen && selectedEvent && (
          <ModalWorkingHours
            show={isModalOpen}
            setShow={setIsModalOpen}
            selectedEvent={selectedEvent}
            setEvents={setEvents}
            handleSave={handleSaveEvent}
            handleDelete={handleDeleteEvent}
          />
        )}
      </div>
      <div className="back-btn-center">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <span className="arrow">←</span>ATRÁS
        </button>
      </div>
    </section>
  );
};

export default AdminWorkingHours;
