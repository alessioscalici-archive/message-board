/**
 * @ngdoc service
 * @name Main.service:WebSocket
 *
 * @requires $rootScope
 * @requires $websocket
 *
 * @description
 *  This service encapsulates the websocket configuration
 */
angular.module('Main').service('WebSocket', function($rootScope, $timeout, $websocket, $log, URL) {
  'use strict';
  // Open a WebSocket connection

  var dataStream,
    connectWs = function () {

    dataStream = $websocket(URL.webSocket);


    dataStream.onMessage(function(message) {

      $log.debug('websocket message: ', message);

      var msg = JSON.parse(message.data);

      $rootScope.$broadcast(msg.type, msg.data);

    });


    dataStream.onClose(function() {

      $log.debug('WS closed: starting reconnect attempts');
      $timeout(connectWs, 3000);
      $rootScope.$broadcast('LED_SET', 'ws-status', 'red');

    });

    dataStream.onError(function() {

      $log.debug('WS ERROR: ', arguments);

    });

    dataStream.onOpen(function() {

      $log.debug('WS CONNECTED: ', arguments);
      $rootScope.$broadcast('LED_SET', 'ws-status', 'green');

    });

    return dataStream;
  };

  this.connect = connectWs;


  this.send = function () {
    if (dataStream) {
      dataStream.send.apply(dataStream, arguments);
    }
  };


});