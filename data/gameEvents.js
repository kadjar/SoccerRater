var    Q = require('q')
,     ce = require('cloneextend')
, events = require('events');

exports.extend = function() {
  this.gameEvents = new GameEvents(this);
}

var GameEvents = function(_super) {
  this._super = _super;
};
var E = GameEvents.prototype;

E.__proto__ = events.EventEmitter.prototype;

E._getRandomPlayer = function(team) {
  var team = team == undefined ?  Math.floor(Math.random() * 2): team;
  var player = Math.floor(Math.random() * 10)
  return {team: team, id: this._super.playerMap[team].players[player] };
}

E.fireRandomEvent = function() {
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
     return {};
  }
  var res = this._atomicEvents[method].call(this);
  this.emit('gameEvent', { timestamp: (new Date()), events: res })
  console.log('gameEvent', res);
  //return res;
};

E._atomicEvents = {};
E._atomicEvents.caution = function() {
  var player = this._getRandomPlayer();
  this._adjRating(player, -2);

  return [{
    event: 'caution',
    eventText: this._super.players[player.team][player.id].lastName + ' has been cautioned.',
    eventTime: this._super.data.match.gameClock,
    player: player.id,
    team: player.team
  }]
}
E._atomicEvents.foul = function() {
  var player = this._getRandomPlayer();
  this._adjRating(player, -.5);

  return [{
    event: 'foul',
    eventText: this._super.players[player.team][player.id].lastName + ' committed a foul.',
    eventTime: this._super.data.match.gameClock,
    player: player.id,
    team: player.team
  }]
}
E._atomicEvents.attempt = function() {
  var player = this._getRandomPlayer();

  if (Math.random() > .5) {
    // on frame
    this._adjRating(player, .5);

    var oppTeam = Math.abs(player.team - 1);
    var gk = this._super.playerMap[oppTeam].gk;
    this._adjRating({ team: oppTeam, id: this._super.playerMap[oppTeam].gk }, .5)
    
    return [{
        event: 'shot_attempt',
        eventText: this._super.players[player.team][player.id].lastName + ' fires a shot!',
        eventTime: this._super.data.match.gameClock,
        player: player.id,
        team: player.team
      }, {
        event: 'save',
        eventText: this._super.players[oppTeam][gk].lastName + ' with the save.',
        eventTime: this._super.data.match.gameClock,
        player: gk,
        team: oppTeam
    }]
  } else {
    this._adjRating(player, -.5);

    return [{
      event: 'shot_attempt',
      eventText: this._super.players[player.team][player.id].lastName + ' fires a shot, but missed!',
      eventTime: this._super.data.match.gameClock,
      player: player.id,
      team: player.team
    }]
  }
}
E._atomicEvents.offside = function() {
  var player = this._getRandomPlayer();
  this._adjRating(player, -.2);

  return [{
    event: 'offside',
    eventText: this._super.players[player.team][player.id].lastName + ' was caught offside.',
    eventTime: this._super.data.match.gameClock,
    player: player.id,
    team: player.team
  }]
}
E._atomicEvents.goal = function() {
  // scorer
  var player = this._getRandomPlayer();    
  this._adjRating(player, 2);

  // assist
  var assister = this._getRandomPlayer(player.team);
  this._adjRating(assister, 1);

  // opp player
  var oppTeam = Math.abs(player.team - 1);
  this._adjRating(this._getRandomPlayer(oppTeam), -1);
  this._adjRating(this._getRandomPlayer(oppTeam), -1);  

  // opp goalie  
  this._adjRating({ team: oppTeam, id: this._super.playerMap[oppTeam].gk }, -3)

  this._super.data.match.score[player.team]++

  return [{
    event: 'goal',
    eventText: this._super.players[player.team][player.id].lastName + ' scored a goal!',
    eventTime: this._super.data.match.gameClock,
    player: player.id,
    team: player.team
  },
  {  
    event: 'assist',
    eventText: 'Assisted by ' + this._super.players[player.team][assister.id].lastName,
    eventTime: this._super.data.match.gameClock,
    player: assister.id,
    team: player.team
  }]
}

E._adjRating = function(player, amt) {
  this._super.ratings.addRating(player.id, 'proRating', amt);
}
