let foundNextBestMove;
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
			case 'p': return 10 +  (i !== undefined ? (isWhite ? pawnEvalWhite[i][j] : pawnEvalBlack[i][j]) : 0);
			case 'r': return 50 + (i !== undefined ? (isWhite ? rookEvalWhite[i][j] : rookEvalBlack[i][j]) : 0);
			case 'n': return 30 + (i !== undefined ? knightEval[i][j] : 0);
			case 'b': return 30 + (i !== undefined ? (isWhite ? bishopEvalBlack[i][j] : bishopEvalBlack[i][j]) : 0);
			case 'q': return 90 + (i !== undefined ? evalQueen[i][j] : 0);
			case 'k': return 900 +  (i !== undefined ? (isWhite ? kingEvalWhite[i][j] : kingEvalBlack[i][j]) : 0);
			default: console.error("Unknown piece type " + piece, i); return 0;
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

function findNextBestMove(bestMove) {
	nextBestMove = {};
	for(const d1move in bestMove.detail) {
		for(const d2move in bestMove.detail[d1move].detail) {
			nextBestMove[d2move.move] = {
				prevMove: d2move,
				bonus: 30000
			}		
		}
	}
	
	return nextBestMove;	
}

function getCoords(square) {
	let col = square[0]; //a-h => 0-7
	let row = square[1]; //1-8 => 7-0
	return {
		i: 8 - (row - '0'),
		j: col.charCodeAt(0) - ('a').charCodeAt(0)
	}
}

function orderMoves(moves) {
	orderedMoves = [];
	const history = game.history();
	const prevMove = history[history.length-1];
	moves.forEach(move => {
		let bonus = 0;
		if(foundNextBestMove !== undefined && foundNextBestMove[move] !== undefined) {
			if(foundNextBestMove[move].prevMove === prevMove)
				foundNextBestMove[move].bonus = 50000;
			bonus = foundNextBestMove[move].bonus;
		} else {
			const gameBoard = game.board();
			let pieceBeingMoved = {};
			switch(move[0]) {
				case 'K': pieceBeingMoved.type = 'k'; break;
				case 'Q': pieceBeingMoved.type = 'q'; break;
				case 'B': pieceBeingMoved.type = 'b'; break;
				case 'N': pieceBeingMoved.type = 'n'; break;
				case 'R': pieceBeingMoved.type = 'r'; break;
				default: pieceBeingMoved.type = 'p'; break;
			}
			let isCapture = move.search(/x/) !== -1;
			if(move.search(/\+/) !== -1)
				bonus += 30;
			if(isCapture) {
				let startIndex = move.search(/[a-h][1-8]/);
				let toSquare = move.slice(startIndex, startIndex+2);
				let toSquareCoords = getCoords(toSquare);
				let capturedPiece = gameBoard[toSquareCoords.i][toSquareCoords.j]; 
				bonus += Math.abs(getPieceValue(pieceBeingMoved)*10) - Math.abs(getPieceValue(capturedPiece));
				startIndex = prevMove.search(/[a-h][1-8]/);
				let squareOfPieceMovedByOpponent = prevMove.slice(startIndex, startIndex+2);
				if(squareOfPieceMovedByOpponent === toSquare)
					bonus += 1001;
			}
			if(move.search(/0-/) !== -1)
				bonus += 20;
		}
		orderedMoves.push({
			move,
			bonus,
		})
	})
	orderedMoves.sort((a,b) => b.bonus-a.bonus);
	let refinedOrderedMoves = orderedMoves.map(move => move.move);
	return refinedOrderedMoves;	
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
			let stats="";
			stats += "<b>Time taken:</b> " + ((end-start)/1000) + " seconds";
			$('#other-stats').html(stats);
			console.log(bestMove);
			foundNextBestMove = findNextBestMove(bestMove);
			game.move(bestMove.move);
			board.position(game.fen());	
			return resolve();
		}, 0);	
	})
	
}

function makeRandomMove () {
  var possibleMoves = game.moves()

  // game over
  if (possibleMoves.length === 0) return;

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
	
	if(doOrdering)
		possibleMoves = orderMoves(possibleMoves);

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
			if(alpha > beta) {
				// console.log("Pruned\n");
				break;
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
			if(alpha > beta) {
				// console.log("Pruned\n");
				break;
			}
		}

		let randomIdx = Math.floor(Math.random() * bestMoves.length)
		return {val: min, move: bestMoves[randomIdx], detail, evaluated};
	}
}