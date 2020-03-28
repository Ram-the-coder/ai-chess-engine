var board = null
// var think = null
var game = new Chess()
var searchDepth = 3;
let doOrdering = false;

$('#sdepth').val(searchDepth);

$('#sdepth').change((e) => {
	searchDepth = e.target.value;
	console.log(searchDepth);
})

$('#morder').prop('checked', doOrdering);
$('#morder').change((e) => {
  doOrdering = e.target.checked;
})


var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
}

function makeMove() {
	window.setTimeout(() => {
    makeBestMove().then(() => {
      console.log("chosen");
      updateMoves();
      makeMove();
    });
  }, 250);
}

// var thinkConfig = {
// 	position: 'start',
// 	pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
// 	showNotation: false,
// }

board = Chessboard('myBoard', config);
// think = Chessboard('think', thinkConfig)