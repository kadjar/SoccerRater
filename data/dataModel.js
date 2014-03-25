// this layer is probably redundant. 

var Q = require('q'),
ls = require('./localService');

var currentGame = {}
,       history = []
,    inProgress = false
,    gameEvents;

exports.init = function() {
  return { game: currentGame, history: history, inProgress: inProgress }
}

exports.inProgress = function() { return inProgress };

exports.getGame = function() {
  return currentGame;
}

exports.startGame = function() {
  var d = Q.defer();
  ls.startGame().then(function(game) {
    currentGame = game.data;

    inProgress = true;
    d.resolve(currentGame.match.kickoff);
    game.on('gameEvent', handleGameEvent)
  });
  return d.promise;
}
exports.stopGame = function() {
  ls.init().then(function(data) {
    currentGame = data;
  })
  inProgress = false;
  history = [];
  ls.stopGame();
}
exports.getMatchData = function() {
  var d = Q.defer();  
  ls.getMatchData().then(function(res) {
    d.resolve(res);
  })
  return d.promise;
}

exports.eventSubscribe = function(callback) {
  gameEvents = callback;
}

exports.ratingsSubmission = function(sub) {
  ls.receivePlayerRating(sub);
}

function handleGameEvent(e) {
  history.push(e)
  gameEvents(e)
}

(function init() {
  ls.init().then(function(data) {
    currentGame = data;
  })
})()