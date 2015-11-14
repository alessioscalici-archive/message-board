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
    username: 'user1',
    password: 'user1'
  };

  $scope.login = function(){

    Auth.login($scope.loginData).then(function (res) {
      $state.go('messages');
    }, function (err) {

      // FIXME Error handling
      $log.debug('LOGIN ERROR', err);
    })
    ;
  };

});