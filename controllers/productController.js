'use strict';
const Product = require("../models/productModel");
const base = require("./baseController");

exports.softDeleteProduct = async (req, res, next) => {
    // As i understood, we won't remove the products to keep track on logs
    // we'll just put a variable to false
    // maybe we should add a methide named "softDelete" on baseController ?
    try {
        Product.findByIdAndUpdate(req.product.id, {
            active: false
        });

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