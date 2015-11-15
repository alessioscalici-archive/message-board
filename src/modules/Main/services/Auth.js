/**
 * @ngdoc service
 * @name Main.service:Auth
 *
 * @requires $log
 * @requires $q
 * @requires $injector
 * @requires $localStorage
 * @requires Main.constant:URL
 *
 * @description
 * This service manages the authentication.
 * The workflow is:
 *
 * - First of all, login using the login() method. An authorization token will be returned (if the login was successful)
 * - When a request receives a "token expired" response:
 *   - Queue the request with the queueRequest() method
 *   - Make a refresh token request calling the refreshToken() method
 * - The refreshToken method automatically re-sends the pending requests when a new Access Token is available
 */
angular.module('Main').service('Auth', function($log, $q, $injector, $localStorage, URL){
  'use strict';

  var urlEncodedTransform = function(obj) {
    var str = [];
    angular.forEach(obj, function (v, p) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    });
    return str.join("&");
  };
  var me = {

    /**
     * The oAuth token
     * @type {object}
     */
    token : null,



    /**
     * @ngdoc method
     * @name login
     * @methodOf Main.service:Auth
     *
     * @description
     * Performs a login request
     *
     * @param  {object} data                  the login form data
     * @param  {string} data.username         the user name
     * @param  {string} data.password         the user password
     *
     * @return {promise}                      a promise resolved when the Access Token is ready, fulfilled with the login call response
     */
    login : function(data) {


      return $injector.get('$http')({
        method: 'POST',
        url: URL.oauthToken,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: urlEncodedTransform,
        data: {
          'username' : data.username,
          'password': data.password,
          'grant_type':'password',
          'client_id': URL.key.clientId,
          'client_secret': URL.key.clientSecret
        }
      }).then(function(response){
        me.setToken(response.data);
        return response;
      });

    },


    /**
     * Returns true if the token is valid, false otherwise
     * @return {boolean} true if the token is valid, false otherwise
     */
    isTokenValid : function(){
      return !!$localStorage.token;
    },


    /**
     * @ngdoc method
     * @name logout
     * @methodOf Main.service:Auth
     * @description
     *
     * Performs a logout request
     *
     * @return {promise}          a promise resolved at the call response
     */
    logout : function() {

      $localStorage.token = false;

      var deferred = $q.defer();
      deferred.resolve();
      return deferred.promise;

      /*
      if (!me.isTokenValid()) {
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
      }
      return $injector.get('$http').post( URL.oauthRevokeToken, {
        'access_token' : me.getAccessToken(),
        'refresh_token' : me.getRefreshToken()
      }).then(function(response){
        $log.debug('Logout successful: ', response);
        $localStorage.token = false;
        $localStorage.$save();
        return response;
      });
      */
    },


    /**
     * Sets the new authorization Token
     * @return {string} the Refresh Token
     */
    setToken : function(token){

      $log.debug('Login token: ', token);

      if (!token || !token['access_token'] || !token['refresh_token']) {
        $log.error('Unexpected authentication token format: ', token);
      } else {
        $localStorage.token = token;
      }

    },

    /**
     * Returns the Refresh Token
     * @return {string} the Refresh Token
     */
    getRefreshToken : function(){
      return !!$localStorage.token && $localStorage.token['refresh_token'];
    },


    /**
     * Returns the Access Token
     * @return {string} the Access Token, or false if there is no access token
     */
    getAccessToken : function(){
      return !!$localStorage.token && $localStorage.token['access_token'];
    },


    /**
     * Performs a Refresh Token request to get a new Access Token, and then re-sends the queued requests.
     * @return {promise} a promise resolved when the new Access Token is ready, fulfilled with an array of
     *                     responses of the pending requests, or with the rejection if one of them is rejected
     */
    refreshToken : function(){

      if (!me.isTokenValid()) {
        $injector.get('$state').go('login');
        return;
      }

      var promise = $injector.get('$http')({
        method: 'POST',
        url: URL.oauthToken,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: urlEncodedTransform,
        data: {
          'grant_type': 'refresh_token',
          'client_id': URL.key.clientId,
          'client_secret': URL.key.clientSecret,
          'refresh_token' : me.getRefreshToken()
        }
      }).then(function(response){

        $log.debug('New access token: ', response.data);
        me.setToken(response.data);

        return me.sendPendingRequests();
      });

      $log.debug('Auth.refreshToken: discarding token', $localStorage.token);
      $localStorage.token = false;

      return promise;
    },


    /**
     * The pending requests queue
     * @type {Array}
     */
    queue : [],

    /**
     *
     * Put a request in the queue
     *
     * @param {object} req - an $http request configuration.
     * @return {promise} a pending promise, resolved in the 'sendPendingRequests' method
     *                     when the server returns the response for the request.
     */
    queueRequest : function(req){

      $log.debug('Auth: queuing request', req);

      var defer = $q.defer();

      this.queue.push({
        request : req,
        deferred : defer
      });
      return defer.promise;

    },


    /**
     * Re-send all the request previously queued, and clears the queue
     * @return {promise} a promise fulfilled with an array of responses of every pending request, or with the rejection if one of them is rejected
     */
    sendPendingRequests : function(){

      $log.debug('Auth: re-sending ' + this.queue.length + ' requests');

      var promiseArray = [];

      angular.forEach(this.queue, function(item){

        $log.debug('Auth: re-sending request', item.request.url, item);

        var promise = $injector.get('$http')(item.request).then(function(resp){
          item.deferred.resolve(resp);
          return item.deferred.promise;
        });

        promiseArray.push(promise);
      });

      this.queue = [];

      return $q.all(promiseArray);

    }

  };
  return me;
});