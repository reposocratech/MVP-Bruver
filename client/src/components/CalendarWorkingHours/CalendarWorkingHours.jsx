import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css"
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { useState } from 'react'
import { ModalWorkingHours } from '../Modal/ModalWorkingHours/ModalWorkingHours'

dayjs.locale('es');
dayjs.extend(customParseFormat)
const localizer = dayjsLocalizer(dayjs)
const DnDCalendar = withDragAndDrop(Calendar);

export const CalendarWorkingHours = () => {
  const [view, setView] = useState('week');
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //crear evento
  const handleSelectSlot = ({ start, end }) => {
    const title = window.prompt("Título del evento");

    if (!title) return;

    // Verificar si ya existe un evento en el rango seleccionado
    const overlappingEvent = events.some(event =>
      (start < event.end && end > event.start) // Verificar superposición
    );

    if (overlappingEvent) {
      alert("Ya existe un evento en este rango de tiempo.");
      return;
    }

    setEvents((prev) => [
      ...prev,
      {
        id: Date.now(),
        title,
        start,
        end,
      }
    ]);
  }

  //modificar horas de un evento ya creado 
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true)
  };




  return (
    <>
      <DnDCalendar
        localizer={localizer}
        view={view}
        date={date}
        events={events}
        onView={setView}
        onNavigate={setDate}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        selectable='ignoreEvents'
        views={['week']}
        startAccessor="start"
        endAccessor="end"
        min={dayjs(date).hour(9).minute(30).toDate()}
        max={dayjs(date).hour(20).minute(30).toDate()}
        step={30}
        timeslots={1}
        style={{ height: "95vh" }}

        resizable
        onEventDrop={({ event, start, end }) => {
          setEvents(prev =>
            prev.map(e =>
              e.id === event.id
                ? { ...e, start, end }
                : e
            )
          );
        }}

        onEventResize={({ event, start, end }) => {
          setEvents(prev =>
            prev.map(e =>
              e.id === event.id
                ? { ...e, start, end }
                : e
            )
          );
        }}
      />

      {isModalOpen && selectedEvent && (
        <ModalWorkingHours
          show={isModalOpen}
          setShow={setIsModalOpen}
          selectedEvent={selectedEvent}
          setEvents={setEvents}
          
        />
      )}




    </>
  )
}
