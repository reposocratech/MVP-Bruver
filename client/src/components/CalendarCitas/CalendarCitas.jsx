import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import './CalendarCitas.css'

dayjs.locale('es')
dayjs.extend(customParseFormat)

const localizer = dayjsLocalizer(dayjs)
const DnDCalendar = withDragAndDrop(Calendar)

export const CalendarCitas = ({
  view,
  date,
  events,
  isMobile,
  setView,
  setDate,
  onSelectEvent,
  openNewAppointment
}) => {
  return (
    <div className="calendar-working-hours calendar-citas">
      <DnDCalendar
        localizer={localizer}
        view={view}
        date={date}
        events={events}
        onNavigate={setDate}
        onSelectEvent={onSelectEvent}
        onSelectSlot={(event)=>openNewAppointment(event.start)}
        selectable={isMobile ? "ignoreEvents" : true}
         longPressThreshold={200}
        views={isMobile ? ["day"] : ["week"]}
        onView={(newView) => {
          if (isMobile && newView !== "day") return;
          if (!isMobile && newView !== "week") return;
          setView(newView);
        }}
        startAccessor="start"
        endAccessor="end"
        min={dayjs(date).hour(9).minute(30).toDate()}
        max={dayjs(date).hour(20).minute(30).toDate()}
        step={15}
        timeslots={1}
        style={{ height: '95vh' }}
        resizable
         eventPropGetter={(event) => ({
    className: `status-${event.status}`
  })}
      />
    </div>
  )
}
