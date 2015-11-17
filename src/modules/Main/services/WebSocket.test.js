
describe('WebSocket', function () {
  'use strict';


  beforeEach(module('Main'));
  beforeEach(module('websocketMock'));
  beforeEach(module('_mock'));

  /*
    Inject the needed services into the s object
   */
  var s = {}, toInject = ['$rootScope', '$timeout', 'WebSocket', '$websocket', 'EntityMock'];

  beforeEach(inject(function ($injector) {
    for (var i=0; i<toInject.length; ++i)
      s[toInject[i]] = $injector.get(toInject[i]);
  }));





  // //---------------------------------------------------------------------------------
  // //                                  TESTS
  // //---------------------------------------------------------------------------------




  // --------------------------------------------- .connect() --------------------------------------------- //


  describe('.connect()', function(){

    it('should set a onMessage listener on the dataStream object', function(){
      spyOn(s.$websocket.dataStream, 'onMessage');
      s.WebSocket.connect();
      expect(s.$websocket.dataStream.onMessage).toHaveBeenCalled();
    });


  });



  describe('when disconnected', function() {

    describe('.send()', function() {

      it('should do nothing', function() {

        spyOn(s.$websocket.dataStream, 'send');

        s.WebSocket.send(s.EntityMock.messages[0]);

        expect(s.$websocket.dataStream.send).not.toHaveBeenCalled();
      });

    });
  });



  // --------------------------------------------- after connection --------------------------------------------- //


  describe('after connection', function() {

    var message, parsedMessage;

    beforeEach(function () {
      s.WebSocket.connect();

      message = s.EntityMock.wsMessages[0];
      parsedMessage = JSON.parse(message.data);

    });

    describe('on WS message', function() {

      it('should broadcast a WS_MESSAGE event from the root scope', function() {

        spyOn(s.$rootScope, '$broadcast');

        s.$websocket.trigger('message', [message]);

        expect(s.$rootScope.$broadcast).toHaveBeenCalledWith(parsedMessage.type, parsedMessage.data);
      });

    });


    describe('on WS close', function() {

      it('should try to reconnect to the web socket', function() {

        spyOn(s.$websocket.dataStream, 'onMessage');
        s.$websocket.trigger('close');
        s.$timeout.flush();

        expect(s.$websocket.dataStream.onMessage).toHaveBeenCalled();
      });

    });



    describe('.send()', function() {

      it('should send a message via the dataStream', function() {

        spyOn(s.$websocket.dataStream, 'send');

        s.WebSocket.send(s.EntityMock.messages[0]);

        expect(s.$websocket.dataStream.send).toHaveBeenCalledWith(s.EntityMock.messages[0]);
      });

    });

  });

});




