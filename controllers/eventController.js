'use strict';
const {ConnectionEvent, OrderEvent, ProductEvent} = require('../models/eventModel');
const base = require('./baseController');

/**
 * Util function to get ProductEvent based on a criteria
 * @param Model the model to make the request from
 * @param param criteria of the search
 * @returns {function(req, res, next): Promise<Document[]>}
 */
const getEvent = (Model, param) => async ( req, res, next) => {
    let obj = {};
    obj[param]=req.params.id;
    try {
        const doc = await Model.find({obj});

        if (!doc) {
            return next(new AppError(404, 'fail', 'No document found with that id'), req, res, next);
        }

        res.status(200).json({
            status: 'success',
            data: doc
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllConnectionEvent = base.getAll(ConnectionEvent);
exports.getConnectionEvent = base.getOne(ConnectionEvent);

exports.getAllOrderEvent = base.getAll(OrderEvent);
exports.getOrderEvent = base.getOne(OrderEvent);

exports.getAllProductEvent = base.getAll(ProductEvent);
exports.getProductEvent = base.getOne(ProductEvent);

exports.getProductEventForElement = getEvent(ProductEvent, "product");
exports.getProductEventForUser = getEvent(ProductEvent,"user");

exports.getConnectionEventForUser = getEvent(ConnectionEvent, "user");
exports.getOrderEventForUser = getEvent(OrderEvent, "user");
