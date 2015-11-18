
var spyOn = window.spyOn;

describe('SpinnerInterceptor', function () {
  'use strict';


  beforeEach(module('Main'));


  /*
    Inject the needed services into the s object
   */
  var s = {}, toInject = ['SpinnerInterceptor', 'Spinner'];

  beforeEach(inject(function ($injector) {
    for (var i=0; i<toInject.length; ++i)
      s[toInject[i]] = $injector.get(toInject[i]);
  }));



  //---------------------------------------------------------------------------------
  //                                  TESTS
  //---------------------------------------------------------------------------------


  describe('.request()', function () {

    describe('if the request has a "spinner" parameter', function (){

      var req;
      beforeEach(function () {
        req = {
          params: {
            spinner: 'test-spinner'
          }
        };
      });


      it('should show the spinner calling the Spinner.show("spinner-id") method', function () {

        var spinnerId = req.params.spinner;
        spyOn(s.Spinner, 'show');

        s.SpinnerInterceptor.request(req);

        expect(s.Spinner.show).toHaveBeenCalledWith(spinnerId);
      });

    });

    describe('if the request does NOT have a "spinner" parameter', function (){

      var req;
      beforeEach(function () {
        req = {
          params: {}
        };
      });


      it('should NOT show the spinner calling the Spinner.show("spinner-id") method', function () {

        var spinnerId = req.params.spinner;
        spyOn(s.Spinner, 'show');

        s.SpinnerInterceptor.request(req);

        expect(s.Spinner.show).not.toHaveBeenCalledWith(spinnerId);
      });

    });

  });




  describe('.response()', function () {

    describe('if the request had a "spinner" parameter', function (){

      var resp;
      beforeEach(function () {
        resp = {
          config: {
            spinner: 'test-spinner'
          }
        };
      });


      it('should hide the spinner calling the Spinner.hide("spinner-id") method', function () {

        var spinnerId = resp.config.spinner;
        spyOn(s.Spinner, 'hide');

        s.SpinnerInterceptor.response(resp);

        expect(s.Spinner.hide).toHaveBeenCalledWith(spinnerId);
      });

    });

    describe('if the request did NOT have a "spinner" parameter', function (){

      var resp;
      beforeEach(function () {
        resp = {
          config: {}
        };
      });


      it('should NOT hide the spinner calling the Spinner.hide("spinner-id") method', function () {

        var spinnerId = resp.config.spinner;
        spyOn(s.Spinner, 'hide');

        s.SpinnerInterceptor.response(resp);

        expect(s.Spinner.hide).not.toHaveBeenCalledWith(spinnerId);
      });

    });

  });



  describe('.responseError()', function () {

    describe('if the request had a "spinner" parameter', function (){

      var resp;
      beforeEach(function () {
        resp = {
          config: {
            spinner: 'test-spinner'
          }
        };
      });


      it('should hide the spinner calling the Spinner.hide("spinner-id") method', function () {

        var spinnerId = resp.config.spinner;
        spyOn(s.Spinner, 'hide');

        s.SpinnerInterceptor.responseError(resp);

        expect(s.Spinner.hide).toHaveBeenCalledWith(spinnerId);
      });

    });

    describe('if the request did NOT have a "spinner" parameter', function (){

      var resp;
      beforeEach(function () {
        resp = {
          config: {}
        };
      });


      it('should NOT hide the spinner calling the Spinner.hide("spinner-id") method', function () {

        var spinnerId = resp.config.spinner;
        spyOn(s.Spinner, 'hide');

        s.SpinnerInterceptor.responseError(resp);

        expect(s.Spinner.hide).not.toHaveBeenCalledWith(spinnerId);
      });

    });

  });
});
