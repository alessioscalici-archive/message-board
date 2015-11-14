/**
 * @ngdoc controller
 * @name messages.controller:MessagesCtrl
 *
 * @requires $scope
 *
 * @description
 *
 * This is the messages view controller
 *
 */
angular.module('messages').controller('MessagesCtrl', function ($scope, UserSvc){
  'use strict';

  $scope.users = UserSvc.query({
    spinner: 'users-spinner'
  });

});