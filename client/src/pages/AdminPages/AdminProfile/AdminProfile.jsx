import React from 'react'
import './AdminProfile.css'

const AdminProfile = () => {
  return (
    <section className="admin-section">

      <h2 className="title">Mi perfil</h2>

      <div className="profile-card">
        
        <div className="info-block">
          <h3>Información</h3>

          <button className="edit-btn">✏️ Editar</button>

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
            <div className="option-header">AGENDA</div>
            {/* <img src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png" alt="agenda"/> */}
            <i class="bi bi-journal-richtext"></i>
          </div>
          <div className="option-card">
            <div className="option-header">MIS CITAS</div>
            {/* <img src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png" alt="citas"/> */}
            <i class="bi bi-pencil-square"></i>
          </div>
          <div className="option-card">
            <div className="option-header">HORARIO LABORAL</div>
            {/* <img src="https://cdn-icons-png.flaticon.com/512/747/747310.png" alt="horario"/> */}
            <i class="bi bi-calendar3"></i>
          </div>

        </div>

        <div className="options-row row-bottom">

          <div className="option-card">
            <div className="option-header">MODIFICAR EMPLEADOS</div>
            {/* <img src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" alt="empleados"/> */}
            <i class="bi bi-people"></i>
          </div>
          <div className="option-card">
            <div className="option-header">ADMINISTRAR</div>
            {/* <img src="https://cdn-icons-png.flaticon.com/512/1828/1828859.png" alt="admin"/> */}
            <i class="bi bi-gear"></i>
          </div>

        </div>

      </div>

      <button className="back-btn"><span className="arrow">←</span>ATRAS</button>

    </section>
  )
}

export default AdminProfile;