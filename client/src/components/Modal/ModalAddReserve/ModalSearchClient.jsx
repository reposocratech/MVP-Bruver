import { useState } from "react";
import { Button } from "react-bootstrap";
import "./ModalAddReserve.css";
import { fetchData } from "../../../helpers/axiosHelper";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext/AuthContext";

const ModalSearchClient = ({ toBack, onAcceptClient }) => {
  const [search, setSearch] = useState("");
  const [clientsFiltered, setClientsFiltered] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  const { token } = useContext(AuthContext);

  const handleChange = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      setClientsFiltered([]);
      return;
    }

    try {

      const res = await fetchData(`worker/clients?search=${value}`, "GET", null, token);
      setClientsFiltered(res.data.result);
    } catch (error) {
      console.log(error);
      setClientsFiltered([]);
    }
  };
      const handleAccept = () => {
        if (!selectedClient) return;
        onAcceptClient(selectedClient);
      };

  return (
    <section className="addReserveModal">
      <div className="addReserveGridModal">
        <div className="addReserveCardModal">
          <h3>Buscar cliente</h3>

          <form className="quickReserveForm" onSubmit={(e) => e.preventDefault()}>
            <input
              name="search"
              value={search}
              onChange={handleChange}
              placeholder="Nombre, apellido, num o email"
              autoComplete="off"
            />
          </form>

          <div className="tableClients">
            <table>
              <thead>
                <tr>
                  <th>CLIENTE</th>
                  <th>TELÉFONO</th>
                  <th>E-MAIL</th>
                </tr>
              </thead>

              <tbody>
                {clientsFiltered.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center", padding: "12px" }}>
                      {search.trim() ? "No hay clientes con ese nombre" : ""}
                    </td>
                  </tr>
                ) : (
                  clientsFiltered.map((c) => (
                    <tr key={c.user_id}
                    onClick={() => setSelectedClient(c)}
                    className={selectedClient?.user_id === c.user_id 
                    ? "clientRow selectedClientRow" 
                    : "clientRow"}>
                      <td data-phone={c.phone} data-email={c.email}>
                        {c.name_user} {c.last_name}
                      </td>
                      <td>{c.phone}</td>
                      <td>{c.email}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div>
            <Button className="close" onClick={toBack}>Atrás</Button>
            <Button className="close" onClick={handleAccept}>Aceptar</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModalSearchClient;

