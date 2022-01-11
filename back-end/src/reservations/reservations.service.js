const knex = require('../db/connection');
const tableName = 'reservations';

function listByDate(reservation_date) {
  return knex('reservations')
    .select('*')
    .where({ reservation_date })
    .whereNot({ status: 'finished' })
    .andWhereNot({ status: 'cancelled' })
    .orderBy('reservation_time');
}

function read(tableId) {
  return knex('tables').select('*').where({ table_id: tableId }).first();
}

function list() {
  return knex(tableName).select('*');
}

function search(mobile_number) {
  return knex('reservations')
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, '')}%`
    )
    .orderBy('reservation_date');
}

function update(reservation_id, newResData) {
  return knex(tableName)
    .select('*')
    .where({ reservation_id })
    .update(newResData, '*')
    .then((res) => res[0]);
}

function updateReservation(id, reservation) {
  return knex(tableName)
    .where({ reservation_id: id })
    .update(reservation)
    .returning('*')
    .then((createdRecords) => createdRecords[0]);
}

const updateResStatus = (reservation_id, status) => {
  return knex(tableName)
    .update({ status }, '*')
    .where({ reservation_id })
    .then((res) => res[0]);
};

function create(newReservation) {
  return knex(tableName)
    .insert(newReservation, '*')
    .then((createdReservation) => createdReservation[0]);
}

function listById(reservation_id) {
  return knex(tableName)
    .select('*')
    .where({ reservation_id: reservation_id })
    .then((res) => res[0]);
}

module.exports = {
  list,
  create,
  listById,
  listByDate,
  search,
  update,
  updateResStatus,
  read,
  updateReservation,
};
