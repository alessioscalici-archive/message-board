describe('Spinner', function () {
  'use strict';


  beforeEach(module('Main'));


  /*
    Inject the needed services into the s object
   */
  var s = {}, toInject = ['Spinner'];

  beforeEach(inject(function ($injector) {
    for (var i=0; i<toInject.length; ++i)
      s[toInject[i]] = $injector.get(toInject[i]);
  }));


  // inject the HTML fixture for the tests
  var setSpinnerHtml = function (hidden) {

    var hiddenClass = hidden ? ' class="ng-hide"' : '',
      fixture = '<div><spinner id="test-spinner"' + hiddenClass + '></spinner></div>';

    document.body.insertAdjacentHTML(
      'afterbegin',
      fixture);
  };



  // //---------------------------------------------------------------------------------
  // //                                  TESTS
  // //---------------------------------------------------------------------------------




  describe('.on a visible spinner', function(){

    beforeEach(function () {
      setSpinnerHtml(false);
    });

    describe('.hide()', function(){
      it('should hide the spinner element', function(){
        s.Spinner.hide('test-spinner');
        var spinnerElem = angular.element(document.getElementById('test-spinner'));
        expect(spinnerElem.hasClass('ng-hide')).toBe(true);
      });
    });

  });



  describe('.on a hidden spinner', function(){

    beforeEach(function () {
      setSpinnerHtml(true);
    });

    describe('.show()', function(){
      it('should show the spinner element', function(){
        s.Spinner.show('test-spinner');
        var spinnerElem = angular.element(document.getElementById('test-spinner'));
        expect(spinnerElem.hasClass('ng-hide')).toBe(false);
      });
    });

  });





});