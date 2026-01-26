import "./HomePage.css";
import { Navbar, Container, Nav, NavDropdown, Button } from 'react-bootstrap'
import { Link } from 'react-router'

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
          <p className="heroQuote">"Bienestar con alma para mascotas felices"</p>
        </div>
      </section>

      
      <section className="services">
        <article className="serviceCard">
          <div className="serviceImgWrap">
            <img
              className="serviceImg"
              src="/img/home/service-grooming.png"
              alt="Grooming & Spa"
            />
          </div>
         <NavDropdown.Item as={Link} to="/grooming" className="serviceText">
          <br />
          Grooming &amp; Spa
        </NavDropdown.Item>

        </article>

        <article className="serviceCard">
          <div className="serviceImgWrap">
            <img
              className="serviceImg"
              src="/img/home/service-vet.png"
              alt="Farmacia Veterinaria"
            />
          </div>
          
          <NavDropdown.Item as={Link} to="/pharmacy" className="serviceText">
          Farmacia
          <br />
          Veterinaria
        </NavDropdown.Item>

        </article>

        <article className="serviceCard">
          <div className="serviceImgWrap">
            <img
              className="serviceImg"
              src="/img/home/service-nutrition.png"
              alt="Nutrición y accesorios"
            />
          </div>
          <NavDropdown.Item as={Link} to="/nutrition" className="serviceText">
            Nutrición y
            <br />
            accesorios
            </NavDropdown.Item>
        </article>
      </section>

      
      <img className="dogCorner" src="/img/home/dog-corner.png" alt="Perro" />
    </section>
  );
};

export default HomePage;
