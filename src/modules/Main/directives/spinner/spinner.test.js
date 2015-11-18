describe('spinner', function () {
  'use strict';



  beforeEach(module('Main'));



  var $scope, $rootScope, elem;


  var compileDirective = function (attrs) {
    inject(function (_$rootScope_, $compile) {
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      var attrs = attrs || '';
      var tpl = '<spinner id="spinner-id" ' + attrs + '></spinner>';
      elem = $compile(tpl)($scope);
      $scope.$digest();
    });
  };



  describe('when the spinner does NOT have the class "opaque"', function(){

    beforeEach(function () {
      compileDirective();
    });

    it ('it should set the class ng-hide when compiled', function(){
      expect(elem.hasClass('ng-hide')).toBe(true);
    });

  });

  xdescribe('when the spinner DOES have the attribute start-visible="true" ', function(){

    beforeEach(function () {
      compileDirective('start-visible="true"');
    });

    it ('it should  NOT set the class ng-hide when compiled', function(){
      expect(elem.hasClass('ng-hide')).toBe(false);
    });

  });





});