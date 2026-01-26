import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { fetchData } from "../../../../helpers/axiosHelper";
import { AuthContext } from "../../../../contexts/AuthContext/AuthContext";
import { Button } from "react-bootstrap";
import "./ClientProfile.css"

const ClientProfilePage = () => {
  const [user, setUser] = useState();
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetchData("user/profile", "GET", null, token);
      setUser(res.data.user);
    };

    const fetchPets = async () => {
      const res = await fetchData("pet/mine", "GET", null, token);
      setPets(res.data.pets);
    };

    const fetchAppointments = async () => {
      const res = await fetchData("appointment/mine", "GET", null, token);
      setAppointments(res.data.appointments);
    };

    fetchProfile();
    fetchPets();
    fetchAppointments();
  }, []);

  return (
    <div className="cp-page">
      <div className="cp-info-card">
        <div className="cp-info-left">
          <h2>Información</h2>
          <div className="cp-info-box">
            <p>{user?.name_user} {user?.last_name}</p>
            <p>{user?.email}</p>
            <p>{user?.phone}</p>
          </div>

          <Button className="cp-btn" onClick={() => navigate("/profile/edit")}>
            Editar
          </Button>
        </div>

        <div className="cp-info-right">
          <img
            className="cp-user-img"
            src={`${import.meta.env.VITE_SERVER_IMAGES}/users/${user?.picture_user}`}
            alt=""
          />
        </div>
      </div>



      <h1 className="cp-title">Mis mascotas</h1>

      <Button className="cp-btn" onClick={() => navigate("/pets/new")}>
        Añadir
      </Button>

      <div className="cp-pets-grid">
        {pets?.map((pet) => {
          return (
            <div className="cp-pet-card" key={pet.pet_id}>
              <img
                className="cp-pet-img"
                src={`${import.meta.env.VITE_SERVER_IMAGES}/pets/${pet.picture_pet}`}
                alt=""
              />

              <div className="cp-pet-footer">
                <p className="cp-pet-name">{pet.name_pet}</p>

                <div className="cp-pet-actions">
                  <Button
                    className="cp-btn"
                    onClick={() => navigate(`/pets/edit/${pet.pet_id}`)}
                  >
                    Editar
                  </Button>

                  <Button
                    className="cp-btn"
                    onClick={() => navigate(`/pets/delete/${pet.pet_id}`)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <h1 className="cp-title">Mis citas</h1>

      <div className="cp-table-wrap">
        <table className="cp-table">
          <thead>
            <tr>
              <th>HORA</th>
              <th>DÍA DE RESERVA</th>
              <th>TOTAL</th>
            </tr>
          </thead>

          <tbody>
            {appointments?.map((a) => {
              return (
                <tr key={a.appointment_id}>
                  <td>{a.start_time?.slice(0, 5)}</td>
                  <td>{a.appointment_date?.slice(0, 10)}</td>
                  <td>{a.total_price}€</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientProfilePage;
