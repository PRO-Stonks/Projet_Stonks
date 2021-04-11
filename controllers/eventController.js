/**
 * Behaviour for Event access
 */
'use strict';
const {ConnectionEvent, OrderEvent, ElementEvent} = require('../models/eventModel');
const base = require('./baseController');

/**
 * GetAllConnectionEvent handler
 * @type {function(Response.req, res, next): Promise<Document[]>}
 */
exports.getAllConnectionEvent = base.getAll(ConnectionEvent);

/**
 * GetOneConnectionEvent handler
 * @type {function(Response.req, res, next): Promise<Document[]>}
 */
exports.getConnectionEvent = base.getOne(ConnectionEvent);

/**
 * Get All handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.getAllOrderEvent = base.getAll(OrderEvent);
/**
 * Get one handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.getOrderEvent = base.getOne(OrderEvent);

/**
 * Get All handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.getAllElementEvent = base.getAll(ElementEvent);

/**
 * Get One handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.getElementEvent = base.getOne(ElementEvent);

/**
 * Get by location handler
 * @type {function(Response.req, res, next): Promise<Document[]>}
 */
exports.getElementEventForElement = base.getDocumentWithFilter(ElementEvent, "element");

/**
 * Get by user handler
 * @type {function(Response.req, res, next): Promise<Document[]>}
 */
exports.getElementEventForUser = base.getDocumentWithFilter(ElementEvent, "user");

/**
 * Get by user handler
 * @type {function(Response.req, res, next): Promise<Document[]>}
 */
exports.getConnectionEventForUser = base.getDocumentWithFilter(ConnectionEvent, "user");

/**
 * Get by user handler
 * @type {function(Response.req, res, next): Promise<Document[]>}
 */
exports.getOrderEventForUser = base.getDocumentWithFilter(OrderEvent, "user");

/**
 * HardDelete handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.hardDeleteAllConnectionEvent = base.deleteAll(ConnectionEvent);
/**
 * HardDelete handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.hardDeleteAllOrderEvent = base.deleteAll(OrderEvent);
/**
 * HardDelete handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.hardDeleteAllElementEvent = base.deleteAll(ElementEvent);