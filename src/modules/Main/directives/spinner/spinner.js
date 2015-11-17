
/**
 * @ngdoc directive
 * @name Main.directive:spinner
 * @restrict E
 *
 *
 * @description
 *
 *  The spinner directive
 *
 */
angular.module('Main').directive('spinner', function() {
  'use strict';
  return {
    restrict: 'E',
    template: '<div class="loader">Loading...</div>',
    link: function (scope, element, attrs) {
      element.addClass('ng-hide');
    }
  };

});