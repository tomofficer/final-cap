import { useState, useEffect } from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';
import Dashboard from '../dashboard/Dashboard';
import NotFound from './NotFound';
import { today } from '../utils/date-time';
import NewReservation from '../reservations/NewReservation';
import EditReservation from '../reservations/EditReservation';
import useQuery from '../utils/useQuery';
import { listReservations, listTables } from '../utils/api';
import ReservationSearch from '../reservations/ReservationSearch';
import NewTable from '../reservations/NewTable';
import SeatReservation from '../reservations/SeatReservation';

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */

const Routes = () => {
  const query = useQuery();
  const date = query.get('date');
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  useEffect(loadDashboard, [date]);

  //load all reservations
  function loadReservations() {
    setReservationsError(null);
    return listReservations({ date })
      .then(setReservations)
      .catch(setReservationsError);
  }

  //load tables
  function loadTables() {
    setTablesError(null);
    return listTables({ date }).then(setTables).catch(setTablesError);
  }

  //load dashboard
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  return (
    <Switch>
      <Route exact={true} path='/'>
        <Redirect to={'/dashboard'} />
      </Route>
      <Route path='/reservations/:reservation_id/edit'>
        <EditReservation loadReservations={loadReservations} />
      </Route>
      <Route exact path='/search'>
        <ReservationSearch />
      </Route>
      <Route path='/reservations/:reservation_id/seat'>
        <SeatReservation tables={tables} />
      </Route>
      <Route path='/reservations/new'>
        <NewReservation />
      </Route>
      <Route exact={true} path='/reservations'>
        <Redirect to={'/dashboard'} />
      </Route>
      <Route path='/dashboard'>
        <Dashboard
          date={date ? date : today()}
          reservations={reservations}
          reservationsError={reservationsError}
          loadReservations={loadReservations}
          loadTables={loadTables}
          tablesError={tablesError}
          tables={tables}
        />
      </Route>
      <Route path='/tables/new'>
        <NewTable />
      </Route>

      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
};

export default Routes;
