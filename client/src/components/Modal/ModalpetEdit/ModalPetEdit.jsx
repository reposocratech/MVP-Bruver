import { useContext, useState } from 'react';

import { AuthContext } from '../../../contexts/AuthContext/AuthContext';
import { fetchData } from '../../../helpers/axiosHelper';
import { useNavigate } from 'react-router'; 
import { Button } from 'react-bootstrap';
import './ModalPetEdit.css';


const ModalPetEdit = ({ onClose, pet }) => {
  const navigate = useNavigate(); 
  const { token, logout, pets, setPets } = useContext(AuthContext);
  const [editPet, setEditPet] = useState(pet);
  const [avatar, setAvatar] = useState();
  const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) =>{
        const {name, value} = e.target;
        if(name === "avatar"){
            setAvatar(e.target.files[0])
            };
            setEditPet({...editPet, [name]: value})
        }

      const specieText = (value) => (Number(value) === 1 ? "Perro" : "Gato");

   const onSubmit = async (e) =>{
        e.preventDefault();
        try {
            const newFormdata = new FormData();
            newFormdata.append("editPet", JSON.stringify(editPet));
            if (avatar) newFormdata.append("img", avatar);

            const res = await fetchData(`pet/${pet.pet_id}`, "PUT", newFormdata, token);
            const updatedPet = res?.data?.pet || editPet;

            setPets(pets.map(elem =>{
              if(elem.pet_id === pet.pet_id){
                return { ...elem, ...updatedPet };
              }else{
                return elem;
              }
            }))
            setEditPet(updatedPet);
            onClose();

        } catch (error) {
            console.log(error);
            setErrorMsg(error?.response?.data?.message || 'Error al actualizar el perfil');
        }
    }
  // 6) Eliminar perfil -> borrado lógico + logout + home
 const handleDeleteProfile = async () => {
    if (!token) return;

    try {
      if (window.confirm('¿Seguro que quieres esta mascota?')) {
        setErrorMsg('');

        await fetchData('user/delete', 'PUT', null, token);

        logout();
        onClose();
        navigate('/');
      }
    } catch (error) {
      console.log(error);
      setErrorMsg(
        error?.response?.data?.message || 'Error al eliminar la mascota',
      );
  }; 
}

  return (
    <section className="userProfileModal">
      <div className="userProfileModalContent">
        <h2 className="modalTitle">Edita tu mascota</h2>

        <form className="userProfileForm">
          <label>Nombre*</label>
          <input
            name="name_pet"
            value={editPet?.name_pet?editPet.name_pet:""}
            onChange={handleChange}
          />

          <label>Descripción</label>
          <input
            name="description"
            value={editPet?.description?editPet.description:""}
            onChange={handleChange}
          />

          <label>Especie</label>
          <input name="specie" value={specieText(editPet?.specie?editPet.specie:"")} disabled />

          <label>Categoría (peso)*</label>
          <select
            name="size_category"
            value={editPet?.size_category?editPet.size_category:""}
            onChange={handleChange}
          >
            <option value={1}>Toy</option>
            <option value={2}>Pequeño</option>
            <option value={3}>Mediano</option>
            <option value={4}>Grande</option>
          </select>

          <label>Pelo</label>
          <input
            name="hair"
            value={editPet?.hair?editPet.hair:""}
            onChange={handleChange}
          />

          <label>Historial Médico</label>
          <input
            name="medical_history"
            value={editPet?.medical_history?editPet.medical_history:""}
            onChange={handleChange}
          />

          {errorMsg && <p className="text-danger">{errorMsg}</p>}

          <label>Cambiar foto</label>
          <input
            type="file"
            name="avatar"
            onChange={handleChange}
            className="changePhotoBtn"
          />

          <div className="modalButtons">
            <Button className="confirmBtn" onClick={onSubmit}>
              CONFIRMAR
            </Button>

            <button
              type="button"
              className="cancelBtn"
              onClick={onClose}
            >
              CANCELAR
            </button>

            <button
              type="button"
              className="deleteBtn"
              onClick={handleDeleteProfile}
            >
              ELIMINAR MASCOTA
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}


export default ModalPetEdit;
