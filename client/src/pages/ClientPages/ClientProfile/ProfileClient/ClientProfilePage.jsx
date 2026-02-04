import React, { useContext, useEffect, useState } from "react";
import { Table, Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router";
import "./clientprofilepage.css";

import ModalUserProfileEdit from "../../../../components/Modal/ModalUserProfileEdit/ModalUserProfileEdit";
import ModalPetEdit from "../../../../components/Modal/ModalpetEdit/ModalPetEdit";
import { UsersPetsGallery } from "../../../../components/UsersPetsGallery/UsersPetsGallery";
import { AuthContext } from "../../../../contexts/AuthContext/AuthContext";
import { fetchData } from "../../../../helpers/axiosHelper";

const ClientProfilePage = () => {

  const navigate = useNavigate();
  const { id } = useParams();

  const { user, token } = useContext(AuthContext);

  const [openModal, setOpenModal] = useState(false);
  const [openModalEditPet, setOpenModalEditPet] = useState(false);
  const [selectedPet, setSelectedPet] = useState();
  const [appointments, setAppointments] = useState([]);
  const [showUser, setShowUser] = useState(user);

  useEffect(() => {
    document.body.style.overflow = openModal ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [openModal]);
  
  useEffect(() => {
    document.body.style.overflow = openModalEditPet ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [openModalEditPet]);

  // actualiza y cambia si cambiamos id, token o user.
  //si hay id en la ruta dinamica muestra ese, si no el logueado
  useEffect(() => {
    const fetchUser = async () => {
      if (id) {
        try {
          let res;
          // Si el usuario autenticado es admin (type === 1), usa el endpoint de admin
          if (user?.type === 1) {
            res = await fetchData(`admin/user/${id}`, "GET", null, token);
          } else {
            res = await fetchData(`user/${id}`, "GET", null, token);
          }
          setShowUser(res?.data?.user || null);
        } catch (error) {
          console.log(error);
          setShowUser(null);
        }
      } else {
        setShowUser(user);
      }
    };
    fetchUser();
  }, [id, user, token]);

  // mira ruta dinamica, si no hay id, te enseña el logueado
  useEffect(() => {
    const getAppointments = async () => {
      try {
        let res;
        if (id) {
          res = await fetchData(`appointment/user/${id}`, "GET", null, token);
          console.log(res);
        } else {
          res = await fetchData("appointment/mine", "GET", null, token);
        }
        setAppointments(res?.data?.appointments || []);
      } catch (error) {
        console.log(error);
        setAppointments([]);
      }
    };
    if (token) getAppointments();
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
    <div className="clientProfilePage">
      <h1 className="profileTitle">Perfil usuario</h1>

      {/* INFO */}
      <section className="infoCard">
        <div className="infoLeft">
          <div className="infoHeader">
            <h2 className="infoTitle">Información</h2>

            <button
  type="button"
  className="editBtn"
  onClick={() => setOpenModal(true)}
>
  ✎ Editar
</button>

          </div>

          <div className="infoTableWrap">
            <Table className="infoTable" borderless>
              <tbody>
                <tr>
                  <td className="infoKey">Nombre</td>
                  <td className="infoValue">
                    {showUser?.name_user} {showUser?.last_name}
                  </td>
                </tr>
                <tr>
                  <td className="infoKey">Correo</td>
                  <td className="infoValue">{showUser?.email}</td>
                </tr>
                <tr>
                  <td className="infoKey">Teléfono</td>
                  <td className="infoValue">{showUser?.phone}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>

        <div className="infoRight">
          <div className="userPhoto">
            <span>
              {showUser && showUser.picture_user ? (
                <img
                  className="userPhoto"
                  src={`${import.meta.env.VITE_SERVER_IMAGES}/picturesGeneral/${showUser.picture_user}`}
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

      {/* MASCOTAS */}
      <section className="petsSection">
        <div className="sectionHeader">
          <h1 className="sectionTitle">Mis mascotas</h1>

          <button
  type="button"
  className="addLinkBtn"
  onClick={() => navigate("/addpet")}
>
  🐾 Añadir
</button>

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
