import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import { AuthContext } from "../../../../contexts/AuthContext/AuthContext";
import { fetchData } from "../../../../helpers/axiosHelper";
import "./editpet.css";

const EditPet = () => {
  const navigate = useNavigate();
  const { petId } = useParams();

  const { token, pets, setPets } = useContext(AuthContext);

  // ✅ Arranca en null y NO lo usamos hasta que llegue el GET
  const [editPet, setEditPet] = useState(null);

  useEffect(() => {
    const getPet = async () => {
      try {
        const res = await fetchData(`pet/${petId}`, "GET", null, token);

        // ✅ soporta: { pet: {...} } o directamente { ... }
        const petFromApi = res?.data?.pet ?? res?.data;

        setEditPet(petFromApi || null);
      } catch (error) {
        console.log(error);
        setEditPet(null);
      }
    };

    if (token) getPet();
  }, [token, petId]);

  // ✅ si aún no hay datos, no pintamos nada que use editPet.name_pet
  if (!editPet) {
    return (
      <div className="editPetPage">
        <h2 className="pageTitle">Cargando mascota...</h2>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditPet({ ...editPet, [name]: value });
  };

  const specieText = (value) => (Number(value) === 1 ? "Perro" : "Gato");

  const sizeText = (value) => {
    const map = { 1: "Toy", 2: "Pequeño", 3: "Mediano", 4: "Grande" };
    return map[Number(value)] || "Sin definir";
  };

  const onSubmit = async () => {
    try {
      const body = {
        name_pet: editPet.name_pet,
        description: editPet.description,
        specie: Number(editPet.specie),
        size_category: Number(editPet.size_category),
        hair: editPet.hair,
        medical_history: editPet.medical_history,
      };

      const res = await fetchData(`pet/${petId}`, "PUT", body, token);

      if (res?.data?.pet) {
        setPets(pets.map((p) => (p.pet_id === res.data.pet.pet_id ? res.data.pet : p)));
      }

      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="editPetPage">
      <h2 className="pageTitle">Editar mascota</h2>

      {/* INFO MASCOTA */}
      <section className="petInfoBox">
        <div className="petInfoLeft">
          <h3>Información</h3>
          <div className="infoRow">{editPet.name_pet || ""}</div>
          <div className="infoRow">Especie: {specieText(editPet.specie)}</div>
          <div className="infoRow">Tamaño: {sizeText(editPet.size_category)}</div>
        </div>

        <div className="petInfoRight">
          {editPet.picture_pet ? (
            <img
              src={`http://localhost:4000/images/pets/${editPet.picture_pet}`}
              alt={editPet.name_pet}
            />
          ) : (
            <div className="noPhoto">SIN FOTO</div>
          )}
        </div>
      </section>

      {/* FORMULARIO */}
      <h3 className="editTitle">Edita tu mascota</h3>

      <Container>
        <Row className="d-flex justify-content-center pt-4">
          <Col xs={6}>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="name_pet"
                  value={editPet.name_pet || ""}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={editPet.description || ""}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Especie</Form.Label>
                <Form.Control type="text" value={specieText(editPet.specie)} disabled />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Categoría (peso)</Form.Label>
                <Form.Select
                  name="size_category"
                  value={editPet.size_category}
                  onChange={handleChange}
                >
                  <option value={1}>Toy</option>
                  <option value={2}>Pequeño</option>
                  <option value={3}>Mediano</option>
                  <option value={4}>Grande</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Pelo</Form.Label>
                <Form.Control
                  type="text"
                  name="hair"
                  value={editPet.hair || ""}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Historial médico</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="medical_history"
                  value={editPet.medical_history || ""}
                  onChange={handleChange}
                />
              </Form.Group>

              <div className="formActions">
                <button type="button" className="backBtn" onClick={() => navigate("/profile")}>
                  ATRÁS
                </button>

                <button type="button" className="confirmBtn" onClick={onSubmit}>
                  CONFIRMAR
                </button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EditPet;

