/**
 * Behaviour for QR access
 */
'use strict';
const QR = require("../models/QRModel");
const base = require("./baseController");
const mongoose = require("mongoose");
exports.getQR = base.getOne(QR);
exports.getAllQR = base.getAll(QR);

// Admin only
/**
 * QR creation
 * @behaviour Automaticly assign a uid to the QRdata and returns it to the client
 * @param req user request
 * @param res response
 * @param next handler
 * @returns {Promise<void>}
 */
exports.addQR = async (req, res, next) => {
    try {
        const doc = await QR.create({code: new mongoose.Types.ObjectId()});
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
    }
};

/**
 * HardDelete handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.deleteQR = base.deleteOne(QR);

/**
 * HardDeleteAll handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.deleteAllQR = base.deleteAll(QR);

/**
 * HardDelete handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.updateQR = base.updateOne(QR);