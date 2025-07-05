/**
 * Professional 3D Chess Game - Main Entry Point
 * Features: 10 Board Themes, 10 Piece Collections, 8 Environments, AI Opponents
 */

import { ChessGame } from './src/core/ChessGame.js';
import { Scene3D } from './src/3d/Scene3D.js';
import { ChessAI } from './src/ai/ChessAI.js';
import { GameUI } from './src/ui/GameUI.js';
import { ThemeManager } from './src/themes/ThemeManager.js';
import { EnvironmentManager } from './src/environments/EnvironmentManager.js';

class Professional3DChess {
    constructor() {
        this.canvas = document.getElementById('renderCanvas');
        this.engine = null;
        this.scene = null;
        this.camera = null;
        
        // Game components
        this.chessGame = null;
        this.scene3D = null;
        this.chessAI = null;
        this.gameUI = null;
        this.themeManager = null;
        this.environmentManager = null;
        
        // Game state
        this.isPlayerTurn = true;
        this.gameMode = 'ai'; // 'ai' or 'multiplayer'
        this.difficulty = 3;
        this.currentTheme = 'classic';
        this.currentPieceCollection = 'staunton';
        this.currentEnvironment = 'library';
        
        this.init();
    }

    async init() {
        try {
            await this.initBabylon();
            await this.initGameComponents();
            await this.loadAssets();
            this.setupEventListeners();
            this.hideLoadingScreen();
            this.startNewGame();
        } catch (error) {
            console.error('Failed to initialize game:', error);
            this.showError('Failed to initialize the game. Please refresh and try again.');
        }
    }

    async initBabylon() {
        // Create Babylon.js engine
        this.engine = new BABYLON.Engine(this.canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true,
            antialias: true,
            adaptToDeviceRatio: true
        });

        // Create scene
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = new BABYLON.Color3(0.05, 0.05, 0.1);

        // Enable physics
        this.scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());

        // Create camera
        this.camera = new BABYLON.ArcRotateCamera(
            "camera",
            -Math.PI / 2,
            Math.PI / 3,
            15,
            new BABYLON.Vector3(0, 0, 0),
            this.scene
        );

        // Camera controls
        this.camera.attachControls(this.canvas);
        this.camera.setTarget(BABYLON.Vector3.Zero());
        this.camera.lowerRadiusLimit = 8;
        this.camera.upperRadiusLimit = 25;
        this.camera.lowerBetaLimit = 0.1;
        this.camera.upperBetaLimit = Math.PI / 2.2;

        // Lighting setup
        this.setupLighting();

        // Start render loop
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }

    setupLighting() {
        // Hemispheric light for ambient lighting
        const hemisphericLight = new BABYLON.HemisphericLight(
            "hemisphericLight",
            new BABYLON.Vector3(0, 1, 0),
            this.scene
        );
        hemisphericLight.intensity = 0.4;

        // Directional light for shadows
        const directionalLight = new BABYLON.DirectionalLight(
            "directionalLight",
            new BABYLON.Vector3(-1, -1, -1),
            this.scene
        );
        directionalLight.position = new BABYLON.Vector3(10, 10, 10);
        directionalLight.intensity = 0.8;

        // Shadow generator
        const shadowGenerator = new BABYLON.ShadowGenerator(2048, directionalLight);
        shadowGenerator.useExponentialShadowMap = true;
        shadowGenerator.darkness = 0.3;

        // Point lights for dramatic effect
        const pointLight1 = new BABYLON.PointLight(
            "pointLight1",
            new BABYLON.Vector3(-5, 8, -5),
            this.scene
        );
        pointLight1.intensity = 0.3;
        pointLight1.diffuse = new BABYLON.Color3(0, 1, 1); // Cyan

        const pointLight2 = new BABYLON.PointLight(
            "pointLight2",
            new BABYLON.Vector3(5, 8, 5),
            this.scene
        );
        pointLight2.intensity = 0.3;
        pointLight2.diffuse = new BABYLON.Color3(1, 0.4, 0); // Orange

        this.shadowGenerator = shadowGenerator;
    }

    async initGameComponents() {
        // Initialize chess game logic
        this.chessGame = new ChessGame();
        
        // Initialize 3D scene manager
        this.scene3D = new Scene3D(this.scene, this.shadowGenerator);
        
        // Initialize AI
        this.chessAI = new ChessAI(this.difficulty);
        
        // Initialize UI
        this.gameUI = new GameUI(this);
        
        // Initialize theme manager
        this.themeManager = new ThemeManager(this.scene, this.scene3D);
        
        // Initialize environment manager
        this.environmentManager = new EnvironmentManager(this.scene, this.camera);
    }

    async loadAssets() {
        this.updateLoadingText("Loading 3D Models...");
        
        // Load all themes and piece collections
        await this.themeManager.loadAllThemes();
        
        this.updateLoadingText("Setting up environments...");
        
        // Load environments
        await this.environmentManager.loadAllEnvironments();
        
        this.updateLoadingText("Initializing chess board...");
        
        // Create initial chess board
        await this.scene3D.createChessBoard(this.currentTheme);
        await this.scene3D.createChessPieces(this.currentPieceCollection);
        
        this.updateLoadingText("Finalizing setup...");
        
        // Set initial environment
        await this.environmentManager.setEnvironment(this.currentEnvironment);
    }

    setupEventListeners() {
        // Theme selector
        document.getElementById('board-theme').addEventListener('change', (e) => {
            this.changeTheme(e.target.value);
        });

        // Piece collection selector
        document.getElementById('piece-collection').addEventListener('change', (e) => {
            this.changePieceCollection(e.target.value);
        });

        // Environment selector
        document.getElementById('environment').addEventListener('change', (e) => {
            this.changeEnvironment(e.target.value);
        });

        // AI difficulty selector
        document.getElementById('ai-difficulty').addEventListener('change', (e) => {
            this.difficulty = parseInt(e.target.value);
            this.chessAI.setDifficulty(this.difficulty);
        });

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

        // Piece selection and movement
        this.scene.onPointerObservable.add((pointerInfo) => {
            this.handlePointerEvent(pointerInfo);
        });
    }

    updateLoadingText(text) {
        const loadingText = document.querySelector('.loading-text');
        if (loadingText) {
            loadingText.textContent = text;
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

    async startNewGame() {
        // Reset chess game
        this.chessGame.reset();
        this.isPlayerTurn = true;
        
        // Reset 3D board
        await this.scene3D.resetBoard();
        
        // Update UI
        this.gameUI.updateGameStatus('Game in progress');
        this.gameUI.updateCurrentPlayer('white');
        this.gameUI.updateMoveCount(1);
        this.gameUI.clearLastMove();
        this.gameUI.clearCapturedPieces();
        
        console.log('New game started');
    }

    async changeTheme(themeId) {
        this.currentTheme = themeId;
        await this.themeManager.applyBoardTheme(themeId);
        console.log(`Changed to theme: ${themeId}`);
    }

    async changePieceCollection(collectionId) {
        this.currentPieceCollection = collectionId;
        await this.themeManager.applyPieceCollection(collectionId);
        console.log(`Changed to piece collection: ${collectionId}`);
    }

    async changeEnvironment(environmentId) {
        this.currentEnvironment = environmentId;
        await this.environmentManager.setEnvironment(environmentId);
        console.log(`Changed to environment: ${environmentId}`);
    }

    handlePointerEvent(pointerInfo) {
        if (!this.isPlayerTurn) return;

        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN:
                this.handlePieceSelection(pointerInfo.pickInfo);
                break;
            case BABYLON.PointerEventTypes.POINTERUP:
                this.handlePieceMove(pointerInfo.pickInfo);
                break;
        }
    }

    handlePieceSelection(pickInfo) {
        if (pickInfo.hit && pickInfo.pickedMesh) {
            const piece = this.scene3D.getPieceFromMesh(pickInfo.pickedMesh);
            if (piece && piece.color === this.chessGame.turn()) {
                this.scene3D.selectPiece(piece);
                this.scene3D.highlightLegalMoves(this.chessGame.moves({ square: piece.square }));
            }
        }
    }

    async handlePieceMove(pickInfo) {
        const selectedPiece = this.scene3D.getSelectedPiece();
        if (!selectedPiece) return;

        let targetSquare = null;

        if (pickInfo.hit && pickInfo.pickedMesh) {
            // Check if clicking on a square or piece
            targetSquare = this.scene3D.getSquareFromMesh(pickInfo.pickedMesh);
        }

        if (targetSquare) {
            const move = {
                from: selectedPiece.square,
                to: targetSquare,
                promotion: 'q' // Auto-promote to queen for simplicity
            };

            if (this.chessGame.isLegalMove(move)) {
                await this.makeMove(move);
            }
        }

        // Clear selection
        this.scene3D.clearSelection();
        this.scene3D.clearHighlights();
    }

    async makeMove(move) {
        // Make move in chess logic
        const moveResult = this.chessGame.move(move);
        if (!moveResult) return;

        // Animate move in 3D
        await this.scene3D.animateMove(move);

        // Update UI
        this.gameUI.updateLastMove(moveResult.san);
        this.gameUI.updateMoveCount(this.chessGame.history().length);
        
        // Handle captured pieces
        if (moveResult.captured) {
            this.gameUI.addCapturedPiece(moveResult.captured, moveResult.color === 'w' ? 'black' : 'white');
        }

        // Check game state
        if (this.chessGame.isGameOver()) {
            this.handleGameOver();
            return;
        }

        // Switch turns
        this.isPlayerTurn = !this.isPlayerTurn;
        this.gameUI.updateCurrentPlayer(this.chessGame.turn() === 'w' ? 'white' : 'black');

        // AI move if it's AI's turn
        if (!this.isPlayerTurn && this.gameMode === 'ai') {
            await this.makeAIMove();
        }
    }

    async makeAIMove() {
        this.gameUI.updateAIStatus('Thinking...');
        
        // Get AI move
        const aiMove = await this.chessAI.getBestMove(this.chessGame);
        
        if (aiMove) {
            setTimeout(async () => {
                await this.makeMove(aiMove);
                this.gameUI.updateAIStatus('Ready');
            }, 1000); // Small delay for realism
        }
    }

    undoMove() {
        if (this.chessGame.history().length === 0) return;

        const lastMove = this.chessGame.undo();
        if (lastMove) {
            this.scene3D.undoLastMove();
            this.gameUI.updateMoveCount(this.chessGame.history().length);
            this.gameUI.updateCurrentPlayer(this.chessGame.turn() === 'w' ? 'white' : 'black');
            this.isPlayerTurn = this.chessGame.turn() === 'w';
        }

        // If in AI mode and it's AI turn after undo, undo AI move too
        if (this.gameMode === 'ai' && !this.isPlayerTurn) {
            const aiMove = this.chessGame.undo();
            if (aiMove) {
                this.scene3D.undoLastMove();
                this.gameUI.updateMoveCount(this.chessGame.history().length);
                this.isPlayerTurn = true;
            }
        }
    }

    showHint() {
        if (!this.isPlayerTurn) return;

        const hint = this.chessAI.getBestMove(this.chessGame);
        if (hint) {
            this.scene3D.highlightMove(hint);
            setTimeout(() => {
                this.scene3D.clearHighlights();
            }, 3000);
        }
    }

    handleGameOver() {
        let status = '';
        
        if (this.chessGame.isCheckmate()) {
            const winner = this.chessGame.turn() === 'w' ? 'Black' : 'White';
            status = `Checkmate! ${winner} wins!`;
        } else if (this.chessGame.isDraw()) {
            status = 'Draw!';
        } else if (this.chessGame.isStalemate()) {
            status = 'Stalemate!';
        } else if (this.chessGame.isThreefoldRepetition()) {
            status = 'Draw by repetition!';
        } else if (this.chessGame.isInsufficientMaterial()) {
            status = 'Draw by insufficient material!';
        }

        this.gameUI.updateGameStatus(status);
        this.isPlayerTurn = false;
        
        console.log('Game over:', status);
    }

    // Dispose resources when game is closed
    dispose() {
        if (this.scene) {
            this.scene.dispose();
        }
        if (this.engine) {
            this.engine.dispose();
        }
    }
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
    window.chessGame = new Professional3DChess();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.chessGame) {
        window.chessGame.dispose();
    }
});