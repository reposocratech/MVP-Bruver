import { Button } from 'react-bootstrap';
import { useState } from 'react';
import './ModalAddReserve.css';

const ModalAddReserve = ({ onClose, onAccept }) => {

 const [option, setOption] = useState('');

  const handleAccept  = () => {
    if (!option) return;
    onAccept(option);
  };

  return (
    <section className="addReserveModal">
      <div className="addReserveGridModal">
        <div className="addReserveCardModal">
          <h3>Añadir una reserva</h3>
          <select id="selectClient"
          value={option}
          onChange={(e) => setOption(e.target.value)}>
            <option value="" disabled>
              Reserva para un nuevo cliente
            </option>
            <option value="1">Buscar cliente</option>
            <option value="2">Reserva rápida</option>
          </select>
          <div>
            <Button className="close" onClick={handleAccept}>
              Aceptar
            </Button>
            <Button className="close" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModalAddReserve;
