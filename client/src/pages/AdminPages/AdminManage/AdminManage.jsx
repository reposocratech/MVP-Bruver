import { useState, useEffect } from 'react';
import { fetchData } from '../../../helpers/axiosHelper';
import { useNavigate } from 'react-router';
import { profileSchema } from '../../../schemas/ProfileSchema';
import { ZodError } from 'zod';
import './AdminManage.css';
import { RiUserAddLine } from 'react-icons/ri';
import ModalCreateProfile from '../../../components/Modal/ModalCreateProfile/ModalCreateProfile';
import ModalUserProfileEdit from "../../../components/Modal/ModalUserProfileEdit/ModalUserProfileEdit";

const initialProfile = {
  type: '',
  name_user: '',
  last_name: '',
  phone: '',
  email: '',
  province: '',
  city: '',
  address: '',
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
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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
          name_user: w.name_user,
          last_name: w.last_name,
          phone: w.phone,
          email: w.email,
          type: w.type,
          province: w.province,
          city: w.city,
          address: w.address,
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
          client_code: c.client_code,
          name_user: c.name_user,
          last_name: c.last_name,
          phone: c.phone,
          email: c.email,
          province: c.province,
          city: c.city,
          address: c.address,
          type: c.type,
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
    //cambia el is_deleted a 1 o a 0
  const handleIsDeleted = async (userId, isDeleted) => {
    try {
      const newStatus = isDeleted ? 0 : 1;
      await fetchData(`admin/user/${userId}/status/${newStatus}`, 'PUT');
      setClients(prev => prev.map(c => c.id === userId ? { ...c, is_deleted: newStatus } : c));
      setWorkers(prev => prev.map(w => w.id === userId ? { ...w, is_deleted: newStatus } : w));
    } catch (error) {
      console.error('Error al cambiar el estado:', error);
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
        name_user: profile.name_user,
        last_name: profile.last_name,
        phone: profile.phone,
        email: profile.email,
        province: profile.province,
        city: profile.city,
        address: profile.address,
        password: profile.password || profile.hashedPass,
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
          name_user: profile.name_user,
          last_name: profile.last_name,
          phone: profile.phone,
          email: profile.email,
          type: 2,
          province: profile.province,
          city: profile.city,
          address: profile.address,
        };
        setWorkers([...workers, newWorker]);
      } else if (profile.type === 'client') {
        const newClient = {
          id: clients.length + 1,
          name_user: profile.name_user,
          last_name: profile.last_name,
          phone: profile.phone,
          email: profile.email,
          province: profile.province,
          city: profile.city,
          address: profile.address,
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

  // Funcion para actualizar la tabla al editar un user
    const handleUserUpdated = (updatedUser) => {
      //es user_id o id dependiendo de si viene del back o del front. Porque depende de si lo esta editando el admin o no
      const userId = updatedUser.user_id || updatedUser.id;
      // id: userId - da consistencia para forzar a que sea id
      if (updatedUser.type === 1 || updatedUser.type === 2) {
        setWorkers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedUser, id: userId } : u));
      } else {
        setClients(prev => prev.map(u => u.id === userId ? { ...u, ...updatedUser, id: userId } : u));
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
              {workers
                .filter(w => !(w.type === 1 && w.id === 1))
                .map((w) => (
                  <tr key={w.id}>
                    <td className="agr-bold">{w.name_user} {w.last_name}</td>
                    <td>{w.phone}</td>
                    <td>{w.email}</td>
                    <td>
                      <div className="agr-actions">
                        <button className="agr-pill" type="button" onClick={() => { setSelectedUser(w); setShowEditProfileModal(true); }}>
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
                        <button className="agr-pill" type="button" onClick={() => handleIsDeleted(w.id, w.is_deleted)}>
                          {w.is_deleted ? 'DAR ALTA' : 'DAR BAJA'}
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
                <th>CODIGO CLIENTE</th>
                <th>CLIENTE</th>
                <th>TELEFONO</th>
                <th>E-MAIL</th>
                <th>ADMINISTRAR</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id}>
                  <td>{c.client_code}</td>
                  <td className="agr-bold">{c.name_user} {c.last_name}</td>
                  <td>{c.phone}</td>
                  <td>{c.email}</td>
                  <td>
                    <div className="agr-actions">
                      <button className="agr-pill" type="button" onClick={() => { console.log('Cliente seleccionado:', c);
                        setSelectedUser(c); setShowEditProfileModal(true); }}>
                        EDITAR
                      </button>
                      {/* <button className="agr-pill" type="button" onClick={() => navigate(`/profile/${c.id}`)}>
                        VER PERFIL
                      </button> */}
                      <button className="agr-pill" type="button" onClick={() => navigate(`/admin/clienthistory/${c.id}`)}>
                        VER HISTORIAL
                      </button>
                      <button className="agr-pill" type="button" onClick={() => handleIsDeleted(c.id, c.is_deleted)}>
                        {c.is_deleted ? 'DAR ALTA' : 'DAR BAJA'}
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
      {showEditProfileModal && (
        <ModalUserProfileEdit
          key={selectedUser?.id}
          onClose={() => setShowEditProfileModal(false)}
          user={selectedUser}
          onUserUpdated={handleUserUpdated}
          editClientCode={selectedUser?.type === 3}
          hideDeleteButton={true}
        />
      )}

    </div>
  );
};

export default AdminManage;
