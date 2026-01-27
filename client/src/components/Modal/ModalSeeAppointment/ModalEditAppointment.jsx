import React, { useState } from 'react';
import './ModalAppointment.css';

const ModalEditAppointment = ({ onClose }) => {
  const [duration, setDuration] = useState(90);
  const [price, setPrice] = useState('52.00');
  const [startTime, setStartTime] = useState('09:30');

  return (
    <section className="addReserveModal">
      <div className="addReserveGridModal">
        <div className="addReserveCardModal">
          <div className="appointment-modal-header">
            <span className="appointment-modal-bid">BID 56544</span>
            <span className="appointment-modal-close" onClick={onClose}>✕</span>
          </div>
          <form className="appointment-modal-form">
            <table className="appointment-modal-table">
              <tbody>
                <tr>
                  <td><b>Fecha</b></td>
                  <td><input type="date" className="appointment-input" /></td>
                </tr>
                <tr>
                  <td><b>Hora inicio</b></td>
                  <td>
                    <input
                      type="time"
                      className="appointment-input"
                      value={startTime}
                      onChange={e => setStartTime(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td><b>Duración</b></td>
                  <td>
                    <input
                      type="number"
                      className="appointment-input"
                      value={duration}
                      min="0"
                      onChange={e => setDuration(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td><b>Trabajador</b></td>
                  <td>
                    <select className="appointment-input">
                      <option>Nombre Trabajador1</option>
                      <option>Nombre Trabajador2</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td><b>Precio</b></td>
                  <td className="appointment-price-cell">
                    <input
                      type="number"
                      className="appointment-input appointment-input-price"
                      value={price}
                      min="0"
                      step="0.01"
                      onChange={e => setPrice(e.target.value)}
                    />
                    <span className="appointment-euro">€</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="appointment-modal-actions">
              <button type="button" className="cancel-btn-brown" onClick={onClose}>CANCELAR</button>
              <button type="submit" className="edit-btn-green">ACTUALIZAR CITA</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ModalEditAppointment;
