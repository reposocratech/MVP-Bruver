import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Modal, Form, Button } from "react-bootstrap";
import "./AdminManage.css";
import { RiUserAddLine } from "react-icons/ri";

const AdminManage = () => {
  const navigate = useNavigate();

  const [workers] = useState([
    { id: 1, name: "Carol Rodriguez Lopez", hireDate: "", contact: "" },
    { id: 2, name: "Javi Sanchez Torres", hireDate: "", contact: "" },
    { id: 3, name: "Ricardo Jimenez Martin", hireDate: "", contact: "" },
  ]);

  const [clients] = useState([
    { id: 1, name: "Soledad Ortega", phone: "+34526859614", email: "sole_og66@gmail.com" },
    { id: 2, name: "Óscar Torres", phone: "+34845254132", email: "oscartorres@gmail.com" },
  ]);

  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);

  const [newWorker, setNewWorker] = useState({
    name: "",
    lastname: "",
    phone: "",
    email: "",
  });

  const [newClient, setNewClient] = useState({
    name: "",
    lastname: "",
    phone: "",
    email: "",
    province: "",
    city: "",
    password: "",
    repeatPassword: "",
  });

  const handleWorkerChange = (e) => {
    const { name, value } = e.target;
    setNewWorker({ ...newWorker, [name]: value });
  };

  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setNewClient({ ...newClient, [name]: value });
  };

  const submitWorker = (e) => {
    e.preventDefault();
    // por ahora no hace nada, solo cierra
    setShowWorkerModal(false);
  };

  const submitClient = (e) => {
    e.preventDefault();
    // por ahora no hace nada, solo cierra
    setShowClientModal(false);
  };

  return (
    <div className="agr-page">
      <h1 className="agr-title">Registro General</h1>

      <section className="agr-section">
        <div className="agr-section-title">
          <h2 className="agr-subtitle">Tabla de trabajadores</h2>

          <button
            className="agr-add"
            type="button"
            onClick={() => setShowWorkerModal(true)}
          >
            <RiUserAddLine />
            <span>Añadir</span>
          </button>
        </div>

        <div className="agr-table-wrap">
          <table className="agr-table">
            <thead>
              <tr>
                <th>EMPLEADO</th>
                <th>FECHA DE ALTA</th>
                <th>CONTACTO</th>
                <th>ADMINISTRAR</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w) => (
                <tr key={w.id}>
                  <td className="agr-bold">{w.name}</td>
                  <td>{w.hireDate}</td>
                  <td>{w.contact}</td>
                  <td>
                    <div className="agr-actions">
                      <button className="agr-pill" type="button">
                        EDITAR
                      </button>
                      <button className="agr-pill" type="button">
                        HACER ADMIN
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="agr-section">
        <div className="agr-section-title">
          <h2 className="agr-subtitle">Clientes</h2>

          <button
            className="agr-add"
            type="button"
            onClick={() => setShowClientModal(true)}
          >
            <RiUserAddLine />
            <span>Añadir</span>
          </button>
        </div>

        <div className="agr-table-wrap">
          <table className="agr-table">
            <thead>
              <tr>
                <th>CLIENTE</th>
                <th>TELEFONO</th>
                <th>E-MAIL</th>
                <th>ADMINISTRAR</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id}>
                  <td className="agr-bold">{c.name}</td>
                  <td>{c.phone}</td>
                  <td>{c.email}</td>
                  <td>
                    <div className="agr-actions">
                      <button className="agr-pill" type="button">
                        EDITAR
                      </button>
                      <button className="agr-pill" type="button">
                        VER HISTORIAL
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="agr-bottom">
        <button className="agr-back" type="button" onClick={() => navigate(-1)}>
          ATRÁS
        </button>
      </div>

      <Modal
  show={showWorkerModal}
  onHide={() => setShowWorkerModal(false)}
  centered
  dialogClassName="nc-modal-dialog"
  contentClassName="nc-modal-content"
  backdropClassName="nc-backdrop"
>
  <Modal.Body className="nc-body">
    <h2 className="nc-title">Nuevo empleado</h2>

    <Form className="nc-form" onSubmit={submitWorker}>

      <Form.Group className="nc-group">
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          name="name"
          value={newWorker.name}
          onChange={handleWorkerChange}
          type="text"
        />
      </Form.Group>

      <Form.Group className="nc-group">
        <Form.Label>Apellidos</Form.Label>
        <Form.Control
          name="lastname"
          value={newWorker.lastname}
          onChange={handleWorkerChange}
          type="text"
        />
      </Form.Group>

      <Form.Group className="nc-group">
        <Form.Label>Teléfono</Form.Label>
        <Form.Control
          name="phone"
          value={newWorker.phone}
          onChange={handleWorkerChange}
          type="text"
        />
      </Form.Group>

      <Form.Group className="nc-group">
        <Form.Label>Email</Form.Label>
        <Form.Control
          name="email"
          value={newWorker.email}
          onChange={handleWorkerChange}
          type="email"
        />
      </Form.Group>

      <Form.Group className="nc-group">
        <Form.Label>Provincia</Form.Label>
        <Form.Control
          name="province"
          value={newWorker.province}
          onChange={handleWorkerChange}
          type="text"
        />
      </Form.Group>

      <Form.Group className="nc-group">
        <Form.Label>Ciudad</Form.Label>
        <Form.Control
          name="city"
          value={newWorker.city}
          onChange={handleWorkerChange}
          type="text"
        />
      </Form.Group>

      <Form.Group className="nc-group">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control
          name="password"
          value={newWorker.password}
          onChange={handleWorkerChange}
          type="password"
        />
      </Form.Group>

      <Form.Group className="nc-group">
        <Form.Label>Repetir contraseña</Form.Label>
        <Form.Control
          name="repeatPassword"
          value={newWorker.repeatPassword}
          onChange={handleWorkerChange}
          type="password"
        />
      </Form.Group>

      <div className="nc-buttons">
        <button className="nc-btn nc-btn-ok" type="submit">
          ACEPTAR
        </button>
        <button
          className="nc-btn nc-btn-cancel"
          type="button"
          onClick={() => setShowWorkerModal(false)}
        >
          CANCELAR
        </button>
      </div>

      <p className="nc-slogan">Patitas limpias, corazones felices</p>

      <img className="nc-dog" src="../../../../public/img/adminAddUser/dog1.png" alt="dog" />
    </Form>
  </Modal.Body>
</Modal>


      <Modal
  show={showClientModal}
  onHide={() => setShowClientModal(false)}
  centered
  dialogClassName="nc-modal-dialog"
  contentClassName="nc-modal-content"
  backdropClassName="nc-backdrop"
>
  <Modal.Body className="nc-body">
    <h2 className="nc-title">Nuevo cliente</h2>

    <Form className="nc-form" onSubmit={submitClient}>
      <Form.Group className="nc-group">
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          name="name"
          value={newClient.name}
          onChange={handleClientChange}
          type="text"
        />
      </Form.Group>

      <Form.Group className="nc-group">
        <Form.Label>Apellidos</Form.Label>
        <Form.Control
          name="lastname"
          value={newClient.lastname}
          onChange={handleClientChange}
          type="text"
        />
      </Form.Group>

      <Form.Group className="nc-group">
        <Form.Label>Teléfono</Form.Label>
        <Form.Control
          name="phone"
          value={newClient.phone}
          onChange={handleClientChange}
          type="text"
        />
      </Form.Group>

      <Form.Group className="nc-group">
        <Form.Label>Email</Form.Label>
        <Form.Control
          name="email"
          value={newClient.email}
          onChange={handleClientChange}
          type="email"
        />
      </Form.Group>

      <Form.Group className="nc-group">
        <Form.Label>Provincia</Form.Label>
        <Form.Control
          name="province"
          value={newClient.province}
          onChange={handleClientChange}
          type="text"
        />
      </Form.Group>

      <Form.Group className="nc-group">
        <Form.Label>Ciudad</Form.Label>
        <Form.Control
          name="city"
          value={newClient.city}
          onChange={handleClientChange}
          type="text"
        />
      </Form.Group>

      <Form.Group className="nc-group">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control
          name="password"
          value={newClient.password}
          onChange={handleClientChange}
          type="password"
        />
      </Form.Group>

      <Form.Group className="nc-group">
        <Form.Label>Repetir contraseña</Form.Label>
        <Form.Control
          name="repeatPassword"
          value={newClient.repeatPassword}
          onChange={handleClientChange}
          type="password"
        />
      </Form.Group>

      <div className="nc-buttons">
        <button className="nc-btn nc-btn-ok" type="submit">
          ACEPTAR
        </button>
        <button
          className="nc-btn nc-btn-cancel"
          type="button"
          onClick={() => setShowClientModal(false)}
        >
          CANCELAR
        </button>
      </div>

      <p className="nc-slogan">Patitas limpias, corazones felices</p>

      <img className="nc-dog" src="../../../../public/img/adminAddUser/dog1.png" alt="dog" />
    </Form>
  </Modal.Body>
</Modal>

    </div>
  );
};

export default AdminManage;
