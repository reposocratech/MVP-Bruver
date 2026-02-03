import './UsersDateAppointment.css';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import Calendar from 'react-calendar';

export const UsersDateAppointment = ({
  setCurrentAppointment,
  workers,
  sumaTotalPrecio,
  sumaTotalMinutos,
  minutesToHour
}) => {
  const [date, setDate] = useState(new Date());
  const [workerId, setWorkerId] = useState(null);

  return (
    <>
      <div className="selectDatePage">
          <h2>Selecciona el empleado</h2>
          <div className="selectEmployeeGrid">
            {workers.length === 0 && <p>No hay empleados disponibles.</p>}
            {workers?.map((elem) => (
              <div className="cardEmployee col-12 col-sm-6 col-lg-4" key={elem.workerId}>
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
                  <div className="appointmentEmployeeInfo">
                    <h3>{elem.name_user} </h3>
                    <div className="appointmentEmployeeActions">
                      <button
                        type="button"
                        onClick={() => {
                          setWorkerId(elem.user_id);
                        }}
                        className={
                          workerId === elem.user_id
                            ? 'selectEmployeeBtn selected'
                            : 'selectEmployeeBtn'
                        }
                      >
                        SELECCIONAR
                      </button>
                    </div>
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
