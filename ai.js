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