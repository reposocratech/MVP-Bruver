import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import { fetchData } from '../../../helpers/axiosHelper';
import { AuthContext } from '../../../contexts/AuthContext/AuthContext';
import './AdminSeeUserProfile.css';

const AdminSeeUserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetchData(`admin/user/${id}`, 'GET', null, token);
        setUser(res.data.user);
      } catch (error) {
        console.log(error);
        setError('No se pudo cargar el perfil.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, token]);

  if (loading) return <div className="admin-profile-page">Cargando...</div>;
  if (error) return <div className="admin-profile-page error">{error}</div>;
  if (!user) return <div className="admin-profile-page">Usuario no encontrado</div>;

  return (
    <div className="admin-profile-page">
      <h1>Perfil de {user.name_user} {user.last_name}</h1>
      <div className="admin-profile-card">
        <p><strong>Nombre:</strong> {user.name_user} {user.last_name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Teléfono:</strong> {user.phone}</p>
        <p><strong>Tipo:</strong> {user.type === 1 ? 'Administrador' : user.type === 2 ? 'Trabajador' : 'Cliente'}</p>
        <p><strong>Provincia:</strong> {user.province}</p>
        <p><strong>Ciudad:</strong> {user.city}</p>
        <p><strong>Dirección:</strong> {user.address}</p>
        {user.client_code && <p><strong>Código cliente:</strong> {user.client_code}</p>}
      </div>
      <button className="back-btn" onClick={() => navigate(-1)}>Volver</button>
    </div>
  );
};

export default AdminSeeUserProfile;
