/*
 * Serve content over a socket
 */

var ls = require('../data/localService.js')
,   ce = require('cloneextend');


module.exports = function (boss, socket) {
  console.log('user connected: ', socket.id)

  socket.on('init', function(gameId) {
    ls.getGame(gameId).then(function(game) { 
      console.log('game gotten, intiating', game.match.name)
      
      var send = ce.clone(game);
      socket.emit('init', { game: send, sessionId: socket.id }); 

      game._eventEmitter.on('gameEvent', function(event) {
        console.log('event', event)
        boss.emit('gameEvent', event)
      });
      game._eventEmitter.on('gameOver', function() {
        boss.emit('halt')
      });
      game._eventEmitter.on('update', function() {
        var send = ce.clone(game);
        boss.emit('update', send);
      });
    });
  });

  socket.on('startgame', function(gameId) {
    ls.getGame(gameId).then(function(game) { 
      if (game.inProgress)
        return;

      console.log('game started')
      var timestamp = game.start();
      boss.emit('kickoff', timestamp)
    })
  })
  socket.on('stopgame', function(gameId) {
    ls.getGame(gameId).then(function(game) {
      if (!game.inProgress)
        return;

      game.stop();
      boss.emit('halt')

      ls.resetGame(gameId).then(function(res) {
        socket.emit('init', { game: res, sessionId: socket.id });
      });
    })
  });  

  socket.on('playerRating', function(data) {
    ls.getGame(gameId).then(function(game) {
      game.ratePlayer(data)
    });
  })
};
