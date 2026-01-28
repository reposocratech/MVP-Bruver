import { Button, Table, Col, Container, Row } from "react-bootstrap";
import "./clientprofilepage.css";
import { Link } from "react-router";
import ModalUserProfileEdit from "../../../../components/Modal/ModalUserProfileEdit/ModalUserProfileEdit";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../../contexts/AuthContext/AuthContext";
import { UsersPetsGallery } from "../../../../components/UsersPetsGallery/UsersPetsGallery";
import { fetchData } from "../../../../helpers/axiosHelper";

const ClientProfilePage = () => {
  const [openModal, setOpenModal] = useState(false);

  const { user, token } = useContext(AuthContext);

  // los estados de las citas
  const [appointments, setAppointments] = useState([]);

  /* Función para que haya scroll en la página o en el modal, según donde estés */
  useEffect(() => {
    document.body.style.overflow = openModal ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  },
   [openModal]);

  // para cargar las citas del usuario
  useEffect(() => {
    const getMyAppointments = async () => {
      try {

        const res = await fetchData("appointment/mine", "GET", null, token);
        setAppointments(res.data.appointments || []);
      } 
      catch (error) 
      {
        console.log(error);
      }
    };

    if (token) getMyAppointments();
  }, 
  [token]
);

  // esto es para el formato de la fecha 
  const formatDate = (dateStr) => {

    //  viene co neste tipo"2026-01-18"

    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES");
  };

  const formatTime = (timeStr) => {
    // formato de la fecha 
    if (!timeStr) return "";
    return timeStr.slice(0, 5);
  };

  const formatPrice = (value) => {
    const num = Number(value || 0);
    return num.toFixed(2).replace(".", ",") + " €";
  };

  return (
    <div className="clientProfilePage">
      <h1 className="profileTitle">Perfil usuario</h1>

      {/* INFO */}
      <section className="infoCard">
        <div className="infoLeft">
          <div className="infoHeader">
            <h2 className="infoTitle">Información</h2>

            <Button onClick={() => setOpenModal(true)} className="editBtn" type="button">
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
            <span>FOTO</span>
          </div>
        </div>
      </section>

      {/* MASCOTAS */}
      <section className="petsSection">
        <div className="sectionHeader">
          <h1 className="sectionTitle">Mis mascotas</h1>

          <Button as={Link} to="/addpet" className="addLinkBtn">
            🐾 Añadir
          </Button>
        </div>

        <div className="petsGrid">
          <Container>
            <Row>
              <Col>
                <UsersPetsGallery />
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
                ))
              )}
            </tbody>
          </Table>
        </div>
      </section>

      {openModal && <ModalUserProfileEdit onClose={() => setOpenModal(false)} />}
    </div>
  );
};

export default ClientProfilePage;
