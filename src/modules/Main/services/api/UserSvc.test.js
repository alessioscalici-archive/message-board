describe('UserSvc', function () {
  'use strict';


  beforeEach(module('Main'));


  /*
   Inject the needed services into the s object
   */
  var s = {}, toInject = ['UserSvc'];

  beforeEach(inject(function ($injector) {
    for (var i=0; i<toInject.length; ++i)
      s[toInject[i]] = $injector.get(toInject[i]);
  }));


  // //---------------------------------------------------------------------------------
  // //                                  TESTS
  // //---------------------------------------------------------------------------------


  describe('method ', function(){

    describe('.query()', function(){
      it('should return an object containing a $promise property', function(){
        var res = s.UserSvc.query({});
        expect(res.$promise).toBeDefined();
      });
    });

    describe('.save()', function(){
      it('should return an object containing a $promise property', function(){
        var res = s.UserSvc.save({});
        expect(res.$promise).toBeDefined();
      });
    });

    describe('.get()', function(){
      it('should return an object containing a $promise property', function(){
        var res = s.UserSvc.get({});
        expect(res.$promise).toBeDefined();
      });
    });

    describe('.delete()', function(){
      it('should return an object containing a $promise property', function(){
        var res = s.UserSvc.delete({});
        expect(res.$promise).toBeDefined();
      });
    });
  });

});