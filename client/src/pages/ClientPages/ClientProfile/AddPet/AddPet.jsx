import React, { useContext, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import "./addpet.css";
import { AuthContext } from "../../../../contexts/AuthContext/AuthContext";
import { fetchData } from "../../../../helpers/axiosHelper";

const AddPet = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  
  const [newPet, setNewPet] = useState({
    name_pet: "",
    specie: "", 
    size_category: "", 
    description: "",
    hair: "",
    medical_history: "",
  });

  const categories = [
    { id: 1, title: "Toy", desc: "Menos de 4 Kg" },
    { id: 2, title: "Pequeño", desc: "Entre 5 y 14 Kg" },
    { id: 3, title: "Mediano", desc: "Entre 15 y 25 Kg" },
    { id: 4, title: "Grande", desc: "Más de 25 Kg" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPet({ ...newPet, [name]: value });
  };

  const selectCategory = (id) => {
    setNewPet({ ...newPet, size_category: id });
  };

  const onSubmit = async () => {
    try {

      if (!token) return alert("No hay sesión activa. Vuelve a iniciar sesión.");

      
      if (!newPet.name_pet.trim() || !newPet.specie || !newPet.size_category) {
        return alert("Faltan campos obligatorios (nombre, especie y categoría).");
      }

      const body = {
        name_pet: newPet.name_pet.trim(),
        description: newPet.description.trim() || null,
        specie: Number(newPet.specie),
        size_category: Number(newPet.size_category),
        hair: newPet.hair.trim() || null,
        medical_history: newPet.medical_history.trim() || null,
      };

      await fetchData("pet", "POST", body, token);

      navigate("/profile");
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Error al crear la mascota ❌");
    }
  };

  return (
    <div className="addPetPage">
      <h1 className="addPetTitle">Añadir Mascota</h1>

      <Form className="addPetForm">
        <Form.Group className="addPetGroup">
          <Form.Label className="addPetLabel">Nombre</Form.Label>
          <Form.Control
            className="addPetInput"
            type="text"
            placeholder="Nombre de tu mascota"
            name="name_pet"
            value={newPet.name_pet}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="addPetGroup">
          <Form.Label className="addPetLabel">Especie</Form.Label>
          <Form.Select
            className="addPetInput"
            name="specie"
            value={newPet.specie}
            onChange={handleChange}
          >
            <option value="">Selecciona una opción</option>
            <option value={1}>Perro</option>
            <option value={2}>Gato</option>
          </Form.Select>
        </Form.Group>

        <div className="addPetGroup">
          <p className="addPetLabel">Categoría (peso)</p>

          <div className="categoryGrid">
            {categories.map((c) => {
              const selected = Number(newPet.size_category) === c.id;

              return (
                <button
                  type="button"
                  key={c.id}
                  className={`categoryCard ${selected ? "selected" : ""}`}
                  onClick={() => selectCategory(c.id)}
                  aria-pressed={selected}
                >
                  <div className="categoryText">
                    <h4>{c.title}</h4>
                    <p>{c.desc}</p>
                  </div>

                  <span className={`categoryCheck ${selected ? "on" : ""}`} />
                </button>
              );
            })}
          </div>
        </div>

        <Form.Group className="addPetGroup">
          <Form.Label className="addPetLabel">Pelo</Form.Label>
          <Form.Control
            className="addPetInput"
            type="text"
            placeholder="Ej: corto, largo, rizado..."
            name="hair"
            value={newPet.hair}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="addPetGroup">
          <Form.Label className="addPetLabel">Historial médico</Form.Label>
          <Form.Control
            className="addPetTextarea"
            as="textarea"
            rows={4}
            placeholder="Vacunas, alergias, enfermedades, medicación..."
            name="medical_history"
            value={newPet.medical_history}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="addPetGroup">
          <Form.Label className="addPetLabel">
            Observaciones (Alergias, cuidados especiales, ...)
          </Form.Label>
          <Form.Control
            className="addPetTextarea"
            as="textarea"
            rows={5}
            placeholder="Escribe aquí cualquier detalle importante..."
            name="description"
            value={newPet.description}
            onChange={handleChange}
          />
        </Form.Group>

        <div className="addPetActions">
  <button
    type="button"
    className="addPetBtn acept"
    onClick={onSubmit}
  >
    CONFIRMAR
  </button>

  <button
    type="button"
    className="addPetBtn cancel"
    onClick={() => navigate(-1)}
  >
    CANCELAR
  </button>
</div>
      </Form>
    </div>
  );
};;

export default AddPet;
