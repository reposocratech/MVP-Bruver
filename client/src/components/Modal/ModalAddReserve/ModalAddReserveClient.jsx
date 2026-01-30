import { useEffect, useState, useContext } from 'react';
import { Button } from 'react-bootstrap';
import './ModalAddReserve.css';
import { fetchData } from '../../../helpers/axiosHelper';
import { AuthContext } from '../../../contexts/AuthContext/AuthContext';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const LS_KEY = 'reserve_client';

const pad2 = (n) => String(n).padStart(2, '0');

const formatYmd = (d) => {
  if (!d) return null;
  const dateObj = new Date(d);
  if (Number.isNaN(dateObj.getTime())) return null;

  return `${dateObj.getFullYear()}-${pad2(dateObj.getMonth() + 1)}-${pad2(
    dateObj.getDate(),
  )}`;
};

const ModalAddReserveClient = ({ toBack, client }) => {
  const { token } = useContext(AuthContext);

  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);
  const [supplements, setSupplements] = useState([]);

  const [selectedPetId, setSelectedPetId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedSupplementIds, setSelectedSupplementIds] = useState([]);

  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState('');
  const [observations, setObservations] = useState('');

  const [duration, setDuration] = useState(0);
  const [price, setPrice] = useState('0.00');

  const [manualDuration, setManualDuration] = useState('');
  const [manualPrice, setManualPrice] = useState(''); 

  const [isEditingDuration, setIsEditingDuration] = useState(false);
  const [isEditingPrice, setIsEditingPrice] = useState(false);


  const hours = [
    '9:15','9:30','9:45','10:00','10:15','10:30','10:45','11:15','11:30','11:45','12:00','12:15','12:30','12:45','13:00','13:15','13:30','14:00','14:15','14:30','14:45','15:00','15:15','15:30','15:45','16:00','16:15','16:30','16:45',
  ];

  const [openHours, setOpenHours] = useState(false);

  const petSelected = pets.find(
    (p) => String(p.pet_id) === String(selectedPetId),
  );
  const isSpecie2 = Number(petSelected?.specie) === 2;

  //guardar los valores
  const saveReserve = (extra = {}) => {
    const finalDuration =
    manualDuration !== '' ? Number(manualDuration || 0) : Number(duration || 0);

    const finalPrice = manualPrice !== '' ? Number(manualPrice || 0).toFixed(2) : String(price || '0.00');


    const payload = {
      client: {
        user_id: client?.user_id,
        name_user: client?.name_user,
        last_name: client?.last_name,
        phone: client?.phone,
        email: client?.email,
      },

      pet_id: selectedPetId || null,

      // para quitar servicios si es gato
      service_id: isSpecie2 ? null : selectedServiceId || null,
      supplement_ids: isSpecie2 ? [] : selectedSupplementIds,
      observations: isSpecie2 ? observations : '',
      date: formatYmd(date),
      start_time: startTime || null,
      duration_minutes: finalDuration,
      total_price: finalPrice,
      ...extra,
    };

    localStorage.setItem(LS_KEY, JSON.stringify(payload));
  };

  const calcTotal = (serviceId, supplementIds = []) => {
    if (!serviceId) {
      setDuration(0);
      setPrice('0.00');
      return;
    }

    const serv = services.find(
      (s) => String(s.service_id) === String(serviceId),
    );

    const selectedSupps = supplements.filter((s) =>
      supplementIds.includes(String(s.service_id)),
    );

    const extraMinutes = selectedSupps.reduce(
      (acc, s) => acc + Number(s.duration_minutes || 0),
      0,
    );

    const extraPrice = selectedSupps.reduce(
      (acc, s) => acc + Number(s.price || 0),
      0,
    );

    const totalMinutes = Number(serv?.duration_minutes || 0) + extraMinutes;
    const totalPrice = Number(serv?.price || 0) + extraPrice;

    setDuration(totalMinutes);
    setPrice(totalPrice.toFixed(2));
  };

  const toggleSupplement = (id) => {
    const sid = String(id);

    const next = selectedSupplementIds.includes(sid)
      ? selectedSupplementIds.filter((x) => x !== sid)
      : [...selectedSupplementIds, sid];

    setSelectedSupplementIds(next);
    calcTotal(selectedServiceId, next);
  };

  useEffect(() => {
    if (client?.user_id) {
      localStorage.removeItem(LS_KEY);
      saveReserve({
        pet_id: null,
        service_id: null,
        supplement_ids: [],
        start_time: null,
        duration_minutes:
          manualDuration !== '' ? Number(manualDuration) : duration,
        total_price:
          manualPrice !== '' ? Number(manualPrice).toFixed(2) : price,
      });
    }
  }, [client?.user_id]);

  useEffect(() => {
    if (!client?.user_id) return;
    saveReserve();
  }, [
    selectedPetId,
    selectedServiceId,
    selectedSupplementIds,
    date,
    startTime,
    duration,
    price,
    observations,
    manualDuration,
    manualPrice,
  ]);

  // Cargar mascotas del cliente
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetchData(
          `worker/pets/${client.user_id}`,
          'GET',
          null,
          token,
        );
        setPets(res.data.result);
      } catch (error) {
        console.log(error);
        setPets([]);
      }
    };

    if (client?.user_id) fetchPets();
  }, [client, token]);

  // Después de elegir mascota, cargamos servicios
  useEffect(() => {
    const servicesAndSupplements = async () => {
      try {
        const petSelectedLocal = pets.find(
          (p) => String(p.pet_id) === String(selectedPetId),
        );
        if (!petSelectedLocal) return;

        // Si la especie es 2 (gato) no habrá ni servicios ni suplementos
        if (Number(petSelectedLocal.specie) === 2) {
          setServices([]);
          setSupplements([]);
          setSelectedServiceId('');
          setSelectedSupplementIds([]);
          setManualDuration('');
          setManualPrice('');
          setObservations('');
          return;
        }

        const size = petSelectedLocal.size_category;

        const resServices = await fetchData(
          `worker/services?type=1&size_category=${size}`,
          'GET',
          null,
          token,
        );

        const resSupp = await fetchData(
          `worker/services?type=2&size_category=${size}`,
          'GET',
          null,
          token,
        );

        setServices(resServices.data.result || []);
        setSupplements(resSupp.data.result || []);

        setSelectedServiceId('');
        setSelectedSupplementIds([]);
        setDuration(0);
        setPrice('0.00');
        setObservations('');
      } catch (error) {
        console.log(error);
        setServices([]);
        setSupplements([]);
        setSelectedServiceId('');
        setSelectedSupplementIds([]);
        setDuration(0);
        setPrice('0.00');
      }
    };

    if (selectedPetId) servicesAndSupplements();
  }, [selectedPetId, pets, token]);

  const handlePetChange = (e) => {
    setSelectedPetId(e.target.value);
  };

  const handleServiceChange = (e) => {
    const value = e.target.value;
    setSelectedServiceId(value);

    // para reiniciar los suplementos si cambiamos de servicio
    setSelectedSupplementIds([]);
    setManualDuration('');
    setManualPrice('');
    calcTotal(value, []);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('localStorage:', localStorage.getItem(LS_KEY));
  };

  return (
    <section className="addReserveModal">
      <div className="addReserveGridModal">
        <div className="addReserveCardModal">
          <h3>Añadir reserva</h3>

          <form className="quickReserveForm" onSubmit={handleSubmit}>
            <label>
              Cliente: {client.name_user} {client.last_name}
            </label>

            <div className="selectDate">
              <h2 className="selectDateTitle">Selecciona la fecha</h2>

              <div className="calendarAndHours">
                <div className="calendar-container">
                  <Calendar
                    onChange={(d) => {
                      setDate(d);
                      setOpenHours(false);
                    }}
                    value={date}
                    selectRange={false}
                  />
                </div>

                <div className="hourColumn">
                  <label className="hourLabel">Hora</label>

                  <div className="hourSelectWrap">
                    <button
                      type="button"
                      className="hourSelectBtn"
                      onClick={() => setOpenHours(!openHours)}
                    >
                      {startTime ? startTime : 'Selecciona una hora'}
                      <span className="hourChevron">▾</span>
                    </button>

                    {openHours && (
                      <div className="hourDropdown">
                        {hours.map((h) => (
                          <button
                            key={h}
                            type="button"
                            className={`hourOption ${startTime === h ? 'active' : ''}`}
                            onClick={() => {
                              setStartTime(h);
                              setOpenHours(false);
                            }}
                          >
                            {h}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <label>Mascota</label>
            <select value={selectedPetId} onChange={handlePetChange}>
              <option value="" disabled>
                Selecciona una mascota
              </option>
              {pets.map((p) => (
                <option key={p.pet_id} value={p.pet_id}>
                  {p.name_pet}
                </option>
              ))}
            </select>
            
            {isSpecie2 ? (
              <>
                <label>Observaciones</label>
                <input
                  type="text"
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Escribe aquí..."
                />
              </>
            ) : (
              <>
                <label>Servicio</label>
                <select
                  value={selectedServiceId}
                  onChange={handleServiceChange}
                  disabled={!selectedPetId}
                >
                  <option value="" disabled>
                    {selectedPetId
                      ? 'Selecciona servicio'
                      : 'Elige mascota primero'}
                  </option>
                  {services.map((s) => (
                    <option key={s.service_id} value={s.service_id}>
                      {s.title} ({s.duration_minutes} min) - {s.price}€
                    </option>
                  ))}
                </select>

                <label>Suplementos</label>
                <div className="supplementsBox">
                  {supplements.map((s) => {
                    const sid = String(s.service_id);
                    return (
                      <label key={sid} className="supplementCheck">
                        <input
                          type="checkbox"
                          checked={selectedSupplementIds.includes(sid)}
                          onChange={() => toggleSupplement(sid)}
                          disabled={!selectedServiceId}
                        />
                        <span>
                          {s.title} (+{s.duration_minutes} min) +{s.price}€
                        </span>
                      </label>
                    );
                  })}
                </div>
              </>
            )}

            <div className="resultLine">
              <label className="resultValue">
                Duración (min):
                <input
                  type="number"
                  min="0"
                  value={
                    isEditingDuration
                      ? manualDuration
                      : (manualDuration !== '' ? manualDuration : (duration > 0 ? String(duration) : ''))
                  }
                  onFocus={() => {
                    setIsEditingDuration(true);
                    if (manualDuration === '') setManualDuration(duration > 0 ? String(duration) : '');
                  }}
                  onChange={(e) => setManualDuration(e.target.value)} 
                  onBlur={() => {
                    setIsEditingDuration(false);
                    // si lo deja vacío, vuelve a automático (fallback cuando NO está editando)
                    if (manualDuration !== '' && Number(manualDuration) < 0) setManualDuration('');
                  }}
                  style={{ width: '90px', marginLeft: '10px' }}
                />

              </label>
            </div>

            <div className="resultLine">
              <label className="resultValue">
                Precio (€):
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    isEditingPrice
                      ? manualPrice
                      : (manualPrice !== '' ? manualPrice : (Number(price) > 0 ? String(price) : ''))
                  }
                  onFocus={() => {
                    setIsEditingPrice(true);
                    if (manualPrice === '') setManualPrice(Number(price) > 0 ? String(price) : '');
                  }}

                  onChange={(e) => setManualPrice(e.target.value)} 
                  onBlur={() => {
                    setIsEditingPrice(false);
                    // si lo deja vacío, vuelve a automático
                    if (manualPrice !== '' && Number(manualPrice) < 0) setManualPrice('');
                    else if (manualPrice !== '') setManualPrice(Number(manualPrice).toFixed(2));
                  }}
                  style={{ width: '90px', marginLeft: '10px' }}
                />

              </label>
            </div>

            <div>
              <Button
                className="close"
                type="submit"
                disabled={(!isSpecie2 && !selectedServiceId) || !startTime}
              >
                Aceptar
              </Button>
              <Button className="close" onClick={toBack} type="button">
                Atrás
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ModalAddReserveClient;
