/*
 * Serve content over a socket
 */

var ls = require('../data/localService.js')
,   ce = require('cloneextend');

module.exports = function (boss, socket) {
  ls.getGame('FCBvARS').then(function(res) {
    res.sessionId = socket.id;
    console.log(res)
    //socket.emit('init', res)
  })
  // var quo = dm.init();
  // quo.sessionId = socket.id;

  // socket.emit('init', quo);
  //socket.emit('init', { game: {}, history: [], inProgress: true });
  
  // socket.on('startgame', function () { 
  //   if (dm.inProgress())
  //     return

  //   dm.startGame().then(function(timestamp) {      
  //     console.log('game started')

  //     boss.emit('kickoff', timestamp);
      
  //     dm.eventSubscribe(function(e) {
  //       console.log('game event')
  //       boss.emit('send:event', e)
  //     })

  //     updater = setInterval(function() {
  //       dm.getMatchData().then(function(res) {
  //         boss.emit('match:update', res)
  //       })
  //     }, 5000)
  //   })
  // });  

  // socket.on('stopgame', function () {
  //   if (!dm.inProgress()) {
  //     return
  //   }
  //   dm.stopGame();
  //   console.log('game stopped');

  //   clearInterval(updater);

  //   boss.emit('halt', { user: 'x'})
  // });

  // socket.on('playerSubmit', dm.ratingsSubmission)
};
