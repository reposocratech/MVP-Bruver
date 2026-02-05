import "./LoginPage.css";
import { useNavigate } from "react-router";
import { useState, useContext } from "react";
import { fetchData } from "../../../helpers/axiosHelper";
import { loginSchema } from "../../../schemas/LoginSchema";
import { AuthContext } from "../../../contexts/AuthContext/AuthContext";
import { ZodError } from "zod";

const initialValue = {
  email: "",
  password: "",
};

const LoginPage = () => {
  const [login, setLogin] = useState(initialValue);
  const [errorMsg, setErrorMsg] = useState("");
  const [valErrors, setValErrors] = useState({});
  const { setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      loginSchema.parse(login);

      const res = await fetchData("user/login", "POST", login);
      const token = res.data.token;

      const resUser = await fetchData("user/userByToken", "GET", null, token);

      localStorage.setItem("token", token);
      setUser(resUser.data.user);
      setToken(token);

      const type = Number(resUser.data.user?.type);

      if (type === 1) navigate("/admin");
      else if (type === 2) navigate("/worker/profile");
      else navigate("/profile");
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldsErrors = {};
        error.issues.forEach((elem) => {
          fieldsErrors[elem.path[0]] = elem.message;
        });
        setValErrors(fieldsErrors);
        setErrorMsg("");
      } else {
        setErrorMsg(error.response?.data?.message);
        setValErrors({});
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Entra en tu perfil</h2>

        <form onSubmit={onSubmit} className="login-form" noValidate>
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              value={login.email}
              placeholder="Introduce tu e-mail"
              onChange={handleChange}
              type="email"
              autoComplete="email"
            />
            {valErrors.email && <p className="text-danger">{valErrors.email}</p>}
          </div>

          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              placeholder="Introduce tu contraseña"
              onChange={handleChange}
              value={login.password}
              name="password"
              type="password"
              autoComplete="current-password"
            />

            {errorMsg && <p className="text-danger">{errorMsg}</p>}
            {valErrors.password && (
              <p className="text-danger">{valErrors.password}</p>
            )}
          </div>

          <div className="buttons">
            <button type="submit" className="button_register acept">
              ACEPTAR
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="button_register cancel"
            >
              CANCELAR
            </button>
          </div>

          <p className="not-registered">
            ¿No estás registrado?{" "}
            <span onClick={() => navigate("/register")} className="register-link">
              Regístrate
            </span>
          </p>

          <p className="not-registered">
            ¿Olvidaste tu contraseña?{" "}
            <span
              onClick={() => navigate("/recoveryPass")}
              className="register-link"
            >
              Pincha aquí
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;