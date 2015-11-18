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
angular.module('messages').controller('MessagesCtrl', function ($scope, $log, $document, $timeout, messageCenterService, WebSocket, Current, MessageSvc){
  'use strict';



  /**
   * Scroll the document to the last message
   */
  /* istanbul ignore next */
  var scrollToLastMsg = function () {
    $timeout(function () {
      angular.element($document[0]).scrollToElement($document[0].getElementById('message-bottom'), 0, 800);
    });
  };


  // ======================= EXPOSED METHODS ====================== //

  /**
   * @ngdoc method
   * @methodOf messages.controller:MessagesCtrl
   * @name postMsg
   *
   * @description Posts a new message to the dashboard
   */
  $scope.postMsg = function () {

    $scope.postingMessage = true;

    MessageSvc.save({
        text: $scope.newMessageText,
        spinner: 'new-message-spinner'
      }).$promise
      .then(function () { // if success

        $scope.newMessageText = '';
        scrollToLastMsg();

      }, function () {  // if error

        messageCenterService.add('danger', 'The message cannot be sent', { timeout: 3000 });
      })
      .finally(function () { // finally

        $scope.postingMessage = false;
      });

  };



  // ========================= INITIALIZATION ========================= //

  $scope.messages = [];

  // retrieve old messages

  MessageSvc.query({
    spinner: 'messages-spinner'
  }).$promise.then(function (resp) {
    $scope.messages = resp;
    scrollToLastMsg();
  }, function () {
    messageCenterService.add('danger', 'Impossible to fetch old messages', { timeout: 3000 });
  });



  // ========================= LISTENERS ========================= //

  var listeners = [

    // when receiving a new message notification from the web socket
    $scope.$on('WS_MESSAGE', function (ev, msg) {
      $scope.messages.push(msg);
      scrollToLastMsg();

      // play notification sound
      $document[0].getElementById('audio-notification').play();
    }),

    // detach listeners on scope destroy
    $scope.$on('$destroy', /* istanbul ignore next */ function () {
      angular.forEach(listeners, function (detach) {
        detach();
      });
    })
  ];

});