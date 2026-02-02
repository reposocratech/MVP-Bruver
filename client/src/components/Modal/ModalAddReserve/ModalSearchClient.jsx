import { useState, useContext } from 'react';
import { Button } from 'react-bootstrap';
import { fetchData } from '../../../helpers/axiosHelper';
import { AuthContext } from '../../../contexts/AuthContext/AuthContext';
import styles from './ModalSearchClient.module.css';

const ModalSearchClient = ({ toBack, onAcceptClient }) => {
  const [search, setSearch] = useState('');
  const [clients, setClients] = useState([]);
  const [selected, setSelected] = useState(null);
  const { token } = useContext(AuthContext);

  const handleChange = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (!value.trim()) {
      setClients([]);
      return;
    }

    const res = await fetchData(
      `worker/clients?search=${value}`,
      'GET',
      null,
      token
    );

    setClients(res.data.result || []);
  };

  return (
    <section className={styles.modal}>
      <div className={styles.card}>
        <h3>Buscar cliente</h3>

        <input
          className={styles.searchInput}
          value={search}
          onChange={handleChange}
          placeholder="Nombre, teléfono o email"
          autoComplete="off"
        />

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan="3" className={styles.empty}>
                    {search ? 'No hay clientes con ese criterio' : ''}
                  </td>
                </tr>
              ) : (
                clients.map((c) => (
                  <tr
                    key={c.user_id}
                    onClick={() => setSelected(c)}
                    className={
                      selected?.user_id === c.user_id
                        ? styles.activeRow
                        : styles.row
                    }
                  >
                    <td>{c.name_user} {c.last_name}</td>
                    <td>{c.phone}</td>
                    <td>{c.email}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.actions}>
          <Button onClick={toBack}>Atrás</Button>
          <Button onClick={() => selected && onAcceptClient(selected)}>
            Aceptar
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ModalSearchClient;
