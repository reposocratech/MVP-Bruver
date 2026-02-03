import ModalAddReserve from '../../../components/Modal/ModalAddReserve/ModalAddReserve';
import ModalQuickReserve from '../../../components/Modal/ModalAddReserve/ModalQuickReserve';
import ModalSearchClient from '../../../components/Modal/ModalAddReserve/ModalSearchClient';
import ModalAddReserveClient from '../../../components/Modal/ModalAddReserve/ModalAddReserveClient';
import "./Worker.css";


const Worker = ({
  openModal,
  openSearchClient,
  openQuickReserve,
  openAddReserveClient,
  setOpenModal,
  setOpenSearchClient,
  setOpenQuickReserve,
  setOpenAddReserveClient,
  selectedClient,
  setSelectedClient,
  handleChange,
  dateStartTime,
  setDateStartTime,
  setAppoiment
}) => {

 /*  const [openModal, setOpenModal] = useState(false);
  const [openSearchClient, setOpenSearchClient] = useState(false);
  const [openQuickReserve, setOpenQuickReserve] = useState(false);
 /*  const [openCita, setOpenCita] = useState(false); */
  /* const [openAddReserveClient, setOpenAddReserveClient] = useState(false); */ 

  /* const [selectedClient, setSelectedClient] = useState(null); */

   /*  const handleChange = (option) => {
    setOpenModal(false);

    if (option === '1') {
      setOpenSearchClient(true);
    }

    if (option === '2') {
      setOpenQuickReserve(true);
    }
  }; */
 console.log("kkkkkkkkkkkkkkkkkkkkkkkkk", dateStartTime);
 
    const backModalAddReserve = () => {
      setOpenModal(true);
      setOpenSearchClient(false);
      setOpenQuickReserve(false);
    }

    const backModalAddReserveClient = () => {
      setOpenAddReserveClient(false);
      setOpenSearchClient(true);
    };

    const handleAcceptClient = (client) => {
      setSelectedClient(client);
      setOpenSearchClient(false);
      setOpenAddReserveClient(true)
    }

  return (
    <> 
    {/* <div className="workerPage">
      <div className="workerCard"> */}

       {/*  <h2 className="workerTitle">Gestión de reservas</h2>

        <div className="workerActions">
          <Button
            className="primary"
            onClick={() => setOpenModal(true)}
          >
            Añadir una reserva
          </Button>

          <Button
            className="secondary"
            onClick={() => setOpenCita(true)}
          >
            Consultar
          </Button>
        </div> */}

        {openModal && (
          <ModalAddReserve
            toBack={backModalAddReserve}
            onClose={() => setOpenModal(false)}
            onAccept={handleChange}
          />
        )}

        {openSearchClient && (
          <ModalSearchClient
            toBack={backModalAddReserve}
            onAcceptClient={handleAcceptClient}
          />
        )}

        {openQuickReserve && (
          <ModalQuickReserve
            toBack={backModalAddReserve}
          />
        )}

        {openAddReserveClient && (
          <ModalAddReserveClient
            toBack={backModalAddReserveClient}
            client={selectedClient}
            dateStartTime={dateStartTime}
            setDateStartTime={setDateStartTime}
            setOpenModal={setOpenModal}
            setOpenSearchClient={setOpenSearchClient}
            setAppoiment={setAppoiment}
          />
        )}

       {/*  {openCita && (
          <ModalSeeAppointment
            onClose={() => setOpenCita(false)}
          />
        )} */}

   {/*    </div>
    </div> */}
    </>
  )
}

export default Worker

