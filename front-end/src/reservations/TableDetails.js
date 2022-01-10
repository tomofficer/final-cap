import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import ErrorAlert from '../layout/ErrorAlert';
import { seatReservation, getReservationById } from '../utils/api';
import formatReservationDate from '../utils/format-reservation-date';
/* eslint-disable */
export default function SeatReservation({
  tables,
  reservations,
  loadTables,
  loadReservations,
}) {
  const { reservation_id } = useParams();
  const history = useHistory();
  const [error, setError] = useState(null);
  const [dataError, setDataError] = useState([]);
  const [tableId, setTableId] = useState(0);
  const [reservationData, setReservationData] = useState({});

  function getRes() {
    const abortController = new AbortController();
    setError(null);
    getReservationById(reservation_id, abortController.signal)
      .then(setReservationData)
      .catch(setError);
  }

  useEffect(getRes, [reservation_id]);

  const validation = () => {
    const errors = [];
    let valid = true;
    const table = tables.find((table) => table.table_id === Number(tableId));
    if (reservationData.people > table.capacity) {
      errors.push({ message: 'Table not large enough' });
      valid = false;
    }
    if (table.reservation_id) {
      errors.push({ message: 'Table is occupied' });
      valid = false;
    }
    setDataError(errors);
    return valid;
  };

  async function submitHandler(e) {
    console.log(e.value);
    if (validation()) {
      try {
        await seatReservation(reservation_id, tableId);
        // await loadTables();
        // await loadReservations();
        formatReservationDate(reservationData);
        history.push(`/dashboard?date=${reservationData.reservation_date}`);
      } catch (error) {
        console.log(error);
      }
    }
  }

  function handleClear(e) {
    e.preventDefault();
    alert('ya cleared');
  }

  async function cancelHandler(event) {
    event.preventDefault();
    history.goBack();
  }

  //   async function changeHandler({ target }) {
  //     alert("Select this table?")
  //     submitHandler(target.value);
  //   }

  return (
    <div>
      {dataError.map((err, index) => (
        <ErrorAlert key={index} error={err} />
      ))}

      <div>
        <div className='d-md-flex m-3'></div>
        <ul>
          {tables.map((table, index) => {
            return (
              <div>
                {`${table.reservation_id}` === 'null' ? (
                  <div key={index}>
                    <li key={table.table_id}>Table Name: {table.table_name}</li>
                    <li>Capacity: {table.capacity}</li>
                    <li>Reservation_Id: {table.reservation_id}</li>
                    <li>
                      {`${table.reservation_id}` !== 'null' ? (
                        <button
                          onClick={handleClear}
                          className='btn btn-danger'>
                          Clear Table
                        </button>
                      ) : (
                        <button
                          value={table.table_id}
                          onClick={submitHandler}
                          className='btn btn-info'>
                          Seat Table
                        </button>
                      )}
                    </li>
                    <hr />
                  </div>
                ) : (
                  <></>
                )}
              </div>
            );
          })}
        </ul>
      </div>

      {/* <select
        name="table_id"
        id="table_name"
        onChange={changeHandler}
        value={tableId}
      >
        <option defaultValue={0}>Select A Table</option>
        {tables.map((table) => (
          <option key={table.table_id} value={table.table_id}>
            {table.table_name} - {table.capacity}
          </option>
        ))}
      </select>
      <button type="submit" onClick={submitHandler}>
        Submit
      </button>
      <button onClick={cancelHandler}>Cancel</button> */}
    </div>
  );
}
