var    Q = require('q');

var   ds = require('../dataService.js')
,   Game = require('./_game.js');

var games = {};

exports.getGame = function(gameId) {
  var d = Q.defer();  

  if (!games[gameId]) {
    return newGame(gameId)
  }
  console.log('games::', games[gameId].match.name)

  d.resolve(games[gameId]);

  return d.promise;
}

exports.resetGame = function(gameId) {
  return newGame(gameId);
}

function newGame(gameId) {
  var d = Q.defer();

  ds.get('gameData').then(function(data) {
    games[gameId] = new Game(data[0]);
    d.resolve(games[gameId])
  })

  return d.promise;
}