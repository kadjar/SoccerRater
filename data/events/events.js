var Randomizer = require('../util/randomizer.js');
var util = require('../util/util.js');

var Event = require('./_eventModel.js');

module.exports = function(players) {
  this._players = players;   
  this._SECONDSPERGAME = 5400;



  // Public methods

  this.getRandomEvent = function() {
    var type = this._rand.getRandom();
    
    var res = type ? this._eventTypes[type].call(this) : false;

    return res;
  }



  // Convenience methods

  this._getRandomFieldPlayer = function(team) {
    var team = team || util.randomInt(2);
    var ceil = this._players[team].length;
    var player = this._players[team][util.randomInt(ceil, 1)].id;

    return { team: team, player: player }; 
  }
  this._getOppGk = function(team) {
    team = util.opposite(team)
    return { team: team, player: this._players[team][0].id }
  }

  this._perGame = function (num) { return num / this._SECONDSPERGAME; }


  // Make the event randomizer

  this._rand = new Randomizer(this);  
  this._rand.register('caution', this._perGame(4));
  this._rand.register('foul', this._perGame(25));
  this._rand.register('offside', this._perGame(8));
  this._rand.register('goal', this._perGame(3));
  this._rand.register('failedShot', this._perGame(25));



  // Figure out what to do with each random event

  this._eventTypes = {};
  this._eventTypes.caution = function() {
    return [new Event('caution', this._getRandomFieldPlayer())]
  }
  this._eventTypes.foul = function() {
    var res = [];

    var fouler = this._getRandomFieldPlayer();
    res.push(new Event('foul', fouler));

    var foulee = this._getRandomFieldPlayer(util.opposite(fouler.team));
    res.push(new Event('wasFouled', foulee))

    return res;
  }
  this._eventTypes.offside = function() {
    return [new Event('offside', this._getRandomFieldPlayer())]
  }
  this._eventTypes.goal = function() {
    var res = [];

    var scorer = this._getRandomFieldPlayer();
    res.push(new Event('goal', scorer));

    var assister = this._getRandomFieldPlayer(scorer.team);
    res.push(new Event('assist', assister));

    var oppGk = this._getOppGk(scorer.team)
    res.push(new Event('missedSave', oppGk));
    return res;
  }
  this._eventTypes.failedShot = function() {
    var res = [];

    if (util.randomBool()) {
      res.push(new Event('missedAttempt', this._getRandomFieldPlayer()))
    } else {
      var shooter = this._getRandomFieldPlayer();
      res.push(new Event('savedAttempt', shooter))

      var oppGk = this._getOppGk(shooter.team)
      res.push(new Event('save', oppGk))
    }

    return res;
  }
}