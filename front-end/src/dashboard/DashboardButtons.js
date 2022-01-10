import { today, previous, next } from '../utils/date-time';
import { useHistory } from 'react-router-dom';

const DashboardButtons = ({ selectedDate, setSelectedDate, date }) => {
  //navigation
  const history = useHistory();

  //click handlers
  function handlePrevious(e) {
    setSelectedDate(previous(selectedDate));
    history.push(`/dashboard?date=${previous(selectedDate)}`);
  }

  function handleNext(e) {
    setSelectedDate(next(selectedDate));
    history.push(`/dashboard?date=${next(selectedDate)}`);
  }

  function handleToday() {
    setSelectedDate(today());
    history.push(`/dashboard?date=${today()}`);
  }

  return (
    <div className='pt-3'>
      {/* Today button */}
      <button
        onClick={handleToday}
        type='button'
        className='btn btn-secondary mr-4'
        data-toggle='tooltip'
        data-placement='bottom'
        title={date}>
        Today
      </button>

      <button onClick={handlePrevious} className='btn btn-dark mr-4'>
        <span className='oi oi-arrow-left mr-3'></span>
        Previous Date
      </button>

      <button onClick={handleNext} className='btn btn-dark mr-4'>
        Next Date
        <span className='oi oi-arrow-right ml-3'></span>
      </button>
    </div>
  );
};

export default DashboardButtons;
