import "./ForgotPassPage.css";
import { useState } from "react";
import { recoverySchema } from "../../../schemas/RecoverySchema";
import { fetchData } from "../../../helpers/axiosHelper";
import { ZodError } from "zod";
import { useNavigate } from "react-router";

const initialValue = {
  email: ""
};



const ForgotPassPage = () => {
  const [recovery, setRecovery] = useState(initialValue);
  const [valErr, setValErr] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecovery({ ...recovery, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      recoverySchema.parse(recovery);
      await fetchData("user/forgotPassword", "POST", recovery);
      setRecovery(initialValue);
      setErrorMsg("Email enviado correctamente");
      setValErr({});
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldsErrors = {};
        error.issues.forEach((elem) => {
          fieldsErrors[elem.path[0]] = elem.message;
        });
        setValErr(fieldsErrors);
        setErrorMsg("");
      } else {
        setErrorMsg(
          error?.response?.data?.message || "Algo ha ido mal"
        );
        setValErr({});
      }
    }
  };

  return (
    <div className="forgotpass-page">
      <div className="forgotpass-card">
        <h2>Recuperar contraseña</h2>

        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label>Introduce tu e-mail</label>
            <input
              name="email"
              value={recovery.email}
              onChange={handleChange}
              type="email"
              placeholder="Introduce tu email"
            />
            {valErr.email && (
              <p className="text-danger">{valErr.email}</p>
            )}
          </div>

          {errorMsg && (
            <p className="text-danger">{errorMsg}</p>
          )}

          <div className="buttons">
            <button type="submit" className="button_forgot">
              Enviar
            </button>
            <button type="button" className="button_back" onClick={() => navigate(-1)}>
              Volver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassPage;
