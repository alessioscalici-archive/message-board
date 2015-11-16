describe('route', function () {
  'use strict';


  beforeEach(module('Main'));
  //beforeEach(module('localStorageMock'));



  /*
   Inject the needed services into the s object
   */
  var s = {}, toInject = ['$state', '$localStorage'];

  beforeEach(inject(function ($injector) {
    for (var i=0; i<toInject.length; ++i)
      s[toInject[i]] = $injector.get(toInject[i]);
  }));


  /*
   Initialize tests
   */
  var $state, $httpBackend, $localStorage;

  beforeEach(inject(function () {

    $state = s.$state;
    $localStorage = s.$localStorage;

  }));




  //---------------------------------------------------------------------------------
  //                                  TESTS
  //---------------------------------------------------------------------------------



  describe('logged-in state ->', function(){

    beforeEach(function(){
      $localStorage.token = {
        'access_token' : 'ACCESS-TOKEN',
        'refresh_token' : 'REFRESH-TOKEN'
      };
    });

    it('app.messages', function(){
      $state.go('app.messages');
    });

    xit('app.assignment', function(){
      // called in the resolve
      spyOn(s.Assignment, 'get');
      $state.go('app.assignment');
      expect(s.Assignment.get).toHaveBeenCalled();
    });


  });

});
