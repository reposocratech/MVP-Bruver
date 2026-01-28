import "./RegisterPage.css";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router";
import { registerSchema } from "../../../schemas/RegisterSchema";
import { ZodError } from "zod";
import { fetchData } from "../../../helpers/axiosHelper";
import ModalVerifyEmail from "../../../components/Modal/ModalVerifyEmail/ModalVerifyEmail";

const initialValue = {
  name_user: "",
  last_name: "",
  phone: "",
  email: "",
  address: "",
  province: "",
  city: "",
  password: "",
  rep_password: "",
};

const RegisterPage = () => {
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);

  const [register, setRegister] = useState(initialValue);
  const [valErrors, setValErrors] = useState({});
  const [fetchError, setFetchError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegister({ ...register, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      registerSchema.parse(register);
      await fetchData("user/register", "POST", register);

     
      setOpenModal(true);
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldsErrors = {};
        error.issues.forEach((elem) => {
          fieldsErrors[elem.path[0]] = elem.message;
        });
        setValErrors(fieldsErrors);
        setFetchError("");
      } else {
        setValErrors({});
        setFetchError(
          error.response?.data?.errno === 1062
            ? "Email ya existe"
            : "Error al crear usuario"
        );
      }
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2>Registro</h2>

        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              name="name_user"
              value={register.name_user}
              onChange={handleChange}
            />
            {valErrors.name_user && (
              <p className="text-danger">{valErrors.name_user}</p>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Apellidos</Form.Label>
            <Form.Control
              name="last_name"
              value={register.last_name}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              name="phone"
              value={register.phone}
              onChange={handleChange}
            />
            {valErrors.phone && <p className="text-danger">{valErrors.phone}</p>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="email"
              value={register.email}
              onChange={handleChange}
            />
            {valErrors.email && <p className="text-danger">{valErrors.email}</p>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              name="address"
              value={register.address}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Provincia</Form.Label>
            <Form.Control
              name="province"
              value={register.province}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ciudad</Form.Label>
            <Form.Control
              name="city"
              value={register.city}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={register.password}
              onChange={handleChange}
            />
            {valErrors.password && (
              <p className="text-danger">{valErrors.password}</p>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Repetir contraseña</Form.Label>
            <Form.Control
              type="password"
              name="rep_password"
              value={register.rep_password}
              onChange={handleChange}
            />
            {valErrors.rep_password && (
              <p className="text-danger">{valErrors.rep_password}</p>
            )}
          </Form.Group>

          <div className="buttons">
            <Button type="submit" className="button_register acept">
              Aceptar
            </Button>
            <Button
              type="button"
              className="button_register cancel"
              onClick={() => navigate("/")}
            >
              Cancelar
            </Button>
          </div>

          {fetchError && <p className="text-danger text-center">{fetchError}</p>}

          <p className="register-phrase">Patitas limpias, corazones felices</p>
        </Form>

        
        {openModal && (
          <ModalVerifyEmail
            onClose={() => {
              setOpenModal(false);
              navigate("/login"); 
            }}
          />
        )}
      </div>

      <img
        src="/img/home/dog1.png"
        alt="Perrito decorativo"
        className="dogCorner"
      />
    </div>
  );
};

export default RegisterPage;
