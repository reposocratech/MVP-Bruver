import { Button, Form, Table } from 'react-bootstrap';
import './ModalAddReserve.css';

const ModalSearchClient = ({ toBack }) => {

  return (
    <section className="addReserveModal">
      <div className="addReserveGridModal">
        <div className="addReserveCardModal">
          <h3>Busca al cliente</h3>
         <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Buscar cliente</Button>
          </Form>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Username</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Jacob</td>
                  <td>Thornton</td>
                  <td>@fat</td>
                </tr>
              </tbody>
            </Table>
 
          <div>
            <Button className="close">
              Aceptar
            </Button>
            <Button className="close" onClick={toBack}>
              Atrás
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModalSearchClient;
