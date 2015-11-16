/**
 * @ngdoc controller
 * @name login.controller:LoginCtrl
 *
 * @requires $scope
 * @requires Main.service:Auth
 *
 * @description
 *
 * This is the login view controller
 *
 */
angular.module('login').controller('LoginCtrl', function ($scope, $log, $state, messageCenterService, Auth){
  'use strict';



  /**
   * @ngdoc method
   * @methodOf login.controller:LoginCtrl
   * @name login
   *
   * @description Sends a login request to the application and goes to the message view if success, if error shows an error message
   */
  $scope.login = function(){

    Auth.login($scope.loginData).then(function (res) {
      $state.go('app.messages');
    }, function (err) {
      messageCenterService.add('danger', 'Please check again your username / password', { timeout: 3000 });
    })
    ;
  };


  // ============================ INITIALIZATION ============================ //


  $scope.loginData = {
    username: '',
    password: ''
  };

});