import { Navbar, Container, Nav, NavDropdown, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router'
import './navbar.css'
import logoNavbar from "../../assets/images/logo-navbar.png"

export const NavbarPublic = () => {

  const navigate = useNavigate();
  
  return (
    <Navbar expand="lg" className="navbar-custom">
      <Container fluid>
     
        <Navbar.Brand as={Link} to="/" className="navbar-logo">
          <img src={logoNavbar} 
          alt="" 
          className='navbar-logo-img'/>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
         
          <Nav className="navbar-nav-center">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/about">Quienes somos</Nav.Link>

            <NavDropdown title="Servicios" id="services-dropdown">
              <NavDropdown.Item as={Link} to="/grooming">
                Grooming & Spa
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/pharmacy">
                Farmacia veterinaria
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/nutrition">
                Nutrición y accesorios
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={Link} to="/contact">Contacto</Nav.Link>
          </Nav>

         
          <div className="navbar-actions">
            <Button onClick={()=> navigate("/login")} className="nav-btn">INICIAR SESIÓN</Button>
            <Button onClick={()=> navigate("/register")} className="nav-btn">REGÍSTRATE</Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
