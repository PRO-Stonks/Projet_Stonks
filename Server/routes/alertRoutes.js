'use strict';
const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const authController = require('../controllers/authController');

// Protect all routes after this middleware
router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router
    .route('/create/')
    .get(alertController.verifyElement);


router
    .route('/products')
    .get(alertController.getAllProductAlert);

router
    .route('/elements')
    .get(alertController.getAllElementAlert);

router
    .route('/products/:id')
    .get(alertController.deleteProductAlert);

router
    .route('/elements/:id')
    .get(alertController.deleteElementAlert);

module.exports = router;