import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import './CalendarWorkingHours.css'

dayjs.locale('es')
dayjs.extend(customParseFormat)

const localizer = dayjsLocalizer(dayjs)
const DnDCalendar = withDragAndDrop(Calendar)

export const CalendarWorkingHours = ({
  view,
  date,
  events,
  isMobile,
  setView,
  setDate,
  handleSelectSlot,
  handleSelectEvent,
}) => {
  return (
    <section className="calendar-working-hours-scope">
      <div className="calendar-working-hours">
        <DnDCalendar
          localizer={localizer}
          view={view}
          date={date}
          events={events}
          onNavigate={setDate}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable={handleSelectSlot ? "ignoreEvents" : false}
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
          step={30}
          timeslots={1}
          style={{ height: '95vh' }}
          resizable
        />
      </div>
    </section>
  )
}
