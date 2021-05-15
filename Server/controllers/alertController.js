/**
 * Behaviour for Alert access
 */
'use strict';
const {ElementAlert, ProductAlert} = require('../models/alertModel');
const base = require('./baseController');
const Element = require("../models/elementModel");
const APIFeatures = require("../utils/apiFeatures");

/**
 * getAllElementAlert handler
 * @type {function(Response.req, res, next): Promise<Document[]>}
 */
exports.getAllElementAlert = async (req, res, next) => {
    try {
        const features = new APIFeatures(ElementAlert.find().populate([{
            path: "idElement",
            select: "exitDate idProduct idLocation",
            populate : [{path: 'idProduct'}, {path: 'idLocation', select: 'name'}]
        }]), req.query).sort().paginate()

        const doc = await features.query;

        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: doc
        });

    } catch (error) {
        next(error);
    }
}

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

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.verifyElement = async (req, res, next) => {
    const doc = await Element.find({
        active: true
        , exitDate: {$lt: new Date()}
    });

    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: doc
    });

    exports.createAlert();

}

/**
 * Create alert based on db
 */
exports.createAlert = async () => {
    const doc = await Element.find({
        active: true
        , exitDate: {$lt: new Date()}
    });

    doc.forEach(docKey => {
        ElementAlert.findOne({idElement: docKey._id}).then(res => {
            if(!res){
                ElementAlert.create({idElement: docKey._id}).catch(err => console.log(err));
            }
        }).catch(err => console.log("Error while reading"));
    })
}

