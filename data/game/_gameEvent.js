var events = require('events');

var Randomizer = require('../util/randomizer.js');

module.exports = function() {
  this._SECONDSPERGAME = 5400;

  this._rand = new Randomizer(this);

  this.eventTypes = {};

  this.eventTypes.caution = function() {
    var player = this._getRandomPlayer();
    this._adjRating(player, -2);

    return [{
      event: 'caution',
      eventText: ' has been cautioned.',
      eventTime: this._super.data.match.gameClock,
      player: player.id,
      team: player.team
    }]
  }

  function perGame(num) { return num / this._SECONDSPERGAME; }
}