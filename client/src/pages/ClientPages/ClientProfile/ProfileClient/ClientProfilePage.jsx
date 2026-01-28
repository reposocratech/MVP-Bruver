import { Button, Table , Col, Container, Row} from "react-bootstrap";
import "./clientprofilepage.css";
import { Link } from 'react-router'
import ModalUserProfileEdit from '../../../../components/Modal/ModalUserProfileEdit/ModalUserProfileEdit';
import { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { AuthContext } from "../../../../contexts/AuthContext/AuthContext";
import { UsersPetsGallery } from "../../../../components/UsersPetsGallery/UsersPetsGallery";
import { useEffect } from "react";

const ClientProfilePage = () => {
  const [openModal, setOpenModal] = useState(false);
  const { user } = useContext(AuthContext);




  /* Función para que haya scroll en la página o en el modal, según donde estés */
  useEffect(() => {
    document.body.style.overflow = openModal ? 'hidden' : 'auto';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [openModal]);

  return (
    <div className="clientProfilePage">
      <h1 className="profileTitle">Perfil usuario</h1>

      {/* INFO */}
      <section className="infoCard">
        <div className="infoLeft">
          <div className="infoHeader">
            <h2 className="infoTitle">Información</h2>

            <Button
              onClick={() => setOpenModal(true)}
              className="editBtn"
              type="button"
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
              <tr>
                <td>10:00</td>
                <td>18/01/2026</td>
                <td>56,00€</td>
              </tr>
              <tr>
                <td>11:00</td>
                <td>18/01/2026</td>
                <td>56,00€</td>
              </tr>
              <tr>
                <td>12:00</td>
                <td>18/01/2026</td>
                <td>56,00€</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </section>

      {openModal && <ModalUserProfileEdit onClose={() => setOpenModal(false)} />}
    </div>
  );
};

export default ClientProfilePage;
