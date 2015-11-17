
/**
 * @ngdoc object
 * @name Main.constant:URL
 *
 * @description
 *
 * Contains the URLs.
 *
 */
// This IEFE is used to avoid global namespace pollution. We need a constant here (allows to use it in Angular config)
(function(){
  'use strict';


  var base = 'http://localhost:3000/',
    apiBase = base + 'api/v1/',
    webSocket = 'ws://localhost:8080';

  angular.module('Main').constant('URL', {


    key : {
      clientId: 'client1',
      clientSecret: 'client1'
    },

    webSocket:          webSocket,

    apiBase :           apiBase,
    oauthToken :        base + 'oauth/token',
    oauthRevokeToken :  base + 'oauth/token/revoke',

    user : {
      base :            apiBase + 'user/:id',
      me :              apiBase + 'me'
    },

    message: {
      base: 'message'
    }
  });
})();
