var ps = require('../player/playerService.js');

module.exports = function(raw) {
  raw.fieldPlayers.forEach(function(team, idx) {    
    team.forEach(buildPlayer, this)
  }, this);
  raw.goalkeepers.forEach(buildPlayer, this);

  function buildPlayer(id) {
    this[id] = ps.getPlayer(id);
  }  
}
