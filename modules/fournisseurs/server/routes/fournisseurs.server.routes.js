'use strict';

/**
 * Module dependencies
 */
var fournisseursPolicy = require('../policies/fournisseurs.server.policy'),
  fournisseurs = require('../controllers/fournisseurs.server.controller');

module.exports = function(app) {
  // Fournisseurs Routes
  app.route('/api/fournisseurs').all(fournisseursPolicy.isAllowed)
    .get(fournisseurs.list)
    .post(fournisseurs.create);

  app.route('/api/fournisseurs/:fournisseurId').all(fournisseursPolicy.isAllowed)
    .get(fournisseurs.read)
    .put(fournisseurs.update)
    .delete(fournisseurs.delete);

  // Finish by binding the Fournisseur middleware
  app.param('fournisseurId', fournisseurs.fournisseurByID);
};
