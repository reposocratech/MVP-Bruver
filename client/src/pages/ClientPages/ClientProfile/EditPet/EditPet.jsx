import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import "./editpet.css";
import { fetchData } from "../../../../helpers/axiosHelper";
import { AuthContext } from "../../../../contexts/AuthContext/AuthContext";

const EditPet = () => {
  const navigate = useNavigate();
  const { petId } = useParams();

  const { token, pets, setPets } = useContext(AuthContext);

  // 1) estado del formulario con campos reales de Base de datos
  const [pet, setPet] = useState({
    pet_id: null,
    name_pet: "",
    description: "",
    specie: 1,
    size_category: 1,
    hair: "", // ✅ nuevo
    medical_history: "", // ✅ nuevo
    picture_pet: null,
  });

  const [loading, setLoading] = useState(false);

  // Mapeos para mostrar texto “real”
  const specieText = (value) => (Number(value) === 1 ? "Perro" : "Gato");
  const sizeText = (value) => {
    const map = { 1: "Toy", 2: "Pequeño", 3: "Mediano", 4: "Grande" };
    return map[Number(value)] || "Sin definir";
  };

  // 2) al entrar en la página, pedimos la mascota a la BD por id
  useEffect(() => {
    const getPet = async () => {
      try {
        const res = await fetchData(`pet/${petId}`, "GET", null, token);
        setPet(res.data.pet);
      } catch (error) {
        console.log(error);
      }
    };

    if (token) getPet();
  }, [token, petId]);

  // 3) cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPet((prev) => ({ ...prev, [name]: value }));
  };

  // 4) volver al perfil
  const handleBack = () => {
    navigate("/profile");
  };

  // 5) confirmar -> PUT a la BD + actualizar contexto + volver a /profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || loading) return;

    try {
      setLoading(true);

      const body = {
        name_pet: pet.name_pet,
        description: pet.description,
        specie: Number(pet.specie), // no editable, pero se manda igual
        size_category: Number(pet.size_category), // editable

        // ✅ nuevos
        hair: pet.hair,
        medical_history: pet.medical_history,
      };

      const res = await fetchData(`pet/${petId}`, "PUT", body, token);

      if (res?.data?.pet) {
        setPets(pets.map((p) => (p.pet_id === res.data.pet.pet_id ? res.data.pet : p)));
      }

      navigate("/profile");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editPetPage">
      <h2 className="pageTitle">Editar mascota</h2>

      {/* INFO MASCOTA */}
      <section className="petInfoBox">
        <div className="petInfoLeft">
          <h3>Información</h3>
          <div className="infoRow">{pet.name_pet}</div>
          <div className="infoRow">Especie: {specieText(pet.specie)}</div>
          <div className="infoRow">Tamaño: {sizeText(pet.size_category)}</div>
        </div>

        <div className="petInfoRight">
          {pet.picture_pet ? (
            <img src={`http://localhost:4000/images/pets/${pet.picture_pet}`} alt={pet.name_pet} />
          ) : (
            <div className="noPhoto">SIN FOTO</div>
          )}
        </div>
      </section>

      {/* FORMULARIO */}
      <h3 className="editTitle">Edita tu mascota</h3>

      <form className="editPetForm" onSubmit={handleSubmit}>
        <label>Nombre</label>
        <input name="name_pet" value={pet.name_pet} onChange={handleChange} />

        <label>Descripción</label>
        <input name="description" value={pet.description || ""} onChange={handleChange} />

        <label>Especie</label>
        <input value={specieText(pet.specie)} disabled />
        
        <label>Pelo</label>
        <input name="hair" value={pet.hair || ""} onChange={handleChange} />

        
        <label>Historial médico</label>
        <input
          name="medical_history"
          value={pet.medical_history || ""}
          onChange={handleChange}
        />

        <label>Categoría (peso)</label>
        <select name="size_category" value={pet.size_category} onChange={handleChange}>
          <option value={1}>Toy</option>
          <option value={2}>Pequeño</option>
          <option value={3}>Mediano</option>
          <option value={4}>Grande</option>
        </select>

        <label>Foto</label>
        <div className="photoSection">
          <button type="button" className="changePhotoBtn">
            Cambiar foto
          </button>
        </div>

        <div className="formActions">
          <button type="button" className="backBtn" onClick={handleBack} disabled={loading}>
            ATRÁS
          </button>

          <button type="submit" className="confirmBtn" disabled={loading}>
            {loading ? "GUARDANDO..." : "CONFIRMAR"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPet;
