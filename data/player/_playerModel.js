var   R = require('../rating/rating.js');

module.exports = function(player) {
  player.gameStats = { 
    stats: {},
    liveRating: new R('live'),
    proRating: new R('pro')
  }
}


