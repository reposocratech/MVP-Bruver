import {  useState } from 'react';
import { Button, Modal } from 'react-bootstrap'
import dayjs from 'dayjs'


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
    <div>

      <Modal show={show} onHide={handleClose} onShow={handleShow}>
        <Modal.Header closeButton>
          <Modal.Title>Seleccionar horario</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <div>
            <label htmlFor="">Hora inicio</label>
            <input type="datetime-local"
              name="start"
              value={start}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="">Hora fin</label>
            <input type="datetime-local"
              name="end"
              value={end}
              onChange={handleChange}
            />
          </div>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>

          <Button variant="secondary" onClick={()=>handleDelete(selectedEvent.id)}>
            Eliminar
          </Button>
          <Button variant="primary" onClick={()=>handleSave(selectedEvent.id, start, end)}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
