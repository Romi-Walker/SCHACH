/**
 * Mock Chess.js library for standalone operation
 * Provides basic chess functionality without external dependencies
 */

window.Chess = function() {
    const game = {
        board: [
            [{type: 'r', color: 'b'}, {type: 'n', color: 'b'}, {type: 'b', color: 'b'}, {type: 'q', color: 'b'}, {type: 'k', color: 'b'}, {type: 'b', color: 'b'}, {type: 'n', color: 'b'}, {type: 'r', color: 'b'}],
            [{type: 'p', color: 'b'}, {type: 'p', color: 'b'}, {type: 'p', color: 'b'}, {type: 'p', color: 'b'}, {type: 'p', color: 'b'}, {type: 'p', color: 'b'}, {type: 'p', color: 'b'}, {type: 'p', color: 'b'}],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [{type: 'p', color: 'w'}, {type: 'p', color: 'w'}, {type: 'p', color: 'w'}, {type: 'p', color: 'w'}, {type: 'p', color: 'w'}, {type: 'p', color: 'w'}, {type: 'p', color: 'w'}, {type: 'p', color: 'w'}],
            [{type: 'r', color: 'w'}, {type: 'n', color: 'w'}, {type: 'b', color: 'w'}, {type: 'q', color: 'w'}, {type: 'k', color: 'w'}, {type: 'b', color: 'w'}, {type: 'n', color: 'w'}, {type: 'r', color: 'w'}]
        ],
        currentPlayer: 'w',
        moveHistory: [],
        gameOver: false
    };

    return {
        // Core game methods
        move: function(moveObj) {
            if (typeof moveObj === 'string') {
                // Handle SAN notation
                return this.moveSAN(moveObj);
            }
            
            const from = moveObj.from;
            const to = moveObj.to;
            
            if (!this.isValidSquare(from) || !this.isValidSquare(to)) {
                return null;
            }
            
            const fromCoords = this.squareToCoords(from);
            const toCoords = this.squareToCoords(to);
            
            const piece = game.board[fromCoords.rank][fromCoords.file];
            if (!piece || piece.color !== game.currentPlayer) {
                return null;
            }
            
            // Check if the move is valid according to chess rules
            if (!this.isValidMove(from, to, piece)) {
                return null;
            }
            
            const captured = game.board[toCoords.rank][toCoords.file];
            
            // Don't allow capturing own pieces
            if (captured && captured.color === piece.color) {
                return null;
            }
            
            // Make the move
            game.board[toCoords.rank][toCoords.file] = piece;
            game.board[fromCoords.rank][fromCoords.file] = null;
            
            // Check if this move puts own king in check
            if (this.wouldBeInCheck(piece.color)) {
                // Undo the move
                game.board[fromCoords.rank][fromCoords.file] = piece;
                game.board[toCoords.rank][toCoords.file] = captured;
                return null;
            }
            
            const moveResult = {
                san: this.moveToSAN(from, to, piece, captured),
                from: from,
                to: to,
                piece: piece.type,
                color: piece.color,
                captured: captured ? captured.type : undefined
            };

            game.currentPlayer = game.currentPlayer === 'w' ? 'b' : 'w';
            moveResult.fen = this.fen();
            game.moveHistory.push(moveResult);

            return moveResult;
        },
        
        undo: function() {
            if (game.moveHistory.length === 0) return null;
            
            const lastMove = game.moveHistory.pop();
            
            const fromCoords = this.squareToCoords(lastMove.from);
            const toCoords = this.squareToCoords(lastMove.to);
            
            // Restore piece
            game.board[fromCoords.rank][fromCoords.file] = {
                type: lastMove.piece,
                color: lastMove.color
            };
            
            // Restore captured piece or clear square
            if (lastMove.captured) {
                game.board[toCoords.rank][toCoords.file] = {
                    type: lastMove.captured,
                    color: lastMove.color === 'w' ? 'b' : 'w'
                };
            } else {
                game.board[toCoords.rank][toCoords.file] = null;
            }
            
            game.currentPlayer = lastMove.color;
            
            return lastMove;
        },
        
        turn: function() {
            return game.currentPlayer;
        },
        
        board: function() {
            return game.board.map(rank => rank.slice());
        },
        
        get: function(square) {
            if (!this.isValidSquare(square)) return null;
            const coords = this.squareToCoords(square);
            return game.board[coords.rank][coords.file];
        },
        
        moves: function(options = {}) {
            const moves = [];
            const verbose = options.verbose || false;
            const square = options.square;
            
            if (square) {
                return this.getMovesForSquare(square, verbose);
            }
            
            // Get all legal moves
            for (let rank = 0; rank < 8; rank++) {
                for (let file = 0; file < 8; file++) {
                    const piece = game.board[rank][file];
                    if (piece && piece.color === game.currentPlayer) {
                        const squareName = this.coordsToSquare(file, rank);
                        const pieceMoves = this.getMovesForSquare(squareName, verbose);
                        moves.push(...pieceMoves);
                    }
                }
            }
            
            return moves;
        },
        
        getMovesForSquare: function(square, verbose = false) {
            const coords = this.squareToCoords(square);
            const piece = game.board[coords.rank][coords.file];
            
            if (!piece || piece.color !== game.currentPlayer) {
                return [];
            }
            
            const moves = [];
            
            // Generate all possible moves for this piece
            for (let rank = 0; rank < 8; rank++) {
                for (let file = 0; file < 8; file++) {
                    const targetSquare = this.coordsToSquare(file, rank);
                    
                    // Skip if target is same as source
                    if (targetSquare === square) continue;
                    
                    // Check if this move is valid
                    if (this.isValidMove(square, targetSquare, piece)) {
                        // Check if the move would put own king in check
                        const captured = game.board[rank][file];
                        
                        // Don't allow capturing own pieces
                        if (captured && captured.color === piece.color) {
                            continue;
                        }
                        
                        // Test the move
                        game.board[rank][file] = piece;
                        game.board[coords.rank][coords.file] = null;
                        
                        if (!this.wouldBeInCheck(piece.color)) {
                            moves.push(verbose ? { from: square, to: targetSquare } : targetSquare);
                        }
                        
                        // Restore board
                        game.board[coords.rank][coords.file] = piece;
                        game.board[rank][file] = captured;
                    }
                }
            }
            
            return moves;
        },
        
        addLinearMoves: function(moves, fromSquare, coords, directions, verbose) {
            for (const [dr, df] of directions) {
                for (let i = 1; i < 8; i++) {
                    const newRank = coords.rank + i * dr;
                    const newFile = coords.file + i * df;
                    
                    if (newRank < 0 || newRank >= 8 || newFile < 0 || newFile >= 8) break;
                    
                    const target = game.board[newRank][newFile];
                    const targetSquare = this.coordsToSquare(newFile, newRank);
                    
                    if (!target) {
                        moves.push(verbose ? { from: fromSquare, to: targetSquare } : targetSquare);
                    } else {
                        if (target.color !== game.currentPlayer) {
                            moves.push(verbose ? { from: fromSquare, to: targetSquare } : targetSquare);
                        }
                        break;
                    }
                }
            }
        },
        
        addKnightMoves: function(moves, fromSquare, coords, verbose) {
            const knightMoves = [
                [-2, -1], [-2, 1], [-1, -2], [-1, 2],
                [1, -2], [1, 2], [2, -1], [2, 1]
            ];
            
            for (const [dr, df] of knightMoves) {
                const newRank = coords.rank + dr;
                const newFile = coords.file + df;
                
                if (newRank >= 0 && newRank < 8 && newFile >= 0 && newFile < 8) {
                    const target = game.board[newRank][newFile];
                    if (!target || target.color !== game.currentPlayer) {
                        const targetSquare = this.coordsToSquare(newFile, newRank);
                        moves.push(verbose ? { from: fromSquare, to: targetSquare } : targetSquare);
                    }
                }
            }
        },
        
        addKingMoves: function(moves, fromSquare, coords, verbose) {
            const kingMoves = [
                [-1, -1], [-1, 0], [-1, 1],
                [0, -1],           [0, 1],
                [1, -1],  [1, 0],  [1, 1]
            ];
            
            for (const [dr, df] of kingMoves) {
                const newRank = coords.rank + dr;
                const newFile = coords.file + df;
                
                if (newRank >= 0 && newRank < 8 && newFile >= 0 && newFile < 8) {
                    const target = game.board[newRank][newFile];
                    if (!target || target.color !== game.currentPlayer) {
                        const targetSquare = this.coordsToSquare(newFile, newRank);
                        moves.push(verbose ? { from: fromSquare, to: targetSquare } : targetSquare);
                    }
                }
            }
        },
        
        isGameOver: function() {
            return game.gameOver || this.isCheckmate() || this.isStalemate();
        },
        
        isCheckmate: function() {
            if (!this.inCheck()) return false;
            
            // Check if current player has any legal moves
            const moves = this.moves();
            return moves.length === 0;
        },
        
        isStalemate: function() {
            if (this.inCheck()) return false;
            
            // Check if current player has any legal moves
            const moves = this.moves();
            return moves.length === 0;
        },
        
        isDraw: function() {
            return this.isStalemate() || this.isInsufficientMaterial() || this.isThreefoldRepetition();
        },
        
        isInsufficientMaterial: function() {
            const pieces = [];
            for (let rank = 0; rank < 8; rank++) {
                for (let file = 0; file < 8; file++) {
                    const piece = game.board[rank][file];
                    if (piece) {
                        pieces.push(piece.type);
                    }
                }
            }
            
            // King vs King
            if (pieces.length === 2) return true;
            
            // King + Knight/Bishop vs King
            if (pieces.length === 3) {
                return pieces.includes('n') || pieces.includes('b');
            }
            
            return false;
        },
        
        isThreefoldRepetition: function() {
            const positions = {};
            for (const move of game.moveHistory) {
                if (move.fen) {
                    positions[move.fen] = (positions[move.fen] || 0) + 1;
                    if (positions[move.fen] >= 3) return true;
                }
            }
            return false;
        },
        
        inCheck: function() {
            return this.wouldBeInCheck(game.currentPlayer);
        },
        
        fen: function() {
            let fen = '';
            for (let rank = 0; rank < 8; rank++) {
                let empty = 0;
                for (let file = 0; file < 8; file++) {
                    const piece = game.board[rank][file];
                    if (piece) {
                        if (empty > 0) {
                            fen += empty;
                            empty = 0;
                        }
                        const symbol = piece.color === 'w'
                            ? piece.type.toUpperCase()
                            : piece.type;
                        fen += symbol;
                    } else {
                        empty++;
                    }
                }
                if (empty > 0) fen += empty;
                if (rank < 7) fen += '/';
            }
            fen += ` ${game.currentPlayer} - - 0 ${Math.floor(game.moveHistory.length/2)+1}`;
            return fen;
        },
        
        pgn: function() {
            return game.moveHistory.map(move => move.san).join(' ');
        },
        
        history: function(options = {}) {
            if (options.verbose) {
                return game.moveHistory.slice();
            }
            return game.moveHistory.map(move => move.san);
        },
        
        reset: function() {
            game.board = [
                [{type: 'r', color: 'b'}, {type: 'n', color: 'b'}, {type: 'b', color: 'b'}, {type: 'q', color: 'b'}, {type: 'k', color: 'b'}, {type: 'b', color: 'b'}, {type: 'n', color: 'b'}, {type: 'r', color: 'b'}],
                [{type: 'p', color: 'b'}, {type: 'p', color: 'b'}, {type: 'p', color: 'b'}, {type: 'p', color: 'b'}, {type: 'p', color: 'b'}, {type: 'p', color: 'b'}, {type: 'p', color: 'b'}, {type: 'p', color: 'b'}],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null],
                [{type: 'p', color: 'w'}, {type: 'p', color: 'w'}, {type: 'p', color: 'w'}, {type: 'p', color: 'w'}, {type: 'p', color: 'w'}, {type: 'p', color: 'w'}, {type: 'p', color: 'w'}, {type: 'p', color: 'w'}],
                [{type: 'r', color: 'w'}, {type: 'n', color: 'w'}, {type: 'b', color: 'w'}, {type: 'q', color: 'w'}, {type: 'k', color: 'w'}, {type: 'b', color: 'w'}, {type: 'n', color: 'w'}, {type: 'r', color: 'w'}]
            ];
            game.currentPlayer = 'w';
            game.moveHistory = [];
            game.gameOver = false;
        },
        
        load: function(fen) {
            // Simplified FEN loading
            this.reset();
            return true;
        },
        
        loadPgn: function(pgn) {
            // Simplified PGN loading
            this.reset();
            return true;
        },
        
        // Utility methods
        isValidSquare: function(square) {
            return /^[a-h][1-8]$/.test(square);
        },
        
        squareToCoords: function(square) {
            const file = square.charCodeAt(0) - 97; // a=0, b=1, etc.
            const rank = 8 - parseInt(square[1]);   // 8=0, 7=1, etc.
            return { file, rank };
        },
        
        coordsToSquare: function(file, rank) {
            return String.fromCharCode(97 + file) + (8 - rank);
        },
        
        moveToSAN: function(from, to, piece, captured) {
            let san = '';
            
            if (piece.type !== 'p') {
                san += piece.type.toUpperCase();
            }
            
            if (captured) {
                if (piece.type === 'p') {
                    san += from[0]; // File of capturing pawn
                }
                san += 'x';
            }
            
            san += to;
            
            return san;
        },
        
        moveSAN: function(san) {
            // Simplified SAN parsing
            const moves = this.moves({ verbose: true });
            for (const move of moves) {
                if (this.moveToSAN(move.from, move.to, this.get(move.from), this.get(move.to)) === san) {
                    return this.move(move);
                }
            }
            return null;
        },
        
        // Chess rule validation methods
        isValidMove: function(from, to, piece) {
            const fromCoords = this.squareToCoords(from);
            const toCoords = this.squareToCoords(to);
            
            // Can't move to same square
            if (from === to) return false;
            
            const deltaFile = Math.abs(toCoords.file - fromCoords.file);
            const deltaRank = Math.abs(toCoords.rank - fromCoords.rank);
            
            switch (piece.type) {
                case 'p': // Pawn
                    return this.isValidPawnMove(fromCoords, toCoords, piece);
                case 'r': // Rook
                    return this.isValidRookMove(fromCoords, toCoords);
                case 'n': // Knight
                    return this.isValidKnightMove(fromCoords, toCoords);
                case 'b': // Bishop
                    return this.isValidBishopMove(fromCoords, toCoords);
                case 'q': // Queen
                    return this.isValidQueenMove(fromCoords, toCoords);
                case 'k': // King
                    return this.isValidKingMove(fromCoords, toCoords);
                default:
                    return false;
            }
        },
        
        isValidPawnMove: function(fromCoords, toCoords, piece) {
            const direction = piece.color === 'w' ? -1 : 1;
            const startRank = piece.color === 'w' ? 6 : 1;
            const rankDiff = toCoords.rank - fromCoords.rank;
            const fileDiff = Math.abs(toCoords.file - fromCoords.file);
            
            // Moving forward
            if (fileDiff === 0) {
                // One square forward
                if (rankDiff === direction) {
                    return !game.board[toCoords.rank][toCoords.file];
                }
                // Two squares from starting position
                if (fromCoords.rank === startRank && rankDiff === 2 * direction) {
                    return !game.board[toCoords.rank][toCoords.file] && !game.board[fromCoords.rank + direction][fromCoords.file];
                }
            }
            // Capturing diagonally
            else if (fileDiff === 1 && rankDiff === direction) {
                const targetPiece = game.board[toCoords.rank][toCoords.file];
                return targetPiece && targetPiece.color !== piece.color;
            }
            
            return false;
        },
        
        isValidRookMove: function(fromCoords, toCoords) {
            // Must move in straight line
            if (fromCoords.rank !== toCoords.rank && fromCoords.file !== toCoords.file) {
                return false;
            }
            
            return this.isPathClear(fromCoords, toCoords);
        },
        
        isValidKnightMove: function(fromCoords, toCoords) {
            const deltaFile = Math.abs(toCoords.file - fromCoords.file);
            const deltaRank = Math.abs(toCoords.rank - fromCoords.rank);
            
            return (deltaFile === 2 && deltaRank === 1) || (deltaFile === 1 && deltaRank === 2);
        },
        
        isValidBishopMove: function(fromCoords, toCoords) {
            const deltaFile = Math.abs(toCoords.file - fromCoords.file);
            const deltaRank = Math.abs(toCoords.rank - fromCoords.rank);
            
            // Must move diagonally
            if (deltaFile !== deltaRank) {
                return false;
            }
            
            return this.isPathClear(fromCoords, toCoords);
        },
        
        isValidQueenMove: function(fromCoords, toCoords) {
            return this.isValidRookMove(fromCoords, toCoords) || this.isValidBishopMove(fromCoords, toCoords);
        },
        
        isValidKingMove: function(fromCoords, toCoords) {
            const deltaFile = Math.abs(toCoords.file - fromCoords.file);
            const deltaRank = Math.abs(toCoords.rank - fromCoords.rank);
            
            return deltaFile <= 1 && deltaRank <= 1;
        },
        
        isPathClear: function(fromCoords, toCoords) {
            const fileStep = toCoords.file > fromCoords.file ? 1 : (toCoords.file < fromCoords.file ? -1 : 0);
            const rankStep = toCoords.rank > fromCoords.rank ? 1 : (toCoords.rank < fromCoords.rank ? -1 : 0);
            
            let currentFile = fromCoords.file + fileStep;
            let currentRank = fromCoords.rank + rankStep;
            
            while (currentFile !== toCoords.file || currentRank !== toCoords.rank) {
                if (game.board[currentRank][currentFile]) {
                    return false;
                }
                currentFile += fileStep;
                currentRank += rankStep;
            }
            
            return true;
        },
        
        wouldBeInCheck: function(color) {
            // Find king position
            let kingPos = null;
            for (let rank = 0; rank < 8; rank++) {
                for (let file = 0; file < 8; file++) {
                    const piece = game.board[rank][file];
                    if (piece && piece.type === 'k' && piece.color === color) {
                        kingPos = { rank, file };
                        break;
                    }
                }
                if (kingPos) break;
            }
            
            if (!kingPos) return false;
            
            // Check if any enemy piece can attack the king
            for (let rank = 0; rank < 8; rank++) {
                for (let file = 0; file < 8; file++) {
                    const piece = game.board[rank][file];
                    if (piece && piece.color !== color) {
                        const fromSquare = this.coordsToSquare(file, rank);
                        const toSquare = this.coordsToSquare(kingPos.file, kingPos.rank);
                        
                        if (this.isValidMove(fromSquare, toSquare, piece)) {
                            return true;
                        }
                    }
                }
            }
            
            return false;
        }
    };
};