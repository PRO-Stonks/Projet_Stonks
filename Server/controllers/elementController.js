/**
 * Behaviour for Element access
 */
'use strict';
const Element = require("../models/elementModel");
const QRModel = require("../models/QRModel");
const Location = require("../models/locationModel");
const Product = require("../models/productModel");
const {ElementEvent} = require("../models/eventModel");
const {ProductAlert, ElementAlert} = require('../models/alertModel');
const base = require("./baseController");
const AppError = require("../utils/appError");
const mongoose = require("mongoose");
const APIFeatures = require("../utils/apiFeatures");


/**
 * Soft delete handler
 * @behaviour Disable an element, and create an event to journal it
 * @param req user request
 * @param res response
 * @param next handler
 * @returns {Promise<void>}
 */
const softDeleteElement = async (req, res, next) => {
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
                change: "Remove",
                product: doc.idProduct
            });
            // Remove alert about this element
            await ElementAlert.findByIdAndDelete(req.params.id);

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
 * Soft delete handler
 * @behaviour Disable an element, and create an event to journal it
 * @param req user request
 * @param res response
 * @param next handler
 * @returns {Promise<void>}
 */
exports.softDeleteElement = softDeleteElement;

/**
 * Delete handler
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void|*>}
 */
exports.deleteElementByQR = async (req, res, next) => {
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
    }).populate("idProduct", "lowQuantity");

    if (!element) {
        return next(new AppError(404, 'fail', 'No element found with that id'), req, res, next);
    }

    try {
        if (element.idProduct.lowQuantity !== 0) {
            const count = await Element.countDocuments({idProduct: element.idProduct._id, active: true})
            if (count-1 < element.idProduct.lowQuantity) {
                await ProductAlert.create({idProduct: element.idProduct._id}).catch(err => console.log(err));
            }
        }
    } catch (err) {
        next(new AppError(404, 'fail', 'An error occurred while trying to verify the item quantity'), req, res, next)
    }

    req.params.id = element._id;
    return softDeleteElement(req, res, next);
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
    const product = await Product.findById(req.body.idProduct);
    if(!product){
        return next(
            new AppError(400, "fail", "The product selected does not exist"),
            req,
            res,
            next,
        );
    }

    // Setup object as expected by DB
    req.body.idQR = QR._id;
    delete req.body.code;
    let session;
    try {
        session = await mongoose.startSession();

        const data = await session.withTransaction(async () => {
            const doc = await Element.create(req.body);

            await ElementEvent.create({
                user: req.user.id,
                element: doc._id,
                product: doc.idProduct
            });

            if (product.lowQuantity !== 0) {
                const count = await Element.countDocuments({idProduct: product._id, active: true})
                if (count >= product.lowQuantity) {
                    await ProductAlert.deleteOne({idProduct: product._id}).catch(err => console.log(err));
                }
            }


            return doc
        });
        session.endSession();
        session = null;
        res.status(201).json({
            status: 'success',
            data: data
        });

    } catch (err) {
        return base.manageValidationError(err, req, res, next);
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

        const features = new APIFeatures(Element.findOne({
            idQR: QR._id,
            active: true
        }), req.query)
            .sort()
            .populate()
            .paginate();
        const doc = await features.query;

        if (!doc) {
            return next(new AppError(404, 'fail', 'No element found with that id'), req, res, next);
        }

        res.status(200).json({
            status: 'success',
            data: doc
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
                oldLocation: doc.idLocation,
                product: doc.idProduct
            });
        }).then(dat => {
            doc.idLocation = req.params.location;
            res.status(200).json({
                status: 'success'
            });
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
exports.getAllElementsByLocation = base.getDocumentWithFilterAndPopulate(Element, "idLocation", [{path: "idProduct"}], "location");

/**
 * Get All handler
 * @type {function(Response.req, res, next): Promise<Document[]>}
 */
exports.getAllElementsByProduct = base.getDocumentWithFilterAndPopulate(Element, "idProduct", [{
    path: "idLocation",
    select: "name"
}], "product");

/**
 * Hard delete element handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.deleteElement = async (req, res, next) => {
    try {
        const doc = await Element.findByIdAndDelete(req.params.id);

        if (!doc) {
            return next(new AppError(404, 'fail', 'No document found with that id'), req, res, next);
        }

        await Promise.allSettled([
            ElementAlert.deleteMany({idElement: req.params.id}),
            ElementEvent.deleteMany({element: req.params.id}),
        ]);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

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


exports.deleteAllElement = async (req, res, next) => {
    try {
        await Promise.allSettled([
            Element.deleteMany({}),
            ElementEvent.deleteMany({}),
            ElementAlert.deleteMany({})
        ]);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}