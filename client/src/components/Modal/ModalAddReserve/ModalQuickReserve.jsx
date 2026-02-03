import  { useEffect, useState, useContext } from 'react';
import { Button } from 'react-bootstrap';
import { fetchData } from '../../../helpers/axiosHelper';
import { AuthContext } from '../../../contexts/AuthContext/AuthContext';
import { formatDate } from '../../../helpers/buildDateHelper';
import './ModalQuickReserve.css';


const LS_KEY = 'reserve_quick';

const ModalQuickReserve = ({ toBack, dateStartTime, setAppoiment, onCloseAll }) => {
  const { token, user } = useContext(AuthContext);
  
  const [services, setServices] = useState([]);
  const [supplements, setSupplements] = useState([]);

  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [hair, setHair] = useState('');
  const [observations, setObservations] = useState('');
  const [specie, setSpecie] = useState('');

  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedSupplementIds, setSelectedSupplementIds] = useState([]);

  const [duration, setDuration] = useState(0);
  const [price, setPrice] = useState('0.00');

  const [manualDuration, setManualDuration] = useState('');
  const [manualPrice, setManualPrice] = useState('');
  const [isEditingDuration, setIsEditingDuration] = useState(false);
  const [isEditingPrice, setIsEditingPrice] = useState(false);

  const [sizeCategory, setSizeCategory] = useState('');

  const isCat = String(specie) === '2';

  const saveReserve = () => {
    const finalDuration =
      manualDuration !== '' ? Number(manualDuration || 0) : Number(duration || 0);

    const finalPrice =
      manualPrice !== '' ? Number(manualPrice || 0).toFixed(2) : String(price || '0.00');

    const data = {
      client_name: clientName || null,
      phone: phone || null,
      hair: hair || null,
      specie: specie || null,

      service_id: isCat ? null : selectedServiceId || null,
      supplement_ids: isCat ? [] : selectedSupplementIds,

      appointment_date: formatDate(dateStartTime.toString()),
      start_time: dateStartTime.toString().split(" ")[4],

      duration_minutes: isCat ? 0 : finalDuration,
      total_price: isCat ? '0.00' : finalPrice,
      observations: observations || null,
    };

    localStorage.setItem(LS_KEY, JSON.stringify(data));
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

     let extraMinutes = 0
     let extraPrice = 0

    selectedSupps.forEach((s) => {
      extraMinutes += Number(s.duration_minutes || 0)
      extraPrice += Number(s.price || 0)
    })

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

  // si es gato, limpiamos servicios/suplementos y precios
  useEffect(() => {
  if (String(specie) !== '2') return;
  setTimeout(() => {
    setSizeCategory('');
    setSelectedServiceId('');
    setSelectedSupplementIds([]);
    setDuration(0);
    setPrice('0.00');
    setManualDuration('');
    setManualPrice('');
  }, 0);
}, [specie]);


  // carga servicios y suplementos por categoria
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

    const res = await fetchData(
      `service?size_category=${sizeCategory}`,
        'GET',
        null,
        token
        );

        const allServices = res.data.services || [];

        const servicesList = allServices.filter((s) => s.type === 1);
        const supplementsList = allServices.filter((s) => s.type === 2);

        setServices(servicesList);
        setSupplements(supplementsList);


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
    selectedServiceId,
    selectedSupplementIds,
    duration,
    price,
    manualDuration,
    manualPrice,
    specie,
    sizeCategory,
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


    try {
      const res = await fetchData('appointment/quick', 'POST', data, token);
      console.log('CITA CREADA:', res.data);

      // Refrescar lista de citas del admin/empleado que muestra el calendario
      try {
        const resAppointments = await fetchData(`appointment/getAdminAppoiment/${user?.user_id}`, 'GET', null, token);
        if (setAppoiment) setAppoiment(resAppointments.data.result || []);
      } catch (err) {
        console.log('No se pudo refrescar la lista de citas:', err);
      }

      localStorage.removeItem(LS_KEY);
      if (onCloseAll) onCloseAll();
      else toBack();
    } catch (error) {
      console.log('error al crear la cita:', error);
    }
  };

  return (
    <section className="addReserveModal">
      <div className="addReserveGridModal">
        <div className="addReserveCardModal">
          <h3>Añadir una reserva rápida</h3>

          <form className="quickReserveForm" onSubmit={handleSubmit}>
            {/* AQUÍ SE MOSTRARÁ LA FECHA Y LA HORA */}
            <label>fecha y hora </label>
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
                  disabled={String(specie) === '2'}
                >
                  <option value="" disabled>Selecciona tamaño</option>
                  <option value="1">Toy</option>
                  <option value="2">Pequeño</option>
                  <option value="3">Mediano</option>
                  <option value="4">Grande</option>
                </select>
              </div>
            </div>

            <label>Servicio</label>
            <select
              value={selectedServiceId}
              onChange={handleServiceChange}
              disabled={!sizeCategory || isCat}
            >
              <option value="" disabled>
                {sizeCategory ? 'Selecciona servicio' : 'Selecciona tamaño primero'}
              </option>
              {services.map((s) => (
                <option key={s.service_id} value={s.service_id}>
                  {s.title} ({s.duration_minutes} min) - {s.price}€
                </option>
              ))}
            </select>

            {!isCat && selectedServiceId && (
              <>
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
                    if (manualDuration === '')
                      setManualDuration(duration > 0 ? String(duration) : '');
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
                    if (manualPrice === '')
                      setManualPrice(Number(price) > 0 ? String(price) : '');
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
                disabled={!sizeCategory && !isCat}
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
