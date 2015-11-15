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
angular.module('login').controller('LoginCtrl', function ($scope, $log, $state, Auth){
  'use strict';



  // fixme remove default
  $scope.loginData = {
    username: 'user',
    password: 'password'
  };

  $scope.login = function(){

    Auth.login($scope.loginData).then(function (res) {
      $state.go('app.messages');
    }, function (err) {

      // FIXME Error handling
      $log.debug('LOGIN ERROR', err);
    })
    ;
  };

});