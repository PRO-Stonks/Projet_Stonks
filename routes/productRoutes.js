'use strict';
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authController = require('./../controllers/authController');

// Protect all routes after this middleware
router.use(authController.protect);

// Available by every user
router
    .route('/:id')
    .get(productController.getProduct);

router
    .route('/')
    .get(productController.getAllProduct);

// Only admin have permission to access for the below APIs
router.use(authController.restrictTo('admin'));

router.post('/add', productController.addProduct);

router
    .route('/:id')
    .patch(productController.updateProduct)
    .delete(productController.softDeleteProduct);

router
    .route('/hardDel/:id')
    .delete(productController.deleteProduct);

module.exports = router;