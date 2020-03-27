function getPieceValue(piece) {
	function getAbsoluteValue(piece) {
		switch(piece.type) {
			case 'p': return 10;
			case 'r': return 50;
			case 'n': return 30;
			case 'b': return 30;
			case 'q': return 90;
			case 'k': return 900;
			default: console.err("Unknown piece type " + piece); return 0;
		}	
	}
	if(piece === null)
		return 0;

	const absVal = getAbsoluteValue(piece);
	return piece.color === 'w' ? absVal : -absVal;
}

function evalBoard(board) {
	let points = 0;
	for(let i=0; i<8; ++i) {
		for(let j=0; j<8; ++j) {
			points += getPieceValue(board[i][j]);
		}
	}
	return points;
}

function makeBestMove() {
	let isMax = game.turn() === 'w';
	let bestMove = miniMax(game, 3, -999999, 999999, isMax);
	console.log(bestMove);
	game.move(bestMove.move);
	board.position(game.fen());
}

function makeRandomMove () {
  var possibleMoves = game.moves()

  // game over
  if (possibleMoves.length === 0) return

  var randomIdx = Math.floor(Math.random() * possibleMoves.length)
  game.move(possibleMoves[randomIdx])
  board.position(game.fen())
}

function miniMax(game, depth, alpha, beta, isMax) {
	if(depth === 0)
		return {val: evalBoard(game.board()), detail: {}, evaluated: 1};

	if(alpha > beta)
		return {val: evalBoard(game.board()), detail: {}, evaluated: 1};
	let possibleMoves = game.moves();
	let bestMoves;
	let detail={};
	let evaluated=0;
	if(isMax) {
		let max = -99999;
		for(let i=0; i<possibleMoves.length; ++i) {
			game.move(possibleMoves[i]);
			let newval = miniMax(game, depth-1, alpha, beta, false);
			evaluated += newval.evaluated;
			detail[possibleMoves[i]] = newval;
			alpha = Math.max(alpha, newval.val);
			game.undo();
			if(newval.val > max) {
				max = newval.val;
				bestMoves = [possibleMoves[i]];
			} else if(newval.val === max) {
				bestMoves.push(possibleMoves[i]);
			}
		}
		let randomIdx = Math.floor(Math.random() * bestMoves.length);
		return {val: max, move: bestMoves[randomIdx], detail, evaluated};
	} else {
		let min = 99999;
		for(let i=0; i<possibleMoves.length; ++i) {
			game.move(possibleMoves[i]);
			let newval = miniMax(game, depth-1, alpha, beta, true);
			evaluated += newval.evaluated;
			detail[possibleMoves[i]] = newval;
			beta = Math.min(beta, newval.val);
			game.undo();
			if(newval.val < min) {
				min = newval.val;
				bestMoves = [possibleMoves[i]];
			} else if(newval.val === min) {
				bestMoves.push(possibleMoves[i]);
			}
		}
		let randomIdx = Math.floor(Math.random() * bestMoves.length)
		return {val: min, move: bestMoves[randomIdx], detail, evaluated};
	}
}