
describe('message-item directive', function () {
  'use strict';



  beforeEach(module('Main'));
  beforeEach(module('_mock'));


  var $scope, $rootScope, elem, testMessage;


  var compileDirective = function () {
    inject(function (_$rootScope_, $compile) {

      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();


      var tpl = '<div><message-item message="testMessage"></message-item></div>';

      inject(function ($compile) {
        elem = $compile(tpl)($scope);
      });

      $scope.$digest();

    });
  };


  var Current, EntityMock;
  beforeEach(inject(function (_Current_, _EntityMock_, $httpBackend) {
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
        compileDirective();
      });

      it ('should NOT set the class "from-me" on the message element', function(){
        expect(elem.hasClass('from-me')).toBe(false);
      });

    });


  });


});