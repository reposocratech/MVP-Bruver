import { useState } from "react";
import "./editpet.css";


const EditPet = () => {
  // En el futuro vendrá de la BD
  const [pet, setPet] = useState({
    name: "Estrella",
    specie: "Gato",
    weight: "10.5kg",
    description: "Es un gato muy malo",
    diseases: "",
    photo: "/img/mascotas/gato1.jfif",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setPet((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Actualizar en BD:", pet);
  };
 

  return (
    <div className="editPetPage">

      <h2 className="pageTitle">Mi perfil</h2>

      {/* INFO MASCOTA */}
      <section className="petInfoBox">
        <div className="petInfoLeft">
          <h3>Información</h3>
          <div className="infoRow">{pet.name}</div>
          <div className="infoRow">{pet.weight}</div>
        </div>

        <div className="petInfoRight">
          <img src={pet.photo} alt="Mascota" />
        </div>
      </section>

      

      {/* FORMULARIO */}
      <h3 className="editTitle">Edita tu mascota</h3>

      <form className="editPetForm" onSubmit={handleSubmit}>

        <label>Nombre</label>
        <input
          name="name"
          value={pet.name}
          onChange={handleChange}
        />

        <label>Descripción</label>
        <input
          name="description"
          value={pet.description}
          onChange={handleChange}
        />

        <label>Enfermedades</label>
        <input
          name="diseases"
          value={pet.diseases}
          onChange={handleChange}
        />

        <label>Foto</label>
        <div className="photoSection">
          <img src={pet.photo} alt="preview" />
          <button type="button" className="changePhotoBtn">Cambiar foto</button>
        </div>

        <div className="formActions">
          <button type="button" className="backBtn">ATRÁS</button>
          <button type="submit" className="confirmBtn">CONFIRMAR</button>
        </div>

      </form>

      
    </div>
    
  );
};

export default EditPet;
