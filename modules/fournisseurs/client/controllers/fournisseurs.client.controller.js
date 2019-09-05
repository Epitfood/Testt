(function () {
  'use strict';

  // Fournisseurs controller
  angular
    .module('fournisseurs')
    .controller('FournisseursController', FournisseursController);

  FournisseursController.$inject = ['$scope', '$state', '$window', 'Authentication', 'fournisseurResolve'];

  function FournisseursController ($scope, $state, $window, Authentication, fournisseur) {
    var vm = this;

    vm.authentication = Authentication;
    vm.fournisseur = fournisseur;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Fournisseur
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.fournisseur.$remove($state.go('fournisseurs.list'));
      }
    }

    // Save Fournisseur
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.fournisseurForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.fournisseur._id) {
        vm.fournisseur.$update(successCallback, errorCallback);
      } else {
        vm.fournisseur.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('fournisseurs.view', {
          fournisseurId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
