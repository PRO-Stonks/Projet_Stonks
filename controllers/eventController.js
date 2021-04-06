'use strict';
const {ConnectionEvent, OrderEvent, ElementEvent} = require('../models/eventModel');
const base = require('./baseController');

/**
 * Util function to get an event based on a criteria
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

exports.getAllElementEvent = base.getAll(ElementEvent);
exports.getElementEvent = base.getOne(ElementEvent);

exports.getElementEventForElement = getEvent(ElementEvent, "element");
exports.getElementEventForUser = getEvent(ElementEvent,"user");

exports.getConnectionEventForUser = getEvent(ConnectionEvent, "user");

exports.getOrderEventForUser = getEvent(OrderEvent, "user");
