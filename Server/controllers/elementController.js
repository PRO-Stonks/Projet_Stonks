/**
 * Behaviour for Element access
 */
'use strict';
const Element = require("../models/elementModel");
const QRModel = require("../models/QRModel");
const Location = require("../models/locationModel");
const {ElementEvent} = require("../models/eventModel");
const base = require("./baseController");
const AppError = require("../utils/appError");
const mongoose = require("mongoose");

/**
 * Soft delete handler
 * @behaviour Disable an element, and create an event to journal it
 * @param req user request
 * @param res response
 * @param next handler
 * @returns {Promise<void>}
 */
exports.softDeleteElement = async (req, res, next) => {
    let session;
    try {
        session = await mongoose.startSession();
        // Transaction to revert all in case of error (I hate BDR)
        await session.withTransaction(async () => {
            const doc = await Element.findByIdAndUpdate(req.params.id, {
                active: false
            });
            if (!doc) {
                throw Error;
            }

            await ElementEvent.create({
                user: req.user.id,
                element: doc._id,
                change: "Remove"
            });
            return doc
        }).then(dat => {
            res.status(204).send();
        }).catch(err => {
            return next(new AppError(404, 'fail', 'No document found with that id'), req, res, next);
        });
    } catch (error) {
        next(error);
    } finally {
        if (session) {
            session.endSession();
        }
    }
};

/**
 * Creation handler
 *
 * @behaviour Check that QR code was created, check if not used and then create the new element
 * @param req user request
 * @param res response
 * @param next handler
 * @returns {Promise<*>}
 */
exports.addElement = async (req, res, next) => {
    let session;
    try {
        const QR = await QRModel.findOne({
            code: req.body.code,
        });

        if (!QR) {
            return next(
                new AppError(404, "fail", "The QR code does not exist"),
                req,
                res,
                next,
            );
        }

        const element = await Element.findOne({
            idQR: QR._id,
            active: true
        });
        if (element) {
            return next(
                new AppError(400, "fail", "The QR code is already used by another element"),
                req,
                res,
                next,
            );
        }
        // Setup object as expected by DB
        req.body.idQR = QR._id;
        delete req.body.code;
        session = await mongoose.startSession();

        const doc = await session.withTransaction(async () => {
            const doc = await Element.create(req.body);

            await ElementEvent.create({
                user: req.user.id,
                element: doc._id
            });
            return doc
        });
        res.status(201).json({
            status: 'success',
            data: doc
        });

    } catch (err) {
        if (err instanceof mongoose.Error.ValidationError) {
            let errorOutput = ""
            Object.keys(err.errors).forEach((key) => {
                errorOutput += err.errors[key].message + "\n";
            });

            next(new AppError(400, "Invalid Input", errorOutput),
                req,
                res,
                next);
        } else {
            next(err);
        }
    } finally {
        if (session) {
            session.endSession();
        }
    }
};

exports.getElementByQR = async (req, res, next) => {
    try {
        const QR = await QRModel.findOne({
            code: req.params.code,
        });

        if (!QR) {
            return next(
                new AppError(404, "fail", "The QR code does not exist"),
                req,
                res,
                next,
            );
        }

        const element = await Element.findOne({
            idQR: QR._id,
            active: true
        });

        if (!element) {
            return next(new AppError(404, 'fail', 'No element found with that id'), req, res, next);
        }

        res.status(200).json({
            status: 'success',
            data: element
        });


    } catch (error) {
        next(error);
    }
};

/**
 * Change location handler
 * @param req user request
 * @param res response
 * @param next handler
 * @returns {Promise<*>}
 */
exports.moveElement = async (req, res, next) => {
    if (!req.params.location) {
        return next(new AppError(400, 'fail', 'IdLocation is missing'), req, res, next);
    }
    const location = await Location.findById(
        req.params.location
    );
    if (!location) {
        return next(new AppError(404, 'fail', 'IdLocation not found'), req, res, next);
    }
    let session;
    try {
        session = await mongoose.startSession();
        let doc = {}
        await session.withTransaction(async () => {
            doc = await Element.findByIdAndUpdate(req.params.id, {
                idLocation: req.params.location
            }, {
                runValidators: true,
                context: 'query'
            });
            if (!doc) {
                throw Error;
            }

            await ElementEvent.create({
                user: req.user.id,
                element: doc._id,
                change: "Move",
                oldLocation: doc.idLocation

            });
        }).then(dat => {
            doc.idLocation = req.params.location;
            res.status(200).json({
                status: 'success',
                data: doc
            });
        }).catch(err => {
            console.log(err);
            return next(new AppError(404, 'fail', 'No document found with that id'), req, res, next);
        });

    } catch (error) {
        next(error);
    } finally {
        if (session) {
            session.endSession();
        }
    }
};

/**
 * Update handler
 * @behaviour Standard update but disable updating location
 * @param req user request
 * @param res response
 * @param next handler
 * @returns {Promise<*|undefined>}
 */
exports.updateElement = async (req, res, next) => {
    if (req.body.hasOwnProperty("idLocation")) {
        return next(new AppError(404, 'fail', 'Do not modify idLocation in an update. Use Move instead'), req, res, next);
    }
    return base.updateOne(Element)(req, res, next);
};

/**
 * Get All handler
 * @type {function(Response.req, res, next): Promise<Document[]>}
 */
exports.getAllElementsByLocation = base.getDocumentWithFilter(Element, "idLocation", "location");

/**
 * Hard delete element handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.deleteElement = base.deleteOne(Element);

/**
 * Standard getElement handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.getElement = base.getOne(Element);

/**
 * Standard getAllElement handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.getAllElements = base.getAll(Element);