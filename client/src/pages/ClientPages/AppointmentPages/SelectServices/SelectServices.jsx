import './SelectServices.css';
import { useNavigate } from 'react-router';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import ModalServices from '../../../../components/Modal/ModalServices/ModalServices';

const SelectPet = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
    <section className='servicesPage'>
      <h2>Selecciona tu servicio</h2>
      <section className="services">

        <div className="servicesGrid">
          <div className="servicesCard">
            <img src="/img/appointment/servicio1.jpg" alt="Servicio" />
            <h3>Baño Solo</h3>
            <Button onClick={() => setOpenModal(true)} className="more-services">
              Leer más
            </Button>
            <h3>51,00€</h3>
            <Button
              onClick={() => navigate('/selectDate')}
              className="select-btn"
            >
              SELECCIONAR
            </Button>
          </div>
          <div className="servicesCard">
            <img src="/img/appointment/servicio2.jpg" alt="Servicio" />
            <h3>Baño + Corte con máquina</h3>
            <Button onClick={() => setOpenModal(true)} className="more-services">
              Leer más
            </Button>
            <h3>32,00€</h3>
            <Button
              onClick={() => navigate('/selectservices')}
              className="select-btn"
            >
              SELECCIONAR
            </Button>
          </div>
          <div className="servicesCard">
            <img src="/img/appointment/servicio3.jpg" alt="Servicio" />
            <h3>Baño + Corte con tijeras</h3>
            <Button onClick={() => setOpenModal(true)} className="more-services">
              Leer más
            </Button>
            <h3>24,00€</h3>
            <Button
              onClick={() => navigate('/selectservices')}
              className="select-btn"
            >
              SELECCIONAR
            </Button>
          </div>
        </div>
      </section>

      {openModal && <ModalServices onClose={() => setOpenModal(false)} />}



      <h2>Selecciona tus suplementos</h2>      
      
       <section className="supplements">
        <div className="supplementsGrid">
          <div className="supplementsCard">
               <img src="/img/appointment/nudos.png" alt="Nudos" />
            <h3>Nudos pequeño</h3>
            <h3>7,00€</h3>
            <Button
              className="select-btn"
            >
              SELECCIONAR
            </Button>
          </div>
           <div className="supplementsCard">
               <img src="/img/appointment/deslanado.png" alt="Deslanado" />
            <h3>Deslanado pequeño</h3>
            <h3>5,00€</h3>
            <Button
              className="select-btn"
            >
              SELECCIONAR
            </Button>
          </div>
 
        </div>
      </section>
      
      <Button onClick={() => navigate('/selectpet')} className="back-btn">
        VOLVER
      </Button>
      </section>
    </>
  );
};

export default SelectPet;
