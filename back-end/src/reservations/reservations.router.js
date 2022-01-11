/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require('express').Router();
const controller = require('./reservations.controller');
const methodNotAllowed = require('../errors/methodNotAllowed');

router
  .route(':/reservation_id/edit')
  .put(controller.update)
  .all(methodNotAllowed);

router
  .route('/:reservation_id/status')
  .put(controller.updateReservation)
  .all(methodNotAllowed);

router
  .route('/:reservation_id')
  .get(controller.listById)
  .put(controller.update)
  .all(methodNotAllowed);

router
  .route('/')
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = router;
