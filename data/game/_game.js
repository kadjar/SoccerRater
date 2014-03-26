var events = require('events');

var   gameEvents = require('./_gameEvent.js')
,      Clock = require('./_gameClock.js')
,      GamePlayers = require('./_gamePlayers.js');

module.exports = function(raw) {
  this.data = raw;
  this.events = new Object();
  this.events.__proto__ = events.EventEmitter.prototype;

  this.clock = new Clock();
  this.players = new GamePlayers(this.data.players);

  this.start = function() {

  }
  this.stop = function() {

  }
}