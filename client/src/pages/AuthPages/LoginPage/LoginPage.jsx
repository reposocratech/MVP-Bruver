import { Button, Form } from "react-bootstrap"
import "./LoginPage.css"

const LoginPage = () => {
  return (
    <>
    <h2>Entra en tu perfil</h2>
    <Form>
      <Form.Group className="mb-3" >
        <Form.Label>E-mail</Form.Label>
        <Form.Control type="email"/>
      </Form.Group>
      <Form.Group className="mb-3" >
        <Form.Label>Contraseña</Form.Label>
        <Form.Control type="password"/>
      </Form.Group>
      <div className="buttons">
        <Button className="button_register acept">
          ACEPTAR
        </Button>
        <Button className="button_register cancel" >
          CANCELAR
        </Button>
      </div>
    </Form>
    </>
  )
}

export default LoginPage
