import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import ModalServices from '../../components/Modal/ModalServices/ModalServices';

const Worker = () => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div>
      <Button onClick={handleOpenModal}>Consultar</Button>
      {showModal && <ModalServices onClose={handleCloseModal} />}
    </div>
  );
};

export default Worker;