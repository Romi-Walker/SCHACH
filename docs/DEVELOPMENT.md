# 🔧 Entwicklerdokumentation

Umfassende technische Dokumentation für die Entwicklung und Erweiterung des Professional 3D Chess Games.

## 📋 Inhaltsverzeichnis

1. [Architektur-Übersicht](#architektur-übersicht)
2. [Modul-Struktur](#modul-struktur)
3. [API-Referenz](#api-referenz)
4. [Erweiterung & Anpassung](#erweiterung--anpassung)
5. [Performance-Optimierung](#performance-optimierung)
6. [Debugging & Testing](#debugging--testing)

## 🏗️ Architektur-Übersicht

### MVC-Pattern Implementation
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Model       │    │   Controller    │    │      View       │
│                 │    │                 │    │                 │
│  ChessGame.js   │◄──►│   main.js       │◄──►│   Scene3D.js    │
│  (Game Logic)   │    │  (Orchestrator) │    │  (3D Rendering) │
│                 │    │                 │    │                 │
│  ChessAI.js     │    │   GameUI.js     │    │ ThemeManager.js │
│  (AI Engine)    │    │ (UI Controller) │    │ (Visual Themes) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Datenfluss
```
User Input → GameUI → main.js → ChessGame → Scene3D → Babylon.js → WebGL
     ↑                                         ↓
ChessAI ←── main.js ←── ChessGame ←── Scene3D ←─┘
```

## 📁 Modul-Struktur

### Core-Module

#### 1. ChessGame.js (Model)
```javascript
/**
 * Kerngeschäftslogik des Schachspiels
 * Verwaltet: Spielzustand, Regeln, Zugvalidierung
 */
export class ChessGame {
    constructor() {
        this.chess = new Chess();        // Chess.js Integration
        this.moveHistory = [];           // Zughistorie
        this.gameState = 'playing';      // Spielstatus
        this.capturedPieces = {};        // Geschlagene Figuren
    }
    
    // Öffentliche API
    move(move) { /* Zug ausführen */ }
    undo() { /* Zug rückgängig */ }
    isLegalMove(move) { /* Zugvalidierung */ }
    evaluate() { /* Positionsbewertung */ }
}
```

#### 2. Scene3D.js (View)
```javascript
/**
 * 3D-Rendering und visuelle Darstellung
 * Verwaltet: Babylon.js Scene, Meshes, Animationen
 */
export class Scene3D {
    constructor(scene, shadowGenerator) {
        this.scene = scene;              // Babylon.js Scene
        this.chessPieces = new Map();    // 3D-Figuren
        this.chessBoard = null;          // 3D-Brett
        this.selectedPiece = null;       // Ausgewählte Figur
    }
    
    // 3D-Operationen
    createChessBoard(theme) { /* Brett erstellen */ }
    animateMove(move) { /* Zuganimation */ }
    selectPiece(piece) { /* Figurenauswahl */ }
}
```

#### 3. ChessAI.js (Model)
```javascript
/**
 * Künstliche Intelligenz mit Minimax-Algorithmus
 * Verwaltet: KI-Logik, Bewertungsfunktionen, Schwierigkeitsgrade
 */
export class ChessAI {
    constructor(difficulty = 3) {
        this.difficulty = difficulty;    // 1-6 Schwierigkeitsgrade
        this.maxDepth = this.getDepthForDifficulty(difficulty);
        this.positionCache = new Map();  // Transposition Table
    }
    
    // KI-Operationen
    getBestMove(chessGame) { /* Bester Zug */ }
    minimax(game, depth, alpha, beta, maximizing) { /* Minimax */ }
    evaluatePosition(game) { /* Stellungsbewertung */ }
}
```

### UI & Theme-Module

#### 4. GameUI.js (Controller)
```javascript
/**
 * Benutzeroberflächen-Management
 * Verwaltet: DOM-Elemente, Events, Benutzerinteraktionen
 */
export class GameUI {
    constructor(gameInstance) {
        this.game = gameInstance;        // Hauptspiel-Referenz
        this.elements = this.initializeElements();
        this.isUILocked = false;         // UI-Sperrstatus
    }
    
    // UI-Operationen
    updateCurrentPlayer(player) { /* Spieleranzeige */ }
    showNotification(message) { /* Benachrichtigungen */ }
    lockUI() { /* UI sperren während KI-Zug */ }
}
```

#### 5. ThemeManager.js (View Helper)
```javascript
/**
 * Verwaltung von Themes und visuellen Stilen
 * Verwaltet: 10 Brettthemes, 10 Figurensammlungen, Materialien
 */
export class ThemeManager {
    constructor(scene, scene3D) {
        this.boardThemes = new Map();    // Brett-Themes
        this.pieceCollections = new Map(); // Figuren-Sammlungen
        this.materials = new Map();      // Babylon.js Materialien
    }
    
    // Theme-Operationen
    applyBoardTheme(themeId) { /* Brett-Theme anwenden */ }
    applyPieceCollection(id) { /* Figuren-Sammlung anwenden */ }
}
```

#### 6. EnvironmentManager.js (View Helper)
```javascript
/**
 * Verwaltung von 3D-Umgebungen
 * Verwaltet: 8 Umgebungen (4 statisch, 4 dynamisch), Zuschauer, Effekte
 */
export class EnvironmentManager {
    constructor(scene, camera) {
        this.environments = new Map();   // Umgebungs-Definitionen
        this.spectators = [];            // Zuschauer-Meshes
        this.animations = [];            // Aktive Animationen
    }
    
    // Umgebungs-Operationen
    setEnvironment(envId) { /* Umgebung wechseln */ }
    createSpectators(config) { /* Zuschauer erstellen */ }
}
```

## 📡 API-Referenz

### ChessGame API

#### Grundlegende Methoden
```javascript
// Spiel initialisieren
const game = new ChessGame();

// Zug ausführen
const moveResult = game.move({ from: 'e2', to: 'e4' });
// Rückgabe: { san: 'e4', from: 'e2', to: 'e4', piece: 'p', ... } oder null

// Zug validieren
const isValid = game.isLegalMove({ from: 'e2', to: 'e4' });
// Rückgabe: boolean

// Verfügbare Züge
const moves = game.moves({ square: 'e2' });
// Rückgabe: ['e3', 'e4'] oder [{ from: 'e2', to: 'e3', ... }, ...]

// Spielstatus
const isGameOver = game.isGameOver();
const isCheck = game.inCheck();
const isCheckmate = game.isCheckmate();
```

#### Erweiterte Methoden
```javascript
// Position als FEN
const fen = game.fen();
// Rückgabe: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

// Spielhistorie
const history = game.history({ verbose: true });
// Rückgabe: Array von Move-Objekten

// Materialwert
const material = game.getMaterialCount();
// Rückgabe: { white: 39, black: 39 }

// Position klonen
const gameCopy = game.clone();
```

### Scene3D API

#### 3D-Operationen
```javascript
// Brett erstellen
await scene3D.createChessBoard('cyberpunk');

// Figuren erstellen
await scene3D.createChessPieces('medieval');

// Figur auswählen
scene3D.selectPiece(pieceMesh);

// Züge hervorheben
scene3D.highlightLegalMoves(['e3', 'e4']);

// Animation ausführen
await scene3D.animateMove({ from: 'e2', to: 'e4' });
```

#### Interaktion
```javascript
// Figur von Mesh erhalten
const piece = scene3D.getPieceFromMesh(clickedMesh);

// Feld von Mesh erhalten
const square = scene3D.getSquareFromMesh(clickedMesh);

// Auswahl aufheben
scene3D.clearSelection();
```

### ChessAI API

#### KI-Konfiguration
```javascript
// KI erstellen
const ai = new ChessAI(difficulty = 4); // 1-6

// Schwierigkeit ändern
ai.setDifficulty(6);

// Besten Zug berechnen
const bestMove = await ai.getBestMove(chessGame);
// Rückgabe: { from: 'e2', to: 'e4', ... }

// Position analysieren
const analysis = ai.analyzePosition(chessGame);
// Rückgabe: { evaluation: 0.5, bestMove: {...}, advantage: 'white' }
```

### ThemeManager API

#### Theme-Verwaltung
```javascript
// Theme anwenden
await themeManager.applyBoardTheme('cyberpunk');
await themeManager.applyPieceCollection('robot');

// Verfügbare Themes
const boardThemes = themeManager.getAllBoardThemes();
const pieceCollections = themeManager.getAllPieceCollections();

// Aktuelles Theme
const currentTheme = themeManager.getCurrentBoardTheme();
```

### EnvironmentManager API

#### Umgebungs-Verwaltung
```javascript
// Umgebung setzen
await envManager.setEnvironment('tournament');

// Verfügbare Umgebungen
const environments = envManager.getAllEnvironments();

// Aktuelle Umgebung
const current = envManager.getCurrentEnvironment();
```

## 🎨 Erweiterung & Anpassung

### Neues Brett-Theme hinzufügen

1. **Theme-Definition erstellen**:
```javascript
// In ThemeManager.js > initializeBoardThemes()
this.boardThemes.set('myTheme', {
    name: 'My Custom Theme',
    lightSquareColor: new BABYLON.Color3(1, 0.8, 0.6),
    darkSquareColor: new BABYLON.Color3(0.6, 0.4, 0.2),
    baseColor: new BABYLON.Color3(0.4, 0.3, 0.2),
    materialType: 'custom',
    textures: {
        light: this.createMyCustomTexture(true),
        dark: this.createMyCustomTexture(false),
        base: this.createMyCustomTexture(false, true)
    },
    properties: {
        roughness: 0.7,
        metallic: 0.0,
        specular: 0.2
    }
});
```

2. **Textur-Generator implementieren**:
```javascript
createMyCustomTexture(isLight, isBase = false) {
    const texture = new BABYLON.DynamicTexture("myTexture", {width: 512, height: 512}, this.scene);
    const context = texture.getContext();
    
    // Ihre Textur-Logik hier
    const baseColor = isLight ? "#FFCC99" : "#996633";
    context.fillStyle = baseColor;
    context.fillRect(0, 0, 512, 512);
    
    // Zusätzliche Effekte...
    
    texture.update();
    return texture;
}
```

3. **UI-Option hinzufügen**:
```html
<!-- In index.html -->
<select id="board-theme">
    <!-- Bestehende Optionen -->
    <option value="myTheme">My Custom Theme</option>
</select>
```

### Neue Figuren-Sammlung hinzufügen

1. **Sammlung definieren**:
```javascript
// In ThemeManager.js > initializePieceCollections()
this.pieceCollections.set('alien', {
    name: 'Alien Species',
    style: 'extraterrestrial',
    materialProperties: {
        white: {
            baseColor: new BABYLON.Color3(0.7, 0.9, 0.7),
            roughness: 0.4,
            metallic: 0.1,
            emissiveColor: new BABYLON.Color3(0, 0.2, 0)
        },
        black: {
            baseColor: new BABYLON.Color3(0.3, 0.1, 0.4),
            roughness: 0.4,
            metallic: 0.1,
            emissiveColor: new BABYLON.Color3(0.1, 0, 0.2)
        }
    }
});
```

2. **3D-Figuren erstellen**:
```javascript
// In Scene3D.js erweitern
createAlienPawn(collection) {
    const base = BABYLON.MeshBuilder.CreateSphere("alienPawn", {
        diameter: 0.6
    }, this.scene);
    
    // Alien-spezifische Geometrie
    const tentacles = [];
    for (let i = 0; i < 6; i++) {
        const tentacle = BABYLON.MeshBuilder.CreateCylinder("tentacle", {
            height: 0.3,
            diameterTop: 0.05,
            diameterBottom: 0.1
        }, this.scene);
        
        const angle = (i * Math.PI * 2) / 6;
        tentacle.position.x = 0.2 * Math.cos(angle);
        tentacle.position.z = 0.2 * Math.sin(angle);
        tentacle.position.y = -0.2;
        tentacle.parent = base;
        
        tentacles.push(tentacle);
    }
    
    return base;
}
```

### Neue Umgebung hinzufügen

1. **Umgebung definieren**:
```javascript
// In EnvironmentManager.js
this.environments.set('underwater', {
    name: 'Underwater Palace',
    type: 'dynamic',
    lighting: {
        ambient: { intensity: 0.3, color: new BABYLON.Color3(0.3, 0.5, 0.8) },
        directional: { intensity: 0.4, direction: new BABYLON.Vector3(0, -1, -0.3) },
        pointLights: [
            { position: new BABYLON.Vector3(0, 10, 0), intensity: 0.6, color: new BABYLON.Color3(0.5, 0.8, 1) }
        ]
    },
    skybox: { color: new BABYLON.Color3(0.1, 0.3, 0.6) },
    fog: { enabled: true, start: 10, end: 40, color: new BABYLON.Color3(0.2, 0.4, 0.7) },
    props: ['coral_reefs', 'sea_plants', 'treasure_chests'],
    spectators: {
        count: 25,
        positions: 'swimming',
        animations: ['swim', 'float', 'bubble'],
        sounds: ['underwater_ambience', 'bubble_sounds']
    },
    dynamicElements: ['floating_bubbles', 'swaying_plants', 'swimming_fish']
});
```

2. **Props erstellen**:
```javascript
createCoralReefs() {
    for (let i = 0; i < 10; i++) {
        const coral = BABYLON.MeshBuilder.CreateSphere("coral", {
            diameter: 1 + Math.random() * 2
        }, this.scene);
        
        // Zufällige Positionierung
        coral.position.x = (Math.random() - 0.5) * 30;
        coral.position.z = (Math.random() - 0.5) * 30;
        coral.position.y = 0;
        
        // Korallen-Material
        const material = new BABYLON.StandardMaterial("coralMat", this.scene);
        material.diffuseColor = new BABYLON.Color3(
            0.8 + Math.random() * 0.2,
            0.3 + Math.random() * 0.4,
            0.2 + Math.random() * 0.3
        );
        coral.material = material;
        
        this.environmentMeshes.push(coral);
    }
}
```

### KI-Algorithmus erweitern

1. **Neue Bewertungsfunktion**:
```javascript
// In ChessAI.js hinzufügen
getAdvancedPositionalValue(chessGame) {
    let value = 0;
    
    // Königsangriff bewerten
    value += this.evaluateKingAttack(chessGame);
    
    // Figurenkoordination
    value += this.evaluatePieceCoordination(chessGame);
    
    // Langfristige strategische Faktoren
    value += this.evaluateStrategicFactors(chessGame);
    
    return value;
}

evaluateKingAttack(chessGame) {
    // Implementierung für Königsangriffs-Bewertung
    let attackValue = 0;
    
    const kingSquare = this.findKing(chessGame, chessGame.turn() === 'w' ? 'b' : 'w');
    const attackingPieces = this.getAttackingPieces(chessGame, kingSquare);
    
    attackValue += attackingPieces.length * 10;
    
    return chessGame.turn() === 'w' ? attackValue : -attackValue;
}
```

2. **Machine Learning Integration** (Erweitert):
```javascript
class NeuralChessAI extends ChessAI {
    constructor(difficulty, modelPath) {
        super(difficulty);
        this.neuralNetwork = null;
        this.loadModel(modelPath);
    }
    
    async loadModel(modelPath) {
        // TensorFlow.js Model laden
        this.neuralNetwork = await tf.loadLayersModel(modelPath);
    }
    
    async evaluateWithNN(chessGame) {
        const boardTensor = this.gameToTensor(chessGame);
        const prediction = this.neuralNetwork.predict(boardTensor);
        return await prediction.data();
    }
    
    gameToTensor(chessGame) {
        // Spielposition in Tensor konvertieren
        const board = chessGame.board();
        const tensor = tf.zeros([8, 8, 12]); // 6 Figurentypen * 2 Farben
        
        // Board-Encoding implementieren...
        
        return tensor;
    }
}
```

## ⚡ Performance-Optimierung

### 3D-Rendering Optimierung

1. **Level of Detail (LOD)**:
```javascript
// In Scene3D.js
createPieceWithLOD(type, position) {
    const highDetail = this.createDetailedPiece(type);
    const mediumDetail = this.createMediumPiece(type);
    const lowDetail = this.createSimplePiece(type);
    
    // LOD-System einrichten
    const lodManager = new BABYLON.LODManager(this.scene);
    lodManager.addLevel(0, highDetail);    // 0-10 Einheiten
    lodManager.addLevel(10, mediumDetail); // 10-25 Einheiten
    lodManager.addLevel(25, lowDetail);    // 25+ Einheiten
    
    return lodManager;
}
```

2. **Instancing für Zuschauer**:
```javascript
// In EnvironmentManager.js
createInstancedSpectators(count) {
    // Master-Mesh erstellen
    const masterMesh = this.createSpectatorMesh();
    
    // Instancing für Performance
    const instances = [];
    for (let i = 0; i < count; i++) {
        const instance = masterMesh.createInstance(`spectator_${i}`);
        instance.position = this.getSpectatorPosition('stands', i, count);
        instances.push(instance);
    }
    
    return instances;
}
```

3. **Texture Atlasing**:
```javascript
// Mehrere Texturen in einer kombinieren
createTextureAtlas() {
    const atlas = new BABYLON.DynamicTexture("textureAtlas", {width: 2048, height: 2048}, this.scene);
    const context = atlas.getContext();
    
    // Verschiedene Texturen kombinieren
    const textures = [
        { source: this.woodTexture, x: 0, y: 0, w: 512, h: 512 },
        { source: this.stoneTexture, x: 512, y: 0, w: 512, h: 512 },
        { source: this.metalTexture, x: 0, y: 512, w: 512, h: 512 }
    ];
    
    textures.forEach(tex => {
        context.drawImage(tex.source.getInternalTexture(), tex.x, tex.y, tex.w, tex.h);
    });
    
    atlas.update();
    return atlas;
}
```

### KI-Performance Optimierung

1. **Transposition Table**:
```javascript
// Bereits berechnete Positionen cachen
class TranspositionTable {
    constructor(size = 1000000) {
        this.table = new Map();
        this.maxSize = size;
    }
    
    get(key) {
        return this.table.get(key);
    }
    
    set(key, value, depth) {
        if (this.table.size >= this.maxSize) {
            // LRU-Eviction implementieren
            this.evictOldest();
        }
        
        this.table.set(key, {
            value: value,
            depth: depth,
            timestamp: Date.now()
        });
    }
}
```

2. **Iterative Deepening**:
```javascript
async getBestMoveIterative(chessGame, maxTime = 5000) {
    const startTime = Date.now();
    let bestMove = null;
    let depth = 1;
    
    while (Date.now() - startTime < maxTime && depth <= this.maxDepth) {
        try {
            const move = this.getBestMoveAtDepth(chessGame, depth);
            if (move) bestMove = move;
            depth++;
        } catch (timeoutError) {
            break;
        }
    }
    
    return bestMove;
}
```

## 🐛 Debugging & Testing

### Debugging-Tools

1. **Game State Inspector**:
```javascript
// Debug-Panel für Spielzustand
class GameDebugger {
    constructor(chessGame, scene3D) {
        this.game = chessGame;
        this.scene3D = scene3D;
        this.debugPanel = this.createDebugPanel();
    }
    
    createDebugPanel() {
        const panel = document.createElement('div');
        panel.id = 'debug-panel';
        panel.innerHTML = `
            <h3>Debug Info</h3>
            <div id="position-info"></div>
            <div id="ai-info"></div>
            <div id="performance-info"></div>
        `;
        document.body.appendChild(panel);
        return panel;
    }
    
    update() {
        document.getElementById('position-info').innerHTML = `
            <strong>Position:</strong> ${this.game.fen()}<br>
            <strong>Turn:</strong> ${this.game.turn()}<br>
            <strong>Moves:</strong> ${this.game.moves().length}<br>
            <strong>Check:</strong> ${this.game.inCheck()}
        `;
    }
}
```

2. **Performance Monitor**:
```javascript
class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.startTimes = new Map();
    }
    
    startTimer(operation) {
        this.startTimes.set(operation, performance.now());
    }
    
    endTimer(operation) {
        const startTime = this.startTimes.get(operation);
        if (startTime) {
            const duration = performance.now() - startTime;
            
            if (!this.metrics.has(operation)) {
                this.metrics.set(operation, []);
            }
            
            this.metrics.get(operation).push(duration);
            this.startTimes.delete(operation);
            
            console.log(`${operation}: ${duration.toFixed(2)}ms`);
        }
    }
    
    getAverageTime(operation) {
        const times = this.metrics.get(operation) || [];
        return times.reduce((a, b) => a + b, 0) / times.length;
    }
}
```

### Testing-Framework

1. **Unit Tests**:
```javascript
// tests/chess-game.test.js
describe('ChessGame', () => {
    let game;
    
    beforeEach(() => {
        game = new ChessGame();
    });
    
    test('should start with standard position', () => {
        expect(game.fen()).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    });
    
    test('should allow legal moves', () => {
        const move = game.move({ from: 'e2', to: 'e4' });
        expect(move).not.toBeNull();
        expect(move.san).toBe('e4');
    });
    
    test('should reject illegal moves', () => {
        const move = game.move({ from: 'e2', to: 'e5' });
        expect(move).toBeNull();
    });
});
```

2. **Integration Tests**:
```javascript
// tests/integration.test.js
describe('Game Integration', () => {
    let gameInstance;
    
    beforeEach(async () => {
        // Mock Babylon.js
        global.BABYLON = mockBabylon;
        
        // Initialisiere Spiel
        gameInstance = new Professional3DChess();
        await gameInstance.init();
    });
    
    test('should handle complete game flow', async () => {
        // Zug machen
        await gameInstance.handlePieceMove({
            hit: true,
            pickedMesh: { metadata: { square: 'e4' } }
        });
        
        // Prüfe Spielzustand
        expect(gameInstance.chessGame.history().length).toBe(1);
    });
});
```

3. **Performance Tests**:
```javascript
// tests/performance.test.js
describe('Performance', () => {
    test('AI should calculate move within time limit', async () => {
        const game = new ChessGame();
        const ai = new ChessAI(4);
        
        const startTime = performance.now();
        const move = await ai.getBestMove(game);
        const endTime = performance.now();
        
        expect(endTime - startTime).toBeLessThan(5000); // 5 Sekunden
        expect(move).not.toBeNull();
    });
    
    test('3D scene should maintain 60 FPS', async () => {
        const scene = new BABYLON.Scene(mockEngine);
        const scene3D = new Scene3D(scene, mockShadowGenerator);
        
        await scene3D.createChessBoard('classic');
        await scene3D.createChessPieces('staunton');
        
        // Frame-Rate messen
        const frameRate = scene.getEngine().getFps();
        expect(frameRate).toBeGreaterThan(55);
    });
});
```

### Continuous Integration

```yaml
# .github/workflows/test.yml
name: Test Chess Game

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
    
    - name: Install dependencies
      run: npm install
    
    - name: Run unit tests
      run: npm test
    
    - name: Run integration tests
      run: npm run test:integration
    
    - name: Run performance tests
      run: npm run test:performance
    
    - name: Generate coverage report
      run: npm run coverage
```

## 🚀 Deployment

### Production Build

1. **Minification & Bundling**:
```javascript
// webpack.config.js
const path = require('path');

module.exports = {
    mode: 'production',
    entry: './main.js',
    output: {
        filename: 'chess3d.min.js',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        minimize: true,
        splitChunks: {
            chunks: 'all'
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};
```

2. **Asset Optimization**:
```bash
# Texture-Komprimierung
imagemin --plugin=imagemin-webp "assets/textures/*.png" --out-dir="dist/textures"

# 3D-Model Optimization
gltf-pipeline -i model.gltf -o model.optimized.gltf --draco
```

3. **CDN-Setup**:
```html
<!-- Production HTML -->
<script src="https://cdn.babylonjs.com/babylon.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chess.js@1.0.0-beta.6/chess.min.js"></script>
<script src="dist/chess3d.min.js"></script>
```

## 📝 Code-Dokumentation

### JSDoc-Kommentare

```javascript
/**
 * Führt einen Schachzug aus und aktualisiert den Spielzustand
 * 
 * @param {Object|string} move - Zug-Objekt oder SAN-Notation
 * @param {string} move.from - Startfeld (z.B. 'e2')
 * @param {string} move.to - Zielfeld (z.B. 'e4')
 * @param {string} [move.promotion] - Umwandlungsfigur ('q', 'r', 'b', 'n')
 * 
 * @returns {Object|null} Zug-Objekt bei Erfolg, null bei ungültigem Zug
 * 
 * @example
 * // Einfacher Bauernzug
 * const move = game.move({ from: 'e2', to: 'e4' });
 * 
 * @example
 * // Rochade
 * const castling = game.move({ from: 'e1', to: 'g1' });
 * 
 * @throws {Error} Wirft Fehler bei ungültiger Eingabe
 * 
 * @since 1.0.0
 */
move(move) {
    // Implementation...
}
```

### TypeScript-Definitionen

```typescript
// types/chess3d.d.ts
declare module 'chess3d' {
    export interface Move {
        from: string;
        to: string;
        promotion?: 'q' | 'r' | 'b' | 'n';
        san?: string;
        piece?: string;
        captured?: string;
    }
    
    export interface GameState {
        fen: string;
        turn: 'w' | 'b';
        moveCount: number;
        isGameOver: boolean;
    }
    
    export class ChessGame {
        constructor();
        move(move: Move | string): Move | null;
        undo(): Move | null;
        isLegalMove(move: Move | string): boolean;
        moves(options?: { square?: string; verbose?: boolean }): string[] | Move[];
        fen(): string;
        turn(): 'w' | 'b';
        isGameOver(): boolean;
        inCheck(): boolean;
    }
    
    export class ChessAI {
        constructor(difficulty?: number);
        getBestMove(game: ChessGame): Promise<Move>;
        setDifficulty(level: number): void;
        analyzePosition(game: ChessGame): AnalysisResult;
    }
}
```

---

Diese Entwicklerdokumentation bietet eine vollständige Referenz für die Erweiterung und Wartung des Professional 3D Chess Games. Für weitere Fragen oder detailliertere Informationen zu spezifischen Bereichen, konsultieren Sie die entsprechenden Quelldateien oder erstellen Sie ein GitHub Issue.