import { useState, useEffect } from 'react';
import { fetchData } from '../../../helpers/axiosHelper';
import { useNavigate } from 'react-router';
import { profileSchema } from '../../../schemas/ProfileSchema';
import { ZodError } from 'zod';
import { RiUserAddLine } from 'react-icons/ri';
import ModalCreateProfile from '../../../components/Modal/ModalCreateProfile/ModalCreateProfile';
import './AdminManage.css';


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

const AdminManage = () => {
  
  const navigate = useNavigate();

  const [workers, setWorkers] = useState([]);
  const [clients, setClients] = useState([]);
  const [showCreateProfileModal, setShowCreateProfileModal] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [valErrors, setValErrors] = useState({});
  const [fetchError, setFetchError] = useState('');
  // Estado para forzar la recarga de datos

  // useEffect para cargar los datos de la base de datos al montar el componente y cuando cambie reload
  useEffect(() => {
    // Función para obtener trabajadores y admins
    const fetchWorkers = async () => {
      try {
        const res = await fetchData('admin/workers', 'GET');
        //console.log(res)
        const resAdmins = await fetchData('admin/admins', 'GET');
        // Mapeo de los datos ajustando los nombres
        const workersData = [
          ...res.data,
          ...resAdmins.data
        ].map((w) => ({
          id: w.user_id,
          name: `${w.name_user} ${w.last_name}`,
          phone: w.phone,
          email: w.email,
          type: w.type,
        }));
        setWorkers(workersData);
      } catch (error) {
        console.error('Error al obtener trabajadores y admins:', error);
      }
    };

    // Función para obtener clientes
    const fetchClients = async () => {
      try {
        const res = await fetchData('admin/clients', 'GET');
        // Mapeo de los datos ajustando los nombres
        const clientsData = res.data.map((c) => ({
          id: c.user_id,
          name: `${c.name_user} ${c.last_name}`,
          phone: c.phone,
          email: c.email,
        }));
        setClients(clientsData);
      } catch (error) {
        console.error('Error al obtener clientes:', error);
      }
    };

    // Llamamos a las funciones para cargar los datos
    fetchWorkers();
    fetchClients();
  }, []);

  // Cambiar tipo a admin (type = 1)
    const handleMakeAdmin = async (userId) => {
      try {
        await fetchData(`admin/makeAdmin/${userId}`, 'PUT');
        // Actualiza el tipo en el estado local
        const workersUpdated = workers.map(worker =>
          worker.id === userId ? { ...worker, type: 1 } : worker
        );
        setWorkers(workersUpdated);
      } catch (error) {
        console.error('Error al hacer admin:', error);
      }
    };
  // Cambiar tipo a trabajador (type = 2)
    const handleMakeWorker = async (userId) => {
      try {
        await fetchData(`admin/makeWorker/${userId}`, 'PUT');
        // Actualiza el tipo en el estado local
        const workersUpdated = workers.map(worker =>
          worker.id === userId ? { ...worker, type: 2 } : worker
        );
        setWorkers(workersUpdated);
      } catch (error) {
        console.error('Error al hacer trabajador:', error);
      }
    };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const submitProfile = async (e) => {
    e.preventDefault();
    setValErrors({});
    setFetchError('');
    //validación del select type (que escoja uno)
    if (!profile.type || (profile.type !== 'worker' && profile.type !== 'client')) {
      setValErrors({ type: 'Selecciona un tipo de perfil' });
      return;
    }
    try {
      //validar los campos segun el zod(recordar cambiar password)
      profileSchema.parse(profile);
      //creamos el body que guarda los datos que introducimos del modal
      const body = {
        name_user: profile.name,
        last_name: profile.lastname,
        phone: profile.phone,
        email: profile.email,
        province: profile.province,
        city: profile.city,
        password: profile.hashedPass,
        type: profile.type === 'worker' ? 2 : 3,
      };
      //enviamos solicitud al backend
      const res = await fetchData('admin/createUser', 'POST', body);
      //comprobamos el res
      console.log(res);

      //comprueba si es worker o client y lo introduce en su tabla correspondiente
      if (profile.type === 'worker') {
        const newWorker = {
          id: workers.length + 1,
          name: `${profile.name} ${profile.lastname}`,
          phone: profile.phone,
          email: profile.email,
          type: profile.type,
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
                      {w.type === 2 ? (
                        <button className="agr-pill" type="button" onClick={() => handleMakeAdmin(w.id)}>
                          HACER ADMIN
                        </button>
                      ) : w.type === 1 ? (
                        <button className="agr-pill" type="button" onClick={() => handleMakeWorker(w.id)}>
                          HACER TRABAJADOR
                        </button>
                      ) : null}
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
