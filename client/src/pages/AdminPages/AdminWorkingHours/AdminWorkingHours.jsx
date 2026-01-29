import React from "react";
import { useNavigate } from "react-router";
import "../AdminProfile/AdminProfile.css";
import { CalendarWorkingHours } from "../../../components/CalendarWorkingHours/CalendarWorkingHours";

const AdminWorkingHours = () => {
  const navigate = useNavigate();
  return (
    <section className="admin-section">
      <h2 className="title">Horario laboral (Admin)</h2>
      <div>
        <CalendarWorkingHours/>
      </div>
      <div className="back-btn-center">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <span className="arrow">←</span>ATRÁS
        </button>
      </div>
    </section>
  );
};

export default AdminWorkingHours;
