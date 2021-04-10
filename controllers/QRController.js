'use strict';
const QR = require("../models/QRModel");
const base = require("./baseController");
const mongoose = require("mongoose");
exports.getQR = base.getOne(QR);
exports.getAllQR = base.getAll(QR);

// Admin only
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


exports.deleteQR = base.deleteOne(QR);
exports.deleteAllQR = base.deleteAll(QR);
exports.updateQR = base.updateOne(QR);