/**
 * Behaviour for Location access
 */
'use strict';
const Location = require("../models/locationModel");
const base = require("./baseController");

/**
 * Get One handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.getLocation = base.getOne(Location);
/**
 * Get All handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.getAllLocations = base.getAll(Location);

// Admin only
/**
 * Creation handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.addLocation = base.createOne(Location);

/**
 * HardDelete handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.deleteLocation = base.deleteOne(Location);

/**
 * SoftDelete handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.softDeleteLocation = base.softDeleteOne(Location);

/**
 * HardDeleteAll handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.deleteAllLocation = base.deleteAll(Location);

/**
 * Update handler
 * @type {(function(Response.req=, res=, handler=): Promise<*|undefined>)|*}
 */
exports.updateLocation = base.updateOne(Location);