'use strict';
const Element = require("../models/elementModel");
const base = require("./baseController");

exports.softDeleteElement = base.softDeleteOne(Element);

exports.getAllElementsByLocation = base.getDocumentWithFilter(Element, "idLocation", "location");

exports.addElement = base.createOne(Element);
exports.deleteElement = base.deleteOne(Element);
exports.updateElement = base.updateOne(Element);
exports.getElement = base.getOne(Element);
exports.getAllElements = base.getAll(Element);