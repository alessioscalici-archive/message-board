/**
 * @ngdoc controller
 * @name messages.controller:MessagesCtrl
 *
 * @requires $scope
 *
 * @description
 *
 * This is the message wall view controller
 *
 */
angular.module('messages').controller('MessagesCtrl', function ($scope, $log, WebSocket, smoothScroll, Current, MessageSvc){
  'use strict';


  MessageSvc.query({
    spinner: 'messages-spinner'
  }).$promise.then(function (resp) {
    $scope.messages = resp;
  });


  $scope.postMsg = function () {

    $scope.postingMessage = true;
    MessageSvc.save({
      text: $scope.newMessageText
    }).$promise.finally(function () {
        $scope.newMessageText = '';
        $scope.postingMessage = false;
        smoothScroll(document.getElementById('message-bottom'));
    });

  };



  // ========================= INITIALIZATION ========================= //



  var listeners = [

    $scope.$on('WS_MESSAGE', function (ev, msg) {

      $scope.messages.push(msg);

    }),

    // detach listeners on scope destroy
    $scope.$on('$destroy', function () {
      angular.forEach(listeners, function (detach) {
        detach();
      });
    })
  ];


});