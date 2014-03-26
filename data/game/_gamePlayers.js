var ps = require('../player/playerService.js');

module.exports = function(raw) {
  this.pants = [];  

  raw.fieldPlayers.forEach(function(team, idx) {    
    team.forEach(buildPlayer, this)
  }, this)

  function buildPlayer(id) {
    this[id] = ps.getPlayer(id);
  }  
}
