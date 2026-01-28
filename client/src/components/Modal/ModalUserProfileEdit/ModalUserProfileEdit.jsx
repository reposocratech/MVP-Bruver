import { useState } from "react";
import { Button } from "react-bootstrap"
import "./ModalUserProfileEdit.css";
const ModalUserProfileEdit = ({ onClose }) => {
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    telefono: "",
    provincia: "",
    ciudad:"",
    direccion: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <section className="userProfileModal">
      <div className="userProfileModalContent">
        <h2 className="modalTitle">Edita tu perfil</h2>
        <form className="userProfileForm">
          <label>Nombre</label>
          <input name="nombre" value={form.nombre} onChange={handleChange} />
          <label>Apellidos</label>
          <input name="apellidos" value={form.apellidos} onChange={handleChange} />
          <label>Teléfono</label>
          <input name="telefono" value={form.telefono} onChange={handleChange} />
          <label> Provincia</label>
          <input name="provincia" value={form.provincia} onChange={handleChange}/>
          <label> Ciudad</label>
          <input name="ciudad" value={form.provincia} onChange={handleChange}/>
          <label> Dirección</label>
          <input name="direccion" value={form.provincia} onChange={handleChange}/>
          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} />
          <label>Contraseña</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} />
          <label>Repite contraseña</label>
          <input type="password" name="repeatPassword" value={form.repeatPassword} onChange={handleChange} />
          <label>Cambiar foto</label>
          <input type="file" className="changePhotoBtn"/>
          <div className="modalButtons">
            <button className="confirmBtn">CONFIRMAR</button>
            <button type="button" className="cancelBtn" onClick={onClose}>CANCELAR</button>
            <button type="button" className="deleteBtn">ELIMINAR PERFIL</button>
          </div>
        </form>
      </div>
    </section>
  );
};
export default ModalUserProfileEdit;