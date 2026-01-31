import { Col, Container, Row } from "react-bootstrap";
import { UsersPetsAppointment } from "../../../../components/UsersPetsAppointment/UsersPetsAppointment";
import './SelectPet.css';
const SelectPet = () => {


  return (
    <div className="">
      <Container>
        <Row>
          <Col>
            <UsersPetsAppointment />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SelectPet;
