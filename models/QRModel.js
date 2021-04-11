/**
 * Manage QR representation in the db
 * See specs and EA schema for more details
 */
'use strict';
const mongoose = require('mongoose');

const QRSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: [true, "Please provide a QR code"],
    }
});

const QR = mongoose.model("QR", QRSchema);
module.exports = QR;