
import { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap"
import "./ModalUserProfileEdit.css";

import { AuthContext } from "../../../contexts/AuthContext/AuthContext";
import { fetchData } from "../../../helpers/axiosHelper";
import { useNavigate } from "react-router"; 

const ModalUserProfileEdit = ({ onClose }) => {
  const navigate = useNavigate(); 

  // 1) Sacamos user/token y helpers del contexto
  const { user, setUser, token, logout } = useContext(AuthContext);

  // 2) Estado local del formulario, no he añadido ni contraseña ni edicion del correo
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    telefono: "",
    provincia: "",
    ciudad: "",
    direccion: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 3) para traer la previsualizacion de los datos del user
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        nombre: user.name_user || "",
        apellidos: user.last_name || "",
        telefono: user.phone || "",
        provincia: user.province || "",
        ciudad: user.city || "",
        direccion: user.address || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  // 4) Handle genérico para inputs
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 5) conformar la actualizacion del token
  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!token || loading) return;

    try {
      setLoading(true);
      setErrorMsg("");

      // si no se envia no se edita
      const body = {
        name_user: form.nombre,
        last_name: form.apellidos,
        phone: form.telefono,
        province: form.provincia,
        city: form.ciudad,
        address: form.direccion,
      };

      const res = await fetchData("user/profile", "PUT", body, token);

      if (res?.data?.user) setUser(res.data.user);

      onClose();
    } catch (error) {
      console.log(error);
      setErrorMsg(error?.response?.data?.message || "Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  // 6) eliminar perfil, borrado logico 
  const handleDeleteProfile = async () => {
    if (!token || loading) return;
    /* borrado logico */
    try {
      if (window.confirm("¿Seguro que quieres eliminar tu perfil ?")) {
        setLoading(true);
        setErrorMsg("");

        await fetchData("user/delete", "PUT", null, token);

        logout();
        onClose();

        /* al hacer el borrado nos lleva al home */
        navigate("/"); 
      }
    } catch (error) {
      console.log(error);
      setErrorMsg(error?.response?.data?.message || "Error al eliminar el perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="userProfileModal">
      <div className="userProfileModalContent">
        <h2 className="modalTitle">Edita tu perfil</h2>

        <form className="userProfileForm" onSubmit={handleConfirm}>
          <label>Nombre</label>
          <input name="nombre" value={form.nombre} onChange={handleChange} disabled={loading} />

          <label>Apellidos</label>
          <input
            name="apellidos"
            value={form.apellidos}
            onChange={handleChange}
            disabled={loading}
          />

          <label>Teléfono</label>
          <input
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            disabled={loading}
          />

          <label>Provincia</label>
          <input
            name="provincia"
            value={form.provincia}
            onChange={handleChange}
            disabled={loading}
          />

          <label>Ciudad</label>
          <input name="ciudad" value={form.ciudad} onChange={handleChange} disabled={loading} />

          <label>Dirección</label>
          <input
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            disabled={loading}
          />

          <label>Email</label>

          <input name="email" value={form.email} disabled />

          {errorMsg && <p className="text-danger">{errorMsg}</p>}

          <label>Cambiar foto</label>

          <input type="file" className="changePhotoBtn"/>

          <div className="modalButtons">
            <button className="confirmBtn" type="submit" disabled={loading}>
              {loading ? "GUARDANDO..." : "CONFIRMAR"}
            </button>

            <button type="button" className="cancelBtn" onClick={onClose} disabled={loading}>
              CANCELAR
            </button>

            <button
              type="button"
              className="deleteBtn"
              onClick={handleDeleteProfile}
              disabled={loading}
            >
              ELIMINAR PERFIL
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ModalUserProfileEdit;
