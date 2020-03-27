const pawnEvalWhite =
    [
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
        [5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0],
        [1.0,  1.0,  2.0,  3.0,  3.0,  2.0,  1.0,  1.0],
        [0.5,  0.5,  1.0,  2.5,  2.5,  1.0,  0.5,  0.5],
        [0.0,  0.0,  0.0,  2.0,  2.0,  0.0,  0.0,  0.0],
        [0.5, -0.5, -1.0,  0.0,  0.0, -1.0, -0.5,  0.5],
        [0.5,  1.0, 1.0,  -2.0, -2.0,  1.0,  1.0,  0.5],
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
    ];

const pawnEvalBlack = pawnEvalWhite.slice().reverse();

const knightEval =
    [
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
        [-4.0, -2.0,  0.0,  0.0,  0.0,  0.0, -2.0, -4.0],
        [-3.0,  0.0,  1.0,  1.5,  1.5,  1.0,  0.0, -3.0],
        [-3.0,  0.5,  1.5,  2.0,  2.0,  1.5,  0.5, -3.0],
        [-3.0,  0.0,  1.5,  2.0,  2.0,  1.5,  0.0, -3.0],
        [-3.0,  0.5,  1.0,  1.5,  1.5,  1.0,  0.5, -3.0],
        [-4.0, -2.0,  0.0,  0.5,  0.5,  0.0, -2.0, -4.0],
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
    ];
const bishopEvalWhite = [
    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0],
    [ -1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0],
    [ -1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0],
    [ -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0],
    [ -1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0],
    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
];

const rookEvalWhite = [
    [  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
    [  0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [  0.0,   0.0, 0.0,  0.5,  0.5,  0.0,  0.0,  0.0]
];

const rookEvalBlack = rookEvalWhite.slice().reverse();

const bishopEvalBlack = bishopEvalWhite.slice().reverse();

const evalQueen =
    [
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -0.5,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [  0.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [ -1.0,  0.5,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
];

const kingEvalWhite = [

    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [ -1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [  2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0 ],
    [  2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0 ]
];


const kingEvalBlack = kingEvalWhite.slice().reverse();


function getPieceValue(piece, i, j) {
	function getAbsoluteValue(piece, isWhite, i, j) {
		switch(piece.type) {
			case 'p': return 10 + (isWhite ? pawnEvalWhite[i][j] : pawnEvalBlack[i][j]);
			case 'r': return 50 + (isWhite ? rookEvalWhite[i][j] : rookEvalBlack[i][j]);
			case 'n': return 30 + knightEval[i][j];
			case 'b': return 30 + (isWhite ? bishopEvalBlack[i][j] : bishopEvalBlack[i][j]);
			case 'q': return 90 + evalQueen[i][j];
			case 'k': return 900 + (isWhite ? kingEvalWhite[i][j] : kingEvalBlack[i][j]);
			default: console.err("Unknown piece type " + piece); return 0;
		}	
	}
	if(piece === null)
		return 0;

	const absVal = getAbsoluteValue(piece, piece.color === 'w', i, j);
	return piece.color === 'w' ? absVal : -absVal;
}

function evalBoard(board) {
	let points = 0;
	for(let i=0; i<8; ++i) {
		for(let j=0; j<8; ++j) {
			points += getPieceValue(board[i][j], i, j);
		}
	}
	return points;
}

async function makeBestMove() {
	return new Promise((resolve, reject) => {
		let isMax = game.turn() === 'w';
		$('#thinking-loader').toggleClass('hide');
		setTimeout(() => {
			const start = new Date().getTime();
			let bestMove = miniMax(game, searchDepth, -999999, 999999, isMax);
			const end = new Date().getTime();
			$('#thinking-loader').toggleClass('hide');
			$('#pos-eval').html(bestMove.evaluated);
			$('#speed').html(Math.round(bestMove.evaluated*1000/(end-start)));
			console.log(bestMove);
			game.move(bestMove.move);
			board.position(game.fen());	
			return resolve();
		}, 0);	
	})
	
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

	if(game.in_checkmate()) {
		return {val: isMax ? -1000 : 1000, detail: {}, evaluated: 1};
	}

	if(game.in_draw() || game.in_stalemate() || game.in_threefold_repetition()) { 
		return {val: 0, detail: {}, evaluated: 1};	
	}

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
			if(alpha > beta)
				break;
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
			if(alpha > beta)
				break;
		}

		let randomIdx = Math.floor(Math.random() * bestMoves.length)
		return {val: min, move: bestMoves[randomIdx], detail, evaluated};
	}
}