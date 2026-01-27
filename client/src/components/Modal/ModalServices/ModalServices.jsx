import { Button } from 'react-bootstrap';
import './ModalServices.css';

const ModalServices = ({ onClose }) => {
  return (
    <section className="servicesModal">
      <div className="servicesGridModal">
        <div className="servicesCardModal">
          <img src="/img/appointment/servicio1.jpg" alt="Servicio" />
          <h3>Baño Solo</h3>
          <p>
            Higiene profunda con cosmética de calidad adaptada a su tipo de pelo. 
            Incluye doble enjabonado con masaje relajante, cepillado para retirar 
            el pelo muerto y un secado manual tranquilo, sin prisas.
          </p>
          <Button className="close" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ModalServices;
