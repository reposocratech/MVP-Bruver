import React from 'react';
import './ModalAppointment.css';

const ModalCancelAppointment = ({ onClose, onDelete, appointment }) => {
  return (
    <section className="addReserveModal">
      <div className="addReserveGridModal">
        <div className="addReserveCardModal">
          <div className="appointment-modal-header">
            <span className="appointment-modal-bid">Cancelar reserva</span>
            <div>
              <span className="appointment-modal-edit">✏️</span>
              <span className="appointment-modal-delete">🗑️</span>
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
                <td><b>Total:</b></td>
                <td>52,00€</td>
              </tr>
              <tr>
                <td><b>Estado</b></td>
                <td>confirm/pagado/pte</td>
              </tr>
            </tbody>
          </table>
          <div className="appointment-modal-actions">
            <button className="cancel-btn-brown" onClick={onClose}>CANCELAR</button>
            <button className="cancel-btn-red" onClick={()=> onDelete(appointment.id)}>CANCELAR CITA</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModalCancelAppointment;