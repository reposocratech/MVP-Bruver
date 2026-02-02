import './UsersDateAppointment.css';
import { useState} from 'react';
import Calendar from 'react-calendar';

export const UsersDateAppointment = ({ setCurrentAppointment, workers, sumaTotalPrecio, sumaTotalMinutos}) => {
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
          <div className="col-12 col-sm-6 col-lg-4" key={elem.workerId}>
            <div className="appointmentPetCard">

              <div className="appointmentPetImage">
                {elem.picture_user ? (
                  <img
                    src={`${import.meta.env.VITE_SERVER_IMAGES}/picturesGeneral/${workers.picture_user}`}
                    alt={elem.name_user}
                  />
                ) : (
                 <img
                  className="petPhoto"
                  src={`/img/defaultimg/IconDefect.png`}
                  alt="Imagen de perfil por defecto"
                />
                )}
              </div>

              <div className="appointmentPetInfo">
                <h3>{elem.name_pet}</h3>

                <div className="appointmentPetActions">
                  <button
                  type="button"
                  onClick={() =>{
                    setWorkerId(elem);
                  }}
                  className="selectEmployeeBtn"
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
      </div>

      <h3>minutos/{sumaTotalMinutos.toFixed(2)}</h3>
      <h3>carrito/{sumaTotalPrecio.toFixed(2)}€</h3>

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
