/**
 * @ngdoc object
 * @name Main.config:interceptors
 *
 * @description
 *
 *    Http interceptors registration happens here.
 *
 * @requires $httpProvider
 *
 */
angular.module('Main').config(function($httpProvider){
  'use strict';
  $httpProvider.interceptors.push('TokenInterceptor');
  $httpProvider.interceptors.push('UnauthorizedInterceptor');
  $httpProvider.interceptors.push('SpinnerInterceptor');
})

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
  .factory('TokenInterceptor', function($log, URL, Auth){
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
  })

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
  .factory('UnauthorizedInterceptor', function($log, $injector, $q, Auth){
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
  })

/**
 * @ngdoc service
 * @name Main.service:SpinnerInterceptor
 *
 * @require $log
 * @require $q
 * @require Main.service:Spinner
 *
 * @description This request / response interceptor checks activate and deactivate spinners based on a request property
 */
  .factory('SpinnerInterceptor', function($log, $q, Spinner){
    'use strict';

    var me = {

      request : function(req){
        if (req.params && req.params.spinner) {
          req.spinner = req.params.spinner;
          Spinner.show(req.spinner);
          delete req.params.spinner;
        }
        return req;
      },

      response : function(resp) {
        if (resp.config.spinner) {
          Spinner.hide(resp.config.spinner);
        }
        return resp;
      },

      responseError : function(resp) {
        if (resp.config.spinner) {
          Spinner.hide(resp.config.spinner);
        }
        return $q.reject(resp);
      }
    };
    return me;
  })
 ;