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
    when('/', {
      templateUrl: 'partials/partial1',
      controller: 'MyCtrl1'
    }).
    otherwise({
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);
});
