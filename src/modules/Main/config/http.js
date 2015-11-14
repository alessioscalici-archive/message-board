/**
 * @ngdoc object
 * @name Main.config:log
 *
 * @description
 *
 *    Configuration file for authorization management.
 *    Contains interceptors to handle authorization and refresh tokens.
 *
 * @requires $httpProvider
 *
 */
angular.module('Main').config(function($httpProvider){
  'use strict';
  $httpProvider.interceptors.push('TokenInterceptor');
  $httpProvider.interceptors.push('UnauthorizedInterceptor');
//  $httpProvider.interceptors.push('ErrorHandlingInterceptor');
  $httpProvider.interceptors.push('SpinnerInterceptor');
  //$httpProvider.interceptors.push('PaginatorInterceptor');

})

/**
 * This request interceptor appends the Access Token to the Reels API requests
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
 * This responseError interceptor checks if the response is a "token expired" error.
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
 * This ErrorHandling interceptor checks if the response is an API common error message and it
 * defines the default way to handle it
 */
  /*
  .factory('ErrorHandlingInterceptor', function($log, $q, FlashMessage, ERRORCODE){
    'use strict';

    return {

      responseError : function(resp){

        if (resp.data && resp.data.code === ERRORCODE.ACTIVE_RECORD) {

          $log.debug('ErrorHandlingInterceptor called', resp);

          if (resp.data.errors) {
            var ar = [];
            angular.forEach(resp.data.errors, function (msg) {
              ar.push(msg);
            });
            FlashMessage.show(ar.join('<br>'));
          }
          if (resp.data.error) {
            FlashMessage.show(resp.data.error);
          }
        }
        return $q.reject(resp);
      }
    };
  })
*/
/**
 * This SpinnerInterceptor checks activate and deactivate spinners based on a request property
 */
  .factory('SpinnerInterceptor', function($log, $q, Spinner){
    'use strict';

    var me = {

      request : function(req){
        if (req.params && req.params.spinner) {
          req.spinner = req.params.spinner;
          Spinner.show(req.spinner);
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


/**
 * This PaginatorInterceptor checks for pagination data and updates active paginators
 */

  .factory('PaginatorInterceptor', function($rootScope){
    'use strict';

    var me = {


      request : function(req){
        if (req.params && req.params.paginator) {
          req.paginator = req.params.paginator;
          delete req.params.paginator;
        }
        return req;
      },

      response : function(resp) {

        if (resp.config.paginator) {

          // broadcasts the event to update the paginator
          // (the event is handled in paginatorCtrl)
          var pageData = {
            paginator: resp.config.paginator,
            itemsPerPage: parseInt(resp.headers('X-Page-Size')),
            totalItems: parseInt(resp.headers('X-Page-Total')),
            page: parseInt(resp.headers('X-Page'))
          };
          $rootScope.$broadcast('PAGINATOR_UPDATE', pageData);
        }
        return resp;
      }


    };
    return me;
  })

 ;