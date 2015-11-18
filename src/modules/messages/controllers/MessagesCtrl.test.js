
describe('MessagesCtrl', function () {
  'use strict';

  beforeEach(module('Main'));
  beforeEach(module('stateMock'));
  beforeEach(module('_mock'));
  beforeEach(module('resourceMock'));



  /*
   Inject the needed services into the s object
   */
  var s = {},
    MessageSvcMock,
    toInject = ['$rootScope', '$timeout', 'messageCenterService', 'URL', 'EntityMock'];

  beforeEach(inject(function ($injector, ResourceMock) {
    for (var i=0; i<toInject.length; ++i)
      s[toInject[i]] = $injector.get(toInject[i]);

    MessageSvcMock = new ResourceMock();
  }));


  // runs the controller
  var $scope,
    runController = inject(function ($controller, $rootScope, ResourceMock) {


    // create a new clean scope for the controller
    $scope = $rootScope.$new();

    // define what's injected in the controller
    var injected = angular.extend({
      $scope: $scope,
      MessageSvc: MessageSvcMock
    }, s);

    // execute  the controller
    $controller('MessagesCtrl', injected);
  });






  // //---------------------------------------------------------------------------------
  // //                                  TESTS
  // //---------------------------------------------------------------------------------




  describe('when instantiatiated', function () {

    beforeEach(function () {
      spyOn(s.messageCenterService, 'add');
      spyOn(MessageSvcMock, 'query').and.callThrough();
      runController();
    });


    it('should define a property "messages"', function () {
      expect($scope.messages).toBeDefined();
    });

    it('should load the previous messages', function () {
      expect(MessageSvcMock.query).toHaveBeenCalled();
    });



    // call ok response

    describe('if GET /messages returns ok', function () {

      beforeEach(function () {
        MessageSvcMock.deferred.resolve(s.EntityMock.messages);
        s.$rootScope.$apply();
      });

      it ('should set the messages array to the response', function () {
        expect($scope.messages.length > 0 ).toBe(true);
      });

    });


    // call error response

    describe('if GET /messages returns error', function () {
      beforeEach(function () {
        MessageSvcMock.deferred.reject();
        s.$rootScope.$apply();
      });

      it ('should show an error message', function () {
        expect(s.messageCenterService.add).toHaveBeenCalled();
      });
    });




  });

  // ========================= METHODS ========================= //

  describe('method', function () {

    beforeEach(function () {
      runController();
    });


    describe('.postMsg()', function () {

      beforeEach(function () {
        $scope.newMessageText = 'NEW MESSAGE TEXT';
        spyOn(s.messageCenterService, 'add');
      });


      it('should call MessageSvc.save()', function () {
        spyOn(MessageSvcMock, 'save').and.callThrough();
        $scope.postMsg();
        expect(MessageSvcMock.save).toHaveBeenCalledWith({ text: 'NEW MESSAGE TEXT', spinner: 'new-message-spinner' });
      });


      // call ok response

      describe('if POST /messages returns ok', function () {

        beforeEach(function () {

          $scope.postMsg();

          MessageSvcMock.deferred.resolve({ message: 'OK' });
          s.$rootScope.$apply();
        });

        it ('should set the new message text as empty string', function () {
          expect($scope.newMessageText).toBe('');
        });

        it ('should set postingMessage to false', function () {
          expect($scope.postingMessage).toBe(false);
        });

      });


      // call error response

      describe('if POST /messages returns error', function () {
        beforeEach(function () {

          $scope.postMsg();

          MessageSvcMock.deferred.reject({ message: 'error' });
          s.$rootScope.$apply();
        });

        it ('should show an error message', function () {
          expect(s.messageCenterService.add).toHaveBeenCalled();
        });

        it ('should set postingMessage to false', function () {
          expect($scope.postingMessage).toBe(false);
        });
      });

    });

  });



  // ========================= EVENTS ========================= //

  describe('events', function () {

    beforeEach(function () {
      runController();
    });


    describe('WS_MESSAGE', function () {

      it('should add the message to the messages array', function () {
        var length = $scope.messages.length;
        s.$rootScope.$broadcast('WS_MESSAGE', s.EntityMock.messages[0]);
        expect($scope.messages.length).toBe(length + 1);
      });

    });


  });


});




