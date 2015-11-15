
/**
 * @ngdoc directive
 * @name Main.directive:message
 * @restrict E
 *
 *
 * @description
 *
 *  A message item in the message list
 *
 */
angular.module('messages').directive('messageItem', function (T_MAIN, Current) {
  'use strict';
  return {
    restrict: 'E',
    scope: {
      msg: '=message'
    },
    templateUrl: T_MAIN.MESSAGES_MESSAGE_ITEM,
    link: function (scope, element, attrs) {
      if (Current.user && Current.user._id === scope.msg.from) {
        angular.element(element[0].querySelector('.message')).addClass('from-me');
      }
    }
  };

});