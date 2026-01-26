import './RegisterPage.css';
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { registerSchema } from '../../../schemas/RegisterSchema';
import { ZodError } from 'zod';
import { fetchData } from '../../../helpers/axiosHelper';
import ModalVerifyEmail from '../../../components/Modal/ModalVerifyEmail/ModalVerifyEmail';
import './RegisterPage.css';

const initialValue = {
  name_user: '',
  last_name: '',
  phone: '',
  email: '',
  province: '',
  city: '',
  password: '',
  rep_password: '',
};

const RegisterPage = () => {
  const navigate = useNavigate();
 const [openModal, setOpenModal] = useState(false);

  const [register, setRegister] = useState(initialValue);
  const [valErrors, setValErrors] = useState();
  const [fecthError, setFetchError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegister({ ...register, [name]: value });
  };

  const onSubmit = async () => {
    try {
      registerSchema.parse(register);
      const res = await fetchData('user/register', 'POST', register);
      console.log('^^^^^^^^^^^^', res);
      setOpenModal(true);
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldsErrors = {};
        error.issues.forEach((elem) => {
          fieldsErrors[elem.path[0]] = elem.message;
        });
        setValErrors(fieldsErrors);
        setFetchError('');
      } else {
        setValErrors({});
        if (error.response?.data?.errno === 1062) {
          setFetchError('Email ya existe');
        } else {
          setFetchError('Error al crear usuario');
          console.error('Error al crear usuario:', error);
        }
      }
    }
  };

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          onChange={handleChange}
          value={register.name_user}
          name="name_user"
          type="text"
          placeholder="Introduce tu nombre"
        />
        {valErrors?.name_user && (
          <p className="text-danger">{valErrors.name_user}</p>
        )}
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Apellidos</Form.Label>
        <Form.Control
          onChange={handleChange}
          value={register.last_name}
          name="last_name"
          type="text"
          placeholder="Introduce tus apellidos"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Teléfono</Form.Label>
        <Form.Control
          onChange={handleChange}
          value={register.phone}
          name="phone"
          type="tel"
          placeholder="Introduce tu número de teléfono"
        />
        {valErrors?.phone && <p className="text-danger">{valErrors.phone}</p>}
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Correo Electrónico</Form.Label>
        <Form.Control
          onChange={handleChange}
          value={register.email}
          name="email"
          type="email"
          placeholder="Introduce correo electrónico"
        />
        {valErrors?.email && <p className="text-danger">{valErrors.email}</p>}
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Provincia</Form.Label>
        <Form.Control
          onChange={handleChange}
          value={register.province}
          name="province"
          type="text"
          placeholder="Introduce tu provincia"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Ciudad</Form.Label>
        <Form.Control
          name="city"
          onChange={handleChange}
          value={register.city}
          type="text"
          placeholder="Introduce tu ciudad"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control
          onChange={handleChange}
          value={register.password}
          name="password"
          type="password"
          placeholder="Crea una nueva contraseña"
        />
        {valErrors?.password && (
          <p className="text-danger">{valErrors.password}</p>
        )}
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Repetir contraseña</Form.Label>
        <Form.Control
          onChange={handleChange}
          value={register.rep_password}
          name="rep_password"
          type="password"
          placeholder="Repite tu contraseña"
        />
        {valErrors?.rep_password && (
          <p className="text-danger">{valErrors.rep_password}</p>
        )}
      </Form.Group>

      {openModal && <ModalVerifyEmail onClose={() => setOpenModal(false)} />}

      <Button className="button_register acept" onClick={onSubmit}>
        Aceptar
      </Button>
      <Button className="button_register cancel" onClick={() => navigate('/')}>
        Cancelar
      </Button>
      <p className="text-danger">{fecthError}</p>
    </Form>
  );
};
export default RegisterPage;
