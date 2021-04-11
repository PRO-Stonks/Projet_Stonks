/**
 * Manage element representation in the db
 * See specs and EA schema for more details
 */
'use strict';
const mongoose = require('mongoose');

const elementSchema = new mongoose.Schema({
    idQR: {
        type: mongoose.Types.ObjectId,
        ref: 'QR',
        required: [true, "Please provide a QR id"]
    },
    entryDate: {
        type: Date,
        required: [true, "Please provide an entry date"],
        immutable: true
    },
    exitDate: {
        type: Date,
    },
    price: {
        type: Number,
        required: [true, "Please provide a price"],
        min: 0
    },
    idProduct: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: [true, "Please provide a Product id"]
    },
    idLocation: {
        type: mongoose.Types.ObjectId,
        ref: 'Location',
        required: [true, "Please provide a Location id"]
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
});

const Element = mongoose.model("Element", elementSchema);
module.exports = Element;