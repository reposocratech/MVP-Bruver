import{ useState } from 'react';
import { useNavigate } from 'react-router';
import './AdminManage.css';
import { RiUserAddLine } from 'react-icons/ri';
import ModalCreateProfile from '../../../components/Modal/ModalCreateProfile/ModalCreateProfile';

const AdminManage = () => {
  const navigate = useNavigate();

  const [workers, setWorkers] = useState([
    { id: 1, name: 'Carol Rodriguez Lopez', hireDate: '', contact: '' },
    { id: 2, name: 'Javi Sanchez Torres', hireDate: '', contact: '' },
    { id: 3, name: 'Ricardo Jimenez Martin', hireDate: '', contact: '' },
  ]);

  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'Soledad Ortega',
      phone: '+34526859614',
      email: 'sole_og66@gmail.com',
    },
    {
      id: 2,
      name: 'Óscar Torres',
      phone: '+34845254132',
      email: 'oscartorres@gmail.com',
    },
  ]);

  const [showCreateProfileModal, setShowCreateProfileModal] = useState(false);

  const [newProfile, setNewProfile] = useState({
    type: '',
    name: '',
    lastname: '',
    phone: '',
    email: '',
    province: '',
    city: '',
    password: '',
    repeatPassword: '',
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setNewProfile({ ...newProfile, [name]: value });
  };

  const submitProfile = (e) => {
    e.preventDefault();
    /* Según el tipo de perfil que crees se guardará de una forma u otra */
    if (newProfile.type === '2') {
      setWorkers((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          name: `${newProfile.name} ${newProfile.lastname}`,
          contact: newProfile.phone,
        },
      ]);
    } else {
      setClients((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          name: `${newProfile.name} ${newProfile.lastname}`,
          phone: newProfile.phone,
          email: newProfile.email,
        },
      ]);

      /* Limpiar el formulario una vez rellenado */
      setShowCreateProfileModal(false);
      setNewProfile({
        type: 'worker',
        name: '',
        lastname: '',
        phone: '',
        email: '',
        province: '',
        city: '',
        password: '',
        repeatPassword: '',
      });
    }
  };

  return (
    <div className="agr-page">
      <h1 className="agr-title">Registro General</h1>

      <section className="agr-section">
        <div className="agr-section-title">
          <h2 className="agr-subtitle">Tabla de trabajadores</h2>
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
      <button
        className="agr-back"
        type="button"
        onClick={() => setShowCreateProfileModal(true)}
      >
        <RiUserAddLine />
        <span>Añadir perfil</span>
      </button>
      
        <button className="agr-back" type="button" onClick={() => navigate(-1)}>
          ATRÁS
        </button>
     
 </div>
      <ModalCreateProfile
        show={showCreateProfileModal}
        onClose={() => setShowCreateProfileModal(false)}
        newProfile={newProfile}
        handleProfileChange={handleProfileChange}
        submitProfile={submitProfile}
      />

    </div>
  );
};

export default AdminManage;
