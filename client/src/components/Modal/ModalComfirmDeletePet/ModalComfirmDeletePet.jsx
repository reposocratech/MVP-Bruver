import React from "react";
import "./ModalComfirmDeletePet.css";
import { Button } from "react-bootstrap";

const ModalComfirmDeletePet = ({ show, petName, onCancel, onConfirm }) => {
  if (!show) return null;
  return (
    <section className="addReserveModal">
      <div className="addReserveGridModal">
        <div className="addReserveCardModal">
          <div className="appointment-modal-header">
            <span className="appointment-modal-bid">Eliminar mascota</span>
            <span className="appointment-modal-close" onClick={onCancel}>✕</span>
          </div>
          <div style={{margin: '2rem 0'}}>
            <p>¿Seguro que quieres eliminar a <b>{petName}</b>?<br/>Esta acción no se puede deshacer.</p>
          </div>
          <div className="appointment-modal-actions">
            <button className="cancel-btn-brown" onClick={onCancel}>Cancelar</button>
            <button className="cancel-btn-red" onClick={onConfirm}>Eliminar</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModalComfirmDeletePet;
