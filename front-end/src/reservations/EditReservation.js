import { useEffect, useState } from 'react';
import {
  createReservation,
  getReservationById,
  updateReservation,
} from '../utils/api';
import formatReservationDate from '../utils/format-reservation-date';
import formatReservationTime from '../utils/format-reservation-time';
import { useHistory, useParams } from 'react-router-dom';
// import ErrorAlert from "../layout/ErrorAlert";

const EditReservation = () => {
  const [errors, setErrors] = useState(null);
  const history = useHistory();
  const { reservation_id } = useParams();
  const [formFields, setFormFields] = useState({
    first_name: '',
    last_name: '',
    mobile_number: '',
    reservation_date: '',
    reservation_time: '',
    people: '',
  });

  useEffect(() => {
    getReservationById(reservation_id)
      .then((reservation) => {
        formatReservationDate(reservation);
        formatReservationTime(reservation);
        setFormFields({
          first_name: reservation.first_name,
          last_name: reservation.last_name,
          mobile_number: reservation.mobile_number,
          reservation_date: reservation.reservation_date,
          reservation_time: reservation.reservation_time,
          people: reservation.people,
          reservation_id: reservation.reservation_id,
        });
      })
      .catch(setErrors);
  }, [reservation_id]);

  const validateReservation = () => {
    const errorsArr = [];
    const today = new Date();
    const resDate = new Date(formFields.reservation_date);
    const resTime = formFields.reservation_time;

    if (resDate < today) {
      errorsArr.push({ message: 'Please pick a future date' });
    }

    if (resDate.getDay() === 2) {
      errorsArr.push({ message: 'The restaraunt is closed on Tuesdays!' });
    }

    if (resTime < '10:30' || resTime > '17:30') {
      errorsArr.push({
        message:
          'Please select a reservation time between 10:30 AM and 9:30 PM',
      });
    }

    setErrors(errorsArr);
    if (errorsArr.length > 0) {
      return false;
    }
    return true;
  };

  // const errorList = () => {
  //   return errors.map((err, index) => <ErrorAlert key={index} error={err} />);
  // };

  function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    const foundErrors = validateReservation(formFields);

    if (!foundErrors.length) {
      const abortController = new AbortController();
      updateReservation(formFields, abortController.signal)
        .then((output) =>
          history.push(`/dashboard?date=${formFields.reservation_date}`)
        )
        .catch(errors);
      return () => abortController.abort();
    }
  }

  function handleCancel() {
    alert('Are you sure you want to cancel?');
    history.push(`/dashboard?date=${formFields.reservation_date}`);
  }
  return (
    <div className='bootstrap-iso'>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col text-left'>
            <h2 className='pt-5 libreFont'>Update Reservation</h2>
          </div>
          <div className='col mt-5'>
            <button
              onClick={handleCancel}
              className='btn btn-warning'
              type='button'>
              <span className='oi oi-circle-x mr-2'></span>
            </button>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-6 col-sm-6 col-xs-12'>
            <form onSubmit={handleSubmit} method='post'>
              <div className='form-group'>
                <label className='control-label requiredField' htmlFor='name'>
                  First Name
                  <span className='asteriskField'>*</span>
                </label>
                <input
                  className='form-control'
                  id='name'
                  defaultValue={formFields.first_name}
                  name='name'
                  type='text'
                  onChange={(e) =>
                    setFormFields({ ...formFields, first_name: e.target.value })
                  }
                />
              </div>
              <div className='form-group '>
                <label className='control-label requiredField' htmlFor='name1'>
                  Last Name
                  <span className='asteriskField'>*</span>
                </label>
                <input
                  className='form-control'
                  id='name1'
                  name='name1'
                  defaultValue={formFields.last_name}
                  type='text'
                  onChange={(e) =>
                    setFormFields({ ...formFields, last_name: e.target.value })
                  }
                />
              </div>
              <div className='form-group '>
                <label className='control-label requiredField' htmlFor='tel'>
                  Telephone #<span className='asteriskField'>*</span>
                </label>
                <input
                  className='form-control'
                  id='tel'
                  name='tel'
                  placeholder='000-000-0000'
                  defaultValue={formFields.mobile_number}
                  type='text'
                  onChange={(e) =>
                    setFormFields({
                      ...formFields,
                      mobile_number: e.target.value,
                    })
                  }
                />
              </div>
              <div className='form-group '>
                <label className='control-label requiredField' htmlFor='date'>
                  Date
                  <span className='asteriskField'>*</span>
                </label>
                <input
                  className='form-control'
                  id='date'
                  name='date'
                  placeholder='MM-DD-YYYY'
                  type='date'
                  defaultValue={formFields.reservation_date}
                  onChange={(e) =>
                    setFormFields({
                      ...formFields,
                      reservation_date: e.target.value,
                    })
                  }
                />
                <i className='fas fa-calendar input-prefix'></i>
              </div>
              <div className='form-group'>
                <label
                  className='control-label requiredField'
                  htmlFor='inputMDEx1'>
                  Time
                  <span className='asteriskField'>*</span>
                </label>
                <input
                  type='time'
                  id='inputMDEx1'
                  className='form-control'
                  defaultValue={formFields.reservation_time}
                  onChange={(e) =>
                    setFormFields({
                      ...formFields,
                      reservation_time: e.target.value,
                    })
                  }
                />
              </div>
              <div className='form-group '>
                <label className='control-label requiredField' htmlFor='number'>
                  Group Size
                  <span className='asteriskField'>*</span>
                </label>
                <input
                  className='form-control'
                  id='number'
                  name='number'
                  type='number'
                  defaultValue={formFields.people}
                  onChange={(e) =>
                    setFormFields({ ...formFields, people: e.target.value })
                  }
                />
              </div>
              <div className='form-group'>
                <div>
                  <button
                    className='btn btn-primary mr-4'
                    name='submit'
                    type='submit'>
                    <span className='oi oi-check mr-2'></span>
                    Submit
                  </button>

                  <button className='btn btn-danger mr-4'>
                    <span className='oi oi-trash'></span> Cancel Reservation
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditReservation;
