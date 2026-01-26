import "./contact.css";
import ContactForm from "./ContactForm";

const Contact = () => {
  return (
    <div className="contactPage">
      <h2 className="contactTitle">Contacto</h2>

      <ContactForm />

      <div className="contactOptions">
        <h3>Elige cómo prefieres contactarnos:</h3>

        <a
          href="tel:+34600111222"
          className="btn"
          aria-label="Llamar al +34 600 111 222"
        >
          <i className="bi bi-telephone"></i>
          Llamar
        </a>

        <a
          href="https://wa.me/34600111222?text=Hola%20%F0%9F%91%8B%20Quiero%20informaci%C3%B3n"
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
          aria-label="Abrir WhatsApp"
        >
          <i className="bi bi-whatsapp"></i>
          WhatsApp
        </a>

        <a
          href="mailto:clientas@tudominio.com?subject=Consulta&body=Hola%2C%20quiero%20informaci%C3%B3n..."
          className="btn"
          aria-label="Enviar correo"
        >
          <i className="bi bi-envelope"></i>
          Correo electrónico
        </a>
      </div>

   
      <div className="contactLocation">
  <div className="mapCard">
    <div className="mapFrame">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1934.2801030751177!2d-4.463242926679909!3d36.71965954168198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd72f72daa75f4c7%3A0xf62c24bc5b2b44a1!2sBR%C3%9CVER%20Teatinos!5e0!3m2!1ses!2ses!4v1769081936329"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Ubicación"
      />
    </div>

    <div className="mapInfo">
      <strong>Dirección:</strong>
      <p>Av. Jorge Luis Borges 25, 29010, Málaga, España.</p>
      <p>
        Cerca de la Fuente de Colores de Teatinos y del metro del Palacio de
        la Justicia.
      </p>
    </div>
  </div>
</div>

    </div>
  );
};

export default Contact;
