/**
 * API endpoints
 * See API document to see how to use them
 */
'use strict';
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authController = require('../controllers/authController');

// Protect all routes after this middleware
router.use(authController.protect);
// Restrict to admin
router.use(authController.restrictTo('admin'));

router
    .route('/connections')
    .get(eventController.getAllConnectionEvent);

router
    .route('/connections/:id')
    .get(eventController.getConnectionEvent);

router
    .route('/connections/user/:id')
    .get(eventController.getConnectionEventForUser);


router
    .route('/order/')
    .get(eventController.getAllOrderEvent);

router
    .route('/order/:id')
    .get(eventController.getOrderEvent);

router
    .route('/element/')
    .get(eventController.getAllElementEvent);

router
    .route('/element/:id')
    .get(eventController.getElementEvent);

router
    .route('/element/product/:id')
    .get(eventController.getElementEventForProduct);

router
    .route('/element/event/:id')
    .get(eventController.getElementEventForElement);

router
    .route('/element/user/:id')
    .get(eventController.getElementEventForUser);

module.exports = router;