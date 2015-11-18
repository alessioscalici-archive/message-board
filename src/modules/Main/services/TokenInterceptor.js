/**
 * @ngdoc service
 * @name Main.service:TokenInterceptor
 *
 * @require $log
 * @require Main.constant:URL
 * @require Main.service:Auth
 *
 * @description This request interceptor appends the Access Token to the Reels API requests
 * If a request is done while no valid token is available, the request
 * is queued til a new Access Token is available
 */
angular.module('Main').factory('TokenInterceptor', function($log, URL, Auth){
  'use strict';

  var startsWith = function(a, b){
    return (a.substring(0, b.length) === b);
  };

  return {
    request : function(req){


      if ( startsWith(req.url, URL.apiBase) ) {

        $log.debug('TokenInterceptor: requesting ', req);

        // if the token is expired
        if (!Auth.isTokenValid()) {

          // require a new access token
          Auth.refreshToken();

          // queue the request
          return Auth.queueRequest(req);
        }

        // add the Authorization token to the request headers
        if (Auth.getAccessToken()) {
          req.headers = req.headers || [];
          req.headers.Authorization = "Bearer " + Auth.getAccessToken();
        }

      }
      return req;
    }
  };
});