import React, { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs'
import './ModalAppointment.css';
import { fetchData } from '../../../helpers/axiosHelper';
import { AuthContext } from '../../../contexts/AuthContext/AuthContext';



const ModalEditAppointment = ({ appointment, onClose, onSubmit }) => {

  const [appointmentEdit, setAppointmentEdit] = useState({
    appointment_date: dayjs(appointment.start).format('YYYY-MM-DD'),
    start_time: dayjs(appointment.start).format('HH:mm'),
    duration: dayjs(appointment.end).diff(dayjs(appointment.start), 'minute'),
    employee_user_id: appointment.resourceId,
    total_price: appointment.total_price ?? 0
  });



  const [employees, setEmployees] = useState([]);

  const { token } = useContext(AuthContext)

  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await fetchData(
        'worker/getAllWorkers',
        'get',
        null,
        token
      );
      setEmployees(res.data.result);
    };

    fetchEmployees();
  }, []);

  const handleChange = (e) => {
  const { name, value } = e.target;

  setAppointmentEdit(prev => ({
    ...prev,
    [name]:
      name === 'duration' || name === 'total_price' || name === 'employee_user_id'
        ? Number(value)
        : value
  }));
};




  //enviar cambios juntos
 const handleSubmit = (e) => {
  e.preventDefault();

  onSubmit({
    id: appointment.id,
    ...appointmentEdit
  });

  onClose();
};




  return (
    <section className="addReserveModal">
      <div className="addReserveGridModal">
        <div className="addReserveCardModal">
          <div className="appointment-modal-header">
            <span className="appointment-modal-bid">Editar reserva</span>
            <span className="appointment-modal-close" onClick={onClose}>✕</span>
          </div>
          <form className="appointment-modal-form">
            <table className="appointment-modal-table">
              <tbody>
                <tr>
                  <td><b>Fecha</b></td>
                  <td>
                 <input
  type="date"
  name="appointment_date"
  className="appointment-input"
  value={appointmentEdit.appointment_date}
  onChange={handleChange}
/>

                  </td>
                </tr>
                <tr>
                  <td><b>Hora inicio</b></td>
                  <td>
               <input
  type="time"
  name="start_time"
  className="appointment-input"
  value={appointmentEdit.start_time}
  onChange={handleChange}
/>

                  </td>
                </tr>
                <tr>
                  <td><b>Duración</b></td>
                  <td>
                   <input
  type="number"
  name="duration"
  className="appointment-input"
  min="0"
  step="5"
  value={appointmentEdit.duration}
  onChange={handleChange}
/>

                  </td>
                </tr>
                <tr>
                  <td><b>Trabajador</b></td>
                  <td>
                  <select
  name="employee_user_id"
  className="appointment-input"
  value={appointmentEdit.employee_user_id}
  onChange={handleChange}
>
  {employees?.map(emp => (
    <option key={emp.user_id} value={emp.user_id}>
      {emp.name_user} {emp.last_name}
    </option>
  ))}
</select>


                  </td>
                </tr>
                <tr>
                  <td><b>Precio</b></td>
                  <td className="appointment-price-cell">
                   <input
  type="number"
  name="total_price"
  className="appointment-input"
  min="0"
  step="0.01"
  value={appointmentEdit.total_price}
  onChange={handleChange}
/>


                    <span className="appointment-euro">€</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="appointment-modal-actions">
              <button type="button" className="cancel-btn-brown" onClick={onClose}>CANCELAR</button>

              <button
                type="submit"
                className="edit-btn-green"
                onClick={handleSubmit}>
                ACTUALIZAR CITA
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ModalEditAppointment;
