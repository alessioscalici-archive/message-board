/**
 * @ngdoc service
 * @name Main.service:WebSocket
 *
 * @requires $rootScope
 * @requires $timeout
 * @requires $websocket
 * @requires $log
 * @requires Main.constant:URL
 *
 * @description
 *
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


  /**
   * @ngdoc method
   * @methodOf Main.service:WebSocket
   * @name connect
   *
   * @description connects to the web socket server, creating a data stream object
   */
  this.connect = connectWs;


  /**
   * @ngdoc method
   * @methodOf Main.service:WebSocket
   * @name send
   *
   * @description if there is a data stream object, sends the arguments through the web socket
   */
  this.send = function () {
    if (dataStream) {
      dataStream.send.apply(dataStream, arguments);
    }
  };


});