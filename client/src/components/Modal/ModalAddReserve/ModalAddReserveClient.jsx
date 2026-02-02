import React, { useEffect, useState, useContext } from 'react';
import { Button } from 'react-bootstrap';
import './ModalAddReserve.css';
import { fetchData } from '../../../helpers/axiosHelper';
import { AuthContext } from '../../../contexts/AuthContext/AuthContext';

const saveLocalStorage = 'reserve_client';

const ModalAddReserveClient = ({ toBack, client }) => {
  const { token } = useContext(AuthContext);

  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);
  const [extras, setExtras] = useState([]);

  const [petId, setPetId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [extrasIds, setExtrasIds] = useState([]);

  const [notes, setNotes] = useState('');

  const [minutes, setMinutes] = useState(0);
  const [totalPrice, setTotalPrice] = useState('0.00');

  const [manualMinutes, setManualMinutes] = useState('');
  const [manualPrice, setManualPrice] = useState('');

  const [isEditingMinutes, setIsEditingMinutes] = useState(false);
  const [isEditingPrice, setIsEditingPrice] = useState(false);

  const petSelected = pets.find((p) => String(p.pet_id) === String(petId));
  const isCat = Number(petSelected?.specie) === 2;

  // Guardamos la reserva en localStorage
  const saveReserve = (extra = {}) => {
    const finalMinutes =
      manualMinutes !== '' ? Number(manualMinutes || 0) : Number(minutes || 0);

    const finalPrice =
      manualPrice !== '' ? Number(manualPrice || 0).toFixed(2) : String(totalPrice || '0.00');

    const payload = {
      client_user_id: client?.user_id || null,
      pet_id: petId || null,

      service_id: isCat ? null : serviceId || null,
      supplement_ids: isCat ? [] : extrasIds,

      // AQUÍIII LOS HE DEJADO EN NULL HASTA CONECTAR CON EL CALENDARIO. DARÁ ERROR POR ESTOS 2 CAMPOS!!!!
      appointment_date: null,
      start_time: null,

      duration_minutes: finalMinutes,
      total_price: finalPrice,

      observations: notes || null,

      ...extra,
    };

    localStorage.setItem(saveLocalStorage, JSON.stringify(payload));
  };

  const calcTotal = (newServiceId, newExtrasIds = []) => {
    if (!newServiceId) {
      setMinutes(0);
      setTotalPrice('0.00');
      return;
    }

    const baseService = services.find(
      (s) => String(s.service_id) === String(newServiceId),
    );

    const selectedExtras = extras.filter((s) =>
      newExtrasIds.includes(String(s.service_id)),
    );
    

    const extraMinutes = selectedExtras.reduce(
      (acc, s) => acc + Number(s.duration_minutes || 0),
      0,
    );

    const extraPrice = selectedExtras.reduce(
      (acc, s) => acc + Number(s.price || 0),
      0,
    );

    const totalMinutes = Number(baseService?.duration_minutes || 0) + extraMinutes;
    const total = Number(baseService?.price || 0) + extraPrice;

    setMinutes(totalMinutes);
    setTotalPrice(total.toFixed(2));
  };

  const handleToggleExtra = (id) => {
    const sid = String(id);

    const nextExtrasIds = extrasIds.includes(sid)
      ? extrasIds.filter((x) => x !== sid)
      : [...extrasIds, sid];

    setExtrasIds(nextExtrasIds);
    calcTotal(serviceId, nextExtrasIds);
  };

  // Al cambiar el cliente, reiniciamos el localStorage
  useEffect(() => {
    if (client?.user_id) {
      localStorage.removeItem(saveLocalStorage);
      saveReserve({
        pet_id: null,
        service_id: null,
        supplement_ids: [],
        duration_minutes: 0,
        total_price: '0.00',
      });
    }
  }, [client?.user_id]);

  // Cada cambio se guarda en localStorage
  useEffect(() => {
    if (!client?.user_id) return;
    saveReserve();
  }, [
    petId,
    serviceId,
    extrasIds,
    minutes,
    totalPrice,
    notes,
    manualMinutes,
    manualPrice,
  ]);

  // Cargar mascotas del cliente
  useEffect(() => {
    const getPets = async () => {
      try {
        const res = await fetchData(`worker/pets/${client.user_id}`, 'GET', null, token);
        setPets(res.data.result);
      } catch (error) {
        console.log(error);
        setPets([]);
      }
    };

    if (client?.user_id) getPets();
  }, [client, token]);

  // Cuando eliges mascota cargar servicios por tamaño
  useEffect(() => {
    const getServices = async () => {
      try {
        const pet = pets.find((p) => String(p.pet_id) === String(petId));
        if (!pet) return;

        if (Number(pet.specie) === 2) {
          setServices([]);
          setExtras([]);
          setServiceId('');
          setExtrasIds([]);
          setManualMinutes('');
          setManualPrice('');
          setNotes('');
          return;
        }

        const size = pet.size_category;

        const res = await fetchData(
          `service?size_category=${size}`,
          'GET',
          null,
          token
        );

        const all = res?.data?.services || [];

        setServices(all.filter((s) => Number(s.type) === 1));
        setExtras(all.filter((s) => Number(s.type) === 2));


        setServiceId('');
        setExtrasIds([]);
        setMinutes(0);
        setTotalPrice('0.00');
        setNotes('');
      } catch (error) {
        console.log(error);
        setServices([]);
        setExtras([]);
        setServiceId('');
        setExtrasIds([]);
        setMinutes(0);
        setTotalPrice('0.00');
      }
    };

    if (petId) getServices();
  }, [petId, pets, token]);

  const handlePetChange = (e) => {
    setPetId(e.target.value);
  };

  const handleServiceChange = (e) => {
    const value = e.target.value;
    setServiceId(value);

    setExtrasIds([]);
    setManualMinutes('');
    setManualPrice('');
    calcTotal(value, []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const raw = localStorage.getItem(saveLocalStorage);
    if (!raw) return;

    const data = JSON.parse(raw);


    try {
      const res = await fetchData('appointment/client', 'POST', data, token);
      console.log('Cita creada:', res.data);

      localStorage.removeItem(saveLocalStorage);
      toBack();
    } catch (error) {
      console.log('error al crear cita:', error);
    }
  };

  return (
    <section className="addReserveModal">
      <div className="addReserveGridModal">
        <div className="addReserveCardModal">
          <h3>Añadir reserva</h3>

          <form className="quickReserveForm" onSubmit={handleSubmit}>
            {/* Aquí se pintará la fecha y la hora!!!! */}
            <label>Aquí irá la fecha y la hora</label>
            <label>
              Cliente: {client.name_user} {client.last_name}
            </label>

            <label>Mascota</label>
            <select value={petId} onChange={handlePetChange}>
              <option value="" disabled>Selecciona una mascota</option>
              {pets.map((p) => (
                <option key={p.pet_id} value={p.pet_id}>
                  {p.name_pet}
                </option>
              ))}
            </select>

            {isCat ? (
              <>
                <label>Observaciones</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </>
            ) : (
              <>
                <label>Servicio</label>
                <select
                  value={serviceId}
                  onChange={handleServiceChange}
                  disabled={!petId}
                >
                  <option value="" disabled>
                    {petId ? 'Selecciona servicio' : 'Elige mascota primero'}
                  </option>
                  {services.map((s) => (
                    <option key={s.service_id} value={s.service_id}>
                      {s.title} ({s.duration_minutes} min) - {s.price}€
                    </option>
                  ))}
                </select>

                <label>Suplementos</label>
                <div className="supplementsBox">
                  {extras.map((s) => {
                    const sid = String(s.service_id);
                    return (
                      <label key={sid} className="supplementCheck">
                        <input
                          type="checkbox"
                          checked={extrasIds.includes(sid)}
                          onChange={() => handleToggleExtra(sid)}
                          disabled={!serviceId}
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
                    isEditingMinutes
                      ? manualMinutes
                      : manualMinutes !== ''
                        ? manualMinutes
                        : minutes > 0
                          ? String(minutes)
                          : ''
                  }
                  onFocus={() => {
                    setIsEditingMinutes(true);
                    if (manualMinutes === '')
                      setManualMinutes(minutes > 0 ? String(minutes) : '');
                  }}
                  onChange={(e) => setManualMinutes(e.target.value)}
                  onBlur={() => {
                    setIsEditingMinutes(false);
                    if (manualMinutes !== '' && Number(manualMinutes) < 0) setManualMinutes('');
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
                        : Number(totalPrice) > 0
                          ? String(totalPrice)
                          : ''
                  }
                  onFocus={() => {
                    setIsEditingPrice(true);
                    if (manualPrice === '')
                      setManualPrice(Number(totalPrice) > 0 ? String(totalPrice) : '');
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
                disabled={!petId || (!isCat && !serviceId)}
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
