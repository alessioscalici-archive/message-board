
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
    replace: true,
    scope: {
      msg: '=message'
    },
    templateUrl: T_MAIN.MESSAGES_MESSAGE_ITEM,
    link: function (scope, element, attrs) {

      // adds the from-me class to the message if it's from the current user
      //
      if (Current.user && Current.user._id === scope.msg.from) {
        element.addClass('from-me');
      }
    }
  };

});