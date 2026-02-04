import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import { fetchData } from "../../helpers/axiosHelper";
import ModalComfirmDeletePet from "../Modal/ModalComfirmDeletePet/ModalComfirmDeletePet";
import "./UsersPetsGallery.css";
 
export const UsersPetsGallery = ({ setOpenModalEditPet, setSelectedPet }) => {
  // 1) Traemos del contexto el array de mascotas, token y el setter global
  const { pets, token, setPets } = useContext(AuthContext);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);
 
  // 2) Al montar el componente, si hay token, pedimos las mascotas al backend
  useEffect(() => {
 
    const getMyPets = async () => {
 
      try {
        const res = await fetchData("pet/mine", "GET", null, token);
        setPets(res.data);
      } catch (error) {
        console.log(error);
      }
    };
 
    if (token) getMyPets();
 
  },
   []);


  //Setear la mascota a Editar
  const selectEditablePet = (pet) => {
    setSelectedPet(pet);
    setOpenModalEditPet(true);
  };

  // Mostrar modal de confirmación
  const handleDeleteClick = (pet) => {
    setPetToDelete(pet);
    setShowDeleteModal(true);
  };

  // Confirmar borrado
  const confirmDeletePet = async () => {
    if (!petToDelete) return;
    try {
      await fetchData(`pet/${petToDelete.pet_id}`, "DELETE", null, token);
      setPets(pets.filter((elem) => elem.pet_id !== petToDelete.pet_id));
      setShowDeleteModal(false);
      setPetToDelete(null);
    } catch (error) {
      console.log(error);
      setShowDeleteModal(false);
      setPetToDelete(null);
    }
  };

  // Cancelar borrado
  const cancelDeletePet = () => {
    setShowDeleteModal(false);
    setPetToDelete(null);
  };
 
  // 4) Pintamos la galería de mascotas
  return (
    <>
      <div className="row g-4 justify-content-center">
        {pets?.map((elem) => (
          <div className="col-12 col-sm-6 col-lg-4" key={elem.pet_id}>
            <div className="petCard">
              <div className="petImage">
                {elem.picture_pet ? (
                  <img
                    src={`http://localhost:4000/images/pets/${elem.picture_pet}`}
                    alt={elem.name_pet}
                  />
                ) : (
                  <img
                    className="petPhoto"
                    src={`/img/defaultimg/IconDefaultPet.png`}
                    alt="Imagen de mascota por defecto"
                  />
                )}
              </div>
              <div className="petInfo">
                <h3>{elem.name_pet}</h3>
                <div className="petActions">
                  <button
                    className="petBtn"
                    type="button"
                    onClick={() => selectEditablePet(elem)}
                  >
                    EDITAR
                  </button>
                  <button
                    className="petBtn danger"
                    type="button"
                    onClick={() => handleDeleteClick(elem)}
                  >
                    ELIMINAR
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ModalComfirmDeletePet
        show={showDeleteModal}
        petName={petToDelete?.name_pet}
        onCancel={cancelDeletePet}
        onConfirm={confirmDeletePet}
      />
    </>
  );
};