import { useState } from 'react';
import ModalCancelAppointment from './ModalCancelAppointment';
import ModalEditAppointment from './ModalEditAppointment';
import './ModalAppointment.css';
import dayjs from 'dayjs'

const ModalSeeAppointment = ({ appointment, onClose, onUpdate, onDelete }) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <section className="addReserveModal">
        <div className="addReserveGridModal">
          <div className="addReserveCardModal">
            <div className="appointment-modal-header">
              <span className="appointment-modal-bid">BID 56544</span>
              <div>
                <span className="appointment-modal-edit" onClick={() => setShowEditModal(true)}>✏️</span>
                <span className="appointment-modal-delete" onClick={() => setShowCancelModal(true)}>🗑️</span>
                <span className="appointment-modal-close" onClick={onClose}>✕</span>
              </div>
            </div>
            <table className="appointment-modal-table">
              <tbody>
                <tr>
                  <td><b>Fecha</b></td>
                  <td>
                    {dayjs(appointment.start).format('DD/MM/YYYY')}
                  </td>
                </tr>
                <tr>
                  <td><b>Hora inicio- hora fin</b></td>
                  <td>
                    {dayjs(appointment.start).format('HH:mm')} - {dayjs(appointment.end).format('HH:mm')}
                  </td>
                </tr>
                <tr>
                  <td><b>Reservado por:</b></td>
                  <td>{appointment.created_by_name} </td>
                </tr>
                <tr>
                  <td><b>Datos del cliente:</b></td>
                  <td>{appointment.client_name} </td>
                </tr>
                <tr>
                  <td><b>Trabajador</b></td>
                  <td>{appointment.employee_name} </td>
                </tr>
                <tr>
                  <td><b>Estado/cita</b></td>
                  <td>pte/confi/can/€/no p</td>
                </tr>
                <tr>
                  <td><b>Total:</b></td>
                  <td>{appointment.total_price} €</td>
                </tr>
                <tr>
                  <td><b>Estado</b></td>
                  <td>{appointment.status} </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      
      {showCancelModal && <ModalCancelAppointment
        appointment={appointment}
        onClose={onClose}
        onDelete={onDelete} />}

      {showEditModal && <ModalEditAppointment
        appointment={appointment}
        onClose={onClose}
        onSubmit={onUpdate}
      />}

    </>
  );
};

export default ModalSeeAppointment;
