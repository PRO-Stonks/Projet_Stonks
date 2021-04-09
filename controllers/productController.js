'use strict';
const Product = require("../models/productModel");
const base = require("./baseController");

exports.softDeleteProduct = base.softDeleteOne(Product);

// Admin only
exports.addProduct = base.createOne(Product);
exports.deleteProduct = base.deleteOne(Product);
exports.deleteAllProduct = base.deleteAll(Product);
exports.updateProduct = base.updateOne(Product);
exports.getProduct = base.getOne(Product);
exports.getAllProduct = base.getAll(Product);