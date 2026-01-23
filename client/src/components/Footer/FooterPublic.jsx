import "./footer.css";
import logoFooter from "../../assets/images/logo-footer.png"
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
       
        <div className="footer__logo">
          <img src={logoFooter} alt="Brüver - Fieles a tu mascota" />
        </div>
 
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
 
        <div className="footer__actions">
         
          <button className="footer__button">
            Reservar una cita
            <span className="footer__arrow">➜</span>
          </button>
 
          <div className="footer__social">
            <a href="#" aria-label="Instagram">
              <FaInstagram />
              <FaInstagram />
            </a>
            <a href="#" aria-label="WhatsApp">
              <FaWhatsapp />
              <FaWhatsapp />
            </a>
            <a href="#" aria-label="Email">
              <FaEnvelope />
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>
 
      <div className="footer__bottom">
        © 2026 Brüver. Reservados todos los derechos
      </div>
    </footer>
  );
};