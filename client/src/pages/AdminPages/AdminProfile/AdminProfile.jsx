import{ useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { fetchData } from "../../../helpers/axiosHelper"; 
import ModalUserProfileEdit from "../../../components/Modal/ModalUserProfileEdit/ModalUserProfileEdit.jsx";
import "./AdminProfile.css";
import { AuthContext } from "../../../contexts/AuthContext/AuthContext.js";

const AdminProfile = () => {
  const [openModal, setOpenModal] = useState(false);
  const [admin, setAdmin] = useState();

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmin = async () => {
      const res = await fetchData("/admin", "GET", null, token);
      setAdmin(res.data.user);
    };

    fetchAdmin();
  }, []);


  return (
    <section className="admin-section">
      <h2 className="title">Mi perfil</h2>

      <div className="profile-card">
        <div className="info-block">
          <h3>Información</h3>

          <button onClick={() => setOpenModal(true)} className="edit-btn">
             Editar
          </button>

          <table>
            <tbody>
              <tr><td>{admin?.name_user} {admin?.last_name}</td></tr>
              <tr><td>{admin?.email}</td></tr>
              <tr><td>{admin?.phone}</td></tr>
            </tbody>
          </table>
        </div>

        <div className="profile-img">
          <img
            src="https://cdn-icons-png.flaticon.com/512/456/456212.png"
            alt="perfil"
          />
        </div>
      </div>

      <div className="options-wrapper">
        <div className="options-row row-top">

          <div className="option-card" onClick={()=>navigate('/admin/general')}>
            <div className="option-header"  >AGENDA</div>
            <i class="bi bi-journal-richtext"></i>
          </div>

          <div className="option-card">
            <div className="option-header">MIS CITAS</div>
            <i className="bi bi-pencil-square"></i>
          </div>

          <div className="option-card">
            <div className="option-header">HORARIO LABORAL</div>
            <i className="bi bi-calendar3"></i>
          </div>
        </div>

        <div className="options-row row-bottom">
          <div className="option-card">
            <div className="option-header">MODIFICAR EMPLEADOS</div>
            <i className="bi bi-people"></i>
          </div>
          <div className="option-card" onClick={() => navigate('/admin/manage')} style={{ cursor: 'pointer' }}>
            <div className="option-header">ADMINISTRAR</div>
            <i className="bi bi-gear"></i>
          </div>
        </div>
      </div>

      <button className="back-btn" onClick={() => navigate(-1)}><span className="arrow">←</span>ATRAS</button>



      {openModal && <ModalUserProfileEdit onClose={() => setOpenModal(false)} />}
    </section>
  );
};

export default AdminProfile;
