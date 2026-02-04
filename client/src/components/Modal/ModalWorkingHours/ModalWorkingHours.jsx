import {  useState } from 'react';
import { Button, Modal } from 'react-bootstrap'
import dayjs from 'dayjs'
import "./ModalWorkingHours.css"


export const ModalWorkingHours = ({
  show,
  setShow,
  selectedEvent,
  handleSave,
  handleDelete,

}) => {

  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

   // Cargar valores del evento seleccionado
  /* useEffect(() => {
    if (selectedEvent) {
      setStart(dayjs(selectedEvent.start).format("YYYY-MM-DDTHH:mm"));
      setEnd(dayjs(selectedEvent.end).format("YYYY-MM-DDTHH:mm"));
    }
  }, [selectedEvent]); */ 

    const handleShow = () => {
    if (selectedEvent) {
      setStart(dayjs(selectedEvent.start).format("YYYY-MM-DDTHH:mm"));
      setEnd(dayjs(selectedEvent.end).format("YYYY-MM-DDTHH:mm"));
    }
  }; 

  const handleClose = () => setShow(false);

  //controlar inputs
  const handleChange = (e) => {
    const {name, value} = e.target
    if (name === 'start') setStart(value);
    if (name === 'end') setEnd(value);
  }

 
 
 


  return (
    

       
          
            <Modal
              show={show}
              onHide={handleClose}
              onShow={handleShow}
              centered
              dialogClassName="userProfileModalDialog"
              contentClassName="userProfileModalContent"
              backdropClassName="userProfileModal"
            >
              <Modal.Header closeButton>
                <Modal.Title className='modalTitle' >Seleccionar horario</Modal.Title>
              </Modal.Header>
              <Modal.Body className="userProfileForm">
                <div>
                  <label className='fs-5'>Hora inicio:</label>
                  <input className='fs-4' type="datetime-local"
                    name="start"
                    value={start}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className='fs-5'>Hora fin:</label>
                  <input className='fs-4' type="datetime-local"
                    name="end"
                    value={end}
                    onChange={handleChange}
                  />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <div className='modalButtons'>
                  <Button className="cancelBtn" variant="secondary" onClick={handleClose}>
                    Cancelar
                  </Button>
                  <Button className="deleteBtn" variant="secondary" onClick={()=>handleDelete(selectedEvent.availability_id || selectedEvent.id)}>
                    Eliminar
                  </Button>
                  <Button className="confirmBtn" variant="primary" onClick={()=>handleSave(selectedEvent.id, start, end)}>
                    Aceptar
                  </Button>
                </div>
              </Modal.Footer>
            </Modal>
       
     
    
   
  )
}
