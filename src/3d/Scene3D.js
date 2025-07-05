/**
 * Scene3D.js - 3D Scene Management for Chess Game
 * Handles 3D chessboard, pieces, animations, and interactions
 */

export class Scene3D {
    constructor(scene, shadowGenerator) {
        this.scene = scene;
        this.shadowGenerator = shadowGenerator;
        
        // Chess board and pieces
        this.chessBoard = null;
        this.chessPieces = new Map(); // Map square to piece mesh
        this.pieceModels = new Map(); // Cache for piece models
        
        // Interaction state
        this.selectedPiece = null;
        this.highlightedSquares = [];
        this.moveHistory3D = [];
        
        // Materials
        this.materials = new Map();
        
        // Animation
        this.animationGroup = new BABYLON.AnimationGroup("ChessAnimations");
        
        this.initMaterials();
    }

    initMaterials() {
        // Board materials
        this.materials.set('lightSquare', this.createBoardMaterial('lightSquare', new BABYLON.Color3(0.9, 0.9, 0.8)));
        this.materials.set('darkSquare', this.createBoardMaterial('darkSquare', new BABYLON.Color3(0.4, 0.3, 0.2)));
        this.materials.set('selectedSquare', this.createBoardMaterial('selectedSquare', new BABYLON.Color3(0.9, 0.9, 0.2)));
        this.materials.set('highlightSquare', this.createBoardMaterial('highlightSquare', new BABYLON.Color3(0.2, 0.9, 0.2)));
        
        // Piece materials
        this.materials.set('whitePiece', this.createPieceMaterial('whitePiece', new BABYLON.Color3(0.95, 0.95, 0.9)));
        this.materials.set('blackPiece', this.createPieceMaterial('blackPiece', new BABYLON.Color3(0.1, 0.1, 0.1)));
        this.materials.set('selectedPiece', this.createPieceMaterial('selectedPiece', new BABYLON.Color3(1, 1, 0)));
    }

    createBoardMaterial(name, color) {
        const material = new BABYLON.StandardMaterial(name, this.scene);
        material.diffuseColor = color;
        material.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        material.roughness = 0.8;
        return material;
    }

    createPieceMaterial(name, color) {
        const material = new BABYLON.PBRMaterial(name, this.scene);
        material.baseColor = color;
        material.metallicFactor = 0.1;
        material.roughnessFactor = 0.3;
        material.environmentIntensity = 0.5;
        return material;
    }

    async createChessBoard(theme = 'classic') {
        // Create board base
        const boardBase = BABYLON.MeshBuilder.CreateBox("boardBase", {
            width: 9,
            height: 0.2,
            depth: 9
        }, this.scene);
        boardBase.position.y = -0.1;
        
        const baseMaterial = new BABYLON.StandardMaterial("baseMaterial", this.scene);
        baseMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.15, 0.1);
        boardBase.material = baseMaterial;
        
        // Enable shadows
        this.shadowGenerator.addShadowCaster(boardBase);
        boardBase.receiveShadows = true;

        // Create 64 squares
        this.chessBoard = [];
        for (let rank = 0; rank < 8; rank++) {
            this.chessBoard[rank] = [];
            for (let file = 0; file < 8; file++) {
                const square = this.createSquare(file, rank);
                this.chessBoard[rank][file] = square;
            }
        }

        // Create coordinate labels
        this.createCoordinateLabels();
    }

    createSquare(file, rank) {
        const isLight = (file + rank) % 2 === 0;
        const squareName = String.fromCharCode(97 + file) + (rank + 1);
        
        const square = BABYLON.MeshBuilder.CreateBox(`square_${squareName}`, {
            width: 1,
            height: 0.05,
            depth: 1
        }, this.scene);
        
        // Position the square
        square.position.x = file - 3.5;
        square.position.z = rank - 3.5;
        square.position.y = 0;
        
        // Set material
        square.material = isLight ? this.materials.get('lightSquare') : this.materials.get('darkSquare');
        
        // Store square information
        square.metadata = {
            isSquare: true,
            square: squareName,
            file: file,
            rank: rank,
            isLight: isLight,
            originalMaterial: square.material
        };
        
        square.receiveShadows = true;
        
        return square;
    }

    createCoordinateLabels() {
        // File labels (a-h)
        for (let file = 0; file < 8; file++) {
            const letter = String.fromCharCode(97 + file);
            
            // Bottom labels
            const bottomLabel = this.createTextPlane(letter, 0.3);
            bottomLabel.position.x = file - 3.5;
            bottomLabel.position.z = -4.2;
            bottomLabel.position.y = 0.1;
            
            // Top labels  
            const topLabel = this.createTextPlane(letter, 0.3);
            topLabel.position.x = file - 3.5;
            topLabel.position.z = 4.2;
            topLabel.position.y = 0.1;
            topLabel.rotation.y = Math.PI;
        }
        
        // Rank labels (1-8)
        for (let rank = 0; rank < 8; rank++) {
            const number = (rank + 1).toString();
            
            // Left labels
            const leftLabel = this.createTextPlane(number, 0.3);
            leftLabel.position.x = -4.2;
            leftLabel.position.z = rank - 3.5;
            leftLabel.position.y = 0.1;
            leftLabel.rotation.y = Math.PI / 2;
            
            // Right labels
            const rightLabel = this.createTextPlane(number, 0.3);
            rightLabel.position.x = 4.2;
            rightLabel.position.z = rank - 3.5;
            rightLabel.position.y = 0.1;
            rightLabel.rotation.y = -Math.PI / 2;
        }
    }

    createTextPlane(text, size) {
        const plane = BABYLON.MeshBuilder.CreatePlane("textPlane", { size: size }, this.scene);
        
        const texture = new BABYLON.DynamicTexture("textTexture", { width: 256, height: 256 }, this.scene);
        texture.hasAlpha = true;
        texture.drawText(text, null, null, "bold 180px Arial", "#ffffff", "transparent", true);
        
        const material = new BABYLON.StandardMaterial("textMaterial", this.scene);
        material.diffuseTexture = texture;
        material.opacityTexture = texture;
        material.emissiveColor = new BABYLON.Color3(0.8, 0.8, 0.8);
        
        plane.material = material;
        plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_Y;
        
        return plane;
    }

    async createChessPieces(collection = 'staunton') {
        // Clear existing pieces
        this.clearPieces();
        
        // Standard starting position
        const startingPosition = [
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'], // rank 8 (black)
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'], // rank 7 (black pawns)
            [null, null, null, null, null, null, null, null], // rank 6
            [null, null, null, null, null, null, null, null], // rank 5
            [null, null, null, null, null, null, null, null], // rank 4
            [null, null, null, null, null, null, null, null], // rank 3
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'], // rank 2 (white pawns)
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']  // rank 1 (white)
        ];
        
        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 8; file++) {
                const pieceType = startingPosition[7 - rank][file]; // Flip rank for display
                if (pieceType) {
                    const square = String.fromCharCode(97 + file) + (rank + 1);
                    await this.createPiece(pieceType, square, collection);
                }
            }
        }
    }

    async createPiece(pieceType, square, collection = 'staunton') {
        const isWhite = pieceType === pieceType.toUpperCase();
        const type = pieceType.toLowerCase();
        const color = isWhite ? 'white' : 'black';
        
        // Create piece mesh based on type
        let pieceMesh;
        switch (type) {
            case 'p':
                pieceMesh = this.createPawn(collection);
                break;
            case 'r':
                pieceMesh = this.createRook(collection);
                break;
            case 'n':
                pieceMesh = this.createKnight(collection);
                break;
            case 'b':
                pieceMesh = this.createBishop(collection);
                break;
            case 'q':
                pieceMesh = this.createQueen(collection);
                break;
            case 'k':
                pieceMesh = this.createKing(collection);
                break;
            default:
                return null;
        }
        
        if (!pieceMesh) return null;
        
        // Set piece properties
        pieceMesh.name = `${color}_${type}_${square}`;
        pieceMesh.material = this.materials.get(color + 'Piece');
        
        // Position piece on square
        const coords = this.squareToPosition(square);
        pieceMesh.position.x = coords.x;
        pieceMesh.position.z = coords.z;
        pieceMesh.position.y = 0.5; // Adjust based on piece height
        
        // Store piece metadata
        pieceMesh.metadata = {
            isPiece: true,
            type: type,
            color: color,
            square: square,
            originalMaterial: pieceMesh.material
        };
        
        // Enable shadows
        this.shadowGenerator.addShadowCaster(pieceMesh);
        pieceMesh.receiveShadows = true;
        
        // Store piece in map
        this.chessPieces.set(square, pieceMesh);
        
        return pieceMesh;
    }

    createPawn(collection) {
        const pawn = BABYLON.MeshBuilder.CreateCylinder("pawn", {
            height: 1,
            diameterTop: 0.3,
            diameterBottom: 0.4,
            tessellation: 16
        }, this.scene);
        
        // Add pawn head
        const head = BABYLON.MeshBuilder.CreateSphere("pawnHead", {
            diameter: 0.35
        }, this.scene);
        head.position.y = 0.6;
        head.parent = pawn;
        
        return pawn;
    }

    createRook(collection) {
        const base = BABYLON.MeshBuilder.CreateCylinder("rookBase", {
            height: 0.6,
            diameter: 0.5,
            tessellation: 16
        }, this.scene);
        
        const tower = BABYLON.MeshBuilder.CreateCylinder("rookTower", {
            height: 0.4,
            diameter: 0.4,
            tessellation: 16
        }, this.scene);
        tower.position.y = 0.5;
        tower.parent = base;
        
        // Create battlements
        for (let i = 0; i < 4; i++) {
            const battlement = BABYLON.MeshBuilder.CreateBox("battlement", {
                width: 0.1,
                height: 0.2,
                depth: 0.05
            }, this.scene);
            battlement.position.y = 0.8;
            battlement.position.x = 0.15 * Math.cos(i * Math.PI / 2);
            battlement.position.z = 0.15 * Math.sin(i * Math.PI / 2);
            battlement.parent = base;
        }
        
        return base;
    }

    createKnight(collection) {
        // Create a stylized horse head
        const body = BABYLON.MeshBuilder.CreateCylinder("knightBody", {
            height: 0.6,
            diameter: 0.4,
            tessellation: 16
        }, this.scene);
        
        const neck = BABYLON.MeshBuilder.CreateCylinder("knightNeck", {
            height: 0.4,
            diameterTop: 0.25,
            diameterBottom: 0.3,
            tessellation: 16
        }, this.scene);
        neck.position.y = 0.5;
        neck.rotation.x = Math.PI / 6;
        neck.parent = body;
        
        const head = BABYLON.MeshBuilder.CreateBox("knightHead", {
            width: 0.3,
            height: 0.2,
            depth: 0.4
        }, this.scene);
        head.position.y = 0.7;
        head.position.z = 0.1;
        head.parent = body;
        
        return body;
    }

    createBishop(collection) {
        const base = BABYLON.MeshBuilder.CreateCylinder("bishopBase", {
            height: 0.4,
            diameter: 0.4,
            tessellation: 16
        }, this.scene);
        
        const body = BABYLON.MeshBuilder.CreateCylinder("bishopBody", {
            height: 0.6,
            diameterTop: 0.2,
            diameterBottom: 0.35,
            tessellation: 16
        }, this.scene);
        body.position.y = 0.5;
        body.parent = base;
        
        const hat = BABYLON.MeshBuilder.CreateSphere("bishopHat", {
            diameter: 0.25
        }, this.scene);
        hat.position.y = 0.9;
        hat.parent = base;
        
        return base;
    }

    createQueen(collection) {
        const base = BABYLON.MeshBuilder.CreateCylinder("queenBase", {
            height: 0.3,
            diameter: 0.5,
            tessellation: 16
        }, this.scene);
        
        const body = BABYLON.MeshBuilder.CreateCylinder("queenBody", {
            height: 0.8,
            diameterTop: 0.3,
            diameterBottom: 0.45,
            tessellation: 16
        }, this.scene);
        body.position.y = 0.55;
        body.parent = base;
        
        // Create crown
        for (let i = 0; i < 8; i++) {
            const spike = BABYLON.MeshBuilder.CreateCylinder("crownSpike", {
                height: 0.3,
                diameterTop: 0.02,
                diameterBottom: 0.05,
                tessellation: 8
            }, this.scene);
            
            const angle = (i * Math.PI * 2) / 8;
            spike.position.x = 0.12 * Math.cos(angle);
            spike.position.z = 0.12 * Math.sin(angle);
            spike.position.y = 1.1;
            spike.parent = base;
        }
        
        return base;
    }

    createKing(collection) {
        const base = BABYLON.MeshBuilder.CreateCylinder("kingBase", {
            height: 0.3,
            diameter: 0.5,
            tessellation: 16
        }, this.scene);
        
        const body = BABYLON.MeshBuilder.CreateCylinder("kingBody", {
            height: 0.9,
            diameterTop: 0.3,
            diameterBottom: 0.45,
            tessellation: 16
        }, this.scene);
        body.position.y = 0.6;
        body.parent = base;
        
        // Create cross on top
        const crossV = BABYLON.MeshBuilder.CreateBox("crossVertical", {
            width: 0.05,
            height: 0.3,
            depth: 0.05
        }, this.scene);
        crossV.position.y = 1.15;
        crossV.parent = base;
        
        const crossH = BABYLON.MeshBuilder.CreateBox("crossHorizontal", {
            width: 0.2,
            height: 0.05,
            depth: 0.05
        }, this.scene);
        crossH.position.y = 1.2;
        crossH.parent = base;
        
        return base;
    }

    squareToPosition(square) {
        const file = square.charCodeAt(0) - 97; // a=0, b=1, ..., h=7
        const rank = parseInt(square[1]) - 1;   // 1=0, 2=1, ..., 8=7
        
        return {
            x: file - 3.5,
            z: rank - 3.5
        };
    }

    positionToSquare(x, z) {
        const file = Math.round(x + 3.5);
        const rank = Math.round(z + 3.5);
        
        if (file >= 0 && file <= 7 && rank >= 0 && rank <= 7) {
            return String.fromCharCode(97 + file) + (rank + 1);
        }
        
        return null;
    }

    selectPiece(piece) {
        // Clear previous selection
        this.clearSelection();
        
        if (piece && piece.metadata && piece.metadata.isPiece) {
            this.selectedPiece = piece;
            piece.material = this.materials.get('selectedPiece');
            
            // Highlight the square
            const square = piece.metadata.square;
            this.highlightSquare(square, 'selected');
        }
    }

    clearSelection() {
        if (this.selectedPiece) {
            this.selectedPiece.material = this.selectedPiece.metadata.originalMaterial;
            this.selectedPiece = null;
        }
        this.clearHighlights();
    }

    highlightLegalMoves(moves) {
        this.clearHighlights();
        
        moves.forEach(move => {
            this.highlightSquare(move.to || move, 'highlight');
        });
    }

    highlightSquare(square, type = 'highlight') {
        const coords = this.squareToPosition(square);
        const rank = parseInt(square[1]) - 1;
        const file = square.charCodeAt(0) - 97;
        
        if (this.chessBoard && this.chessBoard[rank] && this.chessBoard[rank][file]) {
            const squareMesh = this.chessBoard[rank][file];
            
            if (type === 'selected') {
                squareMesh.material = this.materials.get('selectedSquare');
            } else {
                squareMesh.material = this.materials.get('highlightSquare');
            }
            
            this.highlightedSquares.push({
                mesh: squareMesh,
                originalMaterial: squareMesh.metadata.originalMaterial
            });
        }
    }

    clearHighlights() {
        this.highlightedSquares.forEach(highlight => {
            highlight.mesh.material = highlight.originalMaterial;
        });
        this.highlightedSquares = [];
    }

    async animateMove(move) {
        const piece = this.chessPieces.get(move.from);
        if (!piece) return;
        
        const targetPos = this.squareToPosition(move.to);
        
        // Handle captured piece
        const capturedPiece = this.chessPieces.get(move.to);
        if (capturedPiece) {
            // Animate captured piece falling/disappearing
            await this.animateCapture(capturedPiece);
            this.chessPieces.delete(move.to);
        }
        
        // Animate piece movement
        const startPos = piece.position.clone();
        const endPos = new BABYLON.Vector3(targetPos.x, piece.position.y, targetPos.z);
        
        // Create animation
        const moveAnimation = BABYLON.Animation.CreateAndStartAnimation(
            "moveAnimation",
            piece,
            "position",
            30, // fps
            20, // frames
            startPos,
            endPos,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        
        // Wait for animation to complete
        return new Promise(resolve => {
            moveAnimation.onAnimationEnd = () => {
                // Update piece position in map
                this.chessPieces.delete(move.from);
                this.chessPieces.set(move.to, piece);
                piece.metadata.square = move.to;
                resolve();
            };
        });
    }

    async animateCapture(piece) {
        // Animate piece falling down and scaling down
        const fallAnimation = BABYLON.Animation.CreateAndStartAnimation(
            "fallAnimation",
            piece,
            "position.y",
            30, // fps
            15, // frames
            piece.position.y,
            -2,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        
        const scaleAnimation = BABYLON.Animation.CreateAndStartAnimation(
            "scaleAnimation",
            piece,
            "scaling",
            30, // fps
            15, // frames
            piece.scaling,
            new BABYLON.Vector3(0.1, 0.1, 0.1),
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        
        return new Promise(resolve => {
            fallAnimation.onAnimationEnd = () => {
                piece.dispose();
                resolve();
            };
        });
    }

    getPieceFromMesh(mesh) {
        if (mesh && mesh.metadata && mesh.metadata.isPiece) {
            return mesh;
        }
        return null;
    }

    getSquareFromMesh(mesh) {
        if (mesh && mesh.metadata) {
            if (mesh.metadata.isSquare) {
                return mesh.metadata.square;
            } else if (mesh.metadata.isPiece) {
                return mesh.metadata.square;
            }
        }
        return null;
    }

    getSelectedPiece() {
        return this.selectedPiece;
    }

    clearPieces() {
        this.chessPieces.forEach(piece => {
            piece.dispose();
        });
        this.chessPieces.clear();
    }

    async resetBoard() {
        this.clearPieces();
        this.clearSelection();
        await this.createChessPieces();
    }

    highlightMove(move) {
        this.highlightSquare(move.from, 'selected');
        this.highlightSquare(move.to, 'highlight');
        
        // Clear after a delay
        setTimeout(() => {
            this.clearHighlights();
        }, 2000);
    }

    undoLastMove() {
        // This would need to be coordinated with the chess game logic
        // For now, just clear highlights
        this.clearSelection();
        this.clearHighlights();
    }

    dispose() {
        this.clearPieces();
        this.materials.forEach(material => material.dispose());
        this.animationGroup.dispose();
    }
}