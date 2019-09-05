// Fournisseurs service used to communicate Fournisseurs REST endpoints
(function () {
  'use strict';

  angular
    .module('fournisseurs')
    .factory('FournisseursService', FournisseursService);

  FournisseursService.$inject = ['$resource'];

  function FournisseursService($resource) {
    return $resource('api/fournisseurs/:fournisseurId', {
      fournisseurId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
