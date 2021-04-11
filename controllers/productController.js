/**
 * Behaviour for Product access
 */
'use strict';
const Product = require("../models/productModel");
const base = require("./baseController");

/**
 * SoftDelete handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.softDeleteProduct = base.softDeleteOne(Product);

// Admin only
/**
 * Creation handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.addProduct = base.createOne(Product);

/**
 * HardDelete handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.deleteProduct = base.deleteOne(Product);

/**
 * HardDeleteAll handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.deleteAllProduct = base.deleteAll(Product);

/**
 * Update handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.updateProduct = base.updateOne(Product);

/**
 * GetOne handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.getProduct = base.getOne(Product);

/**
 * GetAll handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.getAllProduct = base.getAll(Product);