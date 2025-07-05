/**
 * Mock Babylon.js library for standalone operation
 * Provides basic 3D functionality without external dependencies
 */

window.BABYLON = {
    // Core Engine
    Engine: function(canvas, antialias, options) {
        const engine = {
            canvas: canvas,
            fps: 60,
            
            runRenderLoop: function(callback) {
                const loop = () => {
                    callback();
                    requestAnimationFrame(loop);
                };
                requestAnimationFrame(loop);
            },
            
            resize: function() {
                // Mock resize
            },
            
            dispose: function() {
                // Mock dispose
            },
            
            getFps: function() {
                return this.fps;
            }
        };
        
        return engine;
    },
    
    // Scene
    Scene: function(engine) {
        const scene = {
            clearColor: { r: 0, g: 0, b: 0 },
            lights: [],
            meshes: [],
            materials: [],
            textures: [],
            animationGroups: [],
            
            render: function() {
                // Mock render - draw simple 2D representation
                this.draw2DChessBoard();
            },
            
            draw2DChessBoard: function() {
                const canvas = engine.canvas;
                const ctx = canvas.getContext('2d');
                
                if (!ctx) return;
                
                // Clear canvas
                ctx.fillStyle = '#1a1a2e';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Draw chess board
                const boardSize = Math.min(canvas.width, canvas.height) * 0.6;
                const squareSize = boardSize / 8;
                const startX = (canvas.width - boardSize) / 2;
                const startY = (canvas.height - boardSize) / 2;
                
                for (let row = 0; row < 8; row++) {
                    for (let col = 0; col < 8; col++) {
                        const isLight = (row + col) % 2 === 0;
                        ctx.fillStyle = isLight ? '#f0d9b5' : '#b58863';
                        
                        const x = startX + col * squareSize;
                        const y = startY + row * squareSize;
                        
                        ctx.fillRect(x, y, squareSize, squareSize);
                        
                        // Draw border
                        ctx.strokeStyle = '#333';
                        ctx.lineWidth = 1;
                        ctx.strokeRect(x, y, squareSize, squareSize);
                    }
                }
                
                // Draw pieces (simple representation)
                this.drawPieces(ctx, startX, startY, squareSize);
                
                // Draw UI text
                ctx.fillStyle = '#00ffff';
                ctx.font = '24px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Professional 3D Chess - 2D Mode', canvas.width / 2, 50);
                
                ctx.font = '16px Arial';
                ctx.fillText('Click squares to play • This is a simplified 2D version', canvas.width / 2, canvas.height - 30);
            },
            
            drawPieces: function(ctx, startX, startY, squareSize) {
                // Map pieces to unicode symbols
                const symbols = {
                    'p': '♟', 'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚',
                    'P': '♙', 'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔'
                };

                // Try to get actual board state from the chess game
                let board = null;
                if (window.chessGame3D && window.chessGame3D.chess && typeof window.chessGame3D.chess.board === 'function') {
                    board = window.chessGame3D.chess.board();
                }

                // Fallback to starting position if game not available
                if (!board) {
                    board = [
                        'rnbqkbnr'.split(''),
                        'pppppppp'.split(''),
                        '        '.split(''),
                        '        '.split(''),
                        '        '.split(''),
                        '        '.split(''),
                        'PPPPPPPP'.split(''),
                        'RNBQKBNR'.split('')
                    ];
                }
                
                ctx.font = `${squareSize * 0.7}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                for (let row = 0; row < 8; row++) {
                    for (let col = 0; col < 8; col++) {
                        const piece = board[row][col];
                        if (piece && piece !== ' ') {
                            const symbol = symbols[piece.type ? (piece.color === 'w' ? piece.type.toUpperCase() : piece.type.toLowerCase()) : piece];
                            const x = startX + col * squareSize + squareSize / 2;
                            const y = startY + row * squareSize + squareSize / 2;

                            ctx.fillStyle = '#000';
                            ctx.fillText(symbol, x, y);
                        }
                    }
                }
            },
            
            enablePhysics: function(gravity, plugin) {
                // Mock physics
            },
            
            dispose: function() {
                // Mock dispose
            }
        };
        
        // Make canvas clickable for chess interaction
        engine.canvas.addEventListener('click', (e) => {
            scene.handleChessClick(e);
        });
        
        scene.handleChessClick = function(e) {
            const rect = engine.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate chess square
            const boardSize = Math.min(engine.canvas.width, engine.canvas.height) * 0.6;
            const squareSize = boardSize / 8;
            const startX = (engine.canvas.width - boardSize) / 2;
            const startY = (engine.canvas.height - boardSize) / 2;
            
            if (x >= startX && x <= startX + boardSize && y >= startY && y <= startY + boardSize) {
                const col = Math.floor((x - startX) / squareSize);
                const row = Math.floor((y - startY) / squareSize);
                
                const square = String.fromCharCode(97 + col) + (8 - row);
                console.log('Clicked square:', square);
                
                // Trigger chess move if game exists
                if (window.chessGame && window.chessGame.handleSquareClick) {
                    window.chessGame.handleSquareClick(square);
                }
            }
        };
        
        return scene;
    },
    
    // Colors
    Color3: function(r, g, b) {
        return { r, g, b };
    },
    
    Color4: function(r, g, b, a) {
        return { r, g, b, a };
    },
    
    // Vectors
    Vector3: function(x, y, z) {
        const vector = { x: x || 0, y: y || 0, z: z || 0 };
        
        vector.clone = function() {
            return new BABYLON.Vector3(this.x, this.y, this.z);
        };
        
        return vector;
    },
    
    // Camera
    ArcRotateCamera: function(name, alpha, beta, radius, target, scene) {
        return {
            name: name,
            alpha: alpha,
            beta: beta,
            radius: radius,
            target: target,
            scene: scene,
            
            attachControls: function(canvas) {
                // Mock camera controls
            },
            
            setTarget: function(target) {
                this.target = target;
            }
        };
    },
    
    // Lights
    HemisphericLight: function(name, direction, scene) {
        const light = {
            name: name,
            direction: direction,
            scene: scene,
            intensity: 1,
            diffuse: new BABYLON.Color3(1, 1, 1)
        };
        
        scene.lights.push(light);
        return light;
    },
    
    DirectionalLight: function(name, direction, scene) {
        const light = {
            name: name,
            direction: direction,
            scene: scene,
            intensity: 1,
            position: new BABYLON.Vector3(0, 0, 0),
            diffuse: new BABYLON.Color3(1, 1, 1)
        };
        
        scene.lights.push(light);
        return light;
    },
    
    PointLight: function(name, position, scene) {
        const light = {
            name: name,
            position: position,
            scene: scene,
            intensity: 1,
            diffuse: new BABYLON.Color3(1, 1, 1),
            range: 100
        };
        
        scene.lights.push(light);
        return light;
    },
    
    // Shadow Generator
    ShadowGenerator: function(mapSize, light) {
        return {
            mapSize: mapSize,
            light: light,
            useExponentialShadowMap: false,
            darkness: 0.3,
            
            addShadowCaster: function(mesh) {
                // Mock shadow casting
            }
        };
    },
    
    // Mesh Builder
    MeshBuilder: {
        CreateBox: function(name, options, scene) {
            const mesh = {
                name: name,
                position: new BABYLON.Vector3(0, 0, 0),
                rotation: new BABYLON.Vector3(0, 0, 0),
                scaling: new BABYLON.Vector3(1, 1, 1),
                material: null,
                metadata: {},
                receiveShadows: false,
                
                dispose: function() {
                    // Mock dispose
                },
                
                createInstance: function(name) {
                    return Object.assign({}, this, { name: name });
                }
            };
            
            if (scene) scene.meshes.push(mesh);
            return mesh;
        },
        
        CreateSphere: function(name, options, scene) {
            return this.CreateBox(name, options, scene);
        },
        
        CreateCylinder: function(name, options, scene) {
            return this.CreateBox(name, options, scene);
        },
        
        CreatePlane: function(name, options, scene) {
            return this.CreateBox(name, options, scene);
        },
        
        CreateTorus: function(name, options, scene) {
            return this.CreateBox(name, options, scene);
        }
    },
    
    // Materials
    StandardMaterial: function(name, scene) {
        const material = {
            name: name,
            scene: scene,
            diffuseColor: new BABYLON.Color3(1, 1, 1),
            specularColor: new BABYLON.Color3(1, 1, 1),
            emissiveColor: new BABYLON.Color3(0, 0, 0),
            diffuseTexture: null,
            opacityTexture: null,
            roughness: 1,
            backFaceCulling: true,
            alpha: 1,
            
            dispose: function() {
                // Mock dispose
            }
        };
        
        if (scene) scene.materials.push(material);
        return material;
    },
    
    PBRMaterial: function(name, scene) {
        const material = {
            name: name,
            scene: scene,
            baseColor: new BABYLON.Color3(1, 1, 1),
            metallicFactor: 0,
            roughnessFactor: 1,
            environmentIntensity: 1,
            emissiveColor: new BABYLON.Color3(0, 0, 0),
            alpha: 1,
            
            dispose: function() {
                // Mock dispose
            }
        };
        
        if (scene) scene.materials.push(material);
        return material;
    },
    
    // Textures
    DynamicTexture: function(name, options, scene) {
        const texture = {
            name: name,
            scene: scene,
            hasAlpha: false,
            
            getContext: function() {
                // Return mock 2D context
                const canvas = document.createElement('canvas');
                canvas.width = options.width || 512;
                canvas.height = options.height || 512;
                return canvas.getContext('2d');
            },
            
            update: function() {
                // Mock update
            },
            
            drawText: function(text, x, y, font, color, clearColor, invertY) {
                // Mock draw text
            },
            
            dispose: function() {
                // Mock dispose
            }
        };
        
        if (scene) scene.textures.push(texture);
        return texture;
    },
    
    Texture: function(url, scene) {
        const texture = {
            url: url,
            scene: scene,
            
            dispose: function() {
                // Mock dispose
            }
        };
        
        if (scene) scene.textures.push(texture);
        return texture;
    },
    
    // Animation
    Animation: {
        CreateAndStartAnimation: function(name, target, property, frameRate, totalFrames, from, to, loopMode) {
            const animation = {
                name: name,
                target: target,
                property: property,
                onAnimationEnd: null,
                
                stop: function() {
                    // Mock stop
                }
            };
            
            // Simulate animation
            setTimeout(() => {
                if (animation.onAnimationEnd) {
                    animation.onAnimationEnd();
                }
            }, (totalFrames / frameRate) * 1000);
            
            return animation;
        }
    },
    
    AnimationGroup: function(name) {
        return {
            name: name,
            animations: [],
            
            dispose: function() {
                // Mock dispose
            }
        };
    },
    
    // Particle System
    ParticleSystem: function(name, capacity, scene) {
        return {
            name: name,
            capacity: capacity,
            scene: scene,
            particleTexture: null,
            emitter: null,
            minEmitBox: new BABYLON.Vector3(0, 0, 0),
            maxEmitBox: new BABYLON.Vector3(0, 0, 0),
            color1: new BABYLON.Color4(1, 1, 1, 1),
            color2: new BABYLON.Color4(1, 1, 1, 1),
            colorDead: new BABYLON.Color4(0, 0, 0, 0),
            minSize: 1,
            maxSize: 1,
            minLifeTime: 1,
            maxLifeTime: 1,
            emitRate: 100,
            direction1: new BABYLON.Vector3(0, 1, 0),
            direction2: new BABYLON.Vector3(0, 1, 0),
            minEmitPower: 1,
            maxEmitPower: 1,
            gravity: new BABYLON.Vector3(0, -9.81, 0),
            
            start: function() {
                // Mock start
            },
            
            stop: function() {
                // Mock stop
            }
        };
    },
    
    // Constants
    Mesh: {
        BILLBOARDMODE_Y: 2
    },
    
    SceneEnum: {
        FOGMODE_NONE: 0,
        FOGMODE_LINEAR: 1
    },
    
    ANIMATIONLOOPMODE_CONSTANT: 0,
    ANIMATIONLOOPMODE_CYCLE: 1,
    ANIMATIONLOOPMODE_YOYO: 2,
    
    PointerEventTypes: {
        POINTERDOWN: 1,
        POINTERUP: 2,
        POINTERMOVE: 4
    }
};