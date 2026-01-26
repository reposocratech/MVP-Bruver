import React from 'react'
import { Button } from 'react-bootstrap';
import './ModalAddReserve.css';

const ModalQuickReserve = ({ toBack }) => {
  return (
    <section className="addReserveModal">
      <div className="addReserveGridModal">
        <div className="addReserveCardModal">
          <h3>Añadir una reserva rápida</h3>
         <form className="userProfileForm">
          <label>Seleccionar cliente</label>
          <input name="client" />
          <label>Hora de inicio</label>
          <input name="hourStar"/>
          <label>Duración</label>
          <input name="time" />
          <label>Servicio</label>
          <input name="service" />
          <label>Suplemento</label>
          <input name="supplement" />
          <label>Pelaje</label>
          <input name="pelaje" />
          <label>Teléfono</label>
          <input name="tel" />
          <label>Precio</label>
          <input name="price" />

        </form>
          <div>
            <Button className="close">
              Aceptar
            </Button>
            <Button className="close" onClick={toBack}>
              Atrás
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ModalQuickReserve