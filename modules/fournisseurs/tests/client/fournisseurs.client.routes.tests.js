(function () {
  'use strict';

  describe('Fournisseurs Route Tests', function () {
    // Initialize global variables
    var $scope,
      FournisseursService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _FournisseursService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      FournisseursService = _FournisseursService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('fournisseurs');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/fournisseurs');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          FournisseursController,
          mockFournisseur;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('fournisseurs.view');
          $templateCache.put('modules/fournisseurs/client/views/view-fournisseur.client.view.html', '');

          // create mock Fournisseur
          mockFournisseur = new FournisseursService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Fournisseur Name'
          });

          // Initialize Controller
          FournisseursController = $controller('FournisseursController as vm', {
            $scope: $scope,
            fournisseurResolve: mockFournisseur
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:fournisseurId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.fournisseurResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            fournisseurId: 1
          })).toEqual('/fournisseurs/1');
        }));

        it('should attach an Fournisseur to the controller scope', function () {
          expect($scope.vm.fournisseur._id).toBe(mockFournisseur._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/fournisseurs/client/views/view-fournisseur.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          FournisseursController,
          mockFournisseur;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('fournisseurs.create');
          $templateCache.put('modules/fournisseurs/client/views/form-fournisseur.client.view.html', '');

          // create mock Fournisseur
          mockFournisseur = new FournisseursService();

          // Initialize Controller
          FournisseursController = $controller('FournisseursController as vm', {
            $scope: $scope,
            fournisseurResolve: mockFournisseur
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.fournisseurResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/fournisseurs/create');
        }));

        it('should attach an Fournisseur to the controller scope', function () {
          expect($scope.vm.fournisseur._id).toBe(mockFournisseur._id);
          expect($scope.vm.fournisseur._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/fournisseurs/client/views/form-fournisseur.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          FournisseursController,
          mockFournisseur;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('fournisseurs.edit');
          $templateCache.put('modules/fournisseurs/client/views/form-fournisseur.client.view.html', '');

          // create mock Fournisseur
          mockFournisseur = new FournisseursService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Fournisseur Name'
          });

          // Initialize Controller
          FournisseursController = $controller('FournisseursController as vm', {
            $scope: $scope,
            fournisseurResolve: mockFournisseur
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:fournisseurId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.fournisseurResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            fournisseurId: 1
          })).toEqual('/fournisseurs/1/edit');
        }));

        it('should attach an Fournisseur to the controller scope', function () {
          expect($scope.vm.fournisseur._id).toBe(mockFournisseur._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/fournisseurs/client/views/form-fournisseur.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
