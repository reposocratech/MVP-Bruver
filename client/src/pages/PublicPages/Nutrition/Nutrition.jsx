import { useNavigate } from "react-router";
import "./nutrition.css";

const Nutrition = () => {
  const navigate = useNavigate();
  return (
    <>
    <section className="nutritionPage">
      <section className="nutritionContent">
        <h1 className="nutritionTitle">Nutrición</h1>
        <h1 className="nutritionTitle">Próximamente</h1>

        <p className="nutritionText">
          Una buena alimentación es la base de una vida larga y feliz. En Brüber
          te ayudamos a escoger la dieta ideal para tu mascota según su edad,
          tamaño, nivel de actividad o necesidades especiales. Te asesoramos con
          opciones de calidad para mejorar su energía, digestión y bienestar día
          a día.
          <br /><br />
          ¿Tienes alguna duda? Haz clic en la imagen y rellena el formulario.
          Estaremos encantados de ayudarte.
        </p>


          <img
            src="/img/home/service-nutrition.png"
            alt="Servicio de nutrición"
            className="nutritionImage"
            onClick={() => navigate("/contact")}
          />

          <div className="aboutActions">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="nutritionBackBtn"
            >
              VOLVER
            </button>
          </div>
      </section>
    </section>
    </>
  );
};

export default Nutrition;
