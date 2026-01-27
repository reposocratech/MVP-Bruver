import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './GeneralCalendarPage.css'
import dayjs from 'dayjs'
import 'dayjs/locale/es'

dayjs.locale('es');
const localizer = dayjsLocalizer(dayjs)

export const CalendarGeneral = ({ events,
  workers,
  view,
  date,
  onViewChange,
  onDateChange }) => {

  //controlar las horas diarias ene l calendario
  const minTime = new Date()
  minTime.setHours(9, 30, 0)

  const maxTime = new Date()
  maxTime.setHours(20, 15, 0)

  const components = {
    event: ({ event }) => (
      <div style={{ backgroundColor: 'green' }}>
        {event.title}
      </div>
    )
  }

  return (
    <div style={{ height: '95vh', width: '100%' }}>
      <Calendar
        localizer={localizer}
        events={events}
        view={view}
        date={date}
        onView={onViewChange}
        onNavigate={onDateChange}
        views={['day', 'week', 'month']}
        min={minTime}
        max={maxTime}
        step={15}
        timeslots={1}
        components={components}
        resources={workers}
        resourceIdAccessor="id"
        resourceTitleAccessor="title"
      />
    </div>
  )
}
