'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Fournisseur = mongoose.model('Fournisseur'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Fournisseur
 */
exports.create = function(req, res) {
  var fournisseur = new Fournisseur(req.body);
  fournisseur.user = req.user;

  fournisseur.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(fournisseur);
    }
  });
};

/**
 * Show the current Fournisseur
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var fournisseur = req.fournisseur ? req.fournisseur.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  fournisseur.isCurrentUserOwner = req.user && fournisseur.user && fournisseur.user._id.toString() === req.user._id.toString();

  res.jsonp(fournisseur);
};

/**
 * Update a Fournisseur
 */
exports.update = function(req, res) {
  var fournisseur = req.fournisseur;

  fournisseur = _.extend(fournisseur, req.body);

  fournisseur.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(fournisseur);
    }
  });
};

/**
 * Delete an Fournisseur
 */
exports.delete = function(req, res) {
  var fournisseur = req.fournisseur;

  fournisseur.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(fournisseur);
    }
  });
};

/**
 * List of Fournisseurs
 */
exports.list = function(req, res) {
  Fournisseur.find().sort('-created').populate('user', 'displayName').exec(function(err, fournisseurs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(fournisseurs);
    }
  });
};

/**
 * Fournisseur middleware
 */
exports.fournisseurByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Fournisseur is invalid'
    });
  }

  Fournisseur.findById(id).populate('user', 'displayName').exec(function (err, fournisseur) {
    if (err) {
      return next(err);
    } else if (!fournisseur) {
      return res.status(404).send({
        message: 'No Fournisseur with that identifier has been found'
      });
    }
    req.fournisseur = fournisseur;
    next();
  });
};
