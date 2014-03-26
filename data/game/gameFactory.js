var    Q = require('q');

var   ds = require('../dataService.js')
,   Game = require('./_game.js');

var games = {};

exports.getGame = function(gameId) {
  var d = Q.defer();

  if (!games[gameId]) {
    return newGame(gameId)
  }

  d.resolve(games[gameId]);

  return d.promise;
}

function newGame(gameId) {
  var d = Q.defer();

  ds.get('gameData').then(function(data) {
    games[gameId] = new Game(data[0]);
    d.resolve(games[gameId])
  })

  return d.promise;
}