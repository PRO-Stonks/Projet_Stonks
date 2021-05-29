/**
 * Behaviour for User access
 */
'use strict';
const User = require('../models/userModel');
const {ConnectionEvent, OrderEvent, ElementEvent} = require('../models/eventModel');
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
exports.deleteUser = async (req, res, next) => {
    try {
        const doc = await User.findByIdAndDelete(req.params.id);

        if (!doc) {
            return next(new AppError(404, 'fail', 'No document found with that id'), req, res, next);
        }

        await Promise.allSettled([
            ConnectionEvent.deleteMany({user: req.params.id}),
            ElementEvent.deleteMany({user: req.params.id}),
            OrderEvent.deleteMany({user: req.params.id})
        ]);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

/**
 * HardDeleteAll handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.deleteAlluser = async (req, res, next) => {
    try {
        await Promise.allSettled([
            User.deleteMany({}),
            ConnectionEvent.deleteMany({}),
            ElementEvent.deleteMany({}),
            OrderEvent.deleteMany({})
        ]);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}