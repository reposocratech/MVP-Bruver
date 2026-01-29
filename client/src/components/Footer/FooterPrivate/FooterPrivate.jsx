import "../footer.css";
import logoFooter from "../../../assets/images/logo-footer.png"
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaClock,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";
import { useNavigate } from "react-router";
 
export const FooterPrivate = () => {
  const navigate = useNavigate()
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
              Lunes a Viernes de 9h a 21h <br />
              Sábado de 10h a 14h
            </span>
          </p>
        </div>
 
        <div className="footer__actions">
         
          <button className="footer__button" onClick={()=>navigate('/selectpet')}>
            Reservar una cita
            <span className="footer__arrow">➜</span>
          </button>
 
          <div className="footer__social">
            {/* redes sociales */}
            {/* insta */}
          <a
            href="https://www.instagram.com/bruver_oficial/"
            aria-label="Instagram"
            target="_blank"
            rel="noreferrer"
          >
            <FaInstagram />
            <FaInstagram />
          </a>

            {/* whatsapp */}
            {/* añadir whatsapp de las clientas */}
                <a
                  href="https://wa.me/3434534345"
                  aria-label="WhatsApp"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaWhatsapp />
                  <FaWhatsapp />
                </a>
                {/* añadir correo y texto que soliciten */}
               <a
                  href="mailto:prueba@correo.com"
                  aria-label="Email"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "mailto:prueba@correo.com?subject=Consulta%20BR%C3%9CVER&body=Hola,%20quiero%20informaci%C3%B3n.";
                  }}
                >
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