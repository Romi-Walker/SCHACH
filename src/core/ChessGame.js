/**
 * ChessGame.js - Core chess game logic with FIDE rules
 * Integrates with Chess.js library for official rule compliance
 */

export class ChessGame {
    constructor() {
        this.chess = new Chess(); // Chess.js instance
        this.moveHistory = [];
        this.gameState = 'playing'; // 'playing', 'checkmate', 'draw', 'stalemate'
        this.timeControl = null;
        this.capturedPieces = {
            white: [],
            black: []
        };
    }

    /**
     * Reset the game to initial position
     */
    reset() {
        this.chess.reset();
        this.moveHistory = [];
        this.gameState = 'playing';
        this.capturedPieces = {
            white: [],
            black: []
        };
    }

    /**
     * Get current turn ('w' for white, 'b' for black)
     */
    turn() {
        return this.chess.turn();
    }

    /**
     * Get current FEN notation
     */
    fen() {
        return this.chess.fen();
    }

    /**
     * Get current PGN
     */
    pgn() {
        return this.chess.pgn();
    }

    /**
     * Get game history
     */
    history() {
        return this.chess.history({ verbose: true });
    }

    /**
     * Get current board position as 2D array
     */
    board() {
        return this.chess.board();
    }

    /**
     * Get piece at specific square
     * @param {string} square - Square in algebraic notation (e.g., 'e4')
     */
    get(square) {
        return this.chess.get(square);
    }

    /**
     * Get all legal moves for current position
     * @param {object} options - Options object {square: 'e2', verbose: true}
     */
    moves(options = {}) {
        return this.chess.moves(options);
    }

    /**
     * Check if a move is legal
     * @param {object|string} move - Move object or SAN string
     */
    isLegalMove(move) {
        try {
            const testChess = new Chess(this.fen());
            const result = testChess.move(move);
            return result !== null;
        } catch (error) {
            return false;
        }
    }

    /**
     * Make a move
     * @param {object|string} move - Move object or SAN string
     */
    move(move) {
        try {
            const moveResult = this.chess.move(move);
            
            if (moveResult) {
                // Add to our move history
                this.moveHistory.push(moveResult);
                
                // Handle captured pieces
                if (moveResult.captured) {
                    const capturedColor = moveResult.color === 'w' ? 'black' : 'white';
                    this.capturedPieces[capturedColor].push({
                        piece: moveResult.captured,
                        move: this.moveHistory.length
                    });
                }
                
                // Update game state
                this.updateGameState();
                
                return moveResult;
            }
            
            return null;
        } catch (error) {
            console.error('Invalid move:', error);
            return null;
        }
    }

    /**
     * Undo the last move
     */
    undo() {
        const undoneMove = this.chess.undo();
        
        if (undoneMove) {
            // Remove from our move history
            this.moveHistory.pop();
            
            // Handle captured pieces
            if (undoneMove.captured) {
                const capturedColor = undoneMove.color === 'w' ? 'black' : 'white';
                const capturedPieces = this.capturedPieces[capturedColor];
                const lastCaptured = capturedPieces[capturedPieces.length - 1];
                
                if (lastCaptured && lastCaptured.move === this.moveHistory.length + 1) {
                    capturedPieces.pop();
                }
            }
            
            // Update game state
            this.updateGameState();
            
            return undoneMove;
        }
        
        return null;
    }

    /**
     * Check if the game is over
     */
    isGameOver() {
        return this.chess.isGameOver();
    }

    /**
     * Check if current position is checkmate
     */
    isCheckmate() {
        return this.chess.isCheckmate();
    }

    /**
     * Check if current position is stalemate
     */
    isStalemate() {
        return this.chess.isStalemate();
    }

    /**
     * Check if current position is a draw
     */
    isDraw() {
        return this.chess.isDraw();
    }

    /**
     * Check if current position has insufficient material
     */
    isInsufficientMaterial() {
        return this.chess.isInsufficientMaterial();
    }

    /**
     * Check if current position is threefold repetition
     */
    isThreefoldRepetition() {
        return this.chess.isThreefoldRepetition();
    }

    /**
     * Check if the king is in check
     */
    inCheck() {
        return this.chess.inCheck();
    }

    /**
     * Get squares that are attacked by given color
     * @param {string} color - 'w' or 'b'
     */
    getAttackedSquares(color) {
        const squares = [];
        const board = this.board();
        
        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 8; file++) {
                const square = String.fromCharCode(97 + file) + (8 - rank);
                const piece = board[rank][file];
                
                if (piece && piece.color === color) {
                    const moves = this.moves({ square: square, verbose: true });
                    moves.forEach(move => {
                        if (!squares.includes(move.to)) {
                            squares.push(move.to);
                        }
                    });
                }
            }
        }
        
        return squares;
    }

    /**
     * Get material count for evaluation
     */
    getMaterialCount() {
        const pieceValues = {
            'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0
        };
        
        let whiteCount = 0;
        let blackCount = 0;
        
        const board = this.board();
        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 8; file++) {
                const piece = board[rank][file];
                if (piece) {
                    const value = pieceValues[piece.type] || 0;
                    if (piece.color === 'w') {
                        whiteCount += value;
                    } else {
                        blackCount += value;
                    }
                }
            }
        }
        
        return { white: whiteCount, black: blackCount };
    }

    /**
     * Load game from FEN
     * @param {string} fen - FEN notation
     */
    loadFen(fen) {
        try {
            return this.chess.load(fen);
        } catch (error) {
            console.error('Invalid FEN:', error);
            return false;
        }
    }

    /**
     * Load game from PGN
     * @param {string} pgn - PGN notation
     */
    loadPgn(pgn) {
        try {
            return this.chess.loadPgn(pgn);
        } catch (error) {
            console.error('Invalid PGN:', error);
            return false;
        }
    }

    /**
     * Get position evaluation (simple material count)
     */
    evaluate() {
        if (this.isCheckmate()) {
            return this.turn() === 'w' ? -Infinity : Infinity;
        }
        
        if (this.isDraw() || this.isStalemate()) {
            return 0;
        }
        
        const material = this.getMaterialCount();
        let evaluation = material.white - material.black;
        
        // Add positional bonuses
        evaluation += this.getPositionalValue();
        
        return evaluation;
    }

    /**
     * Simple positional evaluation
     */
    getPositionalValue() {
        let value = 0;
        const board = this.board();
        
        // Center control bonus
        const centerSquares = ['d4', 'd5', 'e4', 'e5'];
        centerSquares.forEach(square => {
            const piece = this.get(square);
            if (piece) {
                value += piece.color === 'w' ? 0.1 : -0.1;
            }
        });
        
        // King safety
        if (this.inCheck()) {
            value += this.turn() === 'w' ? -0.5 : 0.5;
        }
        
        return value;
    }

    /**
     * Update game state based on current position
     */
    updateGameState() {
        if (this.isCheckmate()) {
            this.gameState = 'checkmate';
        } else if (this.isStalemate()) {
            this.gameState = 'stalemate';
        } else if (this.isDraw()) {
            this.gameState = 'draw';
        } else {
            this.gameState = 'playing';
        }
    }

    /**
     * Get current game state
     */
    getGameState() {
        return this.gameState;
    }

    /**
     * Get captured pieces
     */
    getCapturedPieces() {
        return this.capturedPieces;
    }

    /**
     * Convert square notation to coordinates
     * @param {string} square - Square in algebraic notation (e.g., 'e4')
     */
    squareToCoords(square) {
        const file = square.charCodeAt(0) - 97; // a=0, b=1, ..., h=7
        const rank = parseInt(square[1]) - 1;   // 1=0, 2=1, ..., 8=7
        return { file, rank };
    }

    /**
     * Convert coordinates to square notation
     * @param {number} file - File (0-7)
     * @param {number} rank - Rank (0-7)
     */
    coordsToSquare(file, rank) {
        return String.fromCharCode(97 + file) + (rank + 1);
    }

    /**
     * Check if castling is legal
     * @param {string} side - 'k' for kingside, 'q' for queenside
     */
    canCastle(side) {
        const color = this.turn();
        const castlingRights = this.chess.getCastlingRights(color);
        
        if (side === 'k') {
            return castlingRights.k;
        } else if (side === 'q') {
            return castlingRights.q;
        }
        
        return false;
    }

    /**
     * Get en passant target square
     */
    getEnPassantSquare() {
        const fen = this.fen();
        const parts = fen.split(' ');
        const enPassantSquare = parts[3];
        return enPassantSquare === '-' ? null : enPassantSquare;
    }

    /**
     * Clone the current game state
     */
    clone() {
        const newGame = new ChessGame();
        newGame.loadFen(this.fen());
        newGame.moveHistory = [...this.moveHistory];
        newGame.gameState = this.gameState;
        newGame.capturedPieces = {
            white: [...this.capturedPieces.white],
            black: [...this.capturedPieces.black]
        };
        return newGame;
    }
}