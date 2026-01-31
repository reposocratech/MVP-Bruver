import { useEffect, useState, useContext } from 'react';
import React from 'react';
import { Button } from 'react-bootstrap';
import './ModalAddReserve.css';
import { fetchData } from '../../../helpers/axiosHelper';
import { AuthContext } from '../../../contexts/AuthContext/AuthContext';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const LS_KEY = 'reserve_quick';

const pad2 = (n) => String(n).padStart(2, '0');
const formatYmd = (d) => {
  if (!d) return null;
  const dateObj = new Date(d);
  if (Number.isNaN(dateObj.getTime())) return null;
  return `${dateObj.getFullYear()}-${pad2(dateObj.getMonth() + 1)}-${pad2(dateObj.getDate())}`;
};

const ModalQuickReserve = ({ toBack }) => {
  const { token } = useContext(AuthContext);

  const [services, setServices] = useState([]);
  const [supplements, setSupplements] = useState([]);

  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [hair, setHair] = useState('');
  const [observations, setObservations] = useState('');
  const [specie, setSpecie] = useState('');


  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState('');
  const [openHours, setOpenHours] = useState(false);

  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedSupplementIds, setSelectedSupplementIds] = useState([]);

  const [duration, setDuration] = useState(0);
  const [price, setPrice] = useState('0.00');

  const [manualDuration, setManualDuration] = useState('');
  const [manualPrice, setManualPrice] = useState('');
  const [isEditingDuration, setIsEditingDuration] = useState(false);
  const [isEditingPrice, setIsEditingPrice] = useState(false);

  const [sizeCategory, setSizeCategory] = useState('');

  const isCat = String(specie) === "2";

  const hours = [
    '9:15','9:30','9:45','10:00','10:15','10:30','10:45',
    '11:15','11:30','11:45','12:00','12:15','12:30','12:45',
    '13:00','13:15','13:30'
  ];

  const saveReserve = () => {
    const finalDuration =
      manualDuration !== '' ? Number(manualDuration || 0) : Number(duration || 0);

    const finalPrice =
      manualPrice !== '' ? Number(manualPrice || 0).toFixed(2) : String(price || '0.00');

    const payload = {
      client_name: clientName || null,
      phone: phone || null,
      hair: hair || null,
      specie: specie || null,
      service_id: isCat ? null: selectedServiceId || null,
      supplement_ids: isCat ?[] : selectedSupplementIds,
      appointment_date: formatYmd(date),
      start_time: startTime || null,
      duration_minutes: isCat ? 0: finalDuration,
      total_price: isCat? "0.00": finalPrice,
      observations: observations || null
    };

    localStorage.setItem(LS_KEY, JSON.stringify(payload));
  };

  const calcTotal = (serviceId, supplementIds = []) => {
    if (!serviceId) {
      setDuration(0);
      setPrice('0.00');
      return;
    }

    const serv = services.find((s) => String(s.service_id) === String(serviceId));

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

  //condicionalm para cargar los datos si es un gato
  useEffect(() => {
  if (String(specie) === "2") {
    setSizeCategory('');
    setSelectedServiceId('');
    setSelectedSupplementIds([]);
    setDuration(0);
    setPrice('0.00');
    setManualDuration('');
    setManualPrice('');
  }
}, [specie]);

  // carga servicios y suplementos por la categoria
  useEffect(() => {
    const fetchServicesAndSupps = async () => {
      try {
        if (!sizeCategory) {
          setServices([]);
          setSupplements([]);
          setSelectedServiceId('');
          setSelectedSupplementIds([]);
          setDuration(0);
          setPrice('0.00');
          setManualDuration('');
          setManualPrice('');
          return;
        }

        const resServices = await fetchData(
          `worker/services?type=1&size_category=${sizeCategory}`,
          'GET',
          null,
          token,
        );

        const resSupp = await fetchData(
          `worker/services?type=2&size_category=${sizeCategory}`,
          'GET',
          null,
          token,
        );

        setServices(resServices?.data?.result || []);
        setSupplements(resSupp?.data?.result || []);

        // reset si cambia el tamaño
        setSelectedServiceId('');
        setSelectedSupplementIds([]);
        setDuration(0);
        setPrice('0.00');
        setManualDuration('');
        setManualPrice('');
      } catch (error) {
        console.log(error);
        setServices([]);
        setSupplements([]);
        setSelectedServiceId('');
        setSelectedSupplementIds([]);
        setDuration(0);
        setPrice('0.00');
        setManualDuration('');
        setManualPrice('');
      }
    };

    fetchServicesAndSupps();
  }, [token, sizeCategory]);

  useEffect(() => {
    localStorage.removeItem(LS_KEY);
    saveReserve();
  }, []);

  // guardar cada cambio
  useEffect(() => {
    saveReserve();
  }, [
    clientName,
    phone,
    hair,
    observations,
    date,
    startTime,
    selectedServiceId,
    selectedSupplementIds,
    duration,
    price,
    manualDuration,
    manualPrice,
    specie
  ]);

  const handleServiceChange = (e) => {
    const value = e.target.value;
    setSelectedServiceId(value);

    setSelectedSupplementIds([]);
    setManualDuration('');
    setManualPrice('');
    calcTotal(value, []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;

    const data = JSON.parse(raw);

    // Validaciones mínimas y si no es gato
    if (!data.appointment_date) return console.log('Falta fecha');
    if (!data.start_time) return console.log('Falta hora');
    if (String(data.specie) !== "2") {
    if (!data.service_id) return console.log('Falta servicio');
    if (!data.duration_minutes || Number(data.duration_minutes) <= 0)
      return console.log('Duración inválida');
  }

    try {
      const res = await fetchData('worker/appointments/quick', 'POST', data, token);
      console.log('CITA CREADA:', res.data);

      localStorage.removeItem(LS_KEY);
      toBack();
    } catch (error) {
      console.log('ERROR creando cita:', error);
    }
  };

  return (
    <section className="addReserveModal">
      <div className="addReserveGridModal">
        <div className="addReserveCardModal">
          <h3>Añadir una reserva rápida</h3>

          <form className="quickReserveForm" onSubmit={handleSubmit}>
            <label>Añadir cliente</label>
            <input
              name="client"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />

            <label>Teléfono</label>
            <input name="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />

            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label>Pelaje</label>
                <input
                  value={hair}
                  onChange={(e) => setHair(e.target.value)}
                  placeholder="Corto, largo..."
                />
              </div>

              <div style={{ width: '40%', display: 'flex', flexDirection: 'column' }}>
                <label>Especie</label>
                <select value={specie} onChange={(e) => setSpecie(e.target.value)}>
                  <option value="" disabled>Selecciona especie</option>
                  <option value="1">Perro</option>
                  <option value="2">Gato</option>
                </select>
              </div>

              <div style={{ width: '40%', display: 'flex', flexDirection: 'column' }}>
                <label>Tamaño</label>
                <select
                  value={sizeCategory}
                  onChange={(e) => setSizeCategory(e.target.value)}
                  disabled={String(specie) === "2"} //si es gato, deshabilitado
                >
                  <option value="" disabled>Selecciona tamaño</option>
                  <option value="1">Toy</option>
                  <option value="2">Pequeño</option>
                  <option value="3">Mediano</option>
                  <option value="4">Grande</option>
                </select>
              </div>
            </div>

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

            <label>Servicio</label>
            <select value={selectedServiceId} onChange={handleServiceChange} disabled={!sizeCategory || isCat}>
              <option value="" disabled>
                {sizeCategory ? 'Selecciona servicio' : 'Selecciona tamaño primero'}
              </option>
              {services.map((s) => (
                <option key={s.service_id} value={s.service_id}>
                  {s.title} ({s.duration_minutes} min) - {s.price}€
                </option>
              ))}
            </select>

            {/* para ocultar los suplementos en caso de ser gato */}
            {!isCat && selectedServiceId && (
              <>
            <label  >Suplementos</label>
            <div className="supplementsBox"> 
              {supplements.map((s) => {
                const sid = String(s.service_id);
                return (
                  <label key={sid} className="supplementCheck">
                    <input
                      type="checkbox"
                      checked={selectedSupplementIds.includes(sid)}
                      onChange={() => toggleSupplement(sid)}
                      /* disabled={!selectedServiceId} */
                    />
                    <span>{`${s.title} (+${s.duration_minutes} min) +${s.price}€`}</span>
                  </label>
                );
              })}
            </div>
            </>
            )}
            <label>Observaciones</label>
              <input
                type="text"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
              />


            <div className="resultLine">
              <label className="resultValue">
                Duración (min):
                <input
                  type="number"
                  min="0"
                  value={
                    isEditingDuration
                      ? manualDuration
                      : manualDuration !== ''
                        ? manualDuration
                        : duration > 0
                          ? String(duration)
                          : ''
                  }
                  onFocus={() => {
                    setIsEditingDuration(true);
                    if (manualDuration === '') setManualDuration(duration > 0 ? String(duration) : '');
                  }}
                  onChange={(e) => setManualDuration(e.target.value)}
                  onBlur={() => {
                    setIsEditingDuration(false);
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
                      : manualPrice !== ''
                        ? manualPrice
                        : Number(price) > 0
                          ? String(price)
                          : ''
                  }
                  onFocus={() => {
                    setIsEditingPrice(true);
                    if (manualPrice === '') setManualPrice(Number(price) > 0 ? String(price) : '');
                  }}
                  onChange={(e) => setManualPrice(e.target.value)}
                  onBlur={() => {
                    setIsEditingPrice(false);
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
                disabled={!startTime || (!manualDuration && duration === 0)}
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

export default ModalQuickReserve;
