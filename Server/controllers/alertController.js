/**
 * Behaviour for Alert access
 */
'use strict';
const {ElementAlert, ProductAlert} = require('../models/alertModel');
const base = require('./baseController');
const Element = require("../models/elementModel");

/**
 * getAllElementAlert handler
 * @type {function(Response.req, res, next): Promise<Document[]>}
 */
exports.getAllElementAlert = base.getAll(ElementAlert);

/**
 * getAllProductAlert handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.getAllProductAlert = base.getAll(ProductAlert);


/**
 * Delete handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.deleteProductAlert = base.deleteOne(ProductAlert);

/**
 * Delete handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.deleteElementAlert = base.deleteOne(ElementAlert);


exports.verifyElement = async (req, res, next) => {
    const doc = await Element.find({ active: true
        , exitDate: {$lt: new Date()}});

    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: doc
    });

}
