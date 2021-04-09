'use strict';
const QR = require("../models/QRModel");
const base = require("./baseController");

exports.getQR = base.getOne(QR);
exports.getAllQR = base.getAll(QR);

// Admin only
exports.addQR = base.createOne(QR);
exports.deleteQR = base.deleteOne(QR);
exports.deleteAllQR = base.deleteAll(QR);
exports.updateQR = base.updateOne(QR);