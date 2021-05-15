/**
 * Manage element alert representation in the db
 * See specs and EA schema for more details
 */
'use strict';
const mongoose = require('mongoose');

const elementAlertSchema = new mongoose.Schema({
    idProduct: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: [true, "Please provide a Product id"]
    },
});

const productAlertSchema = new mongoose.Schema({
    idProduct: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: [true, "Please provide a Product id"]
    },
});

const ElementAlert = mongoose.model("ElementAlert", elementAlertSchema);
const ProductAlert = mongoose.model("ProductAlert", elementAlertSchema);

module.exports = {
    ElementAlert,
    ProductAlert
};