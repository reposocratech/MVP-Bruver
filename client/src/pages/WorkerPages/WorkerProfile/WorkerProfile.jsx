import React, { useState } from 'react'
import ModalUserProfileEdit from '../../../components/Modal/ModalUserProfileEdit/ModalUserProfileEdit.jsx'
import "./WorkerProfile.css"

const WorkerProfile = () => {

  const [openModal, setOpenModal] = useState(false);

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
              <tr><td>Admin</td></tr>
              <tr><td>admin@admin</td></tr>
              <tr><td>666666666</td></tr>
            </tbody>
          </table>
        </div>

        <div className="profile-img">
          <img src="https://cdn-icons-png.flaticon.com/512/456/456212.png" alt="perfil" />
        </div>

      </div>

      <div className="options-wrapper">



        <div className="options-row row-top">
          
          <div className="option-card">
            <div className="option-header">HORARIO LABORAL</div>
            <i class="bi bi-calendar3"></i>
          </div>

          <div className="option-card">
            <div className="option-header">MIS CITAS</div>
            <i class="bi bi-pencil-square"></i>
          </div>

          <div className="option-card">
            <div className="option-header">AGENDA</div>
            <i class="bi bi-journal-richtext"></i>
          </div>
        </div>
      </div>

      <button className="back-btn"><span className="arrow">←</span>ATRAS</button>

      {openModal && <ModalUserProfileEdit onClose={() => setOpenModal(false)} />}
    </section>
  )
}

export default WorkerProfile;