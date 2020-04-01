function updateMoves() {
  str = "";
  count=1;
  game.history().forEach((move, index) => {
    str += " ";
    if(index % 2 == 0)
      str += (count++) + ".";
    str += move;
    if(index % 2)
      str += "&nbsp";
  });
  $('#moves').html(str);
  $('#points').html(calculatePointsByPiece());
}

function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false;

  // only pick up pieces for White
  if (piece.search(/^b/) !== -1) return false;

  var moves = game.moves({
      square: source,
      verbose: true
  });

  if (moves.length === 0) return;

  greySquare(source);

  for (var i = 0; i < moves.length; i++) {
      greySquare(moves[i].to);
  }
  return true;
}

function onDrop (source, target) {
  // see if the move is legal
  	move_cfg = {
		from: source,
		to: target,
		promotion: 'q' // NOTE: always promote to a queen for example simplicity
	};

	var move = game.move(move_cfg);

	removeGreySquares();
	// illegal move
	if (move === null) return 'snapback'

	game.undo();

	if(isPromotion(source, target, game.board(), game.turn())) {
		showModal();
		return;
	}

	// make move
	makeMove(move_cfg);
}

function makeMove(move_cfg) {
  move = game.move(move_cfg);
  if(move === null) return 'snapback';
  updateMoves();
  checkGameEnd(true);
  if(gameOver)
    return;

  window.setTimeout(() => {
    makeBestMove().then(async () => {
      updateMoves();
      setTimeout(() => checkGameEnd(false), 400);
    });
  }, 250);
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  board.position(game.fen());
}

function checkGameEnd(endedByPlayer) {
  gameOver = true;
	if(game.in_checkmate()) {
		endedByPlayer ? window.alert("Congratulation, you've won by checkmate") : window.alert("AI defeats you by checkmate");
	} else if(game.in_stalemate()) { 
		window.alert("Game drawn by stalemate"); 
	} else if(game.in_threefold_repetition()) {
		window.alert("Game drawn by threefold repetition"); 
	} else if(game.insufficient_material()) {
		window.alert("Game drawn by insufficient_material"); 
	} else {
    gameOver = false;
  }
}

var onMouseoverSquare = function(square, piece) {
    var moves = game.moves({
        square: square,
        verbose: true
    });

    if (moves.length === 0) return;

    greySquare(square);

    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
};

var onMouseoutSquare = function(square, piece) {
    removeGreySquares();
};

var removeGreySquares = function() {
    $('#myBoard .square-55d63').css('background', '');
};

var greySquare = function(square) {
    var squareEl = $('#myBoard .square-' + square);

    var background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d') === true) {
        background = '#696969';
    }

    squareEl.css('background', background);
};

function handleReset() {
  game.reset();
  board.position(game.fen());
  updateMoves();
}

function handleUndo() {
  game.undo();
  game.undo();
  board.position(game.fen()); 
  updateMoves();
}

function showModal() {
  const width = document.querySelector('.board-b72b1').offsetWidth;
  const offsetLeft = document.querySelector('.board-b72b1').offsetLeft;
  $('#myModal').css('height', width);
  $('#myModal').css('width', width);
  $('#myModal').css('margin-left', offsetLeft);
  $('#myModal').fadeIn();
  $('.pop-inner').fadeIn();
  const imgStr = 'https://chessboardjs.com/img/chesspieces/wikipedia/';
  $('#q').attr('src', imgStr + game.turn() + 'Q.png');
  $('#r').attr('src', imgStr + game.turn() + 'R.png');
  $('#n').attr('src', imgStr + game.turn() + 'N.png');
  $('#b').attr('src', imgStr + game.turn() + 'B.png');
}

function hideModal() {
  $('#myModal').fadeOut();
  $('.pop-inner').fadeOut();
}

function setPromotion(piece) {
 move_cfg.promotion = piece;
 hideModal();
 makeMove(move_cfg);
}