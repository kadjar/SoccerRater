var ps = require('../player/playerService.js');

module.exports = function(raw) {
  raw.forEach(function(team, idx) {    
    team.forEach(buildPlayer, this)
  }, this);

  function buildPlayer(player) {
    this[player.id] = ps.getPlayer(player.id);
    this[player.id].position = player.pos;
  }
}
