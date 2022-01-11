const service = require('./reservations.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

const hasProperties = require('../errors/hasProperties')(
  'first_name',
  'last_name',
  'mobile_number',
  'reservation_date',
  'reservation_time',
  'people'
);

async function listById(req, res, next) {
  const reservation_id = req.params.reservation_id;
  const data = await service.listById(reservation_id);
  data
    ? res.json({ data: data })
    : next({
        status: 404,
        message: `Reservation Id: ${reservation_id} Not Found`,
      });
}

async function list(req, res) {
  const { date, currentDate, mobile_number } = req.query;
  if (date) {
    const data = await service.listByDate(date);
    res.json({ data });
  } else if (currentDate) {
    const data = await service.listByDate(currentDate);
    res.json({ data });
  } else if (mobile_number) {
    const data = await service.search(mobile_number);
    res.json({ data });
  } else {
    const data = await service.list();
    res.json({ data });
  }
}

async function update(req, res, next) {
  if (req.body.data.reservation_id) {
    res.json({
      data: await service.update(req.body.data.reservation_id, req.body.data),
    });
  } else {
    next({
      status: 404,
      message: 'no reservation_id found',
    });
  }
}

async function updateReservation(req, res, next) {
  const { reservation_id } = req.params;
  const data = await service.updateResStatus(
    Number(reservation_id),
    req.body.data.status
  );
  res.json({ data });
}

function validateReservation(req, res, next) {
  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = req.body.data;

  const validDateFormat = /\d\d\d\d-\d\d-\d\d/;
  const validTimeFormat = /\d\d:\d\d/;
  const validPeople = typeof people === 'number';
  const isValidDate = reservation_date.match(validDateFormat);
  const isValidTime = reservation_time.match(validTimeFormat);
  const today = new Date();
  const reservationDate = new Date(
    `${reservation_date}T${reservation_time}:00`
  );

  if (
    reservationDate.getHours() < 10 ||
    (reservationDate.getHours() === 10 && reservationDate.getMinutes() < 30)
  ) {
    return next({
      status: 400,
      message: 'Error: Restaurant is will open at 10:30AM.',
    });
  } else if (
    reservationDate.getHours() > 22 ||
    (reservationDate.getHours() === 22 && reservationDate.getMinutes() >= 30)
  ) {
    return next({
      status: 400,
      message: 'Error: Restaurant is closed after 10:30PM.',
    });
  } else if (
    reservationDate.getHours() > 21 ||
    (reservationDate.getHours() === 21 && reservationDate.getMinutes() > 30)
  ) {
    return next({
      status: 400,
      message:
        'Error: Reservation must be made at least an hour before closing.',
    });
  }
  if (
    isValidDate &&
    reservationDate.getDay() !== 2 &&
    reservationDate >= today &&
    isValidTime &&
    validPeople
  ) {
    return next();
  } else {
    next({
      status: 400,
      message:
        `${isValidDate}Invalid data format provided. Requires {string: [first_name, last_name, mobile_number], date: reservation_date, time: reservation_time, number: people}` +
        'Restaurant cannot be closed, reservation must be in the future',
    });
  }
}

async function statusValidation(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.listById(Number(reservation_id));
  if (!reservation) {
    return next({
      status: 404,
      message: `Reservation Id: ${reservation_id} not found.`,
    });
  }
  VALID_STATUS = ['booked', 'seated', 'finished', 'cancelled'];
  if (!VALID_STATUS.includes(req.body.data.status)) {
    return next({
      status: 400,
      message: `Status: ${req.body.data.status} unknown.`,
    });
  }
  if (reservation.status === 'finished') {
    return next({
      status: 400,
      message: 'a finished reservation cannot be updated',
    });
  }

  next();
}

async function isNewReservation(req, res, next) {
  const reservation = req.body.data;
  if (reservation.status === 'seated' || reservation.status === 'finished') {
    return next({
      status: 400,
      message: `${reservation.status} should be booked when creating a new reservation`,
    });
  }
  next();
}

async function create(req, res, next) {
  const newReservation = await service.create(req.body.data);
  res.status(201).json({ data: newReservation });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    hasProperties,
    validateReservation,
    asyncErrorBoundary(isNewReservation),
    asyncErrorBoundary(create),
  ],
  listById,
  updateReservation: [
    asyncErrorBoundary(statusValidation),
    asyncErrorBoundary(updateReservation),
  ],
  update: [hasProperties, validateReservation, asyncErrorBoundary(update)],
};
