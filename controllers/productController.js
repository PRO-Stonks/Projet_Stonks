'use strict';
const Product = require("../models/productModel");
const base = require("./baseController");
const AppError = require('../utils/appError');

exports.softDeleteProduct = async (req, res, next) => {
    // As i understood, we won't remove the products to keep track on logs
    // we'll just put a variable to false
    // maybe we should add a methide named "softDelete" on baseController ?
    try {
        const doc = await Product.findByIdAndUpdate(req.params.id, {
            active: false
        });

        if (!doc) {
            return next(new AppError(404, 'fail', 'No document found with that id'), req, res, next);
        }

        res.status(204).json({
            status: 'success',
            data: null
        })
        
    } catch (error) {
        next(error)
    }
}

// Need admin perms
exports.addProduct = base.createOne(Product);
exports.deleteProduct = base.deleteOne(Product);
exports.updateProduct = base.updateOne(Product);

exports.getProduct = base.getOne(Product);
exports.getAllProduct = base.getAll(Product);