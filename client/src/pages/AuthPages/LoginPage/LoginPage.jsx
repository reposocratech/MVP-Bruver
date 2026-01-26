import "./LoginPage.css"
import { useNavigate } from "react-router"
import { Button, Form } from "react-bootstrap"
import { useState, useContext } from "react"
import { fetchData } from "../../../helpers/axiosHelper"
import { loginSchema } from "../../../schemas/LoginSchema"
import { AuthContext } from "../../../contexts/AuthContext/AuthContext"
import { ZodError } from "zod"

const initialValue = {
  email: "",
  password: ""
}

const LoginPage = () => {

  const [login, setLogin] = useState(initialValue);
  //errores back
  const [errorMsg, setErrorMsg] = useState("");
  //errores de validacion
  const [valErrors, setValErrors] = useState();

  const {setUser, setToken} = useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  }

  const onSubmit = async () => {
    try {
      loginSchema.parse(login);
      const res = await fetchData("user/login", "POST", login);
      const token = res.data.token;
      const resUser = await fetchData("user/userByToken", "GET", null, token);
      localStorage.setItem("token", token);
      setUser(resUser.data.user);
      setToken(token);
      navigate("/profile")
    } catch (error) {
      console.log("Error en login:", error);

      if (error instanceof ZodError){
        const fieldsErrors = {};
        error.issues.forEach((elem)=>{
          fieldsErrors[elem.path[0]] = elem.message;
        })
        setValErrors(fieldsErrors);
        setErrorMsg("")
      }else{
        setErrorMsg(error.response?.data?.message);
        setValErrors({});
      }
    }
  }

  return (
    <>
      <h2>Entra en tu perfil</h2>

      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>E-mail</Form.Label>
          <Form.Control 
              name="email"
              value={login.email}
              placeholder="Introduce tu e-mail"
              onChange={handleChange}
              type="email" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
              placeholder="Introduce tu contraseña"
              onChange={handleChange}
              value={login.password}
              name="password"  
              type="password" />
        <p className="text-danger">{errorMsg}</p>
        {valErrors?.password && <p className="text-danger">{valErrors.password}</p>}
        </Form.Group>
        <div className="buttons">
          <Button onClick={onSubmit} className="button_register acept">
            ACEPTAR
          </Button>
          <Button onClick={() => navigate(-1)} className="button_register cancel">
            CANCELAR
          </Button>
        </div>

        {/* NUEVO: acceso para no registrados */}
       
        <p className="not-registered">
          ¿No estás registrado?{" "}
          <a onClick={() => navigate("/register")} className="register-link">
            Regístrate
          </a>
        </p>
      </Form>
    </>
  )
}

export default LoginPage
