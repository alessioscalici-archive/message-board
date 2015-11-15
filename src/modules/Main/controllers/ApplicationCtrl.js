/**
 * @ngdoc controller
 * @name messages.controller:ApplicationCtrl
 *
 * @requires $scope
 *
 * @description
 *
 * The parent controller of all views (when logged in)
 *
 */
angular.module('messages').controller('ApplicationCtrl', function ($scope, $state, WebSocket, Auth, curUser){
  'use strict';


  $scope.curUser = curUser;


  WebSocket.connect();
  WebSocket.send({
    type: 'setUser',
    data: curUser
  });


  $scope.logout = function () {
    Auth.logout().then(function () {
      $state.go('login');
    });
  };

});