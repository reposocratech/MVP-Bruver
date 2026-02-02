import { useContext, useState } from 'react'
import { useNavigate} from "react-router"
import ModalUserProfileEdit from '../../../components/Modal/ModalUserProfileEdit/ModalUserProfileEdit.jsx'
import "./WorkerProfile.css"
import { AuthContext } from '../../../contexts/AuthContext/AuthContext.js'



const WorkerProfile = () => {

const [openModal, setOpenModal] = useState(false);
const {user} = useContext(AuthContext);
const navigate = useNavigate()

  return (
    <section className="worker-section">
      <h2 className="title">Mi perfil</h2>
      <div className="profile-card">
        <div className="info-block">
          <h3>Información</h3>
          <button 
            onClick={() => setOpenModal(true)} 
            className="edit-btn">✏️ Editar </button>
          <table>
            <tbody>
              <tr>
                  <td>{user.name_user}</td>
              </tr>
              <tr>
                  <td>{user.email}</td>
              </tr>
              <tr>
                  <td>{user.phone}</td>
              </tr>
            </tbody>
          </table>
        </div>
       <div className="userPhoto">
            <span>
              {user && user.picture_user ? (
                <img
                  className="profile-img"
                  src={`${import.meta.env.VITE_SERVER_IMAGES}/picturesGeneral/${user.picture_user}`}
                  alt="Imagen de perfil"
                />
              ) : (
                <img
                  className="profile-img"
                  src={`/img/defaultimg/IconDefect.png`}
                  alt="Imagen de perfil por defecto"
                />
              )}
            </span>
          </div>
      </div>
      <div className="options-wrapper">
        <div className="options-row row-top">
          
          <div className="option-card">
            <span onClick={() => navigate(`/worker/workinghours/${user.user_id}`)} >
              <div className="option-header">HORARIO LABORAL</div>
              <i className="bi bi-calendar3"></i>
            </span>
          </div>
          <div className="option-card">
            <span onClick={() => navigate(`/worker/WorkerDate/${user.user_id}`)} >
              <div className="option-header">MIS CITAS</div>
              <i className="bi bi-pencil-square"></i>
            </span>
          </div>
          <div className="option-card">
             <span onClick={() => navigate(`/admin/general`)} >
            <div className="option-header">AGENDA</div>
            <i className="bi bi-journal-richtext"></i>
            </span>
          </div>
        </div>
      </div>

      <button onClick={()=>navigate(-1)} className="back-btn"><span className="arrow">←</span>VOLVER</button>

      {openModal && <ModalUserProfileEdit onClose={() => setOpenModal(false)} />}
    </section>
  )
}

export default WorkerProfile;