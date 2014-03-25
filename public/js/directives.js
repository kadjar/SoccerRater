'use strict';

/* Directives */

angular.module('soccerRater.directives', []).
  directive('appVersion', function (version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  })