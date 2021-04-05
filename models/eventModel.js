'use strict';
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const eventSchema = new mongoose.Schema({
    time: {
        type: Date,
        default: Date.now,
        immutable: true
    }
}, {discriminatorKey: 'kind'});

const eventConnection = new mongoose.Schema({
    ip: {
        type: String,
        required: true,
        validate: [validator.isIP, "IP is invalid"],
        immutable: true
    },
    userAgent: {
        type: String,
        required: true,
        immutable: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        validate: [validator.isMongoId, "UserId is invalid"],
        immutable: true
    }
});

const eventOrder = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        validate: [validator.isMongoId, "UserId is invalid"],
        immutable: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        validate: [validator.isMongoId, "UserId is invalid"],
        immutable: true
    }
});

const eventProduct = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        validate: [validator.isMongoId, "UserId is invalid"],
        immutable: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        validate: [validator.isMongoId, "ProductId is invalid"],
        immutable: true
    },
    change: {
        type: String,
        enum: ["Creation", "Move", "Remove"],
        default: "Creation",
        immutable: true
    },
    oldLocation: {
        type: mongoose.Schema.Types.ObjectId,
        validate: [validator.isMongoId, "LocationId is invalid"],
        required: {
            validator: function () {
                return this.change === "Move";
            },
            message: "Location is required"
        },
        immutable: true
    }
});


const Event = mongoose.model("Event", eventSchema);
const ConnectionEvent = Event.discriminator("ConnectionEvent", eventConnection);
const OrderEvent = Event.discriminator("OrderEvent", eventOrder);
const ProductEvent = Event.discriminator("ProductEvent", eventProduct);
module.exports = {
    Event,
    ConnectionEvent,
    OrderEvent,
    ProductEvent
};