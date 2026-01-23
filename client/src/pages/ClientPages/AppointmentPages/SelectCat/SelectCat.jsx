import './SelectCat.css';
import '../../../PublicPages/Contact/contact.css';
import Contact from '../../../PublicPages/Contact/Contact';
import { Button } from 'react-bootstrap';
import ModalCat from '../../../../components/Modal/ModalCat/ModalCat';
import { useState } from 'react';

const SelectCat = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <h2>Selecciona tu servicio</h2>

      <section className="cats">
        <div className="catGrid">
          <div className="catCard">
            <img src="/img/appointment/gatobruver.jpg" alt="Gatos" />
            <h3>Gatos</h3>
            <Button onClick={() => setOpenModal(true)} className="more-cat">
              Leer más
            </Button>
          </div>
        </div>
      </section>

      {openModal && 
      <ModalCat 
      onClose={() => setOpenModal(false)} />}

      <section className="contac-form">
        <Contact />
      </section>
    </>
  );
};

export default SelectCat;
