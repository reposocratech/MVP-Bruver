import { Button, Form } from "react-bootstrap"
import "./RegisterPage.css"

const RegisterPage = () => {
  return (
    <>
    <h2>Registro</h2>
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Nombre</Form.Label>
        <Form.Control type="text" placeholder="Introduce tu nombre" />
      </Form.Group>
      <Form.Group className="mb-3" >
        <Form.Label>Apellidos</Form.Label>
        <Form.Control type="text" placeholder="Introduce tus apellidos" />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Teléfono</Form.Label>
        <Form.Control type="tel" placeholder="Introduce tu número de teléfono" />
      </Form.Group>
      <Form.Group className="mb-3" >
        <Form.Label>Correo Electrónico</Form.Label>
        <Form.Control type="email" placeholder="Introduce correo electrónico" />
      </Form.Group>
      <Form.Group className="mb-3" >
        <Form.Label>Provincia</Form.Label>
        <Form.Control type="text" placeholder="Introduce tu provincia" />
      </Form.Group>
      <Form.Group className="mb-3" >
        <Form.Label>Ciudad</Form.Label>
        <Form.Control type="text" placeholder="Introduce tu ciudad" />
      </Form.Group>
      <Form.Group className="mb-3" >
        <Form.Label>Contraseña</Form.Label>
        <Form.Control type="password" placeholder="Crea una nueva contraseña" />
      </Form.Group>
      <Form.Group className="mb-3" >
        <Form.Label>Repetir contraseña</Form.Label>
        <Form.Control type="password" placeholder="Repite tu contraseña" />
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

    <h3>Patitas limpias, corazones felices</h3>

    <img className="dogCorner" src="/img/home/dog-corner.png" alt="Perro" />
 
    </>
  )
}

export default RegisterPage
