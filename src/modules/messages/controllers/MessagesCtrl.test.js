
describe('MessagesCtrl', function () {
  'use strict';

  beforeEach(module('Main'));
  beforeEach(module('stateMock'));
  beforeEach(module('_mock'));



  var httpBackend;
  beforeEach(inject(function($httpBackend){
    httpBackend = $httpBackend;
  }));


  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });



  /*
   Inject the needed services into the s object
   */
  var s = {}, toInject = ['MessageSvc', '$rootScope', '$timeout', 'messageCenterService', 'URL', 'EntityMock'];

  beforeEach(inject(function ($injector) {
    for (var i=0; i<toInject.length; ++i)
      s[toInject[i]] = $injector.get(toInject[i]);
  }));


  // runs the controller
  var $scope,
    runController = inject(function ($controller, $rootScope) {


    // create a new clean scope for the controller
    $scope = $rootScope.$new();

    // define what's injected in the controller
    var injected = angular.extend({
      $scope: $scope
    }, s);

    // execute  the controller
    $controller('MessagesCtrl', injected);
  });






  // //---------------------------------------------------------------------------------
  // //                                  TESTS
  // //---------------------------------------------------------------------------------




  describe('when instantiatiated', function () {

    beforeEach(function () {
      spyOn(s.MessageSvc, 'query').and.callThrough();
      httpBackend.whenGET(s.URL.message.base).respond(200, s.EntityMock.messages);
      runController();
      s.$rootScope.$digest();
    });


    xit('should define a property "messages"', function () {

   //   runController();
      httpBackend.flush();
      expect($scope.messages).toBeDefined();

    });

    it('should load the previous messages', function () {

 //     spyOn(s.MessageSvc, 'query').and.callThrough();
 //     runController();
 //     httpBackend.flush();
      expect(s.MessageSvc.query).toHaveBeenCalled();
    });



    // call ok response

    xdescribe('if GET /messages returns ok', function () {

      beforeEach(function () {
 //       httpBackend.expectGET(s.URL.message.base).respond(200, s.EntityMock.messages);
      });

      it ('should set the messages array to the response', function () {

        runController();
   //     httpBackend.flush();

        expect($scope.messages.length > 0 ).toBe(true);
      });

    });


    // call error response

    xdescribe('if GET /messages returns error', function () {
      beforeEach(function () {
 //       httpBackend.expectGET(s.URL.message.base).respond(401, 'Unauthorized');
      });

      it ('should show an error message', function () {
        spyOn(s.messageCenterService, 'add');
        runController();
 //       httpBackend.flush();
        expect(s.messageCenterService.add).toHaveBeenCalled();
      });
    });




  });

  // ========================= METHODS ========================= //

  describe('method', function () {

    beforeEach(function () {
//      httpBackend.whenGET(s.URL.message.base).respond(200, s.EntityMock.messages);
      runController();

      $scope.newMessageText = 'NEW MESSAGE TEXT';
    });


    describe('.postMsg()', function () {


      beforeEach(function () {
 //       httpBackend.whenPOST(s.URL.message.base).respond(201, s.EntityMock.messages[0]);

        runController();

        $scope.newMessageText = 'NEW MESSAGE TEXT';
      });


      it('should call MessageSvc.save()', function () {

        spyOn(s.MessageSvc, 'save').and.callThrough();

        $scope.postMsg();
 //       httpBackend.flush();

        expect(s.MessageSvc.save).toHaveBeenCalledWith({ text: 'NEW MESSAGE TEXT' });
      });


      // call ok response

      xdescribe('if POST /messages returns ok', function () {

        beforeEach(function () {
 //         httpBackend.expectPOST(s.URL.message.base).respond(201, s.EntityMock.messages[0]);
        });

        it ('should set the new message text as empty string', function () {

          $scope.postMsg();
    //      httpBackend.flush();
          expect($scope.newMessageText).toBe('');
        });

      });


      // // call error response

      xdescribe('if POST /messages returns error', function () {
        beforeEach(function () {
  //        httpBackend.expectPOST(s.URL.message.base).respond(401, 'Unauthorized');
        });

        it ('should show an error message', function () {
          spyOn(s.messageCenterService, 'add');

          $scope.postMsg();
   //       httpBackend.flush();

          expect(s.messageCenterService.add).toHaveBeenCalled();
        });
      });

    });

  });



  // ========================= EVENTS ========================= //

  describe('events', function () {

    beforeEach(function () {
//      httpBackend.whenGET(s.URL.message.base).respond(200, s.EntityMock.messages);
      runController();
//      httpBackend.flush();
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




