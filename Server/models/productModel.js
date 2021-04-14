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
    },
    active: { // Still don't completely understand this part
        type: Boolean,
        default: true,
        select: false,
    },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;