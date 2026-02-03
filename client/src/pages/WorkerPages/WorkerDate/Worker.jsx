
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
            dateStartTime={dateStartTime}
            setAppoiment={setAppoiment}
            onCloseAll={() => {
              setOpenModal(false);
              setOpenQuickReserve(false);
              setOpenSearchClient(false);
            }}
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

    </>
  )
}

export default Worker

