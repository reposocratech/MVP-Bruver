import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import { fetchData } from "../../helpers/axiosHelper";
import { Button } from "react-bootstrap";

export const UsersServicesAppointment = () => {
  const navigate = useNavigate();
  const {petId} = useParams();

  const { token } = useContext(AuthContext);

  const [sumaTotalPrecio, setSumaTotalPrecio] = useState(0);
  const [sumaTotalMinutos, setSumaTotalMinutos] = useState(0);

  const [baseServicePrice, setBaseServicePrice] = useState(0);
  const [baseServiceMinutes, setBaseServiceMinutes] = useState(0);

  const [services, setServices] = useState([]);
  const [baseServiceId, setBaseServiceId] = useState(null);
  const [extrasIds, setExtrasIds] = useState([]);

  useEffect(() => {
  const fetchService = async () => {
    try {
      if (!token) return;

      const res = await fetchData(
        `service/getServiceByPetId/${petId}`,
        "GET",
        null,
        token
      );

      setServices(res.data.services);

    } catch (error) {
      console.log(error);
    }
  };

  fetchService();
}, [token, petId, navigate]);

  const baseServices = services.filter((s) => Number(s.type) === 1);
  const extras = services.filter((s) => Number(s.type) === 2);

  const sumarValor = (setState, cantidad, storageKey) => {
    setState(prev => {
      const total = prev + Number(cantidad);
      localStorage.setItem(storageKey, total);
      return total;
    });
  };

  const seleccionarBaseService = (service) => {
    // Precio
    sumarValor(setSumaTotalPrecio, -baseServicePrice, "totalPrecio");
    sumarValor(setSumaTotalPrecio, service.price, "totalPrecio");

    // Minutos
    sumarValor(setSumaTotalMinutos, -baseServiceMinutes, "totalMinutos");
    sumarValor(setSumaTotalMinutos, service.duration_minutes, "totalMinutos");

    setBaseServiceId(service.service_id);
    setBaseServicePrice(Number(service.price));
    setBaseServiceMinutes(Number(service.duration_minutes));
  };

  const toggleExtra = (id) => {
    if (extrasIds.includes(id)) {
      setExtrasIds(extrasIds.filter((x) => x !== id));
    } else {
      setExtrasIds([...extrasIds, id]);
    }
  };


  return (
    <section className="servicesPage">
      <h2>Selecciona tu servicio</h2>

      <section className="services">
        <div className="servicesGrid">
          {baseServices.map((s) => {
            return (
              <div
                key={s.service_id}
                className={`servicesCard ${
                  baseServiceId === s.service_id ? "selected" : ""
                }`}
              >
                <img src="" alt={s.title} />
                <h3>{s.title}</h3>
                <p>{s.duration_minutes} min</p>
                <h3>{Number(s.price).toFixed(2)}€</h3>

                <Button className="select-btn" onClick={() =>{
                  setBaseServiceId(s.service_id); 
                  seleccionarBaseService(s); 
                }} > SELECCIONAR </Button>

              </div>
            );
          })}
        </div>
      </section>

      <h2>Selecciona tus suplementos</h2>

      <section className="supplements">
        <div className="supplementsGrid">
          {extras.map((s) => {
            const selected = extrasIds.includes(s.service_id);

            return (
              <div
                key={s.service_id}
                className={`supplementsCard ${selected ? "selected" : ""}`}
              >
                <img src="" alt={s.title} />
                <h3>{s.title}</h3>
                <p>{s.duration_minutes} min</p>
                <h3>{Number(s.price).toFixed(2)}€</h3>

                <Button className="select-btn" onClick={() => {toggleExtra(s.service_id);
                  sumarValor(setSumaTotalPrecio, selected ? -s.price : s.price, "totalPrecio");
                  sumarValor(setSumaTotalMinutos, selected ? -s.duration_minutes : s.duration_minutes, "totalMinutos");
                }}>
                  {selected ? "QUITAR" : "AÑADIR"}
                </Button>
              </div>
            );
          })}
        </div>
      </section>

      <h3>minutos/{sumaTotalMinutos.toFixed(2)}</h3>
      <h3>carrito/{sumaTotalPrecio.toFixed(2)}€</h3>
      <div className="servicesActions">
        <Button onClick={() => navigate(-1)} className="back-btn">
          VOLVER
        </Button>

        <Button className="next-btn" disabled={!baseServiceId}>
          SIGUIENTE
        </Button>
      </div>
    </section>
  );
}
