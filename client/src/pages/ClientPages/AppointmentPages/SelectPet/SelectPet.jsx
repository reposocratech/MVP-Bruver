import './SelectPet.css';
import { useNavigate } from 'react-router'
import { Button } from 'react-bootstrap'

const SelectPet = () => {

    const navigate = useNavigate();

  return (
    <>
      <h2>Selecciona tu mascota</h2>

      <section className="pets">
         <div className="petGrid">
        <div className="petCard">
          <img src="/img/appointment/perro1.jpg" alt="Mascota" />
          <h3>Toby</h3>
          <Button onClick={()=> navigate("/selectservices")} className="select-btn">SELECCIONAR</Button>
        </div>
        <div className="petCard">
          <img src="/img/appointment/perro2.jpg" alt="Mascota" />
          <h3>Lucas</h3>
          <Button onClick={()=> navigate("/selectservices")} className="select-btn">SELECCIONAR</Button>
        </div>
        <div className="petCard">
          <img src="/img/appointment/gato1.jpg" alt="Mascota" />
          <h3>Frod</h3>
          <Button onClick={()=> navigate("/selectservices")} className="select-btn">SELECCIONAR</Button>
        </div>
        </div>
      </section>

    <Button onClick={()=> navigate("/")} className="back-btn">VOLVER</Button>
    </>
  );
};

export default SelectPet;
