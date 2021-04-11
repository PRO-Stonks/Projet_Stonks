'use strict';
const Element = require("../models/elementModel");
const QRModel = require("../models/QRModel");
const Location = require("../models/locationModel");
const {ElementEvent} = require("../models/eventModel");
const base = require("./baseController");
const AppError = require("../utils/appError");
const mongoose = require("mongoose");
const {promisify} = require("util");

exports.softDeleteElement = async (req, res, next) => {
    try {
        const session = await mongoose.startSession();
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
            res.status(204).json({
                status: 'success',
                data: null
            });
        }).catch(err =>{
            return next(new AppError(404, 'fail', 'No document found with that id'), req, res, next);
        });
    } catch (error) {
        next(error);
    } finally {
        session.endSession();
    }
};

exports.getAllElementsByLocation = base.getDocumentWithFilter(Element, "idLocation", "location");

exports.addElement = async (req, res, next) => {
    try {
        // TODO Add to documentation that client need to send the data of the qr and not the database id
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
        const session = await mongoose.startSession();

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
        session.endSession();
    }
};

exports.moveElement = async (req, res, next) => {
    if(!req.params.location){
        return next(new AppError(400, 'fail', 'IdLocation is missing'), req, res, next);
    }
    const location = await Location.findById(
        req.params.location
    );
    if(!location){
        return next(new AppError(404, 'fail', 'IdLocation not found'), req, res, next);
    }
    try {
        const session = await mongoose.startSession();
        let doc = {}
        await session.withTransaction(async () => {
            doc = await Element.findByIdAndUpdate(req.params.id, {
                idLocation: req.params.location
            }, {
                runValidators: true
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
            res.status(204).json({
                status: 'success',
                data: doc
            });
        }).catch(err =>{
            console.log(err);
            return next(new AppError(404, 'fail', 'No document found with that id'), req, res, next);
        });

    } catch (error) {
        next(error);
    } finally {
        session.endSession();
    }
};


exports.updateElement = async (req, res, next) => {
    if (req.body.hasOwnProperty("idLocation")){
        return next(new AppError(404, 'fail', 'Do not modify idLocation in an update. Use Move instead'), req, res, next);
    }
    return base.updateOne(Element)(req, res, next);
};

exports.deleteElement = base.deleteOne(Element);

exports.getElement = base.getOne(Element);
exports.getAllElements = base.getAll(Element);