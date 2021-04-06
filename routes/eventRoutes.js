'use strict';
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authController = require('./../controllers/authController');

// Protect all routes after this middleware
router.use(authController.protect);
// Restrict to admin
router.use(authController.restrictTo('admin'));

router
    .route('/connections/')
    .get(eventController.getAllConnectionEvent);

router
    .route('/connections/:id')
    .get(eventController.getConnectionEvent);

router
    .route('/order/')
    .get(eventController.getAllOrderEvent);

router
    .route('/connections/:id')
    .get(eventController.getOrderEvent);

router
    .route('/element/')
    .get(eventController.getAllProductEvent);

router
    .route('/element/:id')
    .get(eventController.getProductEvent);

module.exports = router;