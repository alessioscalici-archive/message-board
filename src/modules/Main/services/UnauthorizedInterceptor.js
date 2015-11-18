/**
 * @ngdoc service
 * @name Main.service:UnauthorizedInterceptor
 *
 * @require $log
 * @require $injector
 * @require $q
 * @require Main.service:Auth
 *
 * @description This responseError interceptor checks if the response is a "token expired" error.
 * If a "token expired" is returned, the original call is queued to be called again when a new Access Token is available,
 * and a refresh token call is performed.
 */
angular.module('Main').factory('UnauthorizedInterceptor', function($log, $injector, $q, Auth){
  'use strict';

  return {

    responseError : function(resp){

      $log.debug('response error:', resp);

      // if token expired, send a refresh token request
      if (resp.data && resp.status === 401 && resp.data.error === 'invalid_token') {
        if (resp.data['error_description'].indexOf('expired') !== -1) {

          $log.debug('UnauthorizedInterceptor: Token expired, refreshing...', resp);

          Auth.refreshToken();

          return Auth.queueRequest(resp.config);


        } else if (resp.data['error_description'].indexOf('invalid') !== -1) {
          // the access token is invalid. Go to login
          Auth.logout();
          $injector.get('$state').go('login');
        }
      }

      return $q.reject(resp);
    }
  };
});