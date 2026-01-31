import React from 'react'
import { Col, Container, Row } from "react-bootstrap";

const Appointment = () => {
  return (
    <div>
      <Container>
        <Row>
          <Col>
            <UsersPetsAppointment />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Appointment