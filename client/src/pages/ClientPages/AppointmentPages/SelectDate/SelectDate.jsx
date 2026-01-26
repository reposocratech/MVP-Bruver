import './SelectDate.css';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import Calendar from 'react-calendar';

const SelectDate = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());

  return (
    <div className="selectDatePage">
      <div className="selectEmployee">
        <h2 className="selectEmployeeTitle">Selecciona el empleado</h2>

        <div className="selectEmployeeGrid">
          <div className="selectEmployeeCard">
            <img src="/img/appointment/persona3.jpg" alt="Empleada" />
            <h3>Miriam</h3>
            <button
              type="button"
              onClick={() => navigate('/selectservices')}
              className="selectEmployeeBtn"
            >
              SELECCIONAR
            </button>
          </div>

          <div className="selectEmployeeCard">
            <img src="/img/appointment/persona6.jpg" alt="Empleada" />
            <h3>Carol</h3>
            <button
              type="button"
              onClick={() => navigate('/selectservices')}
              className="selectEmployeeBtn"
            >
              SELECCIONAR
            </button>
          </div>
        </div>
      </div>

      <div className="selectDate">
        <h2 className="selectDateTitle">Selecciona la fecha</h2>
        <div className="calendarAndHours">
          <div className="calendar-container">
            <Calendar onChange={setDate} value={date} selectRange={false} />

            <div className="dateSelected">
             <button
          type="button"
          className="selectHourBtn"
        >
          12:00h
        </button>
             <button
          type="button"
          className="selectHourBtn"
        >
          13:00h
        </button>
             <button
          type="button"
          className="selectHourBtn"
        >
          17:30h
        </button>
         </div>
          </div>
        </div>
      </div>

      <div className="selectEmployeeActions">
        <button
          type="button"
          onClick={() => navigate('/selectservices')}
          className="selectEmployeeBackBtn"
        >
          VOLVER
        </button>
      </div>
    </div>
  );
};

export default SelectDate;
