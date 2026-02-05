import "./RegisterPage.css";
import { useState } from "react";
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

        <form onSubmit={onSubmit} className="register-form" noValidate>
          <div className="field">
            <label htmlFor="name_user">Nombre*</label>
            <input
              id="name_user"
              name="name_user"
              value={register.name_user}
              onChange={handleChange}
              placeholder="Introduce tu nombre"
              autoComplete="given-name"
            />
            {valErrors.name_user && (
              <p className="text-danger">{valErrors.name_user}</p>
            )}
          </div>

          <div className="field">
            <label htmlFor="last_name">Apellidos</label>
            <input
              id="last_name"
              name="last_name"
              value={register.last_name}
              onChange={handleChange}
              placeholder="Introduce tus apellidos"
              autoComplete="family-name"
            />
          </div>

          <div className="field">
            <label htmlFor="phone">Teléfono*</label>
            <input
              id="phone"
              name="phone"
              value={register.phone}
              onChange={handleChange}
              placeholder="Introduce tu teléfono"
              autoComplete="tel"
            />
            {valErrors.phone && <p className="text-danger">{valErrors.phone}</p>}
          </div>

          <div className="field">
            <label htmlFor="email">Email*</label>
            <input
              id="email"
              name="email"
              value={register.email}
              onChange={handleChange}
              placeholder="Introduce tu e-mail"
              autoComplete="email"
            />
            {valErrors.email && <p className="text-danger">{valErrors.email}</p>}
          </div>

          <div className="field">
            <label htmlFor="address">Dirección</label>
            <input
              id="address"
              name="address"
              value={register.address}
              onChange={handleChange}
              placeholder="Introduce tu dirección"
              autoComplete="street-address"
            />
          </div>

          <div className="field">
            <label htmlFor="province">Provincia</label>
            <input
              id="province"
              name="province"
              value={register.province}
              onChange={handleChange}
              placeholder="Introduce tu provincia"
              autoComplete="address-level1"
            />
          </div>

          <div className="field">
            <label htmlFor="city">Ciudad</label>
            <input
              id="city"
              name="city"
              value={register.city}
              onChange={handleChange}
              placeholder="Introduce tu ciudad"
              autoComplete="address-level2"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Contraseña*</label>
            <input
              id="password"
              type="password"
              name="password"
              value={register.password}
              onChange={handleChange}
              placeholder="Introduce tu contraseña"
              autoComplete="new-password"
            />
            {valErrors.password && (
              <p className="text-danger">{valErrors.password}</p>
            )}
          </div>

          <div className="field">
            <label htmlFor="rep_password">Repetir contraseña*</label>
            <input
              id="rep_password"
              type="password"
              name="rep_password"
              value={register.rep_password}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              autoComplete="new-password"
            />
            {valErrors.rep_password && (
              <p className="text-danger">{valErrors.rep_password}</p>
            )}
          </div>

          <div className="buttons">
            <button type="submit" className="button_register acept">
              Aceptar
            </button>

            <button
              type="button"
              className="button_register cancel"
              onClick={() => navigate("/")}
            >
              Cancelar
            </button>
          </div>

          {fetchError && (
            <p className="text-danger text-center">{fetchError}</p>
          )}

          <p className="register-phrase">Patitas limpias, corazones felices</p>
        </form>

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