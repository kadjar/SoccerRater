var   ce = require('cloneextend')
, events = require('events');

var   ge = require('./gameEvents.js')
,     gr = require('./gameRatings.js');

var speedModifier = 10;

exports.init = function(newGame) {
  return new Game(newGame);
} 

function Game(newGame) {  
  this.data = ce.clone(newGame.data);

  this.players = this.data.match.players;
  this.buildPlayerMap();

  gr.extend.call(this);
  ge.extend.call(this);

  this.data.match.gameClock = "00:00";
  this.startClock();  
}

var G = Game.prototype;

G.buildPlayerMap = function() {
  this.playerMap = [];

  this.players.forEach(function(team) {
    var arr = { players: [], gk: '' };

    for (var key in team) {
      if (team[key].position !== "GK") {
        arr.players.push(key)
      } else {
        arr.gk = key
      }
    }
    this.playerMap.push(arr);
  }, this)
}


// G.__proto__ = events.EventEmitter.prototype;

G.startClock = function() {
  console.log('clock started')
  this.data.match.kickoff = new Date();  
  this._gameClock && clearInterval(this._gameClock);
  var self = this;

  var count = 0;  

  this._gameClock = setInterval(function() {    
    if (count == 5400) {
      clearInterval(this._gameClock);
      self.data.match.gameClock = "90:00"     
      return;
    }
    if (count % 60 === 0) {
      self.ratings.flushRatings((count / 60));
    }

    if (Math.random() < 0.033) {
      var gameEvent = self.gameEvents.fireRandomEvent();
    }
    var now = new Date();
    var seconds = Math.floor((now - self.data.match.kickoff) / (1000 / speedModifier));
    self.data.match.gameClock = ("00" + Math.floor(seconds / 60)).slice(-2) + ":" + ("00" + (seconds % 60)).slice(-2);
    self.data.match.gameTime = now;
    
    console.log('tick', self.data.match.gameClock)

    count++;
  }, (1000 / speedModifier))
}
G.stop = function() {
  clearInterval(this._gameClock)
}
