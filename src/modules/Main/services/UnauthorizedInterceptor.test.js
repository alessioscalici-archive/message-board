
var spyOn = window.spyOn;

describe('UnauthorizedInterceptor', function () {
  'use strict';


  beforeEach(module('Main'));
  beforeEach(module('stateMock'));
  beforeEach(module('_mock'));

  /*
    Inject the needed services into the s object
   */
  var s = {}, toInject = ['UnauthorizedInterceptor', 'URL', 'Auth', '$localStorage', 'EntityMock', 'HttpResponseMock'];

  beforeEach(inject(function ($injector) {
    for (var i=0; i<toInject.length; ++i)
      s[toInject[i]] = $injector.get(toInject[i]);
  }));


  /*
    Initializes tests
   */
  var httpBackend, tokenValid = true;

  beforeEach(inject(function ($httpBackend) {

    httpBackend = $httpBackend;

    httpBackend.whenGET(s.URL.user.me).respond(200, s.EntityMock.users[0]);

    s.Auth.isTokenValid = function(){
      return tokenValid;
    };

    s.$localStorage.token = {
      'access_token' : 'ACCESS_TOKEN'
    };

  }));


  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });



  //---------------------------------------------------------------------------------
  //                                  TESTS
  //---------------------------------------------------------------------------------


  describe('.responseError()', function(){


    describe('should return the response unaltered', function(){

      it('if the response status is different than 401', function(){

        var result = s.UnauthorizedInterceptor.responseError(s.HttpResponseMock.notFoundError).then(function(result){
          expect(result).toBe(s.HttpResponseMock.notFoundError);
        });


      });

      it('if the response status is 401 and the message is different from "The access token expired"', function(){
        var result = s.UnauthorizedInterceptor.responseError(s.HttpResponseMock.unauthorizedError).then(function(result){

          expect(result).toBe(s.HttpResponseMock.unauthorizedError);
        });

      });

    });


    describe('if the response has no data attribute', function(){

      beforeEach(function(){
        s.Auth.gotoLogin = function(){};
      });

      it('should return a rejected promise, fulfilled with the response', function(){

        var argument = {};
        var result = s.UnauthorizedInterceptor.responseError(argument);

        result.then(function (resp) {
          // this shouldn't be executed
          expect('the promise').toBe('rejected');
        }, function (resp) {
          expect(resp).toBe(argument);
        });

      });

    });


    describe('if the response is 401 Token expired', function(){

      beforeEach(function(){
        s.Auth.gotoLogin = function(){};
      });

      it('should call Auth.refreshToken and Auth.queueRequest', function(){

        spyOn(s.Auth, 'refreshToken');
        spyOn(s.Auth, 'queueRequest');

        tokenValid = true;
        var result = s.UnauthorizedInterceptor.responseError(s.HttpResponseMock.tokenExpiredError);

        expect(s.Auth.refreshToken).toHaveBeenCalled();
        expect(s.Auth.queueRequest).toHaveBeenCalled();
      });


    });


    describe('if the response is 401 Token invalid', function(){

      beforeEach(function(){
        s.Auth.gotoLogin = function(){};
      });

      it('should call Auth.logout', function(){

        spyOn(s.Auth, 'logout');

        tokenValid = true;
        var result = s.UnauthorizedInterceptor.responseError(s.HttpResponseMock.tokenInvalidError);

        expect(s.Auth.logout).toHaveBeenCalled();
      });

    });


  });

});



