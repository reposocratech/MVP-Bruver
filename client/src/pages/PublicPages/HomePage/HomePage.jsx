import "./HomePage.css";
import { Link } from "react-router";

const HomePage = () => {
  return (
    <section className="home">
      
      <section className="hero">
        <div className="heroLeft"></div>

        <div
          className="heroRight"
          style={{
            backgroundImage: "url(/img/home/background2-2.png)",
          }}
        >
          <p className="heroQuote">"Fieles a tu mascota"</p>
        </div>
      </section>

     
      <section className="servicesHome">

        
        <Link to="/grooming" className="serviceLink">
          <article className="serviceCardHome">
            <div className="serviceImgWrap">
              <img
                className="serviceImg"
                src="/img/home/service-grooming.png"
                alt="Grooming & Spa"
              />
            </div>
            <span className="serviceText">
              Grooming &amp; Spa
            </span>
          </article>
        </Link>

        
        <Link to="/pharmacy" className="serviceLink">
          <article className="serviceCardHome">
            <div className="serviceImgWrap">
              <img
                className="serviceImg"
                src="/img/home/service-vet.png"
                alt="Farmacia Veterinaria"
              />
            </div>
            <span className="serviceText">
              Farmacia
              <br />
              Veterinaria
            </span>
          </article>
        </Link>

        
        <Link to="/nutrition" className="serviceLink">
          <article className="serviceCardHome">
            <div className="serviceImgWrap">
              <img
                className="serviceImg"
                src="/img/home/service-nutrition.png"
                alt="Nutrición y accesorios"
              />
            </div>
            <span className="serviceText">
              Nutrición y
              <br />
              accesorios
            </span>
          </article>
        </Link>

      </section>

      <img className="dogCorner" src="/img/home/dog-corner.png" alt="Perro" />
    </section>
  );
};

export default HomePage;
