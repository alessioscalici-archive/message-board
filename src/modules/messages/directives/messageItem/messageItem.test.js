
describe('message-item directive', function () {
  'use strict';



  beforeEach(module('messages'));
  beforeEach(module('_mock'));


  var $scope, $rootScope, elem, testMessage;


  var compileDirective = function (msg) {
    inject(function (_$rootScope_, $compile) {

      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();

      $scope.testMessage = msg;

      var tpl = '<message-item message="testMessage"></message-item>';

      inject(function ($compile) {
        elem = $compile(tpl)($scope);
      });

      $scope.$digest();

      try {
        $httpBackend.flush();
      } catch (e) {
        // this will happen with cached templates (prod code), just do nothing here
      }

    });
  };


  var $httpBackend, Current, EntityMock;
  beforeEach(inject(function (_Current_, _EntityMock_, _$httpBackend_) {

    $httpBackend = _$httpBackend_;

    Current = _Current_;
    EntityMock = _EntityMock_;
    Current.user = EntityMock.users[0];

    // template request
    $httpBackend.whenGET('modules/messages/directives/messageItem/message_item.html').respond('<div class="message"></div>');
  }));




  describe('when compiled', function(){

    describe('if the message is from another user', function(){

      beforeEach(function () {
        var msg = EntityMock.messages[0];
        msg.from = 'DefinitelyAnotherUser';
        compileDirective(msg);
      });

      it ('should NOT set the class "from-me" on the message element', function(){
        expect(elem.hasClass('from-me')).toBe(false);
      });

    });



    describe('if the message is from the current user', function(){

      beforeEach(function () {
        Current.user = EntityMock.users[0];
        var msg = EntityMock.messages[0];
        msg.from = Current.user._id;
        compileDirective(msg);
      });

      it ('should set the class "from-me" on the message element', function(){
        expect(elem.hasClass('from-me')).toBe(true);
      });

    });


  });


});