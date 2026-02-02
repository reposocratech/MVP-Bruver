import { Modal, Form } from 'react-bootstrap';
import './ModalCreateProfile.css';


const ModalCreateProfile = ({
  show,
  onClose,
  newProfile,
  handleProfileChange,
  submitProfile,
  valErrors,
  fetchError,
}) => {
  return (
    <>
      {show && (
        <section>
          <div className='createProfileGridModal'>
        <Modal
          show={show}
          /* onHide={onClose} */
          centered
          dialogClassName="nc-modal-dialog"
          contentClassName="nc-modal-content"
          backdropClassName="nc-backdrop"
        >
          <Modal.Body className="createProfileCardModal">
            <h3 className="nc-title">Nuevo perfil</h3>

            {fetchError && <div className="error-msg">{fetchError}</div>}

            <Form className="nc-form formNewProfile" onSubmit={submitProfile}>
              <Form.Group className="nc-group">
                <Form.Label>Tipo de perfil</Form.Label>
                <Form.Select
                  name="type"
                  value={newProfile.type}
                  onChange={handleProfileChange}
                >
                  <option value="">Elige</option>
                  <option value="worker">Trabajador</option>
                  <option value="client">Cliente</option>
                </Form.Select>
                {valErrors?.type && <div className="error-msg">{valErrors.type}</div>}
              </Form.Group>


              <Form.Group className="nc-group">
                <Form.Label>Nombre*</Form.Label>
                <Form.Control
                  name="name_user"
                  value={newProfile.name_user}
                  onChange={handleProfileChange}
                  type="text"
                />
                {valErrors?.name_user && <div className="error-msg">{valErrors.name_user}</div>}
              </Form.Group>

              <Form.Group className="nc-group">
                <Form.Label>Apellidos</Form.Label>
                <Form.Control
                  name="last_name"
                  value={newProfile.last_name}
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
                <Form.Label>Email*</Form.Label>
                <Form.Control
                  name="email"
                  value={newProfile.email}
                  onChange={handleProfileChange}
                  type="email"
                />
                {valErrors?.email && <div className="error-msg">{valErrors.email}</div>}
              </Form.Group>


             <Form.Group className="nc-group">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  name="password"
                  value={newProfile.password}
                  onChange={handleProfileChange}
                  type="password"
                />
                {valErrors?.password && <div className="error-msg">{valErrors.password}</div>}
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
                <Form.Label>Dirección</Form.Label>
                <Form.Control
                  name="address"
                  value={newProfile.address }
                  onChange={handleProfileChange}
                  type="text"
                />
              </Form.Group>

{/*               <Form.Group className="nc-group">
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
              </Form.Group> */}


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
                src="/img/adminAddUser/dog1.png"
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
