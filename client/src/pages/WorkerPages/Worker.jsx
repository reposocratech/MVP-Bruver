import { useState } from 'react'
import ModalAddReserve from '../../components/Modal/ModalAddReserve/ModalAddReserve';
import ModalQuickReserve from '../../components/Modal/ModalAddReserve/ModalQuickReserve';
import ModalSearchClient from '../../components/Modal/ModalAddReserve/ModalSearchClient';
import ModalSeeAppointment from '../../components/Modal/ModalSeeAppointment/ModalSeeAppointment';
import ModalAddReserveClient from '../../components/Modal/ModalAddReserve/ModalAddReserveClient';
import { Button } from 'react-bootstrap';


const Worker = () => {

  const [openModal, setOpenModal] = useState(false);
  const [openSearchClient, setOpenSearchClient] = useState(false);
  const [openQuickReserve, setOpenQuickReserve] = useState(false);
  const [openCita, setOpenCita] = useState(false);
  const [openAddReserveClient, setOpenAddReserveClient] = useState(false);

  const [selectedClient, setSelectedClient] = useState(null);

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

    const handleAcceptClient = (client) => {
      setSelectedClient(client);
      setOpenSearchClient(false);
      setOpenAddReserveClient(true)
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
       toBack={backModalAddReserve}
       onAcceptClient={handleAcceptClient}/>}

      {openQuickReserve && <ModalQuickReserve 
       toBack={backModalAddReserve}/>}

       {openAddReserveClient && <ModalAddReserveClient
       toBack={backModalAddReserve}
       client={selectedClient}/>}


      <Button onClick={() => setOpenCita(true)}>Consultar</Button>
      {openCita && <ModalSeeAppointment onClose={() => setOpenCita(false)} />}
    </>
  )
}

export default Worker

