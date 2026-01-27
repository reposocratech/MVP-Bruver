import { Button, Modal, Table } from 'react-bootstrap';
import './clientprofilepage.css';
import { Link } from 'react-router';
import ModalUserProfileEdit from '../../../../components/Modal/ModalUserProfileEdit/ModalUserProfileEdit';
import { useState, useEffect } from 'react';

const ClientProfilePage = () => {
  const [openModal, setOpenModal] = useState(false);

  /* Función para que haya scroll en la página o en el modal, según donde estés */
  useEffect(() => {
    document.body.style.overflow = openModal ? 'hidden' : 'auto';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [openModal]);

  return (
    <div className="clientProfilePage">
      <h1 className="profileTitle">PERFIL USUARIO</h1>

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
                  <td className="infoValue">Clara Rodríguez</td>
                </tr>
                <tr>
                  <td className="infoKey">Correo</td>
                  <td className="infoValue">clarard@gmail.com</td>
                </tr>
                <tr>
                  <td className="infoKey">Teléfono</td>
                  <td className="infoValue">638493234</td>
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
          {/* Mascota 1 */}
          <article className="petCard">
            <div className="petImage">
              <span>IMG</span>
            </div>
            <div className="petBody">
              <h3 className="petName">Toy</h3>

              <div className="petActions">
                <button className="petBtn" type="button">
                  EDITAR
                </button>
                {/* ✅ AQUÍ VA TU MODAL DE EDITAR MASCOTA */}
                <button
                  className="petBtn danger"
                  type="button"
                  onClick={() =>
                    window.confirm('¿Estás seguro de borrar a Toy?')
                  }
                >
                  ELIMINAR
                </button>
              </div>
            </div>
          </article>

          {/* Mascota 2 */}
          <article className="petCard">
            <div className="petImage">
              <span>IMG</span>
            </div>
            <div className="petBody">
              <h3 className="petName">Sam</h3>

              <div className="petActions">
                <button className="petBtn" type="button">
                  EDITAR
                </button>
                {/* ✅ AQUÍ VA TU MODAL DE EDITAR MASCOTA */}
                <button
                  className="petBtn danger"
                  type="button"
                  onClick={() =>
                    window.confirm('¿Estás seguro de borrar a Sam?')
                  }
                >
                  ELIMINAR
                </button>
              </div>
            </div>
          </article>
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
      {openModal && (
        <ModalUserProfileEdit onClose={() => setOpenModal(false)} />
      )}
    </div>
  );
};

export default ClientProfilePage;
