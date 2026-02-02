// Estilos específicos del componente
import './UsersDateAppointment.css';
// Hooks de React (estado, efectos y contexto)
import { useState, useEffect, useContext } from 'react';
// Calendario simple para elegir fecha (lado izquierdo)
import { Button } from 'react-bootstrap';
import Calendar from 'react-calendar';
// dayjs para manipular fechas y horas de forma sencilla
import dayjs from 'dayjs';
// plugin para obtener día ISO de la semana (1..7)
import isoWeek from 'dayjs/plugin/isoWeek';
// Contexto de autenticación (contiene token y setters globales)
import { AuthContext } from '../../../contexts/AuthContext/AuthContext';
// Helper axios que añade token si existe y maneja base URL
import { fetchData } from '../../../helpers/axiosHelper';
// Helper para convertir un day_id (1..7) en una fecha concreta de la semana
import { getDateFromDayId } from '../../../helpers/dateHelper';
// Helper temporal (merge intervals, parse date/time)
import { mergeIntervals, parseDateTime } from '../../../helpers/timeHelper';
// Zod schema para validar payload de creación
import { ZodError } from 'zod';
import { createAppointmentSchema } from '../../../schemas/CreateAppointmentSchema';

// Activamos el plugin isoWeek en dayjs
dayjs.extend(isoWeek);

/*
  UsersDateAppointment
  --------------------
  Componente para:
  - Seleccionar empleado
  - Elegir fecha
  - Mostrar franjas de disponibilidad (desde `schedule`) y citas existentes
  - Generar "huecos" (slots) válidos para la duración seleccionada
  - Permitir seleccionar (click o arrastrando) y confirmar reserva

  Comentarios y funciones clave están en español para facilitar mantenimiento.
*/
export const UsersDateAppointment = ({ setCurrentAppointment, workers, selectedPet, baseServiceId, extrasIds, sumaTotalPrecio, sumaTotalMinutos, cleaningServiceId = null, cleaningServiceDuration = 0 }) => {
  // Fecha seleccionada en el mini-calendario (Date)
  const [date, setDate] = useState(new Date());
  // Id del empleado seleccionado (null = ninguno)
  const [workerId, setWorkerId] = useState(null);
  // Franjas de disponibilidad traídas del backend (array de objetos availability)
  const [schedule, setSchedule] = useState([]);
  // Citas existentes del empleado (array)
  const [appointments, setAppointments] = useState([]);
  // Ya no mostramos calendario semanal; no necesitamos `events`.  // Lista de huecos (slots) calculados que encajan con la duración solicitada
  const [availableSlots, setAvailableSlots] = useState([]);
  // Slot seleccionado por el usuario: {start: Date, end: Date, label: 'HH:mm'}
  const [selectedSlot, setSelectedSlot] = useState(null);
  // Flag para deshabilitar el botón mientras se realiza la petición de creación
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Errores de validación y mensajes de error para mostrar en la UI
  const [errorMsg, setErrorMsg] = useState(null);

  // Extraemos token del AuthContext para hacer peticiones autenticadas
  const { token } = useContext(AuthContext);

  // Cuando cambia el trabajador seleccionado, traemos su schedule y sus citas
  useEffect(() => {
    const fetchDataForWorker = async () => {
      // Si no hay trabajador seleccionado, no hacemos nada

      try {
        // Pedimos en paralelo: franjas de disponibilidad y citas del empleado
        const [availRes, appoRes] = await Promise.all([
          fetchData(`availability/getWorkingHours/${workerId}`, 'get', null, token),
          fetchData(`appointment/getAdminAppoiment/${workerId}`, 'get', null, token)
        ]);

        // Guardamos los resultados (si vienen vacíos, ponemos array vacío para evitar undefined)
        setSchedule(availRes.data.result || []);
        setAppointments(appoRes.data.result || []);
      } catch (error) {
        // Logging para depuración en caso de fallo de la petición
        console.error(error);
      }
    };

    fetchDataForWorker();
  }, [workerId, token]);

  /*
    EFFECT: construir eventos y huecos disponibles para la fecha seleccionada
    - Fusiona availability contiguas
    - Crea eventos 'Disponible' y 'Ocupado' para el calendario
    - Genera botones (slots) que encajan con la duración requerida
  */
  useEffect(() => {
    // Día ISO de la semana (1 = lunes, 7 = domingo)
    const selectedDayId = dayjs(date).isoWeekday();

    // 1) Construir eventos de disponibilidad (solo para el dayId seleccionado)
    const availEvents = schedule
      .filter(item => Number(item.day_id) === Number(selectedDayId) && item.start_time && item.end_time) // filtramos por día y tiempos válidos
      .map(item => {
        // Convertimos start_time/end_time (hh:mm) a objetos dayjs con la fecha concreta de esta semana
        const startParts = item.start_time.split(':').map(Number);
        const endParts = item.end_time.split(':').map(Number);
        
        const [sh, sm] = startParts;
        const [eh, em] = endParts;
        const start = dayjs(getDateFromDayId(item.day_id, date)).hour(sh).minute(sm).second(0);
        const end = dayjs(getDateFromDayId(item.day_id, date)).hour(eh).minute(em).second(0);
        // Devolvemos objeto con start/end en formato Date para el calendario
        return { id: item.availability_id, title: 'Disponible', start: start.toDate(), end: end.toDate() };
      })
      .filter(x => x != null); // eliminamos solo null/undefined (entradas inválidas)

    // 2) Construir eventos de citas (parsing robusto usando parseDateTime)
    const appointmentEvents = appointments
      .map(item => {
        const s = parseDateTime(item.appointment_date, item.start_time); // inicio
        const e = parseDateTime(item.appointment_date, item.end_time) || (s ? s.add(Number(item.duration_minutes || 0), 'minute') : null); // fin o derivado
        return s && e ? { id: item.appointment_id, title: 'Ocupado', start: s.toDate(), end: e.toDate() } : null;
      })
      .filter(x => x != null); // eliminamos solo null/undefined (parsing inválido)

    // 3) Fusionar franjas contiguas u solapadas para simplificar la lógica de generación de huecos
    const mergedAvail = mergeIntervals(availEvents);

    // 5) Generar "slots" (posibles inicios de cita) que encajen dentro de cada franja
    // Incluir duración del servicio de limpieza (si existe). `sumaTotalMinutos` viene de los servicios seleccionados.
    const durationMinutes = Math.round(sumaTotalMinutos + Number(cleaningServiceDuration || 0)); // duración requerida en minutos (incluye limpieza)
    const stepMinutes = 15; // granularidad de búsqueda (cada 15 minutos)

    const slots = [];
    // Comprueba si dos intervalos temporales se solapan.
    // Devuelve true cuando los intervalos [startA, endA) y [startB, endB) tienen intersección,
    // es decir: empieza antes de que termine el otro y viceversa.
    // Los parámetros pueden ser objetos Date o timestamps comparables.
    const overlapsFn = (startA, endA, startB, endB) => startA < endB && startB < endA; // función de solapamiento

    mergedAvail.forEach((avail) => {
      // Empezamos el cursor en el inicio de la franja
      let cursor = dayjs(avail.start).second(0);
      const availEnd = dayjs(avail.end).second(0);

      // Alineamos el cursor al siguiente múltiplo de stepMinutes (para mostrar botones en 00/15/30/45)
      const startMinute = cursor.minute();
      const alignedMinute = Math.ceil(startMinute / stepMinutes) * stepMinutes;
      if (alignedMinute !== startMinute) cursor = cursor.minute(alignedMinute).second(0);

      // Mientras que haya espacio para la duración requerida dentro de la franja
      while (cursor.add(durationMinutes, 'minute').valueOf() <= availEnd.valueOf()) {
        const candidateStart = cursor.second(0);
        const candidateEnd = candidateStart.add(durationMinutes, 'minute').second(0);

        // Comprobamos si choca con alguna cita existente
        const clashes = appointmentEvents.some(app => overlapsFn(candidateStart.toDate(), candidateEnd.toDate(), app.start, app.end));

        if (!clashes) {
          // Si no hay choque, añadimos el slot (mostramos solo la hora de inicio como label)
          slots.push({ start: candidateStart.toDate(), end: candidateEnd.toDate(), label: candidateStart.format('HH:mm') });
        }

        // Avanzamos el cursor en pasos de stepMinutes
        cursor = cursor.add(stepMinutes, 'minute');
      }
    });

    // Guardamos la lista de huecos calculados para renderizar botones
    setAvailableSlots(slots);
  }, [schedule, appointments, date, sumaTotalMinutos, cleaningServiceDuration]);


  /* -----------------------
     Helpers reutilizables (comentados línea a línea)
     ----------------------- */
  // parseDateTime movido a helper `client/src/helpers/timeHelper.js` 

  // Fusiona intervalos contiguos o solapados
  // Entrada: [{start, end}, ...] donde start/end son Date u objetos compatibles
  // Merge de intervalos extraído a helper (`mergeIntervals`) en `client/src/helpers/timeHelper.js`

  // Nota: las funciones auxiliares para seleccionar directamente sobre el calendario
  // (comprobaciones y parsing por día) se han eliminado, porque la interacción
  // se limita ahora exclusivamente a los botones de "Huecos disponibles".
  // Si en el futuro se reintroduce la selección por arrastre, se pueden reimplementar aquí.

  // Selección mediante click en lista de botones (slots)
  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot); // marcamos el slot
  }; 

  // Maneja la confirmación final y la creación de la cita en el backend
  const handleConfirm = async () => {
    // Limpiamos errores previos
    setErrorMsg(null);

    // Construimos payload e incluimos el servicio de limpieza en supplement_ids si no está ya
    const supplementIdsPayload = (Array.isArray(extrasIds) ? extrasIds.map(n => Number(n)).filter(n => !Number.isNaN(n)) : []);
    const baseServiceIdNum = baseServiceId ? Number(baseServiceId) : null;
    const cleaningServiceIdNum = cleaningServiceId ? Number(cleaningServiceId) : null;

    if (cleaningServiceIdNum && !supplementIdsPayload.includes(cleaningServiceIdNum) && cleaningServiceIdNum !== baseServiceIdNum) {
      supplementIdsPayload.push(cleaningServiceIdNum);
    }

    const payload = {
      pet_id: Number(selectedPet.pet_id),
      employee_user_id: Number(workerId),
      service_id: baseServiceIdNum || null,
      supplement_ids: supplementIdsPayload,
      appointment_date: dayjs(selectedSlot.start).format('YYYY-MM-DD'),
      start_time: dayjs(selectedSlot.start).format('HH:mm'),
      duration_minutes: Math.round(sumaTotalMinutos + Number(cleaningServiceDuration || 0)),
      total_price: Number(sumaTotalPrecio || 0),
      observations: null,
      cleaning_service_id: cleaningServiceIdNum || null,
    };

    try {
      // Validación por schema
      createAppointmentSchema.parse(payload);

      // Indicador de envío
      setIsSubmitting(true);

      await fetchData('appointment/create', 'POST', payload, token);

      // Actualizamos las citas del empleado para reflejar el nuevo estado
      const appoRes = await fetchData(`appointment/getAdminAppoiment/${workerId}`, 'get', null, token);
      setAppointments(appoRes.data.result || []);

      alert('Cita creada correctamente');

      // Reset de selección y retorno al paso inicial
      setSelectedSlot(null);
      setWorkerId(null);
      setCurrentAppointment(1);
    } catch (error) {
      if (error instanceof ZodError) {
        const objTemp = {};
        error.errors.forEach((er) => {
          objTemp[er.path[0]] = er.message;
        });
      } else if (error?.response) {
        setErrorMsg(error.response.data.message);
        alert(error.response.data.message);
      } else {
        setErrorMsg('Error al crear la cita');
        alert('Error al crear la cita');
      }
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="selectDatePage">
          <h2>Selecciona el empleado</h2>
          <div className="selectEmployeeGrid">
            {(!workers || workers.length === 0) && <p>No hay empleados disponibles.</p>}
            {workers?.map((elem) => (
              <div              
                key={elem.user_id}
                className={`cardEmployee col-12 col-sm-6 col-lg-4 ${workerId === elem.user_id ? 'selected' : ''}`}
              >
                <div className="appointmentEmployeeCard">
                  {elem.picture_user ? (
                    <img
                      src={`${import.meta.env.VITE_SERVER_IMAGES}/picturesGeneral/${elem.picture_user}`}
                      alt={elem.name_user}
                    />
                  ) : (
                    <img
                      className="employeePhoto"
                      src={`/img/defaultimg/IconDefect.png`}
                      alt="Imagen de perfil por defecto"
                    />
                  )}
                
                <h3>
                  {elem.name_user}
                </h3>
                <div className="appointmentEmployeeActions">
                <button
                  type="button"
                  onClick={() => {
                    console.log('Empleado seleccionado:', elem.user_id);
                    setWorkerId(elem.user_id);
                  }}
                  className="selectEmployeeBtn"
                >
                  SELECCIONAR
                </button>
              </div>
              </div>
              </div>
            ))}
      </div>

      </div>

      <div className="selectDate">
        <h2 className="selectDateTitle">Selecciona la fecha</h2>
        <div className="calendarAndHours">
          <div className="calendar-container">
            <Calendar onChange={setDate} value={date} selectRange={false} />
            <p className="calendar-hint">Selecciona la fecha en el calendario y, a continuación, elige un hueco de la lista de <strong>Huecos disponibles</strong> para reservar.</p>

            <div className="dateSelected">
              <h4>Huecos disponibles para esa fecha:</h4>
              {availableSlots.length === 0 && <p>No hay huecos disponibles para la duración seleccionada.</p>}
              <div className="availableSlots">
                {availableSlots.map((slot) => (
                  <button
                    key={`${dayjs(slot.start).valueOf()}-${slot.label}`}
                    type="button"
                    className={`selectHourBtn ${selectedSlot?.label === slot.label ? 'selected' : ''}`}
                    onClick={() => handleSelectSlot(slot)}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>

              <div className="selected-slot">
                {selectedSlot ? (
                  <p>Seleccionado: {dayjs(selectedSlot.start).format('DD/MM/YYYY HH:mm')}</p>
                ) : (
                  <p className="hint">Selecciona un hueco disponible para habilitar el botón de confirmar.</p>
                )}

                <div className="confirm-actions">
                  {errorMsg && <p className="error">{errorMsg}</p>}
                  <button
                    type="button"
                    className="confirmBtn"
                    disabled={isSubmitting || !selectedSlot || !workerId || !selectedPet}
                    onClick={handleConfirm}
                  >
                     CONFIRMAR
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="selectEmployeeActions">
        <div className="infoAppoint">
      <h3><img src='/img/appointment/clock.png' />{minutesToHour(sumaTotalMinutos)}</h3>
      <h3><img src='/img/appointment/cart.png' />{sumaTotalPrecio.toFixed(2)}€</h3>
      </div>
        <button
          type="button"
          onClick={() => setCurrentAppointment(2)}
          className="selectEmployeeBackBtn"
        >
          VOLVER
        </button>
      </div>
    </>
  );
};
