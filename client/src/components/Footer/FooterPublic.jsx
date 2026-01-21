import "./footer.css";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaClock,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";

export const FooterPublic = () => {
  return (
    <footer className="footer">
      <div className="footer__content">
        {/* Logo */}
        <div className="footer__logo">
          <img src="/logo-bruver.png" alt="Brüver - Fieles a tu mascota" />
        </div>

        {/* Información */}
        <div className="footer__info">
          <h4>Dónde estamos</h4>
          <p>
            <FaMapMarkerAlt />
            <span>Av. Jorge Luis Borges 25</span>
          </p>
          <p>
            <FaPhoneAlt />
            <span>63454643 / 34534443</span>
          </p>
          <p>
            <FaClock />
            <span>
              Lunes a Sábado de 10h a 20h <br />
              Domingo Cerrado
            </span>
          </p>
        </div>

        {/* Acciones */}
        <div className="footer__actions">
          <button className="footer__button">Reservar una cita</button>
          <div className="footer__social">
            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
            <a href="#" aria-label="Email">
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer__bottom">
        © 2026 Brüver. Reservados todos los derechos
      </div>
    </footer>
  );
};