'use strict';

let Joi = require('joi');

module.exports = Joi.object().keys({
    type: Joi.optional(),
    entryDate: Joi.date().timestamp().required().error(() => 'must have a valid entry date'),
    exitDate: Joi.date().timestamp().required().error(() => 'must have a valid entry date'),
    price: Joi.number().greater(0).optional().error(() => 'must be positive'),
    location: Joi.optional(),
});