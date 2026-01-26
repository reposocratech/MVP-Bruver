import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "./addpet.css";

const AddPet = () => {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");

  const categories = [
    { id: "toy", title: "Toy", desc: "Menos de 4 Kg" },
    { id: "pequeno", title: "Pequeño", desc: "Entre 5 y 14 Kg" },
    { id: "mediano", title: "Mediano", desc: "Entre 15 y 25 Kg" },
    { id: "grande", title: "Grande", desc: "Más de 25 Kg" },
  ];

  /* para no meter solo espacios */
  const isFormValid = name.trim() !== "" && species !== "" && category !== "";

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    
    alert("Formulario OK (demostracion).");
  };

  const handleCancel = (e) => {
    e.preventDefault();

    alert("Cancelado (demostracion).");
  };

  return (
    <div className="addPetPage">
      <h1 className="addPetTitle">AÑADIR MASCOTA</h1>

      <Form className="addPetForm" onSubmit={handleConfirm}>
        {/* Nombre */}
        <Form.Group className="addPetGroup">
          <Form.Label className="addPetLabel">Nombre</Form.Label>
          <Form.Control
            className="addPetInput"
            type="text"
            placeholder="Nombre de tu mascota"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        {/* Especie */}
        <Form.Group className="addPetGroup">
          <Form.Label className="addPetLabel">Especie</Form.Label>
          <Form.Select
            className="addPetInput"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
          >
            <option value="">Selecciona una opción</option>
            <option value="perro">Perro</option>
            <option value="gato">Gato</option>
            
          </Form.Select>
        </Form.Group>

        {/* Categoría (peso) */}
        <div className="addPetGroup">
          <p className="addPetLabel">Categoría (peso)</p>

          <div className="categoryGrid">
            {categories.map((c) => {
              const selected = category === c.id;

              return (
                <button
                  type="button"
                  key={c.id}
                  className={`categoryCard ${selected ? "selected" : ""}`}
                  onClick={() => setCategory(c.id)}
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

        {/* Observaciones */}
        <Form.Group className="addPetGroup">
          <Form.Label className="addPetLabel">
            Observaciones (Alergias, cuidados especiales, ...)
          </Form.Label>
          <Form.Control
            className="addPetTextarea"
            as="textarea"
            rows={5}
            placeholder="Escribe aquí cualquier detalle importante..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Form.Group>

        {/* Botones */}
        <div className="addPetButtons">
          {/* no estara habilitado hasta que este todo seleccionado */}
          <Button type="submit" className="btnConfirm" disabled={!isFormValid}>
            CONFIRMAR
          </Button>

          <Button  className="btnCancel" onClick={handleCancel}>
            CANCELAR
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddPet;
