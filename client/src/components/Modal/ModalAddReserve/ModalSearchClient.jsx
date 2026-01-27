import { Button, Form, Table } from 'react-bootstrap';
import './ModalAddReserve.css';

const ModalSearchClient = ({ toBack }) => {

  return (
    <section className="addReserveModal">
      <div className="addReserveGridModal">
        <div className="addReserveCardModal">
          <h3>Busca al cliente</h3>
         <Form className="d-flex searchClient">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button className='close'>Buscar cliente</Button>
          </Form>
            <Table className='tableClients' striped bordered hover>
              <thead>
                <tr>
                  <th></th>
                  <th>Nombre</th>
                  <th>E-mail</th>
                  <th>Teléfono</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Susana Ruíz</td>
                  <td>susir10@gmail.com</td>
                  <td>352 263 415</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Susana Pérez</td>
                  <td>susanpe3@gmail.com</td>
                  <td>663 215 441</td>
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
