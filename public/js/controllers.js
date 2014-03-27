'use strict';

var gameData, inProgress = false;

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', ['$scope', 'socket', 'helperServices', '$rootScope',function ($scope, socket, helperServices, $rootScope) {
    $scope.history = [];

    socket.on('init', function(res) {
      console.log(res)
      $rootScope.sessionId = res.sessionId;
      $scope.game = res.game;      

      if ($scope.game.inProgress) {        
        startGame($scope.game.clock.kickoff)
        $scope.game.eventHistory.forEach($scope.buildHistory)
      }

      $scope.selectedPlayer = $scope.game.players[$scope.game.match.players[0][0].id]
    })

    socket.on('kickoff', function (data) {
      console.log('kickoff', data)
      $scope.inProgress = true;
      startGame(data);
    })

    function tock(c, s) {
      $scope.gameClock = c;
      $scope.time_as_pct = Math.floor(100 * (s / 5400) - 1) + '%'; // 5400 seconds in a 90-minute game  

      $scope.$apply();
    }

    function startGame(stamp) {
      console.log('game start')

      helperServices.startClock(stamp, tock)

      socket.on('match:update', function(data) {        
        $scope.$apply(function() {
          $scope.gameData.match = data;
        });
      })

      //buildUI();
    }

    $scope.buildHistory = function(arr) {
      arr.events.forEach(function(event) {
        $scope.history.push(event.eventTime + ": " + event.eventText)          
      })   
    }

    $scope.start = function() {
      socket.emit('startgame', function(data) {
        console.log('game started', data)
      })
    }   

    $scope.stop = function() {
      console.log('stop')
      helperServices.stopClock();
      $scope.gameClock = "00:00";
      $scope.time_as_pct = "0%";
      inProgress = false;
      $scope.gameEvents = [];
      socket.emit('stopgame', function(data) {
        console.log('stopped', data)
      })
      
    }   

    $scope.showPlayer = function(player) {
        $scope.selectedPlayer = $scope.game.players[player];  
    }

    $scope.submitPlayerRating = function(id, rating) {
      socket.emit('playerSubmit', {playerId: id, playerRating: rating, sessionId: $rootScope.sessionId })
    }
    // socket.on('game', function (inc) {
    //   $scope.gameData = gameData = inc.res.game.data;

    //   inc.res.history.forEach(function(histEvent) {
    //     histEvent.events.forEach(function(event) {
    //       $scope.gameEvents.push(event.eventText)          
    //     })
    //   })

    //   $scope.name = gameData.name;
    //   inProgress = inc.res.game.inProgress;

    //   if (inProgress) 
    //     helperServices.startClock(gameData.match.kickoff, tock)        
    //   else {
    //     $scope.gameClock = '00:00';
    //     socket.on('kickoff', function(data) {
    //       console.log('kickoff', data)
    //       inProgress = true;
    //       helperServices.startClock(data, tock)
    //     });        
    //   }

    //   // socket.on('halt', function() {
    //   //   console.log('halt')
    //   //   $scope.stop();
    //   // })

    //   socket.on('heartbeat', handleHeartbeat)

    //   buildUI();
    // });


    
  }]).
  controller('MyCtrl1', function ($scope, socket) {
    socket.on('send:event', $scope.buildHistory);    
  }).
  controller('MyCtrl2', function ($scope) {
    // write Ctrl here
  });