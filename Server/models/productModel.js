/**
 * Manage Product representation in the db
 * See specs and EA schema for more details
 */
'use strict';
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { // I think, we need to make 'name' unique or it will be possible to have 2 products named 'Coca Cola zero'
        type: String,
        required: [true, "Please provide a name for this product"]
    },
    tag: {
        type: String,
        required: [true, "Please provide a tag for this product"]
    },
    lowQuantity: {
        type: Number,
        default: 0,
        min: 0
    },
    active: {
        type: Boolean,
        default: true,
    },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;