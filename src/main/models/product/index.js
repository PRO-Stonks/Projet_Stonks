'use strict';

let buildMakeProduct = require('./product');
let productSchema = require('./product-schema');

let productValidator = require('../validator/')(productSchema);

module.exports = buildMakeProduct(productValidator);