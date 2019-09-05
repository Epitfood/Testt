(function () {
  'use strict';

  angular
    .module('fournisseurs')
    .controller('FournisseursListController', FournisseursListController);

  FournisseursListController.$inject = ['FournisseursService'];

  function FournisseursListController(FournisseursService) {
    var vm = this;

    vm.fournisseurs = FournisseursService.query();
  }
}());
