import { Modal } from 'react-bootstrap';
import './ModalProfileAdded.css';

const ModalProfileAdded = ({ onClose }) => {
  return (
    <Modal show onHide={onClose} centered>
      <div className="appointmentConfirmedGrid">
        <div className="appointmentConfirmedCard">
          <h3>Perfil añadido</h3>
          <p>El perfil se ha creado correctamente.</p>
          <div className="appointmentConfirmedActions">
            <button
              type="button"
              className="confirmBtn"
              onClick={() => onClose?.()}
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalProfileAdded;
