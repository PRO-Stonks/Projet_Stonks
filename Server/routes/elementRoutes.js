/**
 * API endpoints
 * See API document to see how to use them
 */
'use strict';
const express = require('express');
const router = express.Router();
const elementController = require('../controllers/elementController');
const authController = require('../controllers/authController');

// Protect all routes after this middleware
router.use(authController.protect);

// Available by every user

router
    .route('/local/:location/')
    .get(elementController.getAllElementsByLocation);

router
    .route('/product/:product/')
    .get(elementController.getAllElementsByProduct);

router
    .route('/move/:id/:location')
    .patch(elementController.moveElement);

router
    .route('/QR/:code')
    .get(elementController.getElementByQR)
    .delete(elementController.deleteElementByQR);

router
    .route('/')
    .get(elementController.getAllElements);

router.post('/add', elementController.addElement);

router
    .route('/:id')
    .get(elementController.getElement)
    .patch(elementController.updateElement)
    .delete(elementController.softDeleteElement);

// Only admin have permission to access for the below APIs
router.use(authController.restrictTo('admin'));

router
    .route('/hardDel/:id')
    .delete(elementController.deleteElement);

router
    .route('/hardDel/')
    .delete(elementController.deleteAllElement);

module.exports = router;