var   ce = require('cloneextend');

exports.extend = function() {
  this.ratings = new Ratings(this);
}

var Ratings = function(_super) {
  this._super = _super;
  this._buildRatingsQueue();
};
var R = Ratings.prototype;

R._buildRatingsQueue = function() {
  var queue = {};

  this._super.data.match.players.forEach(function(team, idx) {    
    for (var player in team) {
      queue[player] = {liveRating: team[player].gameStats.liveRating.cumulative, proRating: team[player].gameStats.proRating.cumulative, team: idx}
    }    
  }, this)

  this.queue = ce.clone(queue);
  console.log('ratings built')
}

R.userRatings = { players: {} };
R.userRatings.addRating = function (sub) {
  if (!this.players[sub.playerId]) {
    this.players[sub.playerId] = {};    
  }

  this.players[sub.playerId][sub.sessionId] = sub.playerRating;

  console.log('userrating added',this)
}
R.userRatings.flushLiveRatings = function() {
  var out = {};

  for (var player in this.userRatings.players) {
    var total = 0;
    var uniques = 0;
    for (var session in this.userRatings.players[player]) {
      total += this,userRatings.players[player][session];
      uniques++;
    }

    this.queue[player].liveRating = total / uniques;
  }
}

R.addRating = function(id, type, amt) {
  this.queue[id][type] += (((5 - Math.abs(5 - this.queue[id][type])) / 5) * amt);
}
R.flushRatings = function(minute) {
  this.userRatings.flushLiveRatings.call(this);

  for (var id in this.queue) {
    var stat = this._super.data.match.players[this.queue[id].team][id].gameStats;

    for (var type in {proRating: null, liveRating: null}) {
      stat[type].cumulative = this.queue[id][type];
      stat[type].atomic.push(this.queue[id][type]);
      stat[type].chart += " L " + Math.floor((100 / 90) * minute) + " " + ((10 - this.queue[id][type]) * 10);
    }
  }
  this._buildRatingsQueue();
}