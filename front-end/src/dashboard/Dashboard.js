import { useState } from 'react';
import Scroll from 'react-scroll';
import ErrorAlert from '../layout/ErrorAlert';
import DashboardButtons from './DashboardButtons';
import ListDailyReservations from '../reservations/ListDailyReservations';
import ListTables from '../reservations/ListTables';

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({
  date,
  reservations,
  reservationsError,
  loadReservations,
  tablesError,
  tables,
}) {
  // const [reservations, setReservations] = useState([]);
  // const [reservationsError, setReservationsError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(date);

  return (
    <main>
      <h1 className='pb-3 libreFont'>Dashboard</h1>

      {/* buttons for navigating through the reservation dates */}
      <DashboardButtons
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        date={date}
      />

      {/* <div className="d-md-flex m-3">
        <br />
      </div> */}

      {/* {JSON.stringify(reservations)} */}
      <div className='row'>
        <div className='column m-5 '>
          <h3 className='montFont'>Reservations for {date}</h3>
          <div>
            {reservations.length === 0 ? (
              <div className='d-md-flex m-3'>
                <h3 className='montFont'>No reservations to show</h3>
              </div>
            ) : (
              <ListDailyReservations reservations={reservations} />
            )}
          </div>
        </div>
        <div className='column m-5'>
          <h3 className='montFont'>Tables</h3>
          <div
            className='tables'
            style={{
              position: 'relative',
              height: '500px',
              width: '200px',
              overflow: 'scroll',
              marginBottom: '100px',
            }}>
            <ListTables tables={tables} />
          </div>
        </div>
      </div>
      <ErrorAlert error={reservationsError} />
      {/* This error is getting thrown when dashboard is initially loaded. Why? */}
    </main>
  );
}

export default Dashboard;
