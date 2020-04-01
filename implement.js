var board = null
var move_cfg, gameover;
let table = {}
let foundNextBestMove;
// let startFEN = "8/8/8/8/8/8/2K2pk1/8 w - - 0 1";
// let startFEN = "8/2KP2k1/8/8/8/8/8/8 w - - 0 1";
let startFEN;
var game = new Chess();
gameOver = false;
if(startFEN !== undefined)
  game.load(startFEN);


var searchDepth = 3;
let doOrdering = true;
let useTranspositionTable = true;

$('#sdepth').val(searchDepth);

$('#sdepth').change((e) => {
	searchDepth = e.target.value;
	console.log(searchDepth);
})

$('#morder').prop('checked', doOrdering);
$('#morder').change((e) => {
  doOrdering = e.target.checked;
})

$('#trans').prop('checked', useTranspositionTable);
$('#trans').change((e) => {
  useTranspositionTable = e.target.checked;
})


var config = {
  draggable: true,
  position: startFEN !== undefined ? startFEN : 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
}

board = Chessboard('myBoard', config);


