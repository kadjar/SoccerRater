/*
 * Serve content over a socket
 */

var ls = require('../data/localService.js')
,   ce = require('cloneextend');

module.exports = function (boss, socket) {
  var game;
  console.log('user connected: ', socket.id)

  ls.getGame('FCBvARS').then(function(res) {
    game = res;
    console.log('game gotten, intiating', res.match.name)
    //socket.emit('init', { game: res, sessionId: socket.id });
    socket.emit('init', { game: res.clock, sessionId: socket.id });
    
    //socket.emit('init', res)
  })
  socket.on('startgame', function() {
    if (game.inProgress)
      return;

    console.log('game started')
    var timestamp = game.start();
    boss.emit('kickoff', timestamp)

    game._eventEmitter.on('gameEvent', function(event) {
      console.log('event', event)
      boss.emit('gameEvent', event)
    })
  })  

  socket.on('stopgame', function() {
    if (!game.inProgress)
      return;

    console.log('game stopped')
    game.stop();
    boss.emit('halt')

    ls.resetGame('FCBvARS').then(function(res) {
      socket.emit('init', { game: res, sessionId: socket.id });
    });
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
