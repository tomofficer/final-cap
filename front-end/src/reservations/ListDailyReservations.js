import { Link } from 'react-router-dom';

const ListDailyReservations = ({ reservations }) => {
  //event handlers
  function clearTableHandler() {
    alert('ya cleared');
  }

  //reservation list
  let reservationList = reservations.map((res) => {
    return (
      <ul key={res.reservation_id}>
        <h4 className='mt-4'>
          {res.first_name} {res.last_name}
        </h4>
        <span>
          <li>Mobile Number: {res.mobile_number}</li>
          <li>Date: {res.reservation_date}</li>
          <li>Time: {res.reservation_time}</li>
          <li>Group Size: {res.people}</li>
          <li>Status: {res.status}</li>
        </span>
        <div className='row'>
          <div className='col'>
            <Link to={`reservations/${res.reservation_id}/edit`}>
              {res.status !== 'seated' ? (
                <button className='btn btn-success mr-4 mt-4'>
                  Update Reservation
                </button>
              ) : (
                <></>
              )}
            </Link>
            <Link to={`/reservations/${res.reservation_id}/seat`}>
              {res.status !== 'seated' ? (
                <button
                  href={`/reservations/${res.reservation_id}/seat`}
                  className='btn btn-info mt-4 mr-4'>
                  Seat Reservation
                </button>
              ) : (
                <></>
              )}
            </Link>
            {res.status === 'seated' ? (
              <button
                onClick={clearTableHandler}
                className='btn btn-danger mt-4'>
                Clear Table
              </button>
            ) : (
              <></>
            )}
          </div>
          <div className='col text-right'></div>
        </div>
        <hr></hr>
      </ul>
    );
  });
  return reservationList;
};

export default ListDailyReservations;
