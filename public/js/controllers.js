'use strict';

var gameData, inProgress = false;

/* Controllers */

angular.module('soccerRater.controllers', []).
  controller('SoccerRaterCtrl', ['$scope', 'socket', 'helperServices', '$rootScope',function ($scope, socket, helperServices, $rootScope) {
    $scope.history = [];

    socket.on('init', function(res) {
      console.log(res)
      gameData = res.game;

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
      $scope.game.inProgress = true;
      startGame(data);
    })

    socket.on('halt', function() {
      $scope.stop();
    })

    function tock(c, s) {
      $scope.gameClock = c;
      $scope.time_as_pct = Math.floor(100 * (s / 5400)) + '%'; // 5400 seconds in a 90-minute game  

      $scope.$apply();
    }

    function startGame(stamp) {
      console.log('game start')

      helperServices.startClock(stamp, tock)

      socket.on('update', function(data) {        
        $scope.$apply(function() {
          $scope.game = data;
        });
      })
    }

    $scope.buildHistory = function(item) {
      $scope.history.unshift(item);
    }

    $scope.start = function() {
      socket.emit('startgame', function() {
        console.log('game started')
      })
    }   

    $scope.stop = function() {
      console.log('stop')
      helperServices.stopClock();
      $scope.gameClock = "00:00";
      $scope.time_as_pct = "0%";
      $scope.game.inProgress = false;
      $scope.gameEvents = [];
      socket.emit('stopgame', function(data) {
        console.log('stopped', data)
      })
      
    }   

    $scope.showPlayer = function(player) {
        $scope.selectedPlayer = $scope.game.players[player];  
    }

    $scope.submitPlayerRating = function(id, rating) {
      socket.emit('playerRating', {playerId: id, playerRating: rating, sessionId: $rootScope.sessionId })
    }

  }]).
  controller('MyCtrl1', function ($scope, socket) {
    socket.on('gameEvent', $scope.buildHistory);    
  })