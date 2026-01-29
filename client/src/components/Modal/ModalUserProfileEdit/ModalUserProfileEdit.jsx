import { useContext, useEffect, useState } from "react";
import "./ModalUserProfileEdit.css";

import { AuthContext } from "../../../contexts/AuthContext/AuthContext";
import { fetchData } from "../../../helpers/axiosHelper";
import { useNavigate } from "react-router";

const ModalUserProfileEdit = ({ onClose }) => {
  const navigate = useNavigate();

  // 1) Sacamos user/token y helpers del contexto
  const { user, setUser, token, logout } = useContext(AuthContext);

  // 2) Estado local del formulario
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    telefono: "",
    provincia: "",
    ciudad: "",
    direccion: "",
    email: "",
  }
);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 3) Traer previsualización de datos del user al abrir modal
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

  // 5) Confirmar -> actualizar perfil en BD + actualizar contexto
  const handleConfirm = async () => {
    if (!token || loading) return;

    try {
      setLoading(true);
      setErrorMsg("");

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

  // 6) Eliminar perfil -> borrado lógico + logout + home
  const handleDeleteProfile = async () => {
    if (!token || loading) return;

    try {
      if (window.confirm("¿Seguro que quieres eliminar tu perfil ?")) {
        setLoading(true);
        setErrorMsg("");

        await fetchData("user/delete", "PUT", null, token);

        logout();
        onClose();
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

       
        <form className="userProfileForm">
          <label>Nombre</label>
          <input name="nombre" value={form.nombre} onChange={handleChange} disabled={loading} />

          <label>Apellidos</label>
          <input name="apellidos" value={form.apellidos} onChange={handleChange} disabled={loading} />

          <label>Teléfono</label>
          <input name="telefono" value={form.telefono} onChange={handleChange} disabled={loading} />

          <label>Provincia</label>
          <input name="provincia" value={form.provincia} onChange={handleChange} disabled={loading} />

          <label>Ciudad</label>
          <input name="ciudad" value={form.ciudad} onChange={handleChange} disabled={loading} />

          <label>Dirección</label>
          <input name="direccion" value={form.direccion} onChange={handleChange} disabled={loading} />

          <label>Email</label>
          <input name="email" value={form.email} disabled />

          {errorMsg && <p className="text-danger">{errorMsg}</p>}

          <label>Cambiar foto</label>
          <input type="file" className="changePhotoBtn" />

          <div className="modalButtons">
            <button className="confirmBtn" type="button" onClick={handleConfirm} disabled={loading}>
              CONFIRMAR
            </button>

            <button type="button" className="cancelBtn" onClick={onClose} disabled={loading}>
              CANCELAR
            </button>

            <button type="button" className="deleteBtn" onClick={handleDeleteProfile} disabled={loading}>
              ELIMINAR PERFIL
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ModalUserProfileEdit;
