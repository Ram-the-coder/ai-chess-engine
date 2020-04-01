const {Chess} = require('../node_modules/chess.js/chess.js');

var game = new Chess();
var searchDepth = 3;
let doOrdering = true;
let useTranspositionTable = true;
let table = {}
let foundNextBestMove;


/*************************************************************************************************************/
/***************************************************util.js***************************************************/
/*************************************************************************************************************/
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
      // console.log('piece[' + i + '][' + j + '] = ' + getPieceValue(board[i][j], i, j));
      points += getPieceValue(board[i][j], i, j);
    }
  }
  return points;
}

function getCoords(square) {
  let col = square[0]; //a-h => 0-7
  let row = square[1]; //1-8 => 7-0
  return {
    i: 8 - (row - '0'),
    j: col.charCodeAt(0) - ('a').charCodeAt(0)
  }
}

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
  return points;
}

function isPromotion(source, target, board, turn) {
  const toSquare = getCoords(target);
  const fromSquare = getCoords(source);
  // console.log(toSquare, fromSquare, board[fromSquare.i][fromSquare.j]);
  const isP = (turn === 'w' 
                && toSquare.i === 0 
                && fromSquare.i === 1 
                && board[fromSquare.i][fromSquare.j] 
                && board[fromSquare.i][fromSquare.j].type === 'p'
                && board[fromSquare.i][fromSquare.j].color === 'w'
                ) || (turn === 'b' 
                && toSquare.i === 7 
                && fromSquare.i === 6 
                && board[fromSquare.i][fromSquare.j] 
                && board[fromSquare.i][fromSquare.j].type === 'p'
                && board[fromSquare.i][fromSquare.j].color === 'b'
                );
  return isP;
}

/*************************************************************************************************************/
/***************************************************transpositionTable.js*************************************/
/*************************************************************************************************************/
function findFromSquare(board, move, turn) {
	let startInd = move.search(/[a-h][1-8]/);
	const toSquare = getCoords(move.slice(startInd, startInd+2));
	startInd = move.search(/[a-h]x?[a-h][1-8]/);
	const sameRow = startInd !== -1 ? (move.slice(startInd, startInd+1).charCodeAt(0) - 'a'.charCodeAt(0)) : -1;
	startInd = move.search(/[1-8]x?[a-h][1-8]/);
	const sameAlpha = startInd !== -1 ? 8 - (move.slice(startInd, startInd+1) - '0') : -1;
	startInd = move.search(/[KQNRB]([a-h]|[1-8])?x?[a-h][1-8]/);
	const isPawn = startInd === -1;
	let piece = (move[0]).toLowerCase();
	let fromSquare = {};
	// console.log({sameAlpha, sameRow, isPawn, turn, piece});
	if(isPawn) {
		piece = 'p';
		startInd = move.search(/x/);
		const isCapture = startInd !== -1;
		let file;
		if(isCapture) {
			file = move.slice(startInd-1, startInd).charCodeAt(0) - 'a'.charCodeAt(0);
		} else {
			file = move[0].charCodeAt(0) - 'a'.charCodeAt(0);
		}
		let row1 = turn === 'w' ?  toSquare.i+1 : toSquare.i-1;
		let row2 = turn === 'w' ?  toSquare.i+2 : toSquare.i-2;
		let row3 = toSquare.i;
		if(row1 >= 0 && row1 < 8 && board[row1][file] && board[row1][file].type === 'p' && board[row1][file].color === turn)
			return {i: row1, j: file};
		if(row2 >= 0 && row2 < 8 && board[row2][file] && board[row2][file].type === 'p' && board[row2][file].color === turn)
			return {i: row2, j: file};
		if(row1 >= 0 && row3 < 8 && board[row3][file] && board[row3][file].type === 'p' && board[row3][file].color === turn)
			return {i: row3, j: file};
		console.error("Unknown");
		return {i: 0, j: 0};
	}
	switch(piece) {
		case 'q': 	for(let i=toSquare.i-1, j=toSquare.j-1; i>=0 && j>=0; --i, --j) {
						if(board[i][j] && board[i][j].type === piece && board[i][j].color === turn)
							return {i, j};
					}
					for(let i=toSquare.i+1, j=toSquare.j+1; i<8 && j<8; ++i, ++j) {
						if(board[i][j] && board[i][j].type === piece && board[i][j].color === turn) {
							return {i, j};
						}
					}
					for(let i=toSquare.i+1, j=toSquare.j-1; i<8 && j>=0; ++i, --j) {
						if(board[i][j] && board[i][j].type === piece && board[i][j].color === turn)
							return {i, j};
					}
					for(let i=toSquare.i-1, j=toSquare.j+1; i>=0 && j<8; --i, ++j) {
						if(board[i][j] && board[i][j].type === piece && board[i][j].color === turn)
							return {i, j};
					}
					for(let j=0; j<8; ++j) {
						if(board[toSquare.i][j] && board[toSquare.i][j].type === piece && board[toSquare.i][j].color === turn)
							return {i: toSquare.i, j};
					}
					for(let i=0; i<8; ++i) {
						if(board[i][toSquare.j] && board[i][toSquare.j].type === piece && board[i][toSquare.j].color === turn)
							return {i, j: toSquare.j};
					}
					console.error("Unknown");
					return {i: 0, j: 0};

		case 'k': 	for(let ioff=-1; ioff <= 1; ++ioff) {
						for(let joff=-1; joff<=1; ++joff) {
							let i = toSquare.i + ioff;
							let j = toSquare.j + joff;
							if(i >= 0 && i < 8 && j >=0 && j < 8 && board[i][j] && board[i][j].type === piece && board[i][j].color === turn)
								return {i, j};
						}
					}
					console.error("Unknown");
					return {i: 0, j: 0};

		case 'r': 	//sameRow => ifAlpha | sameAlpha => ifNum
					for(let j=0; j<8; ++j) {
						if(board[toSquare.i][j] && board[toSquare.i][j].type === piece && board[toSquare.i][j].color === turn) {
							let wrongOne = false;
							for(let oj=(j>toSquare.j ? toSquare.j+1 : j+1); oj < (j>toSquare.j ? j : toSquare.j); ++oj) {
								// console.log({j, to: toSquare.j, oj, board: board[toSquare.i][oj]});
								if(board[toSquare.i][oj] !== null) {
									wrongOne = true;
									break;
								}
							}
							if(wrongOne)
								continue;
							if((sameRow===-1 && sameAlpha===-1) || (sameRow === j) || (sameAlpha === toSquare.i))
								return {i: toSquare.i, j};
						}
					}
					for(let i=0; i<8; ++i) {
						if(board[i][toSquare.j] && board[i][toSquare.j].type === piece && board[i][toSquare.j].color === turn) {
							let wrongOne = false;
							for(let oi=(i>toSquare.i ? toSquare.i+1 : i+1); oi < (i>toSquare.i ? i : toSquare.i); ++oi) {
								if(board[oi][toSquare.j] !== null) {
									wrongOne = true;
									break;
								}
							}
							if(wrongOne)
								continue;
							if((sameRow===-1 && sameAlpha===-1) || (sameRow === toSquare.j) || (sameAlpha === i))
								return {i, j: toSquare.j};
						}
					}
					console.log("Unknown");
					console.error("Unknown");
					return {i: 0, j: 0};

		case 'b': 	for(let i=toSquare.i-1, j=toSquare.j-1; i>=0 && j>=0; --i, --j) {
						if(board[i][j] && board[i][j].type === piece && board[i][j].color === turn)
							return {i, j};
					}
					for(let i=toSquare.i+1, j=toSquare.j+1; i<8 && j<8; ++i, ++j) {
						if(board[i][j] && board[i][j].type === piece && board[i][j].color === turn) {
							return {i, j};
						}
					}
					for(let i=toSquare.i+1, j=toSquare.j-1; i<8 && j>=0; ++i, --j) {
						if(board[i][j] && board[i][j].type === piece && board[i][j].color === turn)
							return {i, j};
					}
					for(let i=toSquare.i-1, j=toSquare.j+1; i>=0 && j<8; --i, ++j) {
						if(board[i][j] && board[i][j].type === piece && board[i][j].color === turn)
							return {i, j};
					}

					console.error("Unknown");
					return {i: 0, j: 0};

		case 'n': 	if(sameAlpha != -1) {
						let i = sameAlpha;
						let j1, j2;
						switch(i - toSquare.i) {
							case -2:
							case 2: j1 = toSquare.j - 1;
									j2 = toSquare.j + 1;
									break;
							case -1:
							case 1: j1 = toSquare.j - 2;
									j2 = toSquare.j + 2;
									break;
						}
						if(j1 >= 0 && board[i][j1] && board[i][j1].type === piece && board[i][j1].color === turn)
							return {i, j: j1}
						if(j2 < 8 && board[i][j2] && board[i][j2].type === piece && board[i][j2].color === turn)
							return {i, j: j2};

						console.error("Unknown");
						return {i: 0, j: 0};
					}

					if(sameRow != -1) {
						let j = sameRow;
						let i1, i2;
						switch(j - toSquare.j) {
							case -2:
							case 2: i1 = toSquare.i - 1;
									i2 = toSquare.i + 1;
									break;
							case -1:
							case 1: i1 = toSquare.i - 2;
									i2 = toSquare.i + 2;
									break;
						}
						if(i1 >= 0 && board[i1][j] && board[i1][j].type === piece && board[i1][j].color === turn)
							return {i: i1, j}
						if(i2 < 8 && board[i2][j] && board[i2][j].type === piece && board[i2][j].color === turn)
							return {i: i2, j}
						console.error("Unknown");
						return {i: 0, j: 0};
					}

					for(let ioff=-2; ioff <= 2; ++ioff) {
						for(let joff=-2; joff <= 2; ++joff) {
							if(Math.abs(ioff) + Math.abs(joff) != 3)
								continue;
							let i = toSquare.i + ioff;
							let j = toSquare.j + joff;
							// console.log(i, j);
							if(i >= 0 && i < 8 && j >=0 && j < 8 && board[i][j] && board[i][j].type === piece && board[i][j].color === turn)
								return {i, j};
						}
					}

					console.error("Unknown");
					return {i: 0, j: 0};
	}
	return fromSquare;
}


let piecePositionValue = new Array(12);
const pieceTableIndex = {
	'r': 0,
	'n': 1,
	'b': 2,
	'q': 3,
	'k': 4,
	'p': 5
}
let collisionCheck = {};
for(var i=0; i<12; ++i) {
	piecePositionValue[i] = new Array(64);
	for(var j=0; j<64; ++j) {
		var randNum = Math.random()*Math.pow(2, 64);
		while(collisionCheck[randNum] !== undefined)
			randNum = Math.random()*Math.pow(2, 64);
		collisionCheck[randNum] = 1;
		piecePositionValue[i][j] = randNum;
	}
}
collisionCheck = {};

function getHashValueOfPiece(piece, i, j) {
	if(piece === null)
		return 0;
	else
		return piecePositionValue[pieceTableIndex[piece.type] + (piece.color === 'w' ? 0 : 6)][i*8+j];
}

function computeZobristHash(board) {
	let hash = 0;
	for(var i=0; i<8; ++i) 
		for(var j=0; j<8; ++j) {
			hash ^= getHashValueOfPiece(board[i][j], i, j);
		}
	return hash;
}

function recomputeZobristHash(hash, board, move, isWhite) {
	if(move.search(/=/) !== -1) {
		const toSquare = getCoords(move.slice(0, 2));
		const toPiece = {};
		let startInd = move.search(/=[QRNB]/);
		if(startInd === -1)
			console.error("Promotion piece not found");
		toPiece.type = (move.slice(startInd+1, startInd+2)).toLowerCase();
		toPiece.color = isWhite ? 'w' : 'b';
		const pawn = {type: 'p', color: isWhite ? 'w' : 'b'}
		hash ^= isWhite ? getHashValueOfPiece(pawn, toSquare.i+1, toSquare.j) : getHashValueOfPiece(pawn, toSquare.i-1, toSquare.j);
		hash ^= isWhite ? getHashValueOfPiece(toPiece, toSquare.i, toSquare.j) : getHashValueOfPiece(toPiece, toSquare.i, toSquare.j);
		return hash;
	}
	if(move.search(/O-O-O/) !== -1) {
		const king = {type: 'k', color:isWhite ? 'w' : 'b'};
		const rook = {type: 'r', color:isWhite ? 'w' : 'b'};
		hash ^= isWhite ? getHashValueOfPiece(king, 7, 4) : getHashValueOfPiece(king, 0, 4);
		hash ^= isWhite ? getHashValueOfPiece(rook, 7, 0) : getHashValueOfPiece(rook, 0, 0);
		hash ^= isWhite ? getHashValueOfPiece(king, 7, 2) : getHashValueOfPiece(king, 0, 2);
		hash ^= isWhite ? getHashValueOfPiece(rook, 7, 3) : getHashValueOfPiece(rook, 0, 3);
		return hash;
	} else if(move.search(/O-O/) !== -1) {
		const king = {type: 'k', color:isWhite ? 'w' : 'b'};
		const rook = {type: 'r', color:isWhite ? 'w' : 'b'};
		hash ^= isWhite ? getHashValueOfPiece(king, 7, 4) : getHashValueOfPiece(king, 0, 4);
		hash ^= isWhite ? getHashValueOfPiece(rook, 7, 7) : getHashValueOfPiece(rook, 0, 7);
		hash ^= isWhite ? getHashValueOfPiece(king, 7, 6) : getHashValueOfPiece(king, 0, 6);
		hash ^= isWhite ? getHashValueOfPiece(rook, 7, 5) : getHashValueOfPiece(rook, 0, 5);
		return hash;
	} else {
		let piece = {};
		let startInd = move.search(/[KQNRB]([a-h]|[1-8])?x?[a-h][1-8]/);
		if(startInd === -1)
			piece.type = 'p';
		else
			piece.type = move[0].toLowerCase();

		piece.color = isWhite ? 'w' : 'b';

		startInd = move.search(/[a-h][1-8]/);
		const toSquare = getCoords(move.slice(startInd, startInd+2));
		const fromSquare = findFromSquare(board, move, isWhite ? 'w' : 'b');
		startInd = move.search(/x/);
		const isCapture = startInd !== -1;
		const checkSq = { // For enpassant
			i: toSquare.i + (isWhite ? 1 : -1),
			j: toSquare.j
		}
		let isEnp = false;
		if(isCapture) {
			if(piece.type === 'p' && board[checkSq.i][checkSq.j] && !board[toSquare.i][toSquare.j] && board[checkSq.i][checkSq.j].type === 'p' && board[checkSq.i][checkSq.j].color === (isWhite ? 'b' : 'w')) {
				isEnp = true;
				hash ^= getHashValueOfPiece(board[checkSq.i][checkSq.j], checkSq.i, checkSq.j);
			} else {
				hash ^= getHashValueOfPiece(board[toSquare.i][toSquare.j], toSquare.i, toSquare.j);
			}
		}
		hash ^= getHashValueOfPiece(piece, fromSquare.i, fromSquare.j);
		hash ^= getHashValueOfPiece(piece, toSquare.i, toSquare.j);
		return hash;
	}
}


/*************************************************************************************************************/
/***************************************************ai.js***************************************************/
/*************************************************************************************************************/

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
			const moveNum = game.history().length + 1;
			const hash = computeZobristHash(game.board());
			
			table = {};
			const start = new Date().getTime();
			let bestMove = miniMax(game, searchDepth, -999999, 999999, isMax, moveNum, hash);
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

function miniMax(game, depth, alpha, beta, isMax, moveNum, hash) {
	// let fen = game.fen();
	// console.log(game.history(), fen);
	if(useTranspositionTable && table[hash] !== undefined) {	
		// console.log(table[hash].val, game.fen(), table[hash].fen, computeZobristHash(game.board()), table[hash].hash);
		// return table[hash];
	}
	if(depth === 0 || alpha > beta) {
		const curPosStats = {val: evalBoard(game.board()), detail: {}, evaluated: 1, moveNum};
		if(useTranspositionTable) {
			table[hash] = curPosStats;
		}
		return curPosStats;
	}

	if(game.in_checkmate()) {
		const curPosStats = {val: isMax ? -1000 : 1000, detail: {}, evaluated: 1, moveNum};
		if(useTranspositionTable)
			table[hash] = curPosStats;
		return curPosStats;
	}

	if(game.in_draw() || game.in_stalemate() || game.in_threefold_repetition()) { 
		const curPosStats = {val: 0, detail: {}, evaluated: 1, moveNum};	
		if(useTranspositionTable)
			table[hash] = curPosStats;
		return curPosStats;
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
	
			let newHash;
			if(useTranspositionTable) {
				newHash = recomputeZobristHash(hash, game.board(), possibleMoves[i], game.turn() === 'w');
			}
			game.move(possibleMoves[i]);
			if(useTranspositionTable && computeZobristHash(game.board()) !== newHash) {
				console.log("CLASH")
				console.log(game.history());
				debugger;
			}
			let newval = miniMax(game, depth-1, alpha, beta, false, moveNum, newHash);
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
		const curPosStats = {val: max, move: bestMoves[randomIdx], detail, evaluated, moveNum};
		if(useTranspositionTable)
			table[hash] = curPosStats;
		return curPosStats;
	} else {
		let min = 99999;
		for(let i=0; i<possibleMoves.length; ++i) {
			let newHash;
			let boardB = game.board();
			let turn = game.turn();
			if(useTranspositionTable) {
				newHash = recomputeZobristHash(hash, game.board(), possibleMoves[i], game.turn() === 'w');
			}
			game.move(possibleMoves[i]);
			let boardA = game.board();
			if(useTranspositionTable && computeZobristHash(game.board()) !== newHash) {
				console.log("CLASH")
				console.log(game.history());
				debugger;
			}
			let newval = miniMax(game, depth-1, alpha, beta, true, moveNum, newHash);
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
		const curPosStats = {val: min, move: bestMoves[randomIdx], detail, evaluated ,moveNum};
		if(useTranspositionTable)
			table[hash] = curPosStats;
		return curPosStats;
	}
}


module.exports = {
	transpositionTable: {
		computeZobristHash,
		recomputeZobristHash,
		piecePositionValue,
		getHashValueOfPiece,
	},
	util: {
		getCoords
	}
}