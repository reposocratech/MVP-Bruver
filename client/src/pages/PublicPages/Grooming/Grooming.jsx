import './grooming.css';
import { useNavigate } from 'react-router';
const Grooming = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="groomingPage">
        <h2 className="groomingTitle">Grooming & Spa</h2>
        <div className="groomingGrid">
          <div className="groomingCard">
            <img src="/img/grooming/grooming-dog-1.png" alt="Lavado" />
            <h3>Solo lavado y secado</h3>
            <p>
              Higiene profunda con cosmética de calidad adaptada a su tipo de
              pelo. Incluye doble enjabonado con masaje relajante, cepillado
              para retirar el pelo muerto y un secado manual tranquilo, sin
              prisas.
            </p>
          </div>
          <div className="groomingCard">
            <img src="/img/grooming/grooming-dog-2.png" alt="Corte a máquina" />
            <h3>Baño y Corte a Máquina</h3>
            <p>
              La solución más práctica para el día a día. Un corte pulido e
              higiénico que facilita el mantenimiento en casa, manteniendo a tu
              mascota fresca y cómoda.
            </p>
          </div>
          <div className="groomingCard">
            <img src="/img/grooming/grooming-dog-3.png" alt="Corte a tijera" />
            <h3>Baño y Corte a Tijera</h3>
            <p>
              Nuestro servicio más detallista. Esculpimos el manto a mano
              respetando la forma natural de tu mascota para conseguir ese
              acabado esponjoso y cuidado que tanto nos gusta.
            </p>
          </div>
          <div className="groomingCard">
            <img src="/img/grooming/grooming-cat-1.png" alt="Gatos" />
            <h3>Gatos</h3>
            <p>
              Especialistas en manejo felino sin sedación. Realizamos una
              higiene completa respetando los tiempos y la sensibilidad de cada
              gato para evitar el estrés de los procesos industriales.{' '}
            </p>
          </div>
        </div>
        <div className="groomingIncludes">
          <h4>Todos nuestros servicios incluyen:</h4>
          <ul>
            <li>Uñas y limado</li>
            <li>Limpieza de oídos</li>
            <li>Revisión de piel</li>
            <li>Vaciado de glándulas</li>
            <li>Zonas higiénicas</li>
          </ul>
        </div>
      <div className="aboutActions">
        <button type="button" onClick={() => navigate('/')} className="groomingBackBtn">
          VOLVER
        </button>
      </div>
      </div>
    </>
  );
};
export default Grooming;
