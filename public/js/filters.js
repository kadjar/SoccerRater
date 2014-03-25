'use strict';

/* Filters */

angular.module('soccerRater.filters', []).
  filter('interpolate', function (version) {
    return function (text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }).
  filter('playerData', function() {
    return function(idx, arr ) {
      if (!idx || !arr)
        return [];
      var out = []
      idx.forEach(function(i) {
        out.push(arr[i])
      })
      return out;
    }
  })
