/**
 * Behaviour for User access
 */
'use strict';
const User = require('../models/userModel');
const base = require('./baseController');

/**
 * GetAll handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.getAllUsers = base.getAll(User);

/**
 * GetOne handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.getUser = base.getOne(User);

/**
 * Update handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.updateUser = base.updateOne(User);

/**
 * Softdelete handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.softDeleteUser = base.softDeleteOne(User);

/**
 * HardDelete handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.deleteUser = base.deleteOne(User);

/**
 * HardDeleteAll handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.deleteAlluser = base.deleteAll(User);