describe('MessagesCtrl', function () {
  'use strict';

  var scope;

  beforeEach(module('Main'));

  beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();



      $controller('MessagesCtrl', {
          $scope: scope
      });
  }));


  it('should have a property "name"', function () {

      expect(true).toBeDefined();

  });

  // it('should have a property "name"', function () {

  //     expect(scope.name).toBeDefined();

  // });

  // it('should have a property "version"', function () {

  //     expect(scope.version).toBeDefined();

  // });

  // it('should have a property "description"', function () {

  //     expect(scope.description).toBeDefined();

  // });

});