
var spyOn = window.spyOn;

describe('TokenInterceptor', function () {
  'use strict';


  beforeEach(module('Main'));
  beforeEach(module('stateMock'));
  beforeEach(module('_mock'));

  /*
    Inject the needed services into the s object
   */
  var s = {}, toInject = ['TokenInterceptor', 'URL', 'Auth', 'EntityMock'];

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

    s.Auth.getRefreshToken = function(){
      return 'REFRESH_TOKEN';
    };
    s.Auth.getAccessToken = function(){
      return 'ACCESS_TOKEN';
    };
    s.Auth.isTokenValid = function(){
      return tokenValid;
    };

  }));


  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });



  //---------------------------------------------------------------------------------
  //                                  TESTS
  //---------------------------------------------------------------------------------


  describe('.request()', function(){


    describe('when calling an API URL', function(){


      var req;
      beforeEach(function(){
        req = { url: s.URL.apiBase + 'random/resource.json' };
      });

      it('should set header Authorization', function(){
        var result = s.TokenInterceptor.request(req);
        expect(result.headers.Authorization).toBeDefined();
      });


      it('should call Auth.refreshToken and Auth.queueRequest if the token is invalid', function(){

        spyOn(s.Auth, 'refreshToken');
        spyOn(s.Auth, 'queueRequest');
        tokenValid = false;
        var result = s.TokenInterceptor.request(req);

        expect(s.Auth.refreshToken).toHaveBeenCalled();
        expect(s.Auth.queueRequest).toHaveBeenCalled();
      });


    });



    describe('when calling an API URL without access token', function(){


      var req;
      beforeEach(function(){
        req = { url: s.URL.apiBase + 'random/resource.json' };
        s.Auth.getAccessToken = function(){
          return 'ACCESS_TOKEN';
        };
      });

      it('should NOT set header Authorization', function(){
        var result = s.TokenInterceptor.request(req);
        expect(result.headers).toBeFalsy();
      });


    });


  });

});
