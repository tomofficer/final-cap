const knex = require('../db/connection');
const tableName = 'tables';

function read(tableId) {
  return knex(tableName).select('*').where({ table_id: tableId }).first();
}

function update(updatedTable) {
  return knex(tableName)
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, '*');
}

function create(table) {
  return knex(tableName)
    .insert(table, '*')
    .then((tables) => tables[0]);
}

function listByName() {
  return knex(tableName).select('*').orderBy('table_name', 'asc');
}

function removeResFromTable(tableId) {
  return knex('tables')
    .update({ reservation_id: null }, '*')
    .where({ table_id: tableId })
    .then((table) => table[0]);
}

module.exports = {
  read,
  update,
  create,
  listByName,
  removeResFromTable,
};
