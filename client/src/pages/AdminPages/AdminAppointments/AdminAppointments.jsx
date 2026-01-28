import React from "react";
import { useNavigate } from "react-router";
import "../AdminProfile/AdminProfile.css";

const AdminAppointments = () => {
  const navigate = useNavigate();
  return (
    <section className="admin-section">
      <h2 className="title">Mis citas (Admin)</h2>
      <p>Aquí irá la gestión de citas del administrador.</p>
      <div className="back-btn-center">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <span className="arrow">←</span>ATRÁS
        </button>
      </div>
    </section>
  );
};

export default AdminAppointments;
