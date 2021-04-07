'use strict';
const Element = require("../models/elementModel");
const base = require("./baseController");
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.softDeleteElement = async (req, res, next) => {
    try {
        const doc = await Element.findByIdAndUpdate(req.params.id, {
            active: false
        });

        if (!doc) {
            return next(new AppError(404, 'fail', 'No document found with that id'), req, res, next);
        }

        res.status(204).json({
            status: 'success',
            data: null
        })

    } catch (error) {
        next(error)
    }
};

exports.getAllElementsByLocation = async (req, res, next ) => {
    try {
        const features = new APIFeatures(Element.find({ idLocation: req.params.location }), req.query)
            .sort()
            .paginate();

        const doc = await features.query;

        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: {
                data: doc
            }
        });

    } catch (error) {
        next(error);
    }
};

exports.addElement = base.createOne(Element);
exports.deleteElement = base.deleteOne(Element);
exports.updateElement = base.updateOne(Element);
exports.getElement = base.getOne(Element);
exports.getAllElements = base.getAll(Element);