/**
 * Manage element alert representation in the db
 * See specs and EA schema for more details
 */
'use strict';
const mongoose = require('mongoose');

const elementAlertSchema = new mongoose.Schema({
    idElement: {
        type: mongoose.Types.ObjectId,
        ref: 'Element',
        required: [true, "Please provide an Element id"],
        unique: true
    },
});

const productAlertSchema = new mongoose.Schema({
    idProduct: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: [true, "Please provide a Product id"],
        unique: true
    },
});

const ElementAlert = mongoose.model("ElementAlert", elementAlertSchema);
const ProductAlert = mongoose.model("ProductAlert", elementAlertSchema);

module.exports = {
    ElementAlert,
    ProductAlert
};