import AvailableTableDetails from './TableDetails';
import { useHistory } from 'react-router-dom';

const SeatReservation = ({ tables }) => {
  const history = useHistory();

  function cancelHandler(e) {
    e.preventDefault();
    history.goBack();
  }

  return (
    <div>
      <button onClick={cancelHandler} className='btn btn-warning mt-5'>
        Cancel
      </button>
      <h2 className='pb-3 mt-5 libreFont'>Available Tables</h2>

      <AvailableTableDetails tables={tables} />
      <br />
    </div>
  );
};

export default SeatReservation;
