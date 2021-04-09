'use strict';
const express = require('express');
const router = express.Router();
const QRController = require('../controllers/QRController');
const authController = require('./../controllers/authController');

// Protect all routes after this middleware
router.use(authController.protect);

// Available by every user
router
    .route('/:id')
    .get(QRController.getQR);

router
    .route('/')
    .get(QRController.getAllQR);

// Only admin have permission to access for the below APIs
router.use(authController.restrictTo('admin'));

router.post('/add', QRController.addQR);

router
    .route('/:id')
    .patch(QRController.updateQR)
    .delete(QRController.deleteQR);

module.exports = router;