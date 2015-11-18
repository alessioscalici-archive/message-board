
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


  var base = window.location.origin + '/',
    apiBase = base + 'api/v1/',

    // replaces also the secure "s" accordingly
    webSocket = window.location.origin.replace(/^http(s?)/g, function () {
      return 'ws' + arguments[1];
    });

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
      base:             apiBase + 'message'
    }
  });
})();
