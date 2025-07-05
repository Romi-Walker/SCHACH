/**
 * GameUI.js - User Interface Management for Chess Game
 * Handles all UI interactions, updates, and visual feedback
 */

export class GameUI {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.elements = this.initializeElements();
        this.setupEventListeners();
        
        // UI State
        this.isUILocked = false;
        this.lastMoveHighlight = null;
        
        // Initialize UI
        this.updateUI();
    }

    initializeElements() {
        return {
            // Control panel elements
            boardThemeSelect: document.getElementById('board-theme'),
            pieceCollectionSelect: document.getElementById('piece-collection'),
            environmentSelect: document.getElementById('environment'),
            aiDifficultySelect: document.getElementById('ai-difficulty'),
            
            // Button elements
            newGameBtn: document.getElementById('new-game'),
            undoBtn: document.getElementById('undo'),
            hintBtn: document.getElementById('hint'),
            
            // Game info elements
            currentPlayer: document.getElementById('current-player'),
            moveCount: document.getElementById('move-count'),
            gameStatus: document.getElementById('game-status'),
            aiAvatar: document.getElementById('ai-avatar'),
            aiStatus: document.getElementById('ai-status'),
            lastMove: document.getElementById('last-move'),
            capturedWhite: document.getElementById('captured-white'),
            capturedBlack: document.getElementById('captured-black')
        };
    }

    setupEventListeners() {
        // Theme and appearance changes
        this.elements.boardThemeSelect.addEventListener('change', (e) => {
            this.handleThemeChange(e.target.value);
        });

        this.elements.pieceCollectionSelect.addEventListener('change', (e) => {
            this.handlePieceCollectionChange(e.target.value);
        });

        this.elements.environmentSelect.addEventListener('change', (e) => {
            this.handleEnvironmentChange(e.target.value);
        });

        this.elements.aiDifficultySelect.addEventListener('change', (e) => {
            this.handleDifficultyChange(parseInt(e.target.value));
        });

        // Game control buttons
        this.elements.newGameBtn.addEventListener('click', () => {
            this.handleNewGame();
        });

        this.elements.undoBtn.addEventListener('click', () => {
            this.handleUndo();
        });

        this.elements.hintBtn.addEventListener('click', () => {
            this.handleHint();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
    }

    handleThemeChange(themeId) {
        if (this.isUILocked) return;
        
        this.showLoadingIndicator('Changing theme...');
        this.game.changeTheme(themeId).then(() => {
            this.hideLoadingIndicator();
            this.showNotification(`Theme changed to ${this.getThemeName(themeId)}`);
        });
    }

    handlePieceCollectionChange(collectionId) {
        if (this.isUILocked) return;
        
        this.showLoadingIndicator('Changing piece collection...');
        this.game.changePieceCollection(collectionId).then(() => {
            this.hideLoadingIndicator();
            this.showNotification(`Pieces changed to ${this.getCollectionName(collectionId)}`);
        });
    }

    handleEnvironmentChange(environmentId) {
        if (this.isUILocked) return;
        
        this.showLoadingIndicator('Changing environment...');
        this.game.changeEnvironment(environmentId).then(() => {
            this.hideLoadingIndicator();
            this.showNotification(`Environment changed to ${this.getEnvironmentName(environmentId)}`);
        });
    }

    handleDifficultyChange(difficulty) {
        this.game.difficulty = difficulty;
        this.game.chessAI.setDifficulty(difficulty);
        this.updateAIAvatar(difficulty);
        this.showNotification(`AI difficulty set to ${this.getDifficultyName(difficulty)}`);
    }

    handleNewGame() {
        if (confirm('Start a new game? Current progress will be lost.')) {
            this.game.startNewGame();
            this.showNotification('New game started!');
        }
    }

    handleUndo() {
        if (this.isUILocked) return;
        
        this.game.undoMove();
        this.showNotification('Move undone');
    }

    handleHint() {
        if (this.isUILocked || !this.game.isPlayerTurn) return;
        
        this.showLoadingIndicator('Calculating hint...');
        this.game.showHint();
        this.hideLoadingIndicator();
        this.showNotification('Hint shown (highlighted squares)');
    }

    handleKeyPress(e) {
        // Prevent default if we handle the key
        let handled = false;

        switch (e.key) {
            case 'n':
            case 'N':
                if (e.ctrlKey) {
                    this.handleNewGame();
                    handled = true;
                }
                break;
            case 'z':
            case 'Z':
                if (e.ctrlKey) {
                    this.handleUndo();
                    handled = true;
                }
                break;
            case 'h':
            case 'H':
                this.handleHint();
                handled = true;
                break;
            case 'Escape':
                this.game.scene3D.clearSelection();
                handled = true;
                break;
        }

        if (handled) {
            e.preventDefault();
        }
    }

    // UI Update Methods
    updateUI() {
        this.updateGameInfo();
        this.updateButtonStates();
    }

    updateGameInfo() {
        // This will be called by the game when state changes
    }

    updateCurrentPlayer(player) {
        const indicator = this.elements.currentPlayer.querySelector('.status-indicator');
        const text = this.elements.currentPlayer;
        
        if (player === 'white') {
            indicator.className = 'status-indicator status-white';
            text.innerHTML = '<span class="status-indicator status-white"></span>White to move';
        } else {
            indicator.className = 'status-indicator status-black';
            text.innerHTML = '<span class="status-indicator status-black"></span>Black to move';
        }
    }

    updateMoveCount(count) {
        this.elements.moveCount.textContent = `Move: ${Math.ceil(count / 2)}`;
    }

    updateGameStatus(status) {
        this.elements.gameStatus.textContent = status;
        
        // Add visual feedback for game over states
        if (status.includes('Checkmate') || status.includes('wins')) {
            this.elements.gameStatus.style.color = '#ff6600';
            this.elements.gameStatus.style.fontWeight = 'bold';
        } else if (status.includes('Draw') || status.includes('Stalemate')) {
            this.elements.gameStatus.style.color = '#ffaa00';
            this.elements.gameStatus.style.fontWeight = 'bold';
        } else {
            this.elements.gameStatus.style.color = '';
            this.elements.gameStatus.style.fontWeight = '';
        }
    }

    updateAIStatus(status) {
        const indicator = this.elements.aiStatus;
        indicator.textContent = status;
        
        if (status === 'Thinking...') {
            indicator.className = 'status-thinking';
            indicator.innerHTML = '<span class="status-indicator status-thinking"></span>Thinking...';
        } else {
            indicator.className = '';
            indicator.textContent = status;
        }
    }

    updateAIAvatar(difficulty) {
        const avatars = {
            1: 'Training Bot',
            2: 'Apprentice',
            3: 'Neon Hacker',
            4: 'Corporate Executive',
            5: 'Street Samurai',
            6: 'Net Runner'
        };
        
        this.elements.aiAvatar.textContent = avatars[difficulty] || 'Unknown AI';
    }

    updateLastMove(moveNotation) {
        this.elements.lastMove.textContent = moveNotation;
        
        // Add animation effect
        this.elements.lastMove.style.color = '#00ffff';
        this.elements.lastMove.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            this.elements.lastMove.style.color = '';
            this.elements.lastMove.style.transform = '';
        }, 500);
    }

    clearLastMove() {
        this.elements.lastMove.textContent = 'None';
    }

    addCapturedPiece(piece, color) {
        const container = color === 'white' ? this.elements.capturedWhite : this.elements.capturedBlack;
        
        const pieceElement = document.createElement('span');
        pieceElement.className = 'captured-piece';
        pieceElement.textContent = this.getPieceSymbol(piece, color);
        pieceElement.style.margin = '2px';
        pieceElement.style.fontSize = '20px';
        
        container.appendChild(pieceElement);
        
        // Add animation
        pieceElement.style.transform = 'scale(0)';
        pieceElement.style.opacity = '0';
        
        setTimeout(() => {
            pieceElement.style.transition = 'all 0.3s ease';
            pieceElement.style.transform = 'scale(1)';
            pieceElement.style.opacity = '1';
        }, 100);
    }

    clearCapturedPieces() {
        this.elements.capturedWhite.innerHTML = '';
        this.elements.capturedBlack.innerHTML = '';
    }

    updateButtonStates() {
        const gameInProgress = this.game.chessGame.getGameState() === 'playing';
        const hasHistory = this.game.chessGame.history().length > 0;
        
        this.elements.undoBtn.disabled = !hasHistory || this.isUILocked;
        this.elements.hintBtn.disabled = !gameInProgress || !this.game.isPlayerTurn || this.isUILocked;
    }

    // Utility Methods
    lockUI() {
        this.isUILocked = true;
        this.updateButtonStates();
    }

    unlockUI() {
        this.isUILocked = false;
        this.updateButtonStates();
    }

    showLoadingIndicator(message = 'Loading...') {
        // Create or update loading overlay
        let loadingOverlay = document.getElementById('loading-overlay');
        
        if (!loadingOverlay) {
            loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'loading-overlay';
            loadingOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                color: white;
                font-size: 18px;
                backdrop-filter: blur(5px);
            `;
            document.body.appendChild(loadingOverlay);
        }
        
        loadingOverlay.innerHTML = `
            <div style="text-align: center;">
                <div class="loading-spinner" style="margin: 0 auto 20px;"></div>
                <div>${message}</div>
            </div>
        `;
        
        this.lockUI();
    }

    hideLoadingIndicator() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.remove();
        }
        this.unlockUI();
    }

    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            border-left: 4px solid ${type === 'error' ? '#ff0000' : '#00ffff'};
            z-index: 10000;
            max-width: 300px;
            font-size: 14px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    // Helper methods for display names
    getThemeName(themeId) {
        const names = {
            'classic': 'Classic Wood',
            'medieval': 'Medieval Castle',
            'cyberpunk': 'Cyberpunk Neon',
            'crystal': 'Crystal Palace',
            'space': 'Space Station',
            'temple': 'Ancient Temple',
            'glass': 'Glass Elegance',
            'volcanic': 'Volcanic Terrain',
            'ice': 'Ice Kingdom',
            'matrix': 'Digital Matrix'
        };
        return names[themeId] || themeId;
    }

    getCollectionName(collectionId) {
        const names = {
            'staunton': 'Classic Staunton',
            'medieval': 'Medieval Knights',
            'cyberpunk': 'Cyberpunk Warriors',
            'robot': 'Robot Army',
            'fantasy': 'Fantasy Dragons',
            'roman': 'Roman Legion',
            'steampunk': 'Steam Punk',
            'animal': 'Animal Kingdom',
            'space': 'Space Marines',
            'egyptian': 'Egyptian Gods'
        };
        return names[collectionId] || collectionId;
    }

    getEnvironmentName(environmentId) {
        const names = {
            'library': 'Grand Library',
            'mountain': 'Mountain Peak',
            'chamber': 'Royal Chamber',
            'void': 'Space Void',
            'tournament': 'Medieval Tournament',
            'arena': 'Cyberpunk Arena',
            'factory': 'Robot Factory',
            'colosseum': 'Colosseum'
        };
        return names[environmentId] || environmentId;
    }

    getDifficultyName(difficulty) {
        const names = {
            1: 'Beginner',
            2: 'Amateur',
            3: 'Intermediate',
            4: 'Advanced',
            5: 'Expert',
            6: 'Master'
        };
        return names[difficulty] || 'Unknown';
    }

    getPieceSymbol(piece, color) {
        const symbols = {
            'p': color === 'white' ? '♙' : '♟',
            'r': color === 'white' ? '♖' : '♜',
            'n': color === 'white' ? '♘' : '♞',
            'b': color === 'white' ? '♗' : '♝',
            'q': color === 'white' ? '♕' : '♛',
            'k': color === 'white' ? '♔' : '♚'
        };
        return symbols[piece] || piece;
    }

    // Advanced UI features
    showMoveHistory() {
        // TODO: Implement move history panel
    }

    showGameAnalysis() {
        // TODO: Implement game analysis panel
    }

    showSettings() {
        // TODO: Implement settings panel
    }

    exportGame() {
        // TODO: Implement game export (PGN)
    }

    importGame() {
        // TODO: Implement game import (PGN/FEN)
    }
}