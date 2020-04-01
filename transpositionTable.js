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