describe('spinner', function () {
  'use strict';



  beforeEach(module('Main'));


  var $scope, $rootScope, elem;


  var compileDirective = function () {
    inject(function (_$rootScope_, $compile) {

      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();

      var tpl = '<spinner id="spinner-id"></spinner>';

      inject(function ($compile) {
        elem = $compile(tpl)($scope);
      });

      $scope.$digest();

    });
  };



  describe('when compiled', function(){

    beforeEach(compileDirective);

    it ('it should set the class ng-hide on the spinner element', function(){
      expect(elem.hasClass('ng-hide')).toBe(true);
    });

  });


});