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
  if (!show) return null;

  return (
    <section className="nc-overlay" onClick={() => onClose(false)}>
      <div className="nc-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="nc-title">Nuevo perfil</h3>

        {fetchError && <div className="error-msg">{fetchError}</div>}

        <form className="nc-form" onSubmit={submitProfile}>
          <div className="nc-group">
            <label>Tipo de perfil</label>
            <select name="type" value={newProfile.type} onChange={handleProfileChange}>
              <option value="">Elige</option>
              <option value="worker">Trabajador</option>
              <option value="client">Cliente</option>
            </select>
            {valErrors?.type && <div className="error-msg">{valErrors.type}</div>}
          </div>

          <div className="nc-group">
            <label>Nombre*</label>
            <input
              name="name_user"
              value={newProfile.name_user}
              onChange={handleProfileChange}
              type="text"
            />
            {valErrors?.name_user && <div className="error-msg">{valErrors.name_user}</div>}
          </div>

          <div className="nc-group">
            <label>Apellidos</label>
            <input
              name="last_name"
              value={newProfile.last_name}
              onChange={handleProfileChange}
              type="text"
            />
          </div>

          <div className="nc-group">
            <label>Teléfono</label>
            <input
              name="phone"
              value={newProfile.phone}
              onChange={handleProfileChange}
              type="text"
            />
          </div>

          <div className="nc-group">
            <label>Email*</label>
            <input
              name="email"
              value={newProfile.email}
              onChange={handleProfileChange}
              type="email"
            />
            {valErrors?.email && <div className="error-msg">{valErrors.email}</div>}
          </div>

          <div className="nc-group">
            <label>Contraseña</label>
            <input
              name="password"
              value={newProfile.password}
              onChange={handleProfileChange}
              type="password"
            />
            {valErrors?.password && <div className="error-msg">{valErrors.password}</div>}
          </div>

          <div className="nc-group">
            <label>Provincia</label>
            <input
              name="province"
              value={newProfile.province}
              onChange={handleProfileChange}
              type="text"
            />
          </div>

          <div className="nc-group">
            <label>Ciudad</label>
            <input
              name="city"
              value={newProfile.city}
              onChange={handleProfileChange}
              type="text"
            />
          </div>

          <div className="nc-group">
            <label>Dirección</label>
            <input
              name="address"
              value={newProfile.address}
              onChange={handleProfileChange}
              type="text"
            />
          </div>

          <div className="nc-buttons">
            <button className="btn-accept" type="submit">
              ACEPTAR
            </button>

            <button className="btn-cancel" type="button" onClick={() => onClose(false)}>
              CANCELAR
            </button>
          </div>

          <p className="nc-slogan">Patitas limpias, corazones felices</p>
        </form>
      </div>
    </section>
  );
};

export default ModalCreateProfile;
