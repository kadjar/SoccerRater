var events = require('events');

var     Events = require('../events/events.js')
,        Clock = require('./_gameClock.js')
,  GamePlayers = require('./_gamePlayers.js');

module.exports = function(raw) {
  this.inProgress = false;
  this.match = raw;
  this.match.score = [0,0];
  
  this.players = new GamePlayers(this.match.players);

  this.eventHistory = [];
  this.events = new Events(this.match.players);
  this._eventEmitter = new Object();
  this._eventEmitter.__proto__ = events.EventEmitter.prototype;

  this.handleEvents = function(events) {
    events.forEach(function(event) {
      // adjust auto ratings
      this.players[event.player].gameStats.proRating.pushRating(event.adjustment);

      // score goals
      if (event.type === 'goal') {
        this.match.score[event.team]++
      }

      // publish event
      var theEvent = {time: this.clock.text, player: event.player, event: event.type, text: event.eventText };
      this.eventHistory.push(theEvent);
      this._eventEmitter.emit('gameEvent', theEvent)
    }, this)
  }

  this.clock = new Clock(10);

  this.start = function() {
    this.clock.start();
    this.inProgress = true;
    return this.clock.kickoff;
  }
  this.stop = function() {
    this.clock.stop();
    this.inProgress = false;
  }

  this.clock.on('second', function() {    
    var events = this.events.getRandomEvent();
    events && this.handleEvents(events);

  }.bind(this));

  this.clock.on('minute', function() {
    console.log('tick ', this.clock.text, this.clock.seconds)
  }.bind(this))

  this.clock.on('gameOver', function() {
    this.inProgress = false;
  }.bind(this))
}