/*
 * Serve content over a socket
 */

var dm = require('../data/dataModel.js')
,   ce = require('cloneextend');

var game = false;
var updater;

//var inProgress = false; 

module.exports = function (boss, socket) {
  var quo = dm.init();
  quo.sessionId = socket.id;

  socket.emit('init', quo);
  //socket.emit('init', { game: {}, history: [], inProgress: true });
  
  socket.on('startgame', function () { 
    if (dm.inProgress())
      return

    dm.startGame().then(function(timestamp) {      
      console.log('game started')

      boss.emit('kickoff', timestamp);
      
      dm.eventSubscribe(function(e) {
        console.log('game event')
        boss.emit('send:event', e)
      })

      updater = setInterval(function() {
        dm.getMatchData().then(function(res) {
          boss.emit('match:update', res)
        })
      }, 5000)
    })
  });  

  socket.on('stopgame', function () {
    if (!dm.inProgress()) {
      return
    }
    dm.stopGame();
    console.log('game stopped');

    clearInterval(updater);

    boss.emit('halt', { user: 'x'})
  });

  socket.on('playerSubmit', dm.ratingsSubmission)
};
