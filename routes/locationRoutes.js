'use strict';
const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const authController = require('./../controllers/authController');

// Protect all routes after this middleware
router.use(authController.protect);

// Available by every user
router
    .route('/:id')
    .get(locationController.getLocation);

router
    .route('/')
    .get(locationController.getAllLocations);

// Only admin have permission to access for the below APIs
router.use(authController.restrictTo('admin'));

router.post('/add', locationController.addLocation);

router
    .route('/:id')
    .patch(locationController.updateLocation)
    .delete(locationController.deleteLocation);

module.exports = router;