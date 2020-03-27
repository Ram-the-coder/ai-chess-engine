function calculatePointsByPiece() {
  const board = game.board();
  let points = 0;
  for(let i=0; i<8; ++i) {
    for(let j=0; j<8; ++j) {
      if(board[i][j]) {
        let pt=0;
        switch(board[i][j].type) {
          case 'p': pt = 10; break;
          case 'r': pt = 50; break;
          case 'b': pt = 30; break;
          case 'n': pt = 30; break;
          case 'q': pt = 90; break;
          case 'k': break;
        }
        if(board[i][j].color === 'b')
          pt = -pt;
        points += pt;
      }
    }
  }
  console.log("points: ", points);  
  return points;
}

function updateMoves() {
  str = "";
  game.history().forEach(move => str += " " + move);
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
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  removeGreySquares();
  // illegal move
  if (move === null) return 'snapback'

  // make random legal move for black
  updateMoves();

  if(game.in_checkmate()) {
    window.alert("Congratulation, you've won by checkmate");
  } else if(game.in_stalemate()) { 
   window.alert("Game drawn by stalemate"); 
  } else if(game.in_threefold_repetition()) {
    window.alert("Game drawn by threefold repetition"); 
  }

  window.setTimeout(() => {
    makeBestMove().then(() => {
      console.log("chosen");
      updateMoves();
    });
  }, 250);
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  board.position(game.fen());
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