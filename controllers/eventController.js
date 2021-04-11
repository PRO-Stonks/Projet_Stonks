'use strict';
const {ConnectionEvent, OrderEvent, ElementEvent} = require('../models/eventModel');
const base = require('./baseController');


exports.getAllConnectionEvent = base.getAll(ConnectionEvent);
exports.getConnectionEvent = base.getOne(ConnectionEvent);

exports.getAllOrderEvent = base.getAll(OrderEvent);
exports.getOrderEvent = base.getOne(OrderEvent);

exports.getAllElementEvent = base.getAll(ElementEvent);
exports.getElementEvent = base.getOne(ElementEvent);

exports.getElementEventForElement = base.getDocumentWithFilter(ElementEvent, "element");
exports.getElementEventForUser = base.getDocumentWithFilter(ElementEvent, "user");

exports.getConnectionEventForUser = base.getDocumentWithFilter(ConnectionEvent, "user");

exports.getOrderEventForUser = base.getDocumentWithFilter(OrderEvent, "user");

exports.hardDeleteAllConnectionEvent = base.deleteAll(ConnectionEvent);
exports.hardDeleteAllOrderEvent = base.deleteAll(OrderEvent);
exports.hardDeleteAllElementEvent = base.deleteAll(ElementEvent);