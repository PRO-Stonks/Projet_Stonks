/**
 * Base controller to handle basic and repeated function
 */
'use strict';
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const mongoose = require("mongoose");

/**
 * Hard delete handler
 * @behaviour Expects params.id to exist
 * @param Model The data model to use the request on
 * @returns {(function(req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.deleteOne = Model => async (req, res, next) => {
    try {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc) {
            return next(new AppError(404, 'fail', 'No document found with that id'), req, res, next);
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

/**
 * Soft delete handler
 * @behaviour Expects params.id to exist
 * @param Model The data model to use the request on
 * @returns {(function(req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.softDeleteOne = Model => async (req, res, next) => {
    try {
        const doc = await Model.findByIdAndUpdate(req.params.id, {
            active: false
        });
        if (!doc) {
            return next(new AppError(404, 'fail', 'No document found with that id'), req, res, next);
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

/**
 * Update Handler
 *
 * @behaviour Expects params.id to exist
 * @param Model The data model to use the request on
 * @returns {(function(req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.updateOne = Model => async (req, res, next) => {
    try {
        if (req.body.hasOwnProperty("active")) {
            return next(new AppError(400, 'fail', 'Do not modify active in an update. Use softDelete instead'), req, res, next);
        }
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            context: 'query'
        });

        if (!doc) {
            return next(new AppError(404, 'fail', 'No document found with that id'), req, res, next);
        }

        res.status(200).json({
            status: 'success',
            data: doc

        });

    } catch (err) {
        if (err instanceof mongoose.Error.ValidationError) {
            let errorOutput = ""
            Object.keys(err.errors).forEach((key) => {
                errorOutput += err.errors[key].message + "\n";
            });
            console.log(err)
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
 * Creation handler
 * @param Model The data model to use the request on
 * @returns {(function(req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.createOne = Model => async (req, res, next) => {
    try {
        const doc = await Model.create(req.body);

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
 * Find handler
 * @behaviour Expects params.id to exist
 * @param Model The data model to use the request on
 * @returns {(function(req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.getOne = Model => async (req, res, next) => {
    try {
        const doc = await Model.findById(req.params.id);

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

/**
 * FindAll handler
 * @param Model The data model to use the request on
 * @returns {(function(req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.getAll = Model => async (req, res, next) => {
    try {
        const features = new APIFeatures(Model.find(), req.query)
            .sort()
            .populate()
            .paginate();

        const doc = await features.query;

        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: doc
        });

    } catch (error) {
        next(error);
    }

};

/**
 * HardDeleteAll handler
 * @param Model The data model to use the request on
 * @returns {(function(req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.deleteAll = Model => async (req, res, next) => {
    try {
        await Model.deleteMany({});

        res.status(204).send();

    } catch (error) {
        next(error);
    }
};

/**
 * Util function to get a document based on a criteria
 * @param Model the model to make the request from
 * @param filter criteria of the search
 * @param param where to get the value of the filter
 * @returns {function(req, res, next): Promise<Document[]>}
 */
exports.getDocumentWithFilter = (Model, filter, param = "id") => async (req, res, next) => {
    let obj = {};
    obj[filter] = req.params[param];
    try {
        const features = new APIFeatures(Model.find(obj), req.query)
            .sort()
            .populate()
            .paginate();
        const doc = await features.query;
        if (!doc) {
            return next(new AppError(404, 'fail', 'No document found with that id'), req, res, next);
        }


        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: doc
        });
    } catch (error) {
        next(error);
    }
};

/**
 *
 * Util function to get a document based on a criteria
 * @param Model the model to make the request from
 * @param filter criteria of the search
 * @param populate which filed to populate
 * @param param where to get the value of the filter
 * @returns {function(req, res, next): Promise<Document[]>}
 */
exports.getDocumentWithFilterAndPopulate = (Model, filter, populate, param = "id") => async (req, res, next) => {
    let obj = {};
    obj[filter] = req.params[param];
    try {

        const doc = await Model.find(obj).populate(populate);
        if (!doc) {
            return next(new AppError(404, 'fail', 'No document found with that id'), req, res, next);
        }


        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: doc
        });
    } catch (error) {
        next(error);
    }
};