/**
 * @ngdoc controller
 * @name Main.controller:ApplicationCtrl
 *
 * @requires $scope
 * @requires $state
 * @requires Main.service:WebSocket
 * @requires Main.service:Auth
 *
 * @description
 *
 * The parent controller of all views (when logged in)
 *
 */
angular.module('Main').controller('ApplicationCtrl', function ($scope, $state, WebSocket, Auth, curUser){
  'use strict';


  // ===================== EXPOSED METHODS ================= //

  /**
   * @ngdoc method
   * @methodOf Main.controller:ApplicationCtrl
   * @name logout
   *
   * @description Logs the user out and redirects to login screen
   */
  $scope.logout = function () {
    Auth.logout().then(function () {
      $state.go('login');
    });
  };




  // ===================== INITIALIZATION ================= //

  $scope.curUser = curUser;


  // connect the websocket
  WebSocket.connect();
  WebSocket.send({
    type: 'setUser',
    data: curUser
  });


});