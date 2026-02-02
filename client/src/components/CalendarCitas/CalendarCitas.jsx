import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css"
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.locale('es');
dayjs.extend(customParseFormat)

const localizer = dayjsLocalizer(dayjs)
const DnDCalendar = withDragAndDrop(Calendar);

export const CalendarCitas = ({
  view,
  date,
  events,
  setView,
  setDate,
  onSelectEvent,
}) => {
  return (
    <>
      <DnDCalendar
        localizer={localizer}
        view={view}
        date={date}
        events={events}
        onView={setView}
        onNavigate={setDate}
        onSelectEvent={onSelectEvent}
        selectable
        views={['week']}
        startAccessor="start"
        endAccessor="end"
        min={dayjs(date).hour(9).minute(30).toDate()}
        max={dayjs(date).hour(20).minute(30).toDate()}
        step={15}
        timeslots={1}
        style={{ height: "95vh" }}

        resizable

      />
    </>
  )
}
