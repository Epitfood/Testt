(function () {
  'use strict';

  angular
    .module('fournisseurs')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Fournisseurs',
      state: 'fournisseurs',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'fournisseurs', {
      title: 'List Fournisseurs',
      state: 'fournisseurs.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'fournisseurs', {
      title: 'Create Fournisseur',
      state: 'fournisseurs.create',
      roles: ['user']
    });
  }
}());
