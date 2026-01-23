import { Button } from 'react-bootstrap';
import "./ModalCat.css";

const ModalCat = ({ onClose }) => {
  return (
    <section className="catsModal">
      <div className="catGridModal">
        <div className="catCardModal">
          <img src="/img/appointment/gatobruver.jpg" alt="Gato" />
          <h3>Gatos</h3>
          <p>
            Si tu mascota es un gato, para este tipo de cita es necesario
            consultar previamente con el centro por teléfono antes de realizar
            la reserva. Los gatos requieren un trato especialmente cuidadoso y
            personalizado, por lo que es importante conocer su carácter, estado
            y necesidades concretas. De este modo, podremos informarte
            correctamente sobre el servicio más adecuado, la duración aproximada
            de la cita y las condiciones necesarias para garantizar una
            experiencia tranquila y segura para tu gato.
          </p>    
          <Button className='close' onClick={onClose}>Cerrar</Button>
        </div>
      </div>
    </section>
  );
};

export default ModalCat;
