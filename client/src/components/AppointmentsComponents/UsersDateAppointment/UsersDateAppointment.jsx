import './UsersDateAppointment.css';
import { useState} from 'react';
import Calendar from 'react-calendar';

export const UsersDateAppointment = ({ setCurrentAppointment, workers }) => {
  const [date, setDate] = useState(new Date());
  const [workerId, setWorkerId] = useState(null);

  return (
    <>
      <div className="selectDatePage">
        <div className="selectEmployee">
          <h2>Selecciona el empleado</h2>
          <div className="selectEmployeeGrid">
            {workers.length === 0 && <p>No hay empleados disponibles.</p>}
            {workers?.map((elem) => (
              <div
                key={elem.user_id}
                className={`selectEmployeeCard ${workerId === elem.user_id ? 'selected' : ''}`}
 >
                <div className="appointmentWorkerImage">
                  {elem.picture_user ? (
                    <img
                      src={`http://localhost:4000/images/generalPictures/${elem.picture_user}`}
                      alt={elem.name_user}
                    />
                  ) : (
                    <span>IMG</span>
                  )}
                </div>
                <h3>
                  {elem.name_user}
                </h3>
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
            ))}
          </div>
        </div>
      </div>

      <div className="selectDate">
        <h2 className="selectDateTitle">Selecciona la fecha</h2>
        <div className="calendarAndHours">
          <div className="calendar-container">
            <Calendar onChange={setDate} value={date} selectRange={false} />

            <div className="dateSelected">
              <button type="button" className="selectHourBtn">
                12:00h
              </button>
              <button type="button" className="selectHourBtn">
                13:00h
              </button>
              <button type="button" className="selectHourBtn">
                17:30h
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="selectEmployeeActions">
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
