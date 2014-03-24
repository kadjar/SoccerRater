var    Q = require('q')
,     ce = require('cloneextend')
, events = require('events');


function Game(newGame) {  
  this.data = ce.clone(newGame.data);  
  this.data.match.gameClock = "00:00";
  this.startClock();

  this.buildRatingsQueue();
}

Game.prototype.userRatings = { players: {} };
Game.prototype.userRatings.addRating = function (sub) {
  if (!this.players[sub.playerId]) {
    this.players[sub.playerId] = {};    
  }

  this.players[sub.playerId][sub.sessionId] = sub.playerRating;

  console.log('userrating added',this)
}
Game.prototype.userRatings.flushLiveRatings = function() {
  var out = {};

  for (var player in this.userRatings.players) {
    var total = 0;
    var uniques = 0;
    for (var session in this.userRatings.players[player]) {
      total += this.userRatings.players[player][session];
      uniques++;
    }

    this.ratingsQueue[player].liveRating = total / uniques;
    console.log('tot / u ', total, uniques)
  }
  console.log('liveratings',this.ratingsQueue)
}


Game.prototype.__proto__ = events.EventEmitter.prototype;

Game.prototype.startClock = function() {
  console.log('clock started')
  this.data.match.kickoff = new Date();  
  this._gameClock && clearInterval(this._gameClock);
  var self = this;

  var count = 0;
  var atomic = new GenerateAtomic(this);

  this._gameClock = setInterval(function() {    
    if (count == 5400) {
      clearInterval(this._gameClock);
      self.data.match.gameClock = "90:00"     
      return;
    }
    if (count % 60 === 0) {
      self.flushRatings((count / 60));
      //console.log(self.data.match.players[0][4173].gameStats)
    }

    if (Math.random() < 0.033) {
      //queue.push({ timestamp: (new Date()), events: atomic.getRandomEvent() })
      var gameEvent = atomic.getRandomEvent();
      console.log('gameEvent', gameEvent)

      if (gameEvent.length > 0) {
        self.emit('gameEvent', { timestamp: (new Date()), events: gameEvent })
      }
    }
    var now = new Date();
    var seconds = Math.floor((now - self.data.match.kickoff) / (1000 / speedModifier));
    self.data.match.gameClock = ("00" + Math.floor(seconds / 60)).slice(-2) + ":" + ("00" + (seconds % 60)).slice(-2);
    self.data.match.gameTime = now;
    
    console.log('tick', self.data.match.gameClock)

    count++;
  }, (1000 / speedModifier))
}
Game.prototype.stop = function() {
  clearInterval(this._gameClock)
}
Game.prototype.buildRatingsQueue = function() {
  var queue = {};

  this.data.match.players.forEach(function(team, idx) {    
    for (var player in team) {
      queue[player] = {liveRating: team[player].gameStats.liveRating.cumulative, proRating: team[player].gameStats.proRating.cumulative, team: idx}
    }    
  }, this)

  this.ratingsQueue = ce.clone(queue);
  console.log('ratings built')
}
Game.prototype.addRating = function(id, type, amt) {
  this.ratingsQueue[id][type] += (((5 - Math.abs(5 - this.ratingsQueue[id][type])) / 5) * amt);
}
Game.prototype.flushRatings = function(minute) {
  this.userRatings.flushLiveRatings.call(this);

  for (var id in this.ratingsQueue) {
    var stat = this.data.match.players[this.ratingsQueue[id].team][id].gameStats;

    for (var type in {proRating: null, liveRating: null}) {
      stat[type].cumulative = this.ratingsQueue[id][type];
      stat[type].atomic.push(this.ratingsQueue[id][type]);
      stat[type].chart += " L " + Math.floor((100 / 90) * minute) + " " + ((10 - this.ratingsQueue[id][type]) * 10);
    }
  }
  this.buildRatingsQueue();
}

function GenerateAtomic(boss) {
  var self = this; 

  this.boss = boss;
  this.players = boss.data.match.players;
  this.playerArrays = [];

  this.players.forEach(function(team) {
    var arr = { players: [], gk: '' };

    for (var key in team) {
      if (team[key].position !== "GK") {
        arr.players.push(key)
      } else {
        arr.gk = key
      }
    }
    self.playerArrays.push(arr);
  })
}

GenerateAtomic.prototype.getRandomEvent = function() {
  var roll = Math.random();
  var method;

  if (roll < 0.028) // ~ 5 / 90
    method = 'caution';
  else if (roll < 0.17) // ~ 25 / 90
    method = 'foul'
  else if (roll <  0.19) // ~ 3 / 90
    method = 'goal'
  else if (roll < 0.33) // ~ 25 / 90
    method = 'attempt'
  else if (roll < 0.37) // ~ 8 / 90
    method = 'offside'
  else {
     return []
  }
  var res = this._atomicEvents[method].call(this);
  return res;
};
GenerateAtomic.prototype._atomicEvents = {};
GenerateAtomic.prototype._atomicEvents.caution = function() {
  var player = this.getRandomPlayer();
  this.adjRating(player, -2);

  return [{
    event: 'caution',
    eventText: this.players[player.team][player.id].lastName + ' has been cautioned.',
    eventTime: this.boss.data.match.gameClock,
    player: player.id,
    team: player.team
  }]
}
GenerateAtomic.prototype._atomicEvents.foul = function() {
  var player = this.getRandomPlayer();
  this.adjRating(player, -.5);

  return [{
    event: 'foul',
    eventText: this.players[player.team][player.id].lastName + ' committed a foul.',
    eventTime: this.boss.data.match.gameClock,
    player: player.id,
    team: player.team
  }]
}
GenerateAtomic.prototype._atomicEvents.attempt = function() {
  var player = this.getRandomPlayer();

  if (Math.random() > .5) {
    // on frame
    this.adjRating(player, .5);

    var oppTeam = Math.abs(player.team - 1);
    var gk = this.playerArrays[oppTeam].gk;
    this.adjRating({ team: oppTeam, id: this.playerArrays[oppTeam].gk }, .5)
    
    return [{
        event: 'shot_attempt',
        eventText: this.players[player.team][player.id].lastName + ' fires a shot!',
        eventTime: this.boss.data.match.gameClock,
        player: player.id,
        team: player.team
      }, {
        event: 'save',
        eventText: this.players[oppTeam][gk].lastName + ' with the save.',
        eventTime: this.boss.data.match.gameClock,
        player: gk,
        team: oppTeam
    }]
  } else {
    this.adjRating(player, -.5);

    return [{
      event: 'shot_attempt',
      eventText: this.players[player.team][player.id].lastName + ' fires a shot, but missed!',
      eventTime: this.boss.data.match.gameClock,
      player: player.id,
      team: player.team
    }]
  }
}
GenerateAtomic.prototype._atomicEvents.offside = function() {
  var player = this.getRandomPlayer();
  this.adjRating(player, -.2);

  return [{
    event: 'offside',
    eventText: this.players[player.team][player.id].lastName + ' was caught offside.',
    eventTime: this.boss.data.match.gameClock,
    player: player.id,
    team: player.team
  }]
}
GenerateAtomic.prototype._atomicEvents.goal = function() {
  // scorer
  var player = this.getRandomPlayer();    
  this.adjRating(player, 2);

  // assist
  var assister = this.getRandomPlayer(player.team);
  this.adjRating(assister, 1);

  // opp player
  var oppTeam = Math.abs(player.team - 1);
  this.adjRating(this.getRandomPlayer(oppTeam), -1);
  this.adjRating(this.getRandomPlayer(oppTeam), -1);  

  // opp goalie  
  this.adjRating({ team: oppTeam, id: this.playerArrays[oppTeam].gk }, -3)

  this.boss.data.match.score[player.team]++

  return [{
    event: 'goal',
    eventText: this.players[player.team][player.id].lastName + ' scored a goal!',
    eventTime: this.boss.data.match.gameClock,
    player: player.id,
    team: player.team
  },
  {  
    event: 'assist',
    eventText: 'Assisted by ' + this.players[player.team][assister.id].lastName,
    eventTime: this.boss.data.match.gameClock,
    player: assister.id,
    team: player.team
  }]
}
GenerateAtomic.prototype.adjRating = function(player, amt) {
  // this.players[player.team][player.id].liveRating += (((5 - Math.abs(5 - this.players[player.team][player.id].liveRating)) / 10) * amt)
  this.boss.addRating.call(this.boss, player.id, 'proRating', amt);
}
GenerateAtomic.prototype.getRandomPlayer = function(team) {
  var team = team == undefined ?  Math.floor(Math.random() * 2): team;
  var player = Math.floor(Math.random() * 10)
  return {team: team, id: this.playerArrays[team].players[player] };
}

