import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { fetchData } from "../../../helpers/axiosHelper";
import "./clientProfile.css";

export default function ClientProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const loadAll = async () => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }

      setLoading(true);

      const [uRes, pRes, aRes] = await Promise.all([
        fetchData("/user/profile", "GET", null, token),
        fetchData("/pet/mine", "GET", null, token),
        fetchData("/appointment/mine", "GET", null, token),
      ]);

      setUser(uRes.data.user);
      setPets(pRes.data.pets || []);
      setAppointments(aRes.data.appointments || []);
    } catch (error) {
      console.log(error)
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const goEditUser = () => navigate("/profile/edit");
  const goAddPet = () => navigate("/pets/new");
  const goEditPet = (petId) => navigate(`/pets/edit/${petId}`);

  const handleDeletePet = async (petId) => {
    const ok = window.confirm("¿Seguro que quieres eliminar esta mascota?");
    if (!ok) return;

    try {
      await fetchData(`/pet/${petId}`, "DELETE", null, token);
      // recargar mascotas
      const pRes = await fetchData("/pet/mine", "GET", null, token);
      setPets(pRes.data.pets || []);
    } catch (error) {
      console.log(error)
      alert("No se pudo eliminar la mascota.");
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Cargando perfil...</p>;
  if (!user) return <p style={{ padding: 20 }}>No se pudo cargar el perfil.</p>;

  const serverUrl = import.meta.env.VITE_SERVER_URL || "";
  const userImg = user.picture_user
    ? `${serverUrl}/images/users/${user.picture_user}`
    : "https://via.placeholder.com/300x300?text=Foto";

  return (
    <div className="client-profile">
      <section className="info-card">
        <div className="info-left">
          <div className="info-title-row">
            <h2>Información</h2>
            <button className="link-btn" onClick={goEditUser}>
              ✎ Editar
            </button>
          </div>

          <div className="info-box">
            <p>{user.name_user} {user.last_name || ""}</p>
            <p>{user.email}</p>
            <p>{user.phone}</p>
          </div>
        </div>

        <div className="info-right">
          <img className="info-photo" src={userImg} alt="Foto perfil" />
        </div>
      </section>

      <section className="pets-section">
        <div className="section-title-row">
          <h1>Mis mascotas</h1>
          <button className="add-btn" onClick={goAddPet}>＋ Añadir</button>
        </div>

        {pets.length === 0 ? (
          <p className="empty-msg">Aún no tienes mascotas registradas.</p>
        ) : (
          <div className="pets-grid">
            {pets.map((pet) => {
              const petImg = pet.picture_pet
                ? `${serverUrl}/images/pets/${pet.picture_pet}`
                : "https://via.placeholder.com/400x300?text=Mascota";

              return (
                <div key={pet.pet_id} className="pet-card">
                  <img className="pet-img" src={petImg} alt={pet.name_pet} />
                  <div className="pet-name">{pet.name_pet}</div>

                  <div className="pet-actions">
                    <button className="pet-btn" onClick={() => goEditPet(pet.pet_id)}>
                      EDITAR
                    </button>
                    <button className="pet-btn danger" onClick={() => handleDeletePet(pet.pet_id)}>
                      ELIMINAR
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      
      <section className="appointments-section">
        <h1>Mis citas</h1>

        {appointments.length === 0 ? (
          <p className="empty-msg">No tienes citas todavía.</p>
        ) : (
          <div className="table-wrap">
            <table className="app-table">
              <thead>
                <tr>
                  <th>HORA</th>
                  <th>DÍA DE RESERVA</th>
                  <th>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.appointment_id}>
                    <td>{String(a.start_time).slice(0, 5)}</td>
                    <td>{String(a.appointment_date).slice(0, 10)}</td>
                    <td>{Number(a.total_price).toFixed(2)}€</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}