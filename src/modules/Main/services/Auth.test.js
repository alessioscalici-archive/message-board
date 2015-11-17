describe('Auth', function () {
  'use strict';


  beforeEach(module('Main'));
  beforeEach(module('stateMock'));
  beforeEach(module('_mock'));


  /*
    Inject the needed services into the s object
   */
  var s = {}, toInject = ['$injector', '$localStorage', 'Auth', 'URL', 'EntityMock'];

  beforeEach(inject(function ($injector) {
    for (var i=0; i<toInject.length; ++i)
      s[toInject[i]] = $injector.get(toInject[i]);
  }));


  /*
    Initializes tests
   */
  var httpBackend, localStorage;

  beforeEach(inject(function ($httpBackend, $localStorage) {

    httpBackend = $httpBackend;
    localStorage = $localStorage;

    httpBackend.whenGET(s.URL.user.me).respond(200, s.EntityMock.users[0]);

  }));



  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });



  // //---------------------------------------------------------------------------------
  // //                                  TESTS
  // //---------------------------------------------------------------------------------




  // --------------------------------------------- .login() --------------------------------------------- //


  describe('.login()', function(){

    it('should make the authorization token request', function(){

      httpBackend.expectPOST(s.URL.oauthToken).respond(200, s.EntityMock.authorizationTokens[0]);
      s.Auth.login({ username: 'USERNAME', password: 'PASSWORD' });
      httpBackend.flush();
    });

    describe('if the login is successfull', function(){

      beforeEach(function () {
        httpBackend.whenPOST(s.URL.oauthToken).respond(200, s.EntityMock.authorizationTokens[0]);
      });

      it('should store the token in the browser localstorage', function(){

        s.Auth.login({ username: 'USERNAME', password: 'PASSWORD' });
        httpBackend.flush();

        expect(s.$localStorage.token).toBeDefined();
      });

    });
  });


  // --------------------------------------------- .setToken() --------------------------------------------- //

  describe('.setToken()', function(){

    it('should set the token if the token has the correct format', function(){
      s.Auth.setToken(s.EntityMock.authorizationTokens[0]);
      expect(s.Auth.isTokenValid()).toBe(true);
    });

    it('should NOT set the token if the token has the incorrect format', function(){
      s.Auth.setToken(false);
      expect(s.Auth.isTokenValid()).toBe(false);
    });

    it('should NOT set the token if the token has the incorrect format', function(){
      s.Auth.setToken({});
      expect(s.Auth.isTokenValid()).toBe(false);
    });

  });


  // --------------------------------------------- .refreshToken() --------------------------------------------- //

  describe('.refreshToken()', function(){

    describe('if there is an access token', function(){
      beforeEach(function(){
        s.Auth.setToken(s.EntityMock.authorizationTokens[0]);
        httpBackend.whenPOST(s.URL.oauthToken).respond(200, {});
      });
      it('should send a refresh token request', function(){
        httpBackend.expectPOST(s.URL.oauthToken).respond(200, s.EntityMock.authorizationTokens[0]);
        s.Auth.refreshToken();
        httpBackend.flush();
      });
    });

    describe('if there is NO access token', function(){
      it('should redirect to the login screen', function(){

        var $state = s.$injector.get('$state');

        spyOn(s.$injector, 'get').and.callThrough();
        spyOn($state, 'go');

        s.Auth.refreshToken();

        expect(s.$injector.get).toHaveBeenCalledWith('$state');
        expect($state.go).toHaveBeenCalledWith('login');

      });
    });

  });


  // --------------------------------------------- .getAccessToken() --------------------------------------------- //

  describe('.getAccessToken()', function(){

    it('should return false if there is NO authorization token', function(){
      s.$localStorage.token = false;
      var res = s.Auth.getAccessToken();
      expect(res).toBe(false);
    });

    it('should return the access token if there is an authorization token', function(){
      s.Auth.setToken(s.EntityMock.authorizationTokens[0]);
      var res = s.Auth.getAccessToken();
      expect(res).toBe(s.EntityMock.authorizationTokens[0]['access_token']);
    });

  });


  // --------------------------------------------- .getRefreshToken() --------------------------------------------- //

  describe('.getRefreshToken()', function(){

    it('should return false if there is NO authorization token', function(){
      s.$localStorage.token = false;
      var res = s.Auth.getRefreshToken();
      expect(res).toBe(false);
    });

    it('should return the refresh token if there is an authorization token', function(){
      s.Auth.setToken(s.EntityMock.authorizationTokens[0]);
      var res = s.Auth.getRefreshToken();
      expect(res).toBe(s.EntityMock.authorizationTokens[0]['refresh_token']);
    });

  });


  // --------------------------------------------- .queueRequest() --------------------------------------------- //

  describe('.queueRequest()', function(){

    it('should add a request to the request queue', function(){
      var prevQueueLength = s.Auth.queue.length;

      s.Auth.queueRequest({requestdata : 'somedata'});

      expect(s.Auth.queue.length).toBe( prevQueueLength + 1 );
    });

  });


  // --------------------------------------------- .sendPendingRequests() --------------------------------------------- //

  describe('.sendPendingRequests()', function(){

    var requestData = {
        url : 'http://localhost:3000/test',
        method:'GET'
      };


    beforeEach(function(){
      s.Auth.queueRequest(requestData);
      httpBackend.whenGET(requestData.url).respond(200, {});
    });


    it('should send a request in the pending queue', function(){

      httpBackend.expectGET(requestData.url).respond(200, {});

      s.Auth.sendPendingRequests();

      httpBackend.flush();
    });

  });


  // --------------------------------------------- .logout() --------------------------------------------- //

  describe('.logout()', function(){

    beforeEach(function(){
      s.Auth.setToken(s.EntityMock.authorizationTokens[0]);
    });


    it('should invalidate token on success', function(){

      s.Auth.logout()
        .then(function(){
          expect(s.Auth.isTokenValid()).toBe(false);
        });

    });

  });


});