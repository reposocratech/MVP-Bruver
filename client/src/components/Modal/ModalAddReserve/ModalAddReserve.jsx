import { useState } from 'react';
import styles from './ModalAddReserve.module.css';

const ModalAddReserve = ({ onClose, onAccept }) => {
  const [option, setOption] = useState('');

  const handleAccept = () => {
    if (!option) return;
    onAccept(option);
  };

  return (
    <section className={styles.addReserveModal}>
      <div className={styles.addReserveGridModal}>
        <div className={styles.addReserveCardModal}>
          <h3>Añadir una reserva</h3>

          <select
            value={option}
            onChange={(e) => setOption(e.target.value)}
          >
            <option value="" disabled>Reserva para un nuevo cliente</option>
            <option value="1">Buscar cliente</option>
            <option value="2">Reserva rápida</option>
          </select>

          <div className={styles.modalActions}>
  <button className="close" type="button" onClick={handleAccept}>
    Aceptar
  </button>

  <button className="close" type="button" onClick={onClose}>
    Cerrar
  </button>
</div>
        </div>
      </div>
    </section>
  );
};

export default ModalAddReserve;
