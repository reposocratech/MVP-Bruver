import "./about.css";

const About = () => {
  return (
    <div className="aboutPage">

      <section className="aboutTop">
        <div className="aboutText">
          <h2 className="aboutTitle">Sobre Nosotras</h2>
          <h3>Donde la vocación se encuentra con el cariño</h3>
          <p>
            Para nosotras, BRÜVER es la respuesta a un sentimiento que nos acompaña desde siempre.
          </p>
          <p>
            Somos dos familias, unidas por un gran amor por las mascotas. Para nosotras no son solo animales,
            son un miembro más de nuestra familia.
          </p>
          <div className="aboutLogo">
            <img src="/img/about/logo.png" alt="Brüber Fieles a tu mascota" />
          </div>
        </div>
        <div className="aboutImageBig">
          <img src="/img/about/about.jpg" alt="Equipo Brüber" />
        </div>
      </section>

      <section className="aboutBottom">
        <div className="aboutImages">
          <img className="circleImg" src="/img/about/service-nutrition.png" alt="Tienda" />
          <img className="circleImg small" src="/img/about/service-vet.png" alt="Farmacia" />
        </div>
        <div className="aboutText">
          <h3 className="aboutSubtitle">Nuestra filosofía</h3>
          <p>
            Traemos con nosotras años de formación y experiencia en farmacia comunitaria y en el mundo
            de las mascotas, pero lo que realmente define este espacio es lo que no se aprende en los libros: la empatía.
          </p>
          <p>
            Entendemos esa mirada de confianza que te da tu perro, o la tranquilidad que buscas para tu gato.
            Porque nosotras la sentimos igual.
          </p>
          <p>
            Por eso, en Av. Jorge Luis Borges 25, hemos creado algo más que una peluquería o una tienda.
            Hemos creado un hogar.
          </p>
        </div>
      </section>
    </div>
  );
};
export default About;