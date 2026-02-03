import React, { useEffect, useState, useContext } from "react";
import { Table, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import "./AdminClientHistory.css";
import { AuthContext } from "../../../contexts/AuthContext/AuthContext";
import { fetchData } from "../../../helpers/axiosHelper";

const AdminClientHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [client, setClient] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await fetchData(`admin/user/${id}`, "GET", null, token);
        setClient(res.data.user);
      } catch (error) {
        console.log(error);
        setClient(null);
      }
    };
    fetchClient();
  }, [id, token]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetchData(`appointment/user/${id}`, "GET", null, token);
        setAppointments(res.data.appointments || []);
      } catch (error) {
        console.log(error);
        setAppointments([]);
      }
    };
    fetchAppointments();
  }, [id, token]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const dateSelect = new Date(dateStr);
    return dateSelect.toLocaleDateString("es-ES");
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    return timeStr.slice(0, 5);
  };

  const formatPrice = (value) => {
    const numMoney = Number(value || 0);
    return numMoney.toFixed(2).replace(".", ",") + " €";
  };

  return (
    <div className="adminClientHistoryPage">
      <h1 className="profileTitle">Historial de cliente</h1>
      <section className="infoCard">
        <div className="infoLeft">
          <div className="infoHeader">
            <h2 className="infoTitle">Información</h2>
          </div>
          <div className="infoTableWrap">
            <Table className="infoTable" borderless>
              <tbody>
                <tr>
                  <td className="infoKey">Nombre</td>
                  <td className="infoValue">{client?.name_user} {client?.last_name}</td>
                </tr>
                <tr>
                  <td className="infoKey">Correo</td>
                  <td className="infoValue">{client?.email}</td>
                </tr>
                <tr>
                  <td className="infoKey">Teléfono</td>
                  <td className="infoValue">{client?.phone}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
        <div className="infoRight">
          <div className="userPhoto">
            <span>
              {client && client.picture_user ? (
                <img
                  className="userPhoto"
                  src={`${import.meta.env.VITE_SERVER_IMAGES}/picturesGeneral/${client.picture_user}`}
                  alt="Imagen de perfil"
                />
              ) : (
                <img
                  className="userPhoto"
                  src={`/img/defaultimg/IconDefect.png`}
                  alt="Imagen de perfil por defecto"
                />
              )}
            </span>
          </div>
        </div>
      </section>
      <section className="appointmentsSection">
        <h1 className="sectionTitle center">Citas de {client?.name_user || ''}</h1>
        <div className="appointmentsTableWrap">
          <Table className="appointmentsTable" bordered>
            <thead>
              <tr>
                <th>ID</th>
                <th>HORA</th>
                <th>DÍA DE RESERVA</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center" }}>
                    No hay citas para este cliente
                  </td>
                </tr>
              ) : (
                appointments.map((a) => (
                  <tr key={a.appointment_id}>
                    <td>{a.appointment_id}</td>
                    <td>{formatTime(a.start_time)}</td>
                    <td>{formatDate(a.appointment_date)}</td>
                    <td>{formatPrice(a.total_price)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </section>
      <Button className="backBtn" type="button" onClick={() => navigate(-1)}>
        VOLVER
      </Button>
    </div>
  );
};

export default AdminClientHistory;
