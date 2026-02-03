import React, { useContext, useEffect , useState} from "react";
import { AuthContext } from "../../../contexts/AuthContext/AuthContext";
import { fetchData } from "../../../helpers/axiosHelper";
import { Button } from "react-bootstrap";
import "./UsersServicesAppointment.css"

export const UsersServicesAppointment = ({
  setCurrentAppointment,
  selectedPet,

  sumaTotalPrecio,
  setSumaTotalPrecio,

  sumaTotalMinutos,
  setSumaTotalMinutos,

  baseServicePrice,
  setBaseServicePrice,

  baseServiceMinutes,
  setBaseServiceMinutes,

  baseServiceId,
  setBaseServiceId,

  extrasIds,
  setExtrasIds,
  minutesToHour
}) => {

  const { token } = useContext(AuthContext);
      const [services, setServices] = useState([]);
  

  
  useEffect(() => {
    const fetchService = async () => {
      try {
        if (!token || !selectedPet) return;
        const res = await fetchData(
          `service/getServiceByPetId/${selectedPet.pet_id}`,
          "GET",
          null,
          token
        );
        setServices(res.data.services);
        console.log(res.data.services)
      } catch (error) {
        console.log(error);
      }
    };
    fetchService();
  }, [token, selectedPet]);

  const baseServices = services.filter((s) => Number(s.type) === 1);
  const extras = services.filter((s) => Number(s.type) === 2);

  const sumarValor = (setState, cantidad, storageKey) => {
    setState(prev => {
      const total = prev + Number(cantidad);
      localStorage.setItem(storageKey, total);
      return total;
    });
  };

  //Cada vez que clickas:
  const seleccionarBaseService = (service) => {
    //Quitas el servicio base anterior (precio)
    sumarValor(setSumaTotalPrecio, -baseServicePrice, "totalPrecio");
    //Añades el nuevo servicio base 
    sumarValor(setSumaTotalPrecio, service.price, "totalPrecio");

    //Quitas el servicio base anterior (minutos)
    sumarValor(setSumaTotalMinutos, -baseServiceMinutes, "totalMinutos");
    //Añades el nuevo servicio base 
    sumarValor(setSumaTotalMinutos, service.duration_minutes, "totalMinutos");

    //Nuevo servicio seleccionado
    setBaseServiceId(service.service_id);
    //Cuanto cuesta
    setBaseServicePrice(Number(service.price));
    //Cuanto dura
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
          {baseServices.map((s, idx) => {
            // Asignar imagen según el índice del servicio
            const serviceImages = [
              '/img/appointment/servicio1.jpg',
              '/img/appointment/servicio2.jpg',
              '/img/appointment/servicio3.jpg',
            ];
            return (
              <div
                key={s.service_id}
                className={`servicesCard ${
                  baseServiceId === s.service_id ? "selected" : ""
                }`}
              >
                <img src={serviceImages[idx] || serviceImages[0]} alt={s.title} />
                <h3>{s.title}</h3>
                <p>{s.duration_minutes} min</p>
                <h3>{Number(s.price).toFixed(2)}€</h3>

                <button
                  className={baseServiceId === s.service_id ? "select-btn selected" : "select-btn"}
                  onClick={() =>{
                    setBaseServiceId(s.service_id); 
                    seleccionarBaseService(s); 
                  }}
                > SELECCIONAR </button>

              </div>
            );
          })}
        </div>
      </section>

      <h2>Selecciona tus suplementos</h2>

      <section className="supplements">
        <div className="supplementsGrid">
          {extras.map((s, idx) => {
            const selected = extrasIds.includes(s.service_id);
            // Asignar imagen según el índice del suplemento
            const supplementImages = [
              '/img/appointment/nudos.png',
              '/img/appointment/deslanado.png',
            ];
            return (
              <div
                key={s.service_id}
                className={`supplementsCard ${selected ? "selected" : ""}`}
              >
                <div className="imgAndButton">
                <div className="imgSuple"><img src={supplementImages[idx] || supplementImages[0]} alt={s.title} /> </div>
                <button
                  className={selected ? "select-btn selected" : "select-btn"}
                  onClick={() => {toggleExtra(s.service_id);
                  sumarValor(setSumaTotalPrecio, selected ? -s.price : s.price);
                  sumarValor(setSumaTotalMinutos, selected ? -s.duration_minutes : s.duration_minutes);
                }}
                >

                  {selected ? "QUITAR" : "AÑADIR"}
                </button>
                </div>
                <div className="suplDates">
                <h3>{s.title}</h3>
                <p>{s.duration_minutes} min</p>
                <h3>{Number(s.price).toFixed(2)}€</h3>
               
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <div className="servicesActions">
        <div className="infoAppoint">
      <h3><img src='/img/appointment/clock.png' />{minutesToHour(sumaTotalMinutos)}</h3>
      <h3><img src='/img/appointment/cart.png' />{sumaTotalPrecio.toFixed(2)}€</h3>
      </div>
        <div className="buttons">
          <button onClick={() => setCurrentAppointment(1)} className="back-btn">
            VOLVER
          </button>
          <button
            className="back-btn"
            /* disabled={!baseServiceId} */
             onClick={() => setCurrentAppointment(3)}>
            SIGUIENTE
          </button>
        </div>
      </div>
    </section>
  );
}
