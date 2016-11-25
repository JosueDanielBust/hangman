class Game {
  constructor(player, round, movesLeft, words) {
    this.player = player;
    this.round = round;
    this.movesLeft = movesLeft;
    this.words = words;
  }
  plusRound() { this.round++; }
  plusmovesLeft() {
    (this.movesLeft > 0) ? this.movesLeft-- : this.movesLeft = 0;
  }
  resetMovesLeft() { this.movesLeft = 5; }
}

var player = getWordsFromCookie('player');
var words = getWordsFromCookie('words');
var game = new Game(player[0], 0, 5, words);
var hiddenWords = hideWords();

// Keyboard
var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
              'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
              's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

angular.module('round', [])
  .controller('RoundController', function($scope) {
    $scope.hiddenWords = hiddenWords;
    $scope.round = game.round+1;
    $scope.movesleft = game.movesLeft;
    $scope.word = hiddenWords[game.round];

    letters.forEach(function(letter){
      keyboardJS.bind(letter, function(e) {
        turn(letter);
        
        $scope.$apply(function(){
          $scope.hiddenWords = hiddenWords;
          $scope.round = game.round+1;
          $scope.movesleft = game.movesLeft;
          $scope.word = $scope.hiddenWords[game.round];
        });
      });
    });
  });

function getIndexes(arr, val) {
  var indexes = [], i;
  for(i = 0; i < arr.length; i++) {
    if (arr[i] === val) { indexes.push(i) }
  }
  return indexes;
}

function hideWords() {
  var array = getWordsFromCookie('words');
  for (var i = 0; i < array.length; i++) {
    for (var j = 0; j < array[i].length; j++) {
      array[i] = array[i].replace(array[i][j], '_')
    }
  }
  return array;
}

function unhideLetter(array, word, indexes, letter) {
  var wordArray = array[word];
  wordArray = wordArray.split('');
  indexes.forEach(function(i){wordArray[i] = letter});
  wordArray = wordArray.join('');
  array[word] = wordArray;
  return array;
}

function haveWinner() {
  console.log('we have a winner');
  window.location = "/winner";
}

function haveLooser() {
  console.log('we have a looser');
  eraseCookie('player');
  eraseCookie('words');
  window.location = "/looser";
}

// Turns
function turn(letter) {
  var indexes = getIndexes(game.words[game.round].split(''), letter);
  var lettersOfWord = game.words[game.round].split('');

  if (indexes.length > 0) {
    hiddenWords = unhideLetter(hiddenWords, game.round, indexes, letter);
    //.round.word = [{text: hiddenWords[game.round]}];
  } else {
    game.plusmovesLeft();
  }

  if(getIndexes(hiddenWords[game.round].split(''), '_').length == 0) {
    game.plusRound();
    game.resetMovesLeft();
  }

  if (game.round > 2) {haveWinner()};
  if (game.movesLeft <= 0) {haveLooser()};

  return hiddenWords;
}