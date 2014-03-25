'use strict';

// Declare app level module which depends on filters, and services

angular.module('soccerRater', [
  'ngRoute',

  'soccerRater.controllers',
  'soccerRater.filters',
  'soccerRater.services',
  'soccerRater.directives',

  // 3rd party dependencies
  'btford.socket-io',
  'vr.directives.slider'  
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/view1', {
      templateUrl: 'partials/partial1',
      controller: 'SoccerRaterCtrl'
    }).
    otherwise({
      redirectTo: '/view1'
    });

  $locationProvider.html5Mode(true);
});
