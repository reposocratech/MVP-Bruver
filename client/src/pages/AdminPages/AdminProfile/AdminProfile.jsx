import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { fetchData } from "../../../helpers/axiosHelper";
import { AuthContext } from "../../../contexts/AuthContext/AuthContext";
import ModalUserProfileEdit from "../../../components/Modal/ModalUserProfileEdit/ModalUserProfileEdit.jsx";
import "./AdminProfile.css";

const AdminProfile = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [admin, setAdmin] = useState();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await fetchData("admin", "GET", null, token);
        setAdmin(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAdmin();
  }, [token]);

  return (
    <section className="admin-section">
      <h2 className="title">Mi perfil</h2>

      <div className="profile-card">
        <div className="info-block">
          <h3>Información</h3>

          <button
            className="edit-btn"
            type="button"
            onClick={() => setOpenModal(true)}
          >
            ✎ Editar
          </button>

          <table>
            <tbody>
              <tr>
                <td>
                  {admin?.name_user} {admin?.last_name}
                </td>
              </tr>
              <tr>
                <td>{admin?.email}</td>
              </tr>
              <tr>
                <td>{admin?.phone}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="profile-img">
          <img
            src={`${import.meta.env.VITE_SERVER_IMAGES}/picturesGeneral/${user.picture_user}`}
            alt="perfil"
          />
        </div>
      </div>

      <div className="options-wrapper">
        <div className="options-row row-top">
          <div
            className="option-card option-card-link"
            onClick={() => navigate("/admin/general")}
          >
            <div className="option-header">AGENDA</div>
            <i className="bi bi-journal-richtext"></i>
          </div>

          <div
            className="option-card option-card-link"
            onClick={() => navigate("/admin/appointments")}
          >
            <div className="option-header">MIS CITAS</div>
            <i className="bi bi-pencil-square"></i>
          </div>

          <div
            className="option-card option-card-link"
            onClick={() => navigate(`/admin/workinghours/${admin.user_id}`)}
          >
            <div className="option-header">HORARIO LABORAL</div>
            <i className="bi bi-calendar3"></i>
          </div>
        </div>

        <div className="options-row row-bottom">
          <div
            className="option-card option-card-link"
            onClick={() => navigate("/admin/manage")}
          >
            <div className="option-header">ADMINISTRAR</div>
            <i className="bi bi-gear"></i>
          </div>
        </div>
      </div>

      <button className="back-btn" onClick={() => navigate(-1)}>
        <span className="arrow">←</span>ATRÁS
      </button>

      {openModal && (
        <ModalUserProfileEdit onClose={() => setOpenModal(false)} />
      )}
    </section>
  );
};

export default AdminProfile;
