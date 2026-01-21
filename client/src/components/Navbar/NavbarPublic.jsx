import { Navbar, Container, Nav, NavDropdown, Button } from 'react-bootstrap'
import { Link } from 'react-router'

export const NavbarPublic = () => {
  return (
     <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/">Brüver</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/about">Sobre nosotras</Nav.Link>
            <NavDropdown title="Servicios" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/grooming">Grooming & Spa</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/pharmacy">
                Farmacia y Veterinaria
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/nutrition">Nutrición y accesorios</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to="/contact">Contacto</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Button>Iniciar sesión</Button>
        <Button>Pedir cita</Button>
      </Container>
    </Navbar>
  )
}
