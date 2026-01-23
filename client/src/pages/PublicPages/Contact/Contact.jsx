import "./contact.css";
import ContactForm from "./ContactForm";
const Contact = () => {
  return (
    <div className="contactPage">
      <h2 className="contactTitle">Contacto</h2>
      <ContactForm />
      <div className="contactOptions">
        <h3>Elige cómo prefieres contactarnos:</h3>
        {/* añadir datos reales de las clientas */}
        <a
          href="tel:+34600111222"
          className="btn"
          aria-label="Llamar al +34 600 111 222"
        >
          <i className="bi bi-telephone"></i>
          Llamar
        </a>
        {/* añadir datos de whatsapp de la clienta */}
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
        {/* configurar los correos de las clientas */}
        <a
          href="mailto:clientas@tudominio.com?subject=Consulta&body=Hola%2C%20quiero%20informaci%C3%B3n..."
          className="btn "
          aria-label="Enviar correo"
        >
          <i className="bi bi-envelope"></i>
          Correo electrónico
        </a>
        {/* api google  */}
      </div>
      <div className="contactLocation">
        <h3>¿Dónde estamos?</h3>
        <p>Dirección: Av. Jorge Luis Borges 25, 29010, Málaga, España.</p>
        <p>Cerca de la Fuente de Colores de Teatinos y del metro del Palacio de la Justicia.</p>
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1934.2801030751177!2d-4.463242926679909!3d36.71965954168198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd72f72daa75f4c7%3A0xf62c24bc5b2b44a1!2sBR%C3%9CVER%20Teatinos%20%7C%20Peluquer%C3%ADa%20y%20Tienda%20de%20Mascotas!5e1!3m2!1ses!2ses!4v1769081936329!5m2!1ses!2ses%22" width="800" height="250">
        </iframe>
      </div>
    </div>
  );
};
export default Contact;