import React, { useContext, useState, useEffect } from 'react';
import './Appointment.css';
import { Col, Container, Row } from 'react-bootstrap';
import { AuthContext } from "../../../../contexts/AuthContext/AuthContext";
import { fetchData } from "../../../../helpers/axiosHelper";
import { UsersPetsAppointment } from '../../../../components/AppointmentsComponents/UsersPetsAppointment/UsersPetsAppointment';
import { UsersServicesAppointment } from '../../../../components/AppointmentsComponents/UsersServicesAppointment/UsersServicesAppointment';
import { UsersDateAppointment } from '../../../../components/AppointmentsComponents/UsersDateAppointment/UsersDateAppointment';
import { useNavigate } from 'react-router';

// Convertir minutos a horas
function minutesToHour(totalMinutos) {
  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;
  if (horas > 0) {
    return `${horas}h ${minutos}m`;
  }
  return `${minutos}m`;
}

const Appointment = () => {
  const [currentAppointment, setCurrentAppointment] = useState(1);
  const [selectedPet, setSelectedPet] = useState();
  const [workers, setWorkers] = useState([]);
  const navigate = useNavigate();
  const [sumaTotalPrecio, setSumaTotalPrecio] = useState(0);
    const [sumaTotalMinutos, setSumaTotalMinutos] = useState(0);
  
    const [baseServicePrice, setBaseServicePrice] = useState(0);
    const [baseServiceMinutes, setBaseServiceMinutes] = useState(0);
  
    const [baseServiceId, setBaseServiceId] = useState(null);
    const [extrasIds, setExtrasIds] = useState([]);

/*   const submit = (e) => {
    e.preventDefault();
  };  */

  // 1) Traemos del contexto el array de mascotas, token y el setter global
  const { pets, setPets, token } = useContext(AuthContext);

 
  // 2) Al montar el componente, si hay token, pedimos las mascotas al backend
  useEffect(() => {
    const getMyPets = async () => {
      try {
        const res = await fetchData("pet/mine", "GET", null, token);
        setPets(res.data.pets);
      }
      catch (error)
       {
        console.log(error);
      }
    };
    if (token) getMyPets();
 
  },
   []);
  
  // Si es gato, abreme la página de gatos, si no, vete a servicios normales para perros
  const handleSelectPet = (pet) => {
    console.log('Mascota seleccionada:', pet);
    setSelectedPet(pet);
    if (Number(pet.specie) === 2) {
      console.log('Navegando a /selectcat');
      navigate('/selectcat');
    } else {
      setCurrentAppointment(2);
    }
  };

  // Traer todos los empleados y administradores
  useEffect(() => {
    const showWorkersAndAdmins = async () => {
      try {
        const [adminsRes, workersRes] = await Promise.all([
          fetchData("user/admins", "GET", null, token),
          fetchData("user/workers", "GET", null, token)
        ]);
        // Unimos ambos arrays
        const allWorkers = [
          ...(adminsRes.data.admins || []),
          ...(workersRes.data.workers || [])
        ];
        setWorkers(allWorkers);
      } catch (error) {
        console.log(error);
      }
    };
    if (token) showWorkersAndAdmins();
  }, [token]);

  return (
    <>
      {currentAppointment === 1 && (
        <div>
          <Container>
            <Row>
              <Col>
                <UsersPetsAppointment 
                  setCurrentAppointment={setCurrentAppointment}
                  pets={pets}
                  setSelectedPet={handleSelectPet}
                />
              </Col>
            </Row>
          </Container>
        </div>
      )}
      {currentAppointment === 2 && (
        <div>
          <Container>
            <Row>
              <Col>
                <UsersServicesAppointment 
                  setCurrentAppointment={setCurrentAppointment}
                  selectedPet={selectedPet}

                  sumaTotalPrecio={sumaTotalPrecio}
                  setSumaTotalPrecio={setSumaTotalPrecio}

                  sumaTotalMinutos={sumaTotalMinutos}
                  setSumaTotalMinutos={setSumaTotalMinutos}

                  minutesToHour={minutesToHour}

                  baseServicePrice={baseServicePrice}
                  setBaseServicePrice={setBaseServicePrice}

                  baseServiceMinutes={baseServiceMinutes}
                  setBaseServiceMinutes={setBaseServiceMinutes}

                  baseServiceId={baseServiceId}
                  setBaseServiceId={setBaseServiceId}

                  extrasIds={extrasIds}
                  setExtrasIds={setExtrasIds}
                />      
              </Col>
            </Row>
          </Container>
        </div>
      )}
      {currentAppointment === 3 && (
        <div>
          <Container>
            <Row>
              <Col>
                <UsersDateAppointment 
                  setCurrentAppointment={setCurrentAppointment}
                  workers={workers}
                  selectedPet={selectedPet}
                  baseServiceId={baseServiceId}
                  extrasIds={extrasIds}
                  sumaTotalPrecio={sumaTotalPrecio}
                  sumaTotalMinutos={sumaTotalMinutos}
                  minutesToHour={minutesToHour}
                />
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default Appointment;
