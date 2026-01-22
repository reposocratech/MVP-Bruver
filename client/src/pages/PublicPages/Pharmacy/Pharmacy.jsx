import React from 'react'
import "./pharmacy.css";

const Pharmacy = () => {
  return (
    <section className="farmaciaPage">
      <section className="farmaciaContent">
        <h1 className="farmaciaTitle">Farmacia Veterinaria</h1>
        <h2 className="farmaciaTitle">Próximamente</h2>

   

        <p className="farmaciaText">
          En nuestra farmacia veterinaria te ayudamos a cuidar de tu mascota con
          el mismo cariño con el que lo harías tú. Te asesoramos de forma
          personalizada para encontrar el tratamiento más adecuado, resolver
          dudas sobre medicación y elegir los mejores productos para su bienestar
          diario.
        </p>

        <img
          className="farmaciaImg"
          src="/img/pharmacy/pharmacy.png"
          alt="Farmacia Veterinaria"
        />
      </section>
      
    </section>
  );
};
export default Pharmacy