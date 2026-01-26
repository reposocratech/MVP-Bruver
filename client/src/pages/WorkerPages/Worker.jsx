import { useState } from 'react'
import ModalAddReserve from '../../components/Modal/ModalAddReserve/ModalAddReserve';
import ModalQuickReserve from '../../components/Modal/ModalAddReserve/ModalQuickReserve';
import ModalSearchClient from '../../components/Modal/ModalAddReserve/ModalSearchClient';
import { Button } from 'react-bootstrap';

const Worker = () => {

  const [openModal, setOpenModal] = useState(false);
  const [openSearchClient, setOpenSearchClient] = useState(false);
  const [openQuickReserve, setOpenQuickReserve] = useState(false);

    const handleChange = (option) => {
    setOpenModal(false);

    if (option === '1') {
      setOpenSearchClient(true);
    }

    if (option === '2') {
      setOpenQuickReserve(true);
    }
  };

    const backModalAddReserve = () => {
      setOpenModal(true);
      setOpenSearchClient(false);
      setOpenQuickReserve(false);
    }

  return (
    <>
    <Button onClick={() => setOpenModal(true)} 
    className="Añadir reserva">
              Añadir una reserva
            </Button>
    

    {openModal && (
      <ModalAddReserve 
      toBack={backModalAddReserve}
      onClose={() => setOpenModal(false)} 
      onAccept  ={handleChange}/>)}

      {openSearchClient && <ModalSearchClient 
       toBack={backModalAddReserve}/>}
      {openQuickReserve && <ModalQuickReserve 
       toBack={backModalAddReserve}/>}
    </>
  )
}

export default Worker