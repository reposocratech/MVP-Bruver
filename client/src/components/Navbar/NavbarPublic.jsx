import { useState } from "react";
import { Navbar, Container, Nav, NavDropdown, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import "./navbar.css";
import logoNavbar from "../../assets/images/logo-navbar.png";

export const NavbarPublic = () => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    setExpanded(false);
    navigate(path);
  };

  return (
    <Navbar
      expand="lg"
      expanded={expanded}
      className="navbar-custom"
    >
      <Container fluid>
        <Navbar.Brand
          as={Link}
          to="/"
          className="navbar-logo"
          onClick={() => setExpanded(false)}
        >
          <img
            src={logoNavbar}
            alt="Logo"
            className="navbar-logo-img"
          />
        </Navbar.Brand>

        <Navbar.Toggle onClick={() => setExpanded(!expanded)} />

        <Navbar.Collapse>
          <Nav className="navbar-nav-center">
            <Nav.Link onClick={() => handleNavigate("/")}>
              Inicio
            </Nav.Link>

            <Nav.Link onClick={() => handleNavigate("/about")}>
              Quienes somos
            </Nav.Link>

            <NavDropdown title="Servicios" id="services-dropdown">
              <NavDropdown.Item onClick={() => handleNavigate("/grooming")}>
                Grooming & Spa
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleNavigate("/pharmacy")}>
                Farmacia veterinaria
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleNavigate("/nutrition")}>
                Nutrición y accesorios
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link onClick={() => handleNavigate("/contact")}>
              Contacto
            </Nav.Link>
          </Nav>

          <div className="navbar-actions">
            <Button
              className="nav-btn"
              onClick={() => handleNavigate("/login")}
            >
              INICIAR SESIÓN
            </Button>

            <Button
              className="nav-btn"
              onClick={() => handleNavigate("/register")}
            >
              REGÍSTRATE
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
