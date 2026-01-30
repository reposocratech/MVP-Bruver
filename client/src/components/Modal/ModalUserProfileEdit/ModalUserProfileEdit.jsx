import { useContext, useState } from 'react';
import './ModalUserProfileEdit.css';

import { AuthContext } from '../../../contexts/AuthContext/AuthContext';
import { fetchData } from '../../../helpers/axiosHelper';
import { useNavigate } from 'react-router'; 
import { Button } from 'react-bootstrap';


const ModalUserProfileEdit = ({ onClose }) => {
  const navigate = useNavigate(); 
  const { user, setUser, token, logout } = useContext(AuthContext);
  const [editUser, setEditUser] = useState(user);
  const [avatar, setAvatar] = useState();
  const [errorMsg, setErrorMsg] = useState('');


    const handleChange = (e) =>{
        const {name, value} = e.target;
        if(name === "avatar"){
            setAvatar(e.target.files[0])
            };
            setEditUser({...editUser, [name]: value})
        }


   const onSubmit = async() =>{
        try {
            const newFormdata = new FormData();
            newFormdata.append("editUser", JSON.stringify(editUser));
            if (avatar) newFormdata.append("img", avatar);

            const res = await fetchData("user/profile", "PUT", newFormdata, token);

            if(res?.data?.user) {
                setUser(res.data.user);
            }

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
      if (window.confirm('¿Seguro que quieres eliminar tu perfil ?')) {
        setErrorMsg('');

        await fetchData('user/delete', 'PUT', null, token);

        logout();
        onClose();
        navigate('/');
      }
    } catch (error) {
      console.log(error);
      setErrorMsg(
        error?.response?.data?.message || 'Error al eliminar el perfil',
      );
  }; 
}

  return (
    <section className="userProfileModal">
      <div className="userProfileModalContent">
        <h2 className="modalTitle">Edita tu perfil</h2>

        <form className="userProfileForm">
          <label>Nombre</label>
          <input
            name="name_user"
            value={editUser.name_user?editUser.name_user:""}
            onChange={handleChange}
          />

          <label>Apellidos</label>
          <input
            name="last_name"
            value={editUser.last_name?editUser.last_name:""}
            onChange={handleChange}
          />

          <label>Teléfono</label>
          <input
            name="phone"
            value={editUser.phone?editUser.phone:""}
            onChange={handleChange}
          />

          <label>Provincia</label>
          <input
            name="province"
            value={editUser.province?editUser.province:""}
            onChange={handleChange}
          />

          <label>Ciudad</label>
          <input
            name="city"
            value={editUser.city?editUser.city:""}
            onChange={handleChange}
          />

          <label>Dirección</label>
          <input
            name="address"
            value={editUser.address?editUser.address:""}
            onChange={handleChange}
          />

          <label>Email</label>
          <input name="email" value={editUser.email?editUser.email:""} disabled />

          {errorMsg && <p className="text-danger">{errorMsg}</p>}

          <label>Cambiar foto</label>
          <input
            type="file"
            name="avatar"
            onChange={handleChange}
            className="changePhotoBtn"
          />

          <div className="modalButtons">
            <Button
              className="confirmBtn"
              onClick={onSubmit}
            >
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
              ELIMINAR PERFIL
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}


export default ModalUserProfileEdit;
