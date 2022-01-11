import { useState } from 'react';

const ReservationSearch = () => {
  return (
    <form action='/' method='get' className='mt-5'>
      <label htmlFor='header-search' className='pr-3'>
        <span className='visually-hidden'>Search Reservations</span>
      </label>
      <input
        type='text'
        id='header-search'
        placeholder='Search phone #'
        name='s'
      />
      <button className='btn btn-dark ml-2' type='submit'>
        Search
      </button>
    </form>
  );
};

export default ReservationSearch;
