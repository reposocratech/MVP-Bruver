
import { useState } from 'react';
import ModalCancelAppointment from './ModalCancelAppointment';
import ModalEditAppointment from './ModalEditAppointment';
import './ModalAppointment.css';

const ModalSeeAppointment = ({ onClose }) => {
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
                  <td>19/01/2026</td>
                </tr>
                <tr>
                  <td><b>Hora inicio- hora fin</b></td>
                  <td>09:00 - 10:30</td>
                </tr>
                <tr>
                  <td><b>Reservado por:</b></td>
                  <td>usuario/admin/trabajador</td>
                </tr>
                <tr>
                  <td><b>Datos del cliente:</b></td>
                  <td>Nombre cliente</td>
                </tr>
                <tr>
                  <td><b>Trabajador</b></td>
                  <td>Nombre trabajador</td>
                </tr>
                <tr>
                  <td><b>Estado/cita</b></td>
                  <td>pte/confi/can/€/no p</td>
                </tr>
                <tr>
                  <td><b>Total:</b></td>
                  <td>52,00€</td>
                </tr>
                <tr>
                  <td><b>Estado</b></td>
                  <td>confirm/pagado/pte</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      {showCancelModal && <ModalCancelAppointment onClose={() => setShowCancelModal(false)} />}
      {showEditModal && <ModalEditAppointment onClose={() => setShowEditModal(false)} />}
    </>
  );
};

export default ModalSeeAppointment;
