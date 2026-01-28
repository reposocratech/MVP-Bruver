import "./SelectPet.css";
import { useNavigate } from "react-router";

const SelectPet = () => {
  const navigate = useNavigate();

  return (
    <div className="selectPetPage">
      <h2 className="selectPetTitle">Selecciona tu mascota</h2>

      <div className="selectPetGrid">
        <div className="selectPetCard">
          <img src="/img/appointment/perro1.jpg" alt="Toby" />
          <h3>Toby</h3>
          <button
            type="button"
            onClick={() => navigate("/selectservices")}
            className="selectPetBtn"
          >
            SELECCIONAR
          </button>
        </div>

        <div className="selectPetCard">
          <img src="/img/appointment/perro2.jpg" alt="Lucas" />
          <h3>Lucas</h3>
          <button
            type="button"
            onClick={() => navigate("/selectservices")}
            className="selectPetBtn"
          >
            SELECCIONAR
          </button>
        </div>

        <div className="selectPetCard">
          <img src="/img/appointment/gato1.jpg" alt="Frod" />
          <h3>Frod</h3>
          <button
            type="button"
            onClick={() => navigate("/selectcat")}
            className="selectPetBtn"
          >
            SELECCIONAR
          </button>
        </div>
        
      </div>

      <div className="selectPetActions">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="selectPetBackBtn"
        >
          VOLVER
        </button>
      </div>
    </div>
  );
};

export default SelectPet;
