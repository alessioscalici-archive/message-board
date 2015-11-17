describe('LoginCtrl', function () {
  'use strict';


  beforeEach(module('Main'));
  beforeEach(module('stateMock'));
  beforeEach(module('_mock'));


  /*
   Inject the needed services into the s object
   */
  var s = {}, toInject = ['$state', '$q', 'messageCenterService', 'Auth', 'EntityMock', 'URL'];

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
    $controller('LoginCtrl', injected);

  });



  var httpBackend;
  beforeEach(inject(function ($httpBackend) {
    httpBackend = $httpBackend;
  }));


  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
    s.$state.ensureAllTransitionsHappened();
  });


  // //---------------------------------------------------------------------------------
  // //                                  TESTS
  // //---------------------------------------------------------------------------------



  describe('after instantiation', function () {

    beforeEach(function () {
      runController();
    });

    it('should define a property "loginData"', function () {
      expect($scope.loginData).toBeDefined();
    });

  });

  // ========================= METHODS ========================= //

  describe('.login()', function () {

    beforeEach(function () {
      httpBackend.whenPOST(s.URL.oauthToken).respond(200, s.EntityMock.authorizationTokens[0]);
      runController();
    });

    it('should log in the user', function () {
      spyOn(s.Auth, 'login').and.callThrough();
      $scope.login();
      httpBackend.flush();
      expect(s.Auth.login).toHaveBeenCalled();
    });



    // login ok response

    describe('if login ok', function () {

      beforeEach(function () {
        httpBackend.expectPOST(s.URL.oauthToken).respond(200, s.EntityMock.authorizationTokens[0]);
      });

      it ('should redirect to the messages view', function () {
        s.$state.expectTransitionTo('app.messages');
        $scope.login();
        httpBackend.flush();
      });

    });


    // login error response

    describe('if login error', function () {
      beforeEach(function () {
        httpBackend.expectPOST(s.URL.oauthToken).respond(401, 'Unauthorized');
      });

      it ('should show an error message', function () {
        spyOn(s.messageCenterService, 'add');
        $scope.login();
        httpBackend.flush();
        expect(s.messageCenterService.add).toHaveBeenCalled();
      });
    });

  });


});