import { useState } from 'react';
import { fetchData } from '../../../helpers/axiosHelper';
import { useNavigate } from 'react-router';
import { profileSchema } from '../../../schemas/ProfileSchema';
import { ZodError } from 'zod';
import './AdminManage.css';
import { RiUserAddLine } from 'react-icons/ri';
import ModalCreateProfile from '../../../components/Modal/ModalCreateProfile/ModalCreateProfile';

const initialProfile = {
  type: '',
  name: '',
  lastname: '',
  phone: '',
  email: '',
  province: '',
  city: '',
  password: '',
  repeatPassword: '',
};

const initialWorkers = [
  { id: 1, name: 'Carol Rodriguez Lopez', phone: '+34678965412', email: 'Carol.Rodriguez@gmail.com' },
  { id: 2, name: 'Javi Sanchez Torres', phone: '+34678965413', email: 'Javi.Sanchez@gmail.com' }
];
const initialClients = [
  { id: 1, name: 'Soledad Ortega', phone: '+34526859614', email: 'sole_og66@gmail.com' },
  { id: 2, name: 'Óscar Torres', phone: '+34845254132', email: 'oscartorres@gmail.com' }
];


const AdminManage = () => {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState(initialWorkers);
  const [clients, setClients] = useState(initialClients);
  const [showCreateProfileModal, setShowCreateProfileModal] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [valErrors, setValErrors] = useState({});
  const [fetchError, setFetchError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const submitProfile = async (e) => {
    e.preventDefault();
    setValErrors({});
    setFetchError('');
    //validación del select type
    if (!profile.type || (profile.type !== 'worker' && profile.type !== 'client')) {
      setValErrors({ type: 'Selecciona un tipo de perfil' });
      return;
    }
      console.log('submitProfile ejecutado'); // DEPURACIÓN: Ver si se ejecuta al pulsar ACEPTAR
      console.log('Datos del perfil:', profile); // DEPURACIÓN: Ver los datos que llegan del formulario
    try {
      //validar los campos
      profileSchema.parse(profile);
      //creamos el body que guarda los datos que introducimos del modal
      const body = {
        name_user: profile.name,
        last_name: profile.lastname,
        phone: profile.phone,
        email: profile.email,
        province: profile.province,
        city: profile.city,
        password: profile.password,
        type: profile.type === 'worker' ? 2 : 3,
      };
      //enviamos solicitud al backend
      const res =await fetchData('user/register', 'POST', body);
      //comprobamos el res
      console.log(res);

      //comprueba si es worker o client y lo introduce en su tabla correspondiente
      if (profile.type === 'worker') {
        const newWorker = {
          id: workers.length + 1,
          name: `${profile.name} ${profile.lastname}`,
          phone: profile.phone,
          email: profile.email,
        };
        setWorkers([...workers, newWorker]);
      } else if (profile.type === 'client') {
        const newClient = {
          id: clients.length + 1,
          name: `${profile.name} ${profile.lastname}`,
          phone: profile.phone,
          email: profile.email,
        };
        setClients([...clients, newClient]);
      }
      //cerramos el formulario y seteamos los campos a vacío
      setShowCreateProfileModal(false);
      setProfile(initialProfile);
    } catch (error) {
      console.log('ERROR REAL:', error); // DEPURACIÓN: Mostrar el error real
      if (error instanceof ZodError) {
        const fieldsErrors = {};
        error.issues.forEach((elem) => {
          fieldsErrors[elem.path[0]] = elem.message;
        });
        setValErrors(fieldsErrors);
      } else {
        setValErrors({});
        if (error.response?.data?.errno === 1062) {
          setFetchError('Email repetido usa otro');
        } else {
          setFetchError('Upss, hay algún error chungo');
        }
      }
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
                <th>TELÉFONO</th>
                <th>E-MAIL</th>
                <th>ADMINISTRAR</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w) => (
                <tr key={w.id}>
                  <td className="agr-bold">{w.name}</td>
                  <td>{w.phone}</td>
                  <td>{w.email}</td>
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
        newProfile={profile}
        handleProfileChange={handleChange}
        submitProfile={submitProfile}
        valErrors={valErrors}
        fetchError={fetchError}
      />

    </div>
  );
};

export default AdminManage;
