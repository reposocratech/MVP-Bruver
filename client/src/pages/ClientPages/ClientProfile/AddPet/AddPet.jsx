import { useState, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import "./addpet.css";
import { useNavigate } from "react-router";
import { AuthContext } from "../../../../contexts/AuthContext/AuthContext";
import { fetchData } from "../../../../helpers/axiosHelper";

const AddPet = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [species, setSpecies] = useState(""); // "perro" | "gato"
  const [category, setCategory] = useState(""); // "toy" | "pequeno" | "mediano" | "grande"
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: "toy", title: "Toy", desc: "Menos de 4 Kg" },
    { id: "pequeno", title: "Pequeño", desc: "Entre 5 y 14 Kg" },
    { id: "mediano", title: "Mediano", desc: "Entre 15 y 25 Kg" },
    { id: "grande", title: "Grande", desc: "Más de 25 Kg" },
  ];

  const isFormValid = name.trim() !== "" && species !== "" && category !== "";

  const specieMap = { perro: 1, gato: 2 };
  const sizeCategoryMap = { toy: 1, pequeno: 2, mediano: 3, grande: 4 };

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    if (!token) {
      alert("No hay sesión activa. Vuelve a iniciar sesión.");
      return;
    }

    const body = {
      name_pet: name.trim(),
      description: notes.trim() || null,
      specie: specieMap[species],
      size_category: sizeCategoryMap[category],
    };

    try {
      setLoading(true);

      // VITE_SERVER_URL = http://localhost:4000/  => sin "/" al inicio
      await fetchData("pet", "POST", body, token);

      // ✅ Sin alert, navegación directa al perfil
      navigate("/profile");
    } catch (err) {
      console.log("Error creando mascota:", err);
      alert(err?.response?.data?.message || "Error al crear la mascota ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate("/profile");
  };

  return (
    <div className="addPetPage">
      <h1 className="addPetTitle">AÑADIR MASCOTA</h1>

      <Form className="addPetForm" onSubmit={handleConfirm}>
        <Form.Group className="addPetGroup">
          <Form.Label className="addPetLabel">Nombre</Form.Label>
          <Form.Control
            className="addPetInput"
            type="text"
            placeholder="Nombre de tu mascota"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </Form.Group>

        <Form.Group className="addPetGroup">
          <Form.Label className="addPetLabel">Especie</Form.Label>
          <Form.Select
            className="addPetInput"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            disabled={loading}
          >
            <option value="">Selecciona una opción</option>
            <option value="perro">Perro</option>
            <option value="gato">Gato</option>
          </Form.Select>
        </Form.Group>

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
                  disabled={loading}
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
            disabled={loading}
          />
        </Form.Group>

        <div className="addPetButtons">
          <Button type="submit" className="btnConfirm" disabled={!isFormValid || loading}>
            {loading ? "GUARDANDO..." : "CONFIRMAR"}
          </Button>

          <Button
            type="button"
            className="btnCancel"
            onClick={handleCancel}
            disabled={loading}
          >
            CANCELAR
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddPet;
