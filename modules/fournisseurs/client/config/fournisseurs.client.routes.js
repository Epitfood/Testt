(function () {
  'use strict';

  angular
    .module('fournisseurs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('fournisseurs', {
        abstract: true,
        url: '/fournisseurs',
        template: '<ui-view/>'
      })
      .state('fournisseurs.list', {
        url: '',
        templateUrl: 'modules/fournisseurs/client/views/list-fournisseurs.client.view.html',
        controller: 'FournisseursListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Fournisseurs List'
        }
      })
      .state('fournisseurs.create', {
        url: '/create',
        templateUrl: 'modules/fournisseurs/client/views/form-fournisseur.client.view.html',
        controller: 'FournisseursController',
        controllerAs: 'vm',
        resolve: {
          fournisseurResolve: newFournisseur
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Fournisseurs Create'
        }
      })
      .state('fournisseurs.edit', {
        url: '/:fournisseurId/edit',
        templateUrl: 'modules/fournisseurs/client/views/form-fournisseur.client.view.html',
        controller: 'FournisseursController',
        controllerAs: 'vm',
        resolve: {
          fournisseurResolve: getFournisseur
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Fournisseur {{ fournisseurResolve.name }}'
        }
      })
      .state('fournisseurs.view', {
        url: '/:fournisseurId',
        templateUrl: 'modules/fournisseurs/client/views/view-fournisseur.client.view.html',
        controller: 'FournisseursController',
        controllerAs: 'vm',
        resolve: {
          fournisseurResolve: getFournisseur
        },
        data: {
          pageTitle: 'Fournisseur {{ fournisseurResolve.name }}'
        }
      });
  }

  getFournisseur.$inject = ['$stateParams', 'FournisseursService'];

  function getFournisseur($stateParams, FournisseursService) {
    return FournisseursService.get({
      fournisseurId: $stateParams.fournisseurId
    }).$promise;
  }

  newFournisseur.$inject = ['FournisseursService'];

  function newFournisseur(FournisseursService) {
    return new FournisseursService();
  }
}());
