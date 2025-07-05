/**
 * Simplified main.js for immediate functionality
 * This version works without complex module dependencies
 */

class SimpleChess3D {
    constructor() {
        this.canvas = document.getElementById('renderCanvas');
        this.engine = null;
        this.scene = null;
        this.chess = null;
        this.selectedSquare = null;
        this.currentPlayer = 'white';
        this.moveHistory = [];
        
        this.init();
    }

    async init() {
        try {
            // Check if required libraries are loaded
            if (typeof BABYLON === 'undefined') {
                throw new Error('Babylon.js library not loaded');
            }
            if (typeof Chess === 'undefined') {
                throw new Error('Chess.js library not loaded');
            }

            // Initialize engine and scene
            this.engine = new BABYLON.Engine(this.canvas, true);
            this.scene = new BABYLON.Scene(this.engine);
            
            // Initialize chess
            this.chess = new Chess();
            
            // Setup UI
            this.setupEventListeners();
            
            // Start render loop
            this.engine.runRenderLoop(() => {
                this.scene.render();
            });
            
            // Handle window resize
            window.addEventListener('resize', () => {
                this.engine.resize();
            });
            
            // Hide loading screen
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 2000);
            
        } catch (error) {
            console.error('Failed to initialize game:', error);
            this.showError(`Failed to initialize the game: ${error.message}. Please refresh and try again.`);
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }

    showError(message) {
        const loadingText = document.querySelector('.loading-text');
        if (loadingText) {
            loadingText.textContent = message;
            loadingText.style.color = '#ff0000';
        }
    }

    setupEventListeners() {
        // Game controls
        document.getElementById('new-game').addEventListener('click', () => {
            this.startNewGame();
        });

        document.getElementById('undo').addEventListener('click', () => {
            this.undoMove();
        });

        document.getElementById('hint').addEventListener('click', () => {
            this.showHint();
        });

        // Theme changes
        document.getElementById('board-theme').addEventListener('change', (e) => {
            this.changeTheme(e.target.value);
        });

        document.getElementById('environment').addEventListener('change', (e) => {
            this.changeEnvironment(e.target.value);
        });

        document.getElementById('ai-difficulty').addEventListener('change', (e) => {
            this.showNotification(`AI difficulty set to ${e.target.selectedOptions[0].text}`);
        });

        // Avatar selection
        document.getElementById('ai-character').addEventListener('change', (e) => {
            this.changeAICharacter(e.target.value);
        });

        document.getElementById('robot-type').addEventListener('change', (e) => {
            this.changeRobotType(e.target.value);
        });

        // Make the chess game handle square clicks
        const originalHandleChessClick = this.scene.handleChessClick;
        this.scene.handleChessClick = (e) => {
            originalHandleChessClick.call(this.scene, e);
        };
        
        // Override chess click handling
        window.chessGame = {
            handleSquareClick: (square) => {
                this.handleSquareClick(square);
            }
        };
    }

    handleSquareClick(square) {
        console.log('Square clicked:', square);
        
        if (this.selectedSquare) {
            // Try to make a move
            const move = this.chess.move({
                from: this.selectedSquare,
                to: square
            });
            
            if (move) {
                this.updateGameInfo(move);
                this.selectedSquare = null;
                
                // AI move after a short delay
                if (this.currentPlayer === 'white') {
                    this.currentPlayer = 'black';
                    setTimeout(() => this.makeAIMove(), 1000);
                } else {
                    this.currentPlayer = 'white';
                }
                
                this.updateUI();
            } else {
                this.showNotification('Invalid move!', 'error');
                this.selectedSquare = null;
            }
        } else {
            // Select a piece
            const piece = this.chess.get(square);
            if (piece && ((this.currentPlayer === 'white' && piece.color === 'w') ||
                         (this.currentPlayer === 'black' && piece.color === 'b'))) {
                this.selectedSquare = square;
                this.showNotification(`Selected ${piece.type} on ${square}`);
                
                // Show possible moves
                const moves = this.chess.moves({ square: square });
                console.log('Possible moves:', moves);
            } else {
                this.showNotification('Select your own piece!', 'warning');
            }
        }
    }

    makeAIMove() {
        this.updateAIStatus('Thinking...');
        
        setTimeout(() => {
            const moves = this.chess.moves();
            if (moves.length > 0) {
                const randomMove = moves[Math.floor(Math.random() * moves.length)];
                const move = this.chess.move(randomMove);
                
                if (move) {
                    this.updateGameInfo(move);
                    this.currentPlayer = 'white';
                    this.updateUI();
                    this.showNotification(`AI played: ${move.san}`);
                }
            }
            
            this.updateAIStatus('Ready');
        }, 500 + Math.random() * 1500); // Random thinking time
    }

    updateGameInfo(move) {
        this.moveHistory.push(move);
        
        // Update last move
        document.getElementById('last-move').textContent = move.san;
        
        // Update move count
        document.getElementById('move-count').textContent = `Move: ${Math.ceil(this.moveHistory.length / 2)}`;
        
        // Update current player
        const currentPlayerText = this.currentPlayer === 'white' ? 'White to move' : 'Black to move';
        document.getElementById('current-player').textContent = currentPlayerText;
        
        // Check for game over
        if (this.chess.isGameOver()) {
            let status = '';
            if (this.chess.isCheckmate()) {
                status = this.currentPlayer === 'white' ? 'Black wins by checkmate!' : 'White wins by checkmate!';
            } else if (this.chess.isDraw()) {
                status = 'Game drawn!';
            }
            document.getElementById('game-status').textContent = status;
            this.showNotification(status);
        }
    }

    updateUI() {
        const currentPlayerText = this.currentPlayer === 'white' ? 'White to move' : 'Black to move';
        document.getElementById('current-player').textContent = currentPlayerText;
        
        // Force scene redraw
        if (this.scene && this.scene.render) {
            this.scene.render();
        }
    }

    updateAIStatus(status) {
        document.getElementById('ai-status').textContent = status;
    }

    startNewGame() {
        this.chess.reset();
        this.currentPlayer = 'white';
        this.selectedSquare = null;
        this.moveHistory = [];
        
        document.getElementById('current-player').textContent = 'White to move';
        document.getElementById('move-count').textContent = 'Move: 1';
        document.getElementById('game-status').textContent = 'Game in progress';
        document.getElementById('last-move').textContent = 'None';
        
        this.updateUI();
        this.showNotification('New game started!');
    }

    undoMove() {
        if (this.moveHistory.length === 0) {
            this.showNotification('No moves to undo!', 'warning');
            return;
        }

        // Undo player move
        const undoneMove = this.chess.undo();
        if (undoneMove) {
            this.moveHistory.pop();
            
            // If last move was AI, undo that too
            if (this.currentPlayer === 'white') {
                const aiMove = this.chess.undo();
                if (aiMove) {
                    this.moveHistory.pop();
                }
            } else {
                this.currentPlayer = 'white';
            }
            
            this.updateUI();
            this.showNotification('Move undone');
            
            // Update move display
            document.getElementById('move-count').textContent = `Move: ${Math.ceil(this.moveHistory.length / 2)}`;
            if (this.moveHistory.length > 0) {
                document.getElementById('last-move').textContent = this.moveHistory[this.moveHistory.length - 1].san;
            } else {
                document.getElementById('last-move').textContent = 'None';
            }
        }
    }

    showHint() {
        const moves = this.chess.moves();
        if (moves.length > 0) {
            const randomMove = moves[Math.floor(Math.random() * moves.length)];
            this.showNotification(`Hint: Try ${randomMove}`);
        } else {
            this.showNotification('No legal moves available!');
        }
    }

    changeTheme(themeId) {
        this.showNotification(`Theme changed to ${themeId}`);
        
        // Update canvas background based on theme
        const canvas = this.canvas;
        switch (themeId) {
            case 'cyberpunk':
                canvas.style.background = 'linear-gradient(45deg, #1a1a2e, #16213e)';
                break;
            case 'crystal':
                canvas.style.background = 'linear-gradient(45deg, #e6f3ff, #b3d9ff)';
                break;
            case 'medieval':
                canvas.style.background = 'linear-gradient(45deg, #8B4513, #A0522D)';
                break;
            default:
                canvas.style.background = 'linear-gradient(45deg, #2c3e50, #34495e)';
                break;
        }
        
        // Force redraw
        if (this.scene && this.scene.render) {
            this.scene.render();
        }
    }

    changeEnvironment(envId) {
        const backgrounds = {
            library: 'linear-gradient(45deg, #5D4037, #3E2723)',
            mountain: 'linear-gradient(45deg, #ECEFF1, #90A4AE)',
            chamber: 'linear-gradient(45deg, #4E342E, #212121)',
            void: 'linear-gradient(45deg, #000000, #434343)',
            tournament: 'linear-gradient(45deg, #1E88E5, #1565C0)',
            arena: 'linear-gradient(45deg, #880E4F, #4A148C)',
            factory: 'linear-gradient(45deg, #757575, #424242)',
            colosseum: 'linear-gradient(45deg, #8D6E63, #5D4037)'
        };

        document.body.style.background = backgrounds[envId] || 'linear-gradient(45deg, #2c3e50, #34495e)';
        this.showNotification(`Environment changed to ${envId}`);
    }

    changeAICharacter(characterId) {
        const characters = {
            'neon-hacker': { name: 'Neon Hacker', emoji: '🕴️', color: '#00ffff' },
            'cyber-warrior': { name: 'Cyber Warrior', emoji: '⚔️', color: '#ff6600' },
            'data-ghost': { name: 'Data Ghost', emoji: '👻', color: '#9400d3' },
            'chrome-knight': { name: 'Chrome Knight', emoji: '🏰', color: '#c0c0c0' },
            'neural-queen': { name: 'Neural Queen', emoji: '👑', color: '#ff1493' },
            'quantum-bishop': { name: 'Quantum Bishop', emoji: '🔮', color: '#4169e1' },
            'steel-rook': { name: 'Steel Rook', emoji: '🏭', color: '#708090' },
            'plasma-pawn': { name: 'Plasma Pawn', emoji: '⚡', color: '#ffd700' },
            'void-king': { name: 'Void King', emoji: '🌌', color: '#191970' },
            'matrix-master': { name: 'Matrix Master', emoji: '🔢', color: '#00ff00' }
        };
        
        const character = characters[characterId];
        if (character) {
            document.getElementById('ai-avatar').textContent = character.name;
            document.getElementById('ai-visual').textContent = character.emoji;
            document.getElementById('ai-visual').style.color = character.color;
            this.showNotification(`AI character changed to ${character.name}`);
        }
    }

    changeRobotType(robotType) {
        const robots = {
            'humanoid': { name: 'Humanoid Android', emoji: '🤖' },
            'tactical': { name: 'Tactical Unit', emoji: '🦾' },
            'industrial': { name: 'Industrial Mech', emoji: '⚙️' },
            'combat': { name: 'Combat Drone', emoji: '🚁' },
            'stealth': { name: 'Stealth Bot', emoji: '🥷' },
            'guardian': { name: 'Guardian Model', emoji: '🛡️' },
            'scout': { name: 'Scout Variant', emoji: '🔍' },
            'heavy': { name: 'Heavy Assault', emoji: '🦾' },
            'recon': { name: 'Recon Unit', emoji: '📡' },
            'commander': { name: 'Command Unit', emoji: '👨‍💼' }
        };
        
        const robot = robots[robotType];
        if (robot) {
            document.getElementById('ai-robot-type').textContent = robot.name;
            // Mix character emoji with robot emoji
            const characterEmoji = document.getElementById('ai-visual').textContent;
            document.getElementById('ai-visual').textContent = `${characterEmoji}${robot.emoji}`;
            this.showNotification(`Robot type changed to ${robot.name}`);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        const color = type === 'error' ? '#ff0000' : type === 'warning' ? '#ffaa00' : '#00ffff';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            border-left: 4px solid ${color};
            z-index: 10000;
            max-width: 300px;
            font-size: 14px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize when page loads
window.addEventListener('load', () => {
    window.chessGame3D = new SimpleChess3D();
});