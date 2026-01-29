import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap'
import dayjs from 'dayjs'


export const ModalWorkingHours = ({
  show,
  setShow,
  selectedEvent,
  setEvents,

}) => {

  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')



  const handleClose = () => setShow(false);

  //controlar inputs
  const handleChange = (e) => {
    const {name, value} = e.target
    if (name === 'start') setStart(value);
    if (name === 'end') setEnd(value);
  }

  //guardar cambios
  const handleSave = () => {
    const newStart = dayjs(start).toDate();
    const newEnd = dayjs(end).toDate();

    setEvents(prev =>
      prev.map(e =>
        e.id === selectedEvent.id
          ? { ...e, start: newStart, end: newEnd }
          : e
      )
    );

    handleClose();
  };

  //eliminar evento 
  const handleDelete = () => {
    if (!window.confirm("¿Eliminar este evento?")) return;

    setEvents(prev =>
      prev.filter(e => e.id !== selectedEvent.id)
    );

    handleClose();
  };



  return (
    <div>

      <Modal show={show} onHide={handleClose}>
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

          <Button variant="secondary" onClick={handleDelete}>
            Eliminar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
