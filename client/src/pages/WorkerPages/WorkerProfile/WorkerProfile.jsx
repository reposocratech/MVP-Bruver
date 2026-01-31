<<<<<<< HEAD
import { useState } from 'react'
import { useNavigate } from "react-router"
import ModalUserProfileEdit from '../../../components/Modal/ModalUserProfileEdit/ModalUserProfileEdit.jsx'
import "./WorkerProfile.css"
import { AuthContext } from '../../../contexts/AuthContext/AuthContext.js'
import { useContext } from 'react'
=======
import React, { useContext, useState } from 'react'
import { useNavigate} from "react-router"
import ModalUserProfileEdit from '../../../components/Modal/ModalUserProfileEdit/ModalUserProfileEdit.jsx'
import "./WorkerProfile.css"
import { AuthContext } from '../../../contexts/AuthContext/AuthContext.js'
import { fetchData } from '../../../helpers/axiosHelper.js'
>>>>>>> 56cbc26836bd50ed6cb2492032f96620f0307794

const WorkerProfile = () => {

  const {user, setUser} = useContext(AuthContext);


  const [openModal, setOpenModal] = useState(false);

<<<<<<< HEAD
=======
 const {user} = useContext(AuthContext);



>>>>>>> 56cbc26836bd50ed6cb2492032f96620f0307794
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

        <div className="profile-img">
          <img src={`${import.meta.env.VITE_SERVER_IMAGES}/picturesGeneral/${user?.picture_user}`} alt="perfil" />
        </div>

      </div>

      <div className="options-wrapper">



        <div className="options-row row-top">
          
          <div className="option-card">
            <div className="option-header">HORARIO LABORAL</div>
            <i className="bi bi-calendar3"></i>
          </div>

          <div className="option-card">
            <span onClick={() => navigate(`/Worker/workerDate/${user.user_id}`)} >
            <div className="option-header">MIS CITAS</div>
            <i className="bi bi-pencil-square"></i> 
            </span>
          </div>

          <div className="option-card">
            <div className="option-header">AGENDA</div>
            <i className="bi bi-journal-richtext"></i>
          </div>
        </div>
      </div>

      <button className="back-btn"><span className="arrow">←</span>ATRAS</button>

      {openModal && <ModalUserProfileEdit onClose={() => setOpenModal(false)} />}
    </section>
  )
}

export default WorkerProfile;