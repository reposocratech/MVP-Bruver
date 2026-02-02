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
import ModalSeeAppointment from "../../../components/Modal/ModalSeeAppointment/ModalSeeAppointment.jsx";
import Worker from "../../WorkerPages/WorkerDate/Worker.jsx";

dayjs.extend(isoWeek)

const AdminAppointments = () => {
  const [view, setView] = useState("week")
  const [date, setDate] = useState(new Date())
  const [appoiment, setAppoiment] = useState([])
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showSeeModal, setShowSeeModal] = useState(false);

   const [openModal, setOpenModal] = useState(false);
  const [openSearchClient, setOpenSearchClient] = useState(false);
  const [openQuickReserve, setOpenQuickReserve] = useState(false);
 /*  const [openCita, setOpenCita] = useState(false); */
  const [openAddReserveClient, setOpenAddReserveClient] = useState(false);

  const [selectedClient, setSelectedClient] = useState(null);

  const [dateStartTime, setDateStartTime] = useState(null)

  const { token } = useContext(AuthContext)
  const { adminId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetcAppointments = async () => {
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
    fetcAppointments();
  }, [])

   const handleChange = (option) => {
    setOpenModal(false);

    if (option === '1') {
      setOpenSearchClient(true);
    }

    if (option === '2') {
      setOpenQuickReserve(true);
    }
  };

  const openNewAppointment =(dateStart)=>{
    setOpenModal(true);
     setDateStartTime(dateStart); 
   
   
  }

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
      token
    );

   
    const updated = res.data.result;

    setAppoiment(prev =>
      prev.map(app => {
        if (app.appointment_id !== updated.appointment_id) return app;

       
        const start = new Date(`${updated.appointment_date}T${updated.start_time}`);
        const durationMinutes = updated.duration ?? 0;
        const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

        return {
          ...app,
          ...updated,
          start,
          end
        };
      })
    );

  } catch (error) {
    console.error('Error actualizando cita', error);
  }
};

  //eliminar una cita ya creada
  const deleteAppointment = async (appointmentId) => {
  try {
    await fetchData(`appointment/deleteAppointment/${appointmentId}`, "DELETE", null, token);

    setAppoiment(prev => prev.filter(app => app.appointment_id !== appointmentId));
    setShowSeeModal(false);
  } catch (error) {
    console.error("Error eliminando cita", error);
  }
};





  //eventos en el calendario mapeados
  const eventsMap = appoiment.map((elem) => ({
    id: elem.appointment_id,
    title: elem.employee_name,
    start: buildDate(elem.appointment_date, elem.start_time),
    end: buildDate(elem.appointment_date, elem.end_time),
    resourceId: elem.employee_user_id,

    employee_name: elem.employee_name,
    employee_lastname: elem.employee_lastname,


    client_name: elem.client_name,
    client_lastname: elem.client_lastname,

    created_by_name: elem.created_by_name,
    created_by_type: elem.created_by_type,

    status: elem.status,
    total_price: elem.total_price
  }));

  const allEvents = [...eventsMap]


  return (
    <section className="admin-section">
      <h2 className="title">Mis citas (Admin)</h2>
      <CalendarCitas
        view={view}
        date={date}
        events={allEvents}
        setView={setView}
        setDate={setDate}
        onSelectEvent={handleSelectEvent}
        openNewAppointment={openNewAppointment}
      />

      {showSeeModal && (
        <ModalSeeAppointment
          appointment={selectedAppointment}
          onClose={() => setShowSeeModal(false)}
          onUpdate={updateAppointment}
          onDelete={deleteAppointment}
        />
      )}
      <div className="back-btn-center">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <span className="arrow">VOLVER</span>
        </button>
      </div>

      <Worker 
      openModal={openModal}
      openSearchClient={openSearchClient}
      openQuickReserve={openQuickReserve}
      openAddReserveClient={openAddReserveClient}
      setOpenModal={setOpenModal}
      setOpenSearchClient={setOpenSearchClient}
      setOpenQuickReserve={setOpenQuickReserve}
      setOpenAddReserveClient={setOpenAddReserveClient}
      selectedClient={selectedClient}
      setSelectedClient={setSelectedClient}
      handleChange={handleChange}
      dateStartTime={dateStartTime}
      setDateStartTime={setDateStartTime}
      setAppoiment={setAppoiment}
      />
    </section>
  )
}

export default AdminAppointments
