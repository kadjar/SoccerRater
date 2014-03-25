'use strict';

/* Services */
var speedModifier = 10;

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('soccerRater.services', []).
  factory('socket', function (socketFactory) {
    return socketFactory();
  }).value('version', '0.1').
  factory('helperServices', function() {
    var game = {
      data: null,
      start: null,
      clock: null,
      seconds: 0,
      ticker: null
    }

    function tick() {
        game.seconds = Math.floor(((new Date()) - game.start) / (1000 / speedModifier));
        game.clock = ("00" + Math.floor(game.seconds / 60)).slice(-2) + ":" + ("00" + (game.seconds % 60)).slice(-2);
    }

    return {
      startClock: function(time, callback) {        
        game.start = new Date(time);
        tick();

        game.ticker = setInterval(function() {
          if (game.seconds === 5400) {
            clearInterval(game.ticker);
            return;
          }
          tick();
          callback(game.clock, game.seconds)
        }, (1000 / speedModifier))
      },
      stopClock: function() {
        clearInterval(game.ticker);
      },
      clock: game.clock,
      seconds: game.seconds
    }
  })
