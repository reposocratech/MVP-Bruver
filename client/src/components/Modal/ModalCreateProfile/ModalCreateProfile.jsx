import { Modal, Form } from 'react-bootstrap';
import './ModalCreateProfile.css';

const ModalCreateProfile = ({
  show,
  onClose,
  newProfile,
  handleProfileChange,
  submitProfile,
}) => {
  return (
    <>
      {show && (
        <section createProfileModal>
          <div className='createProfileGridModal'>
        <Modal
          show={show}
          onHide={onclose}
          centered
          dialogClassName="nc-modal-dialog"
          contentClassName="nc-modal-content"
          backdropClassName="nc-backdrop"
        >
          <Modal.Body className="createProfileCardModal">
            <h3 className="nc-title">Nuevo perfil</h3>

            <Form className="nc-form formNewProfile" onSubmit={submitProfile}>
              <Form.Group className="nc-group">
                <Form.Label>Tipo de perfil</Form.Label>
                <Form.Select
                  name="type"
                  value={newProfile.type}
                  onChange={handleProfileChange}
                >
                  <option value="Defect" disabled>
                    Elige
                  </option>
                  <option value="worker">Trabajador</option>
                  <option value="client">Cliente</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="nc-group">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  name="name"
                  value={newProfile.name}
                  onChange={handleProfileChange}
                  type="text"
                />
              </Form.Group>

              <Form.Group className="nc-group">
                <Form.Label>Apellidos</Form.Label>
                <Form.Control
                  name="lastname"
                  value={newProfile.lastname}
                  onChange={handleProfileChange}
                  type="text"
                />
              </Form.Group>

              <Form.Group className="nc-group">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  name="phone"
                  value={newProfile.phone}
                  onChange={handleProfileChange}
                  type="text"
                />
              </Form.Group>

              <Form.Group className="nc-group">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  value={newProfile.email}
                  onChange={handleProfileChange}
                  type="email"
                />
              </Form.Group>

              <Form.Group className="nc-group">
                <Form.Label>Provincia</Form.Label>
                <Form.Control
                  name="province"
                  value={newProfile.province}
                  onChange={handleProfileChange}
                  type="text"
                />
              </Form.Group>

              <Form.Group className="nc-group">
                <Form.Label>Ciudad</Form.Label>
                <Form.Control
                  name="city"
                  value={newProfile.city}
                  onChange={handleProfileChange}
                  type="text"
                />
              </Form.Group>

              <Form.Group className="nc-group">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  name="password"
                  value={newProfile.password}
                  onChange={handleProfileChange}
                  type="password"
                />
              </Form.Group>

              <Form.Group className="nc-group">
                <Form.Label>Repetir contraseña</Form.Label>
                <Form.Control
                  name="repeatPassword"
                  value={newProfile.repeatPassword}
                  onChange={handleProfileChange}
                  type="password"
                />
              </Form.Group>

              <div className="nc-buttons">
                <button className="close" type="submit">
                  ACEPTAR
                </button>
                <button
                  className="close"
                  type="button"
                  onClick={() => onClose(false)}
                >
                  CANCELAR
                </button>
              </div>

              <p className="nc-slogan">Patitas limpias, corazones felices</p>

              <img
                className="nc-dog"
                src="../../../../public/img/adminAddUser/dog1.png"
                alt="dog"
              />
            </Form>
          </Modal.Body>
        </Modal>
        </div>
        </section>
      )}
    </>
  );
};

export default ModalCreateProfile;
