import { Navbar, Container, Nav, NavDropdown, Button } from 'react-bootstrap'
import { Link } from 'react-router'
import '../Navbar/navbar.css'
import logoNavbar from "../../assets/images/logo-navbar.png"
import iconoLogin from "../../assets/images/icono-login.png"
 
export const NavbarLogin = () => {
  return (
    <Navbar expand="lg" className="navbar-custom">
      <Container fluid>
     
        <Navbar.Brand as={Link} to="/" className="navbar-logo">
          <img
            src={logoNavbar}
            alt="Brüver"
            className="navbar-logo-img"
          />
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
 
         
          <div className="botones d-flex align-items-center gap-2">
            <div className="navbar-actions">
              <Button className="nav-btn">PEDIR CITA</Button>
            </div>
 
           
            <div className="profile-icon">
              <span className="profile-tooltip">Perfil</span>
 
              <button className="profile-btn">
                <img
                  src={iconoLogin}
                  alt="Perfil"
                  className="profile-btn-img"
                />
                <span className="profile-filled"></span>
              </button>
            </div>
          </div>
 
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}