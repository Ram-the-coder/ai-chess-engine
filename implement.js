var board = null
// var think = null
var game = new Chess()

var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
}

// var thinkConfig = {
// 	position: 'start',
// 	pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
// 	showNotation: false,
// }

board = Chessboard('myBoard', config)
// think = Chessboard('think', thinkConfig)
