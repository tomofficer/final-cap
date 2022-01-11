const service = require('./tables.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const resService = require('../reservations/reservations.service');
const hasProperties = require('../errors/hasProperties')(
  'table_name',
  'capacity'
);

async function reservationValidation(req, res, next) {
  if (!req.body.data) {
    return next({
      status: 400,
      message: 'Reservation not found.',
    });
  }
  if (!req.body.data.reservation_id) {
    return next({
      status: 400,
      message: 'reservation_id not found',
    });
  }
  const reservation = await resService.listById(req.body.data.reservation_id);

  if (reservation === undefined) {
    return next({
      status: 404,
      message: `reservation_id: ${req.body.data.reservation_id} not found`,
    });
  }
  res.locals.reservation = reservation;
  next();
}

async function validateInput(req, res, next) {
  if (!req.body.data) {
    return next({
      status: 400,
      message: 'No data found in req.body',
    });
  }
  const { table_name, capacity } = req.body.data;
  const validCapacity = typeof capacity === 'number';

  if (table_name.length < 2) {
    return next({
      status: 400,
      message: 'Invalid table_name',
    });
  }
  if (capacity == 0 || validCapacity == false) {
    return next({
      status: 400,
      message: 'Invalid capacity',
    });
  }
  next();
}

async function tableValidation(req, res, next) {
  const reservation = res.locals.reservation;
  const { table_id } = req.params;
  const table = await service.read(table_id);
  if (table) {
    res.locals.table = table;
    if (reservation.people > table.capacity) {
      return next({
        status: 400,
        message: 'Insufficient table capacity',
      });
    }
    if (table.reservation_id) {
      return next({
        status: 400,
        message: 'Table is occupied',
      });
    }
    next();
  } else {
    return next({
      status: 404,
      message: `table_id: ${table_id} not found`,
    });
  }
}

async function alreadySeated(req, res, next) {
  const status = res.locals.reservation.status;
  if (status === 'seated') {
    return next({
      status: 400,
      message: 'reservation is already seated',
    });
  }
  next();
}

async function update(req, res, next) {
  const { reservation_id } = req.body.data;
  await resService.updateResStatus(Number(reservation_id), 'seated');
  const updatedTable = {
    ...res.locals.table,
    reservation_id: reservation_id,
  };
  res.json({ data: await service.update(updatedTable) });
}

async function create(req, res) {
  const newTable = await service.create(req.body.data);
  res.status(201).json({ data: newTable });
}

async function list(req, res) {
  const tables = await service.listByName();
  res.json({ data: [...tables] });
}

async function destroyValidate(req, res, next) {
  const { table_id } = req.params;
  const table = await service.read(table_id);
  if (!table) {
    return next({
      status: 404,
      message: `table_id: ${table_id}, not found `,
    });
  }
  if (!table.reservation_id) {
    return next({
      status: 400,
      message: `Table: ${table.table_id} is not occupied`,
    });
  }
  res.locals.table = table;
  next();
}

async function destroy(req, res) {
  const table = res.locals.table;
  const res_id = table.reservation_id;
  await service.removeResFromTable(table.table_id);
  const data = await resService.updateResStatus(Number(res_id), 'finished');
  res.json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    hasProperties,
    asyncErrorBoundary(validateInput),
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(reservationValidation),
    asyncErrorBoundary(tableValidation),
    asyncErrorBoundary(alreadySeated),
    asyncErrorBoundary(update),
  ],
  destroy: [asyncErrorBoundary(destroyValidate), asyncErrorBoundary(destroy)],
};
