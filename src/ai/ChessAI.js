/**
 * ChessAI.js - Advanced Chess AI with Minimax Algorithm and Alpha-Beta Pruning
 * Implements professional-level chess AI with multiple difficulty levels
 */

export class ChessAI {
    constructor(difficulty = 3) {
        this.difficulty = difficulty;
        this.maxDepth = this.getDepthForDifficulty(difficulty);
        this.positionCache = new Map();
        this.killerMoves = [];
        this.historyHeuristic = new Map();
        
        // Piece values
        this.pieceValues = {
            'p': 100,  // pawn
            'n': 320,  // knight
            'b': 330,  // bishop
            'r': 500,  // rook
            'q': 900,  // queen
            'k': 20000 // king
        };
        
        // Position tables for piece-square values
        this.initPositionTables();
    }

    getDepthForDifficulty(difficulty) {
        const depths = {
            1: 2, // Beginner
            2: 3, // Amateur
            3: 4, // Intermediate
            4: 5, // Advanced
            5: 6, // Expert
            6: 7  // Master
        };
        return depths[difficulty] || 4;
    }

    setDifficulty(difficulty) {
        this.difficulty = difficulty;
        this.maxDepth = this.getDepthForDifficulty(difficulty);
        this.positionCache.clear(); // Clear cache when difficulty changes
    }

    initPositionTables() {
        // Pawn position table
        this.pawnTable = [
            [0,  0,  0,  0,  0,  0,  0,  0],
            [50, 50, 50, 50, 50, 50, 50, 50],
            [10, 10, 20, 30, 30, 20, 10, 10],
            [5,  5, 10, 25, 25, 10,  5,  5],
            [0,  0,  0, 20, 20,  0,  0,  0],
            [5, -5,-10,  0,  0,-10, -5,  5],
            [5, 10, 10,-20,-20, 10, 10,  5],
            [0,  0,  0,  0,  0,  0,  0,  0]
        ];

        // Knight position table
        this.knightTable = [
            [-50,-40,-30,-30,-30,-30,-40,-50],
            [-40,-20,  0,  0,  0,  0,-20,-40],
            [-30,  0, 10, 15, 15, 10,  0,-30],
            [-30,  5, 15, 20, 20, 15,  5,-30],
            [-30,  0, 15, 20, 20, 15,  0,-30],
            [-30,  5, 10, 15, 15, 10,  5,-30],
            [-40,-20,  0,  5,  5,  0,-20,-40],
            [-50,-40,-30,-30,-30,-30,-40,-50]
        ];

        // Bishop position table
        this.bishopTable = [
            [-20,-10,-10,-10,-10,-10,-10,-20],
            [-10,  0,  0,  0,  0,  0,  0,-10],
            [-10,  0,  5, 10, 10,  5,  0,-10],
            [-10,  5,  5, 10, 10,  5,  5,-10],
            [-10,  0, 10, 10, 10, 10,  0,-10],
            [-10, 10, 10, 10, 10, 10, 10,-10],
            [-10,  5,  0,  0,  0,  0,  5,-10],
            [-20,-10,-10,-10,-10,-10,-10,-20]
        ];

        // Rook position table
        this.rookTable = [
            [0,  0,  0,  0,  0,  0,  0,  0],
            [5, 10, 10, 10, 10, 10, 10,  5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [0,  0,  0,  5,  5,  0,  0,  0]
        ];

        // Queen position table
        this.queenTable = [
            [-20,-10,-10, -5, -5,-10,-10,-20],
            [-10,  0,  0,  0,  0,  0,  0,-10],
            [-10,  0,  5,  5,  5,  5,  0,-10],
            [-5,  0,  5,  5,  5,  5,  0, -5],
            [0,  0,  5,  5,  5,  5,  0, -5],
            [-10,  5,  5,  5,  5,  5,  0,-10],
            [-10,  0,  5,  0,  0,  0,  0,-10],
            [-20,-10,-10, -5, -5,-10,-10,-20]
        ];

        // King position table (middle game)
        this.kingMiddleTable = [
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-20,-30,-30,-40,-40,-30,-30,-20],
            [-10,-20,-20,-20,-20,-20,-20,-10],
            [20, 20,  0,  0,  0,  0, 20, 20],
            [20, 30, 10,  0,  0, 10, 30, 20]
        ];

        // King position table (end game)
        this.kingEndTable = [
            [-50,-40,-30,-20,-20,-30,-40,-50],
            [-30,-20,-10,  0,  0,-10,-20,-30],
            [-30,-10, 20, 30, 30, 20,-10,-30],
            [-30,-10, 30, 40, 40, 30,-10,-30],
            [-30,-10, 30, 40, 40, 30,-10,-30],
            [-30,-10, 20, 30, 30, 20,-10,-30],
            [-30,-30,  0,  0,  0,  0,-30,-30],
            [-50,-30,-30,-30,-30,-30,-30,-50]
        ];
    }

    async getBestMove(chessGame) {
        try {
            this.positionCache.clear();
            this.killerMoves = [];
            this.historyHeuristic.clear();
            
            const startTime = Date.now();
            
            // Get all legal moves
            const moves = chessGame.moves({ verbose: true });
            if (moves.length === 0) return null;
            
            // If only one move, return it immediately
            if (moves.length === 1) return moves[0];
            
            let bestMove = null;
            let bestValue = chessGame.turn() === 'w' ? -Infinity : Infinity;
            
            // Order moves for better alpha-beta pruning
            const orderedMoves = this.orderMoves(moves, chessGame);
            
            for (const move of orderedMoves) {
                const gameCopy = chessGame.clone();
                gameCopy.move(move);
                
                const value = this.minimax(
                    gameCopy,
                    this.maxDepth - 1,
                    -Infinity,
                    Infinity,
                    chessGame.turn() === 'b' // Opposite of current player
                );
                
                if (chessGame.turn() === 'w') {
                    if (value > bestValue) {
                        bestValue = value;
                        bestMove = move;
                    }
                } else {
                    if (value < bestValue) {
                        bestValue = value;
                        bestMove = move;
                    }
                }
            }
            
            const endTime = Date.now();
            console.log(`AI calculation time: ${endTime - startTime}ms, Best value: ${bestValue}`);
            
            return bestMove;
        } catch (error) {
            console.error('Error in AI calculation:', error);
            // Fallback to random move
            const moves = chessGame.moves({ verbose: true });
            return moves[Math.floor(Math.random() * moves.length)];
        }
    }

    minimax(chessGame, depth, alpha, beta, maximizingPlayer) {
        const fen = chessGame.fen();
        
        // Check cache
        const cacheKey = `${fen}_${depth}_${maximizingPlayer}`;
        if (this.positionCache.has(cacheKey)) {
            return this.positionCache.get(cacheKey);
        }
        
        // Base case: game over or max depth reached
        if (depth === 0 || chessGame.isGameOver()) {
            const evaluation = this.evaluatePosition(chessGame);
            this.positionCache.set(cacheKey, evaluation);
            return evaluation;
        }
        
        const moves = chessGame.moves({ verbose: true });
        const orderedMoves = this.orderMoves(moves, chessGame);
        
        if (maximizingPlayer) {
            let maxEval = -Infinity;
            
            for (const move of orderedMoves) {
                const gameCopy = chessGame.clone();
                gameCopy.move(move);
                
                const eval_ = this.minimax(gameCopy, depth - 1, alpha, beta, false);
                maxEval = Math.max(maxEval, eval_);
                alpha = Math.max(alpha, eval_);
                
                if (beta <= alpha) {
                    // Beta cutoff
                    this.recordKillerMove(move, depth);
                    break;
                }
            }
            
            this.positionCache.set(cacheKey, maxEval);
            return maxEval;
        } else {
            let minEval = Infinity;
            
            for (const move of orderedMoves) {
                const gameCopy = chessGame.clone();
                gameCopy.move(move);
                
                const eval_ = this.minimax(gameCopy, depth - 1, alpha, beta, true);
                minEval = Math.min(minEval, eval_);
                beta = Math.min(beta, eval_);
                
                if (beta <= alpha) {
                    // Alpha cutoff
                    this.recordKillerMove(move, depth);
                    break;
                }
            }
            
            this.positionCache.set(cacheKey, minEval);
            return minEval;
        }
    }

    evaluatePosition(chessGame) {
        if (chessGame.isCheckmate()) {
            return chessGame.turn() === 'w' ? -20000 : 20000;
        }
        
        if (chessGame.isDraw() || chessGame.isStalemate()) {
            return 0;
        }
        
        let evaluation = 0;
        
        // Material evaluation
        evaluation += this.getMaterialValue(chessGame);
        
        // Positional evaluation
        evaluation += this.getPositionalValue(chessGame);
        
        // King safety
        evaluation += this.getKingSafety(chessGame);
        
        // Pawn structure
        evaluation += this.getPawnStructure(chessGame);
        
        // Piece activity
        evaluation += this.getPieceActivity(chessGame);
        
        // Add some randomness for lower difficulties
        if (this.difficulty < 4) {
            const randomFactor = (5 - this.difficulty) * 20;
            evaluation += (Math.random() - 0.5) * randomFactor;
        }
        
        return evaluation;
    }

    getMaterialValue(chessGame) {
        let value = 0;
        const board = chessGame.board();
        
        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 8; file++) {
                const piece = board[rank][file];
                if (piece) {
                    const pieceValue = this.pieceValues[piece.type];
                    value += piece.color === 'w' ? pieceValue : -pieceValue;
                }
            }
        }
        
        return value;
    }

    getPositionalValue(chessGame) {
        let value = 0;
        const board = chessGame.board();
        const isEndgame = this.isEndgame(chessGame);
        
        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 8; file++) {
                const piece = board[rank][file];
                if (piece) {
                    let posValue = 0;
                    const adjustedRank = piece.color === 'w' ? 7 - rank : rank;
                    
                    switch (piece.type) {
                        case 'p':
                            posValue = this.pawnTable[adjustedRank][file];
                            break;
                        case 'n':
                            posValue = this.knightTable[adjustedRank][file];
                            break;
                        case 'b':
                            posValue = this.bishopTable[adjustedRank][file];
                            break;
                        case 'r':
                            posValue = this.rookTable[adjustedRank][file];
                            break;
                        case 'q':
                            posValue = this.queenTable[adjustedRank][file];
                            break;
                        case 'k':
                            posValue = isEndgame ? 
                                this.kingEndTable[adjustedRank][file] : 
                                this.kingMiddleTable[adjustedRank][file];
                            break;
                    }
                    
                    value += piece.color === 'w' ? posValue : -posValue;
                }
            }
        }
        
        return value;
    }

    getKingSafety(chessGame) {
        let value = 0;
        
        // Penalty for king being in check
        if (chessGame.inCheck()) {
            value += chessGame.turn() === 'w' ? -50 : 50;
        }
        
        // TODO: Add more sophisticated king safety evaluation
        // - Pawn shield
        // - Attacking pieces near king
        // - Open files near king
        
        return value;
    }

    getPawnStructure(chessGame) {
        let value = 0;
        const board = chessGame.board();
        
        // TODO: Implement pawn structure evaluation
        // - Doubled pawns
        // - Isolated pawns
        // - Passed pawns
        // - Pawn chains
        
        return value;
    }

    getPieceActivity(chessGame) {
        let value = 0;
        
        // Mobility bonus - more moves available is better
        const whiteMoves = chessGame.turn() === 'w' ? chessGame.moves().length : 0;
        const gameCopy = chessGame.clone();
        
        // Switch turns to count opponent moves
        if (chessGame.turn() === 'w') {
            gameCopy.loadFen(chessGame.fen().replace(' w ', ' b '));
        } else {
            gameCopy.loadFen(chessGame.fen().replace(' b ', ' w '));
        }
        
        const blackMoves = gameCopy.moves().length;
        
        value += (whiteMoves - blackMoves) * 2;
        
        return value;
    }

    isEndgame(chessGame) {
        const material = chessGame.getMaterialCount();
        const totalMaterial = material.white + material.black;
        
        // Consider it endgame if total material is low
        return totalMaterial < 1500; // Roughly queen + rook per side
    }

    orderMoves(moves, chessGame) {
        // Move ordering for better alpha-beta pruning
        return moves.sort((a, b) => {
            let scoreA = 0;
            let scoreB = 0;
            
            // Prioritize captures
            if (a.captured) scoreA += 1000 + this.pieceValues[a.captured];
            if (b.captured) scoreB += 1000 + this.pieceValues[b.captured];
            
            // Prioritize checks
            const gameA = chessGame.clone();
            gameA.move(a);
            if (gameA.inCheck()) scoreA += 500;
            
            const gameB = chessGame.clone();
            gameB.move(b);
            if (gameB.inCheck()) scoreB += 500;
            
            // Prioritize killer moves
            if (this.isKillerMove(a)) scoreA += 100;
            if (this.isKillerMove(b)) scoreB += 100;
            
            // History heuristic
            scoreA += this.getHistoryScore(a);
            scoreB += this.getHistoryScore(b);
            
            return scoreB - scoreA;
        });
    }

    recordKillerMove(move, depth) {
        if (!this.killerMoves[depth]) {
            this.killerMoves[depth] = [];
        }
        
        if (this.killerMoves[depth].length < 2) {
            this.killerMoves[depth].push(move);
        }
    }

    isKillerMove(move) {
        return this.killerMoves.some(killerArray => 
            killerArray && killerArray.some(killer => 
                killer.from === move.from && killer.to === move.to
            )
        );
    }

    getHistoryScore(move) {
        const key = `${move.from}_${move.to}`;
        return this.historyHeuristic.get(key) || 0;
    }

    updateHistoryHeuristic(move, depth) {
        const key = `${move.from}_${move.to}`;
        const currentScore = this.historyHeuristic.get(key) || 0;
        this.historyHeuristic.set(key, currentScore + depth * depth);
    }

    // Get a hint for the current position
    getHint(chessGame) {
        return this.getBestMove(chessGame);
    }

    // Analyze position and return evaluation
    analyzePosition(chessGame) {
        const evaluation = this.evaluatePosition(chessGame);
        const bestMove = this.getBestMove(chessGame);
        
        return {
            evaluation: evaluation,
            bestMove: bestMove,
            color: chessGame.turn(),
            isWinning: Math.abs(evaluation) > 500,
            advantage: evaluation > 0 ? 'white' : 'black'
        };
    }
}