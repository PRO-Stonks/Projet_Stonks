'use strict';
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authController = require('./../controllers/authController');

// Protect all routes after this middleware
router.use(authController.protect);

router.post('/getOne', productController.getProduct);
router.post('/getAll', productController.getAllProduct);

// Only admin have permission to access for the below APIs
router.use(authController.restrictTo('admin'));

router.delete('/delete', productController.deleteProduct);
router.delete('/softDelete', productController.softDeleteProduct);
router.post('/add', productController.addProduct);

router
    .route('/:id')
    .patch(productController.updateProduct);

module.exports = router;