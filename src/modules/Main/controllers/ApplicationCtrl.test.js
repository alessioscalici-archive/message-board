describe('ApplicationCtrl', function () {
  'use strict';


  beforeEach(module('Main'));
  beforeEach(module('_mock'));



  /*
   Inject the needed services into the s object
   */
  var s = {}, toInject = ['WebSocket', 'Auth', 'EntityMock'];

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
      $scope: $scope,
      curUser: s.EntityMock.users[0]

    }, s);

    // execute  the controller
    $controller('ApplicationCtrl', injected);

  });

  describe('after instantiation', function () {

    beforeEach(function () {
      spyOn(s.WebSocket, 'connect');
      spyOn(s.WebSocket, 'send');
      runController();
    });

    it('should define a property "curUser"', function () {
      expect($scope.curUser).toBeDefined();
    });

    it('should connect the web socket', function () {
      expect(s.WebSocket.connect).toHaveBeenCalled();
    });

    it('should communicate the user data to the web socket', function () {
      expect(s.WebSocket.send).toHaveBeenCalledWith({
        type: 'setUser',
        data: $scope.curUser
      });
    });

  });

  // ========================= METHODS ========================= //

  describe('.logout()', function () {

    beforeEach(function () {
      spyOn(s.Auth, 'logout').and.callThrough();
      runController();
    });

    it('should log out the user', function () {
      $scope.logout();
      expect(s.Auth.logout).toHaveBeenCalled();
    });

  });


});