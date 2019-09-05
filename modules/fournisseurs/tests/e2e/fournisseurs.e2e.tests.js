'use strict';

describe('Fournisseurs E2E Tests:', function () {
  describe('Test Fournisseurs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/fournisseurs');
      expect(element.all(by.repeater('fournisseur in fournisseurs')).count()).toEqual(0);
    });
  });
});
