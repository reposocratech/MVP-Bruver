import React, { useContext, useEffect, useState } from "react";
import { Button, Table, Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import "./clientprofilepage.css";

import ModalUserProfileEdit from "../../../../components/Modal/ModalUserProfileEdit/ModalUserProfileEdit";
import ModalPetEdit from "../../../../components/Modal/ModalpetEdit/ModalPetEdit";
import { UsersPetsGallery } from "../../../../components/UsersPetsGallery/UsersPetsGallery";
import { AuthContext } from "../../../../contexts/AuthContext/AuthContext";
import { fetchData } from "../../../../helpers/axiosHelper";

const ClientProfilePage = () => {
  const navigate = useNavigate();

  const { user, token } = useContext(AuthContext);

  const [openModal, setOpenModal] = useState(false);
  const [openModalEditPet, setOpenModalEditPet] = useState(false);
  const [selectedPet, setSelectedPet] = useState();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    document.body.style.overflow = openModal ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [openModal]);
  
  useEffect(() => {
    document.body.style.overflow = openModalEditPet ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [openModalEditPet]);

  useEffect(() => {
    const getMyAppointments = async () => {
      try {
        const res = await fetchData("appointment/mine", "GET", null, token);
        setAppointments(res?.data?.appointments || []);
      } catch (error) {
        console.log(error);
        setAppointments([]);
      }
    };

    if (token) getMyAppointments();
  }, [token]);

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
    <div className="clientProfilePage">
      <h1 className="profileTitle">Perfil usuario</h1>

      {/* INFO */}
      <section className="infoCard">
        <div className="infoLeft">
          <div className="infoHeader">
            <h2 className="infoTitle">Información</h2>

            <Button
              type="button"
              className="editBtn"
              onClick={() => setOpenModal(true)}
            >
              ✎ Editar
            </Button>
          </div>

          <div className="infoTableWrap">
            <Table className="infoTable" borderless>
              <tbody>
                <tr>
                  <td className="infoKey">Nombre</td>
                  <td className="infoValue">
                    {user?.name_user} {user?.last_name}
                  </td>
                </tr>
                <tr>
                  <td className="infoKey">Correo</td>
                  <td className="infoValue">{user?.email}</td>
                </tr>
                <tr>
                  <td className="infoKey">Teléfono</td>
                  <td className="infoValue">{user?.phone}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>

        <div className="infoRight">
          <div className="userPhoto">
            <span>
              {user && user.picture_user ? (
                <img
                  className="userPhoto"
                  src={`${import.meta.env.VITE_SERVER_IMAGES}/picturesGeneral/${user.picture_user}`}
                  alt="Imagen de perfil"
                />
              ) : (
                <img
                  className="userPhoto"
                  src={`${import.meta.env.VITE_SERVER_IMAGES}/picturesGeneral/perfilDefecto.jpg`}
                  alt="Imagen de perfil por defecto"
                />
              )}
            </span>
          </div>
        </div>
      </section>

      {/* MASCOTAS */}
      <section className="petsSection">
        <div className="sectionHeader">
          <h1 className="sectionTitle">Mis mascotas</h1>

          <Button
            type="button"
            className="addLinkBtn"
            onClick={() => navigate("/addpet")}
          >
            🐾 Añadir
          </Button>
        </div>

        <div className="petsGrid">
          <Container>
            <Row>
              <Col>
                <UsersPetsGallery 
                  setOpenModalEditPet={setOpenModalEditPet}
                  setSelectedPet={setSelectedPet}
                />
              </Col>
            </Row>
          </Container>
        </div>
      </section>

      {/* CITAS */}
      <section className="appointmentsSection">
        <h1 className="sectionTitle center">Mis citas</h1>

        <div className="appointmentsTableWrap">
          <Table className="appointmentsTable" bordered>
            <thead>
              <tr>
                <th>HORA</th>
                <th>DÍA DE RESERVA</th>
                <th>TOTAL</th>
              </tr>
            </thead>

            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center" }}>
                    No tienes citas todavía
                  </td>
                </tr>
              ) : (
                appointments.map((a) => (
                  <tr key={a.appointment_id}>
                    <td>{formatTime(a.start_time)}</td>
                    <td>{formatDate(a.appointment_date)}</td>
                    <td>{formatPrice(a.total_price)}</td>
                  </tr>
                )
              )
              )
              }
            </tbody>
          </Table>
        </div>
      </section>

      {openModal && <ModalUserProfileEdit onClose={() => setOpenModal(false)} />}
      {openModalEditPet && (
        <ModalPetEdit
          onClose={() => setOpenModalEditPet(false)}
          pet={selectedPet}
        />
      )}
    </div>
  );
};

export default ClientProfilePage;
