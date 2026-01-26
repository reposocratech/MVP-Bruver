import { Button } from 'react-bootstrap';
import './ModalVerifyEmail.css';

const ModalVerifyEmail = ({ onClose }) => {
  return (
    <section className="verifyEmailModal">
      <div className="verifyEmailGridModal">
        <div className="verifyEmailCardModal">
          <img src="/img/register/tick.png" alt="tick" />
          <h3>¡Registro completado!</h3>
          <p>
            Hemos enviado un correo de verificación a tu dirección de email. Por
            favor, revisa tu bandeja de entrada y haz clic en el enlace de
            verificación para activar tu cuenta. Una vez verificada, podrás
            iniciar sesión normalmente.
          </p>
          <Button className="close" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ModalVerifyEmail;
