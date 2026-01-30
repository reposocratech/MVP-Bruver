import "./SelectServices.css";
import { Col, Container, Row } from "react-bootstrap";
import { UsersServicesAppointment } from "../../../../components/UsersServicesAppointment/UsersServicesAppointment";


const SelectServices = () => {
   return (
      <div className="">
        <Container>
          <Row>
            <Col>
              <UsersServicesAppointment />
            </Col>
          </Row>
        </Container>
      </div>
    );
};

export default SelectServices;
