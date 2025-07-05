/**
 * ThemeManager.js - Manages 10 different board themes and 10 piece collections
 * Creates professional and visually stunning chess themes
 */

export class ThemeManager {
    constructor(scene, scene3D) {
        this.scene = scene;
        this.scene3D = scene3D;
        
        // Theme definitions
        this.boardThemes = new Map();
        this.pieceCollections = new Map();
        
        // Current active themes
        this.currentBoardTheme = 'classic';
        this.currentPieceCollection = 'staunton';
        
        this.initializeThemes();
    }

    initializeThemes() {
        this.initializeBoardThemes();
        this.initializePieceCollections();
    }

    initializeBoardThemes() {
        // 1. Classic Wood Theme
        this.boardThemes.set('classic', {
            name: 'Classic Wood',
            lightSquareColor: new BABYLON.Color3(0.9, 0.8, 0.6),
            darkSquareColor: new BABYLON.Color3(0.6, 0.4, 0.2),
            baseColor: new BABYLON.Color3(0.4, 0.3, 0.2),
            materialType: 'wood',
            textures: {
                light: this.createWoodTexture(true),
                dark: this.createWoodTexture(false),
                base: this.createWoodTexture(false, true)
            },
            properties: {
                roughness: 0.8,
                metallic: 0.0,
                specular: 0.1
            }
        });

        // 2. Medieval Castle Theme
        this.boardThemes.set('medieval', {
            name: 'Medieval Castle',
            lightSquareColor: new BABYLON.Color3(0.8, 0.8, 0.7),
            darkSquareColor: new BABYLON.Color3(0.4, 0.4, 0.3),
            baseColor: new BABYLON.Color3(0.3, 0.3, 0.25),
            materialType: 'stone',
            textures: {
                light: this.createStoneTexture(true),
                dark: this.createStoneTexture(false),
                base: this.createStoneTexture(false, true)
            },
            properties: {
                roughness: 0.9,
                metallic: 0.0,
                specular: 0.05
            }
        });

        // 3. Cyberpunk Neon Theme
        this.boardThemes.set('cyberpunk', {
            name: 'Cyberpunk Neon',
            lightSquareColor: new BABYLON.Color3(0.1, 0.1, 0.2),
            darkSquareColor: new BABYLON.Color3(0.05, 0.05, 0.1),
            baseColor: new BABYLON.Color3(0.02, 0.02, 0.05),
            materialType: 'cyberpunk',
            textures: {
                light: this.createCyberpunkTexture(true),
                dark: this.createCyberpunkTexture(false),
                base: this.createCyberpunkTexture(false, true)
            },
            emissiveColors: {
                light: new BABYLON.Color3(0, 0.5, 1),
                dark: new BABYLON.Color3(0.5, 0, 1)
            },
            properties: {
                roughness: 0.2,
                metallic: 0.8,
                specular: 0.9
            }
        });

        // 4. Crystal Palace Theme
        this.boardThemes.set('crystal', {
            name: 'Crystal Palace',
            lightSquareColor: new BABYLON.Color3(0.9, 0.95, 1.0),
            darkSquareColor: new BABYLON.Color3(0.7, 0.8, 0.9),
            baseColor: new BABYLON.Color3(0.8, 0.85, 0.9),
            materialType: 'crystal',
            textures: {
                light: this.createCrystalTexture(true),
                dark: this.createCrystalTexture(false),
                base: this.createCrystalTexture(false, true)
            },
            properties: {
                roughness: 0.1,
                metallic: 0.0,
                specular: 0.95,
                alpha: 0.8
            }
        });

        // 5. Space Station Theme
        this.boardThemes.set('space', {
            name: 'Space Station',
            lightSquareColor: new BABYLON.Color3(0.7, 0.7, 0.8),
            darkSquareColor: new BABYLON.Color3(0.3, 0.3, 0.4),
            baseColor: new BABYLON.Color3(0.2, 0.2, 0.25),
            materialType: 'metal',
            textures: {
                light: this.createMetalTexture(true),
                dark: this.createMetalTexture(false),
                base: this.createMetalTexture(false, true)
            },
            properties: {
                roughness: 0.3,
                metallic: 0.9,
                specular: 0.8
            }
        });

        // 6. Ancient Temple Theme
        this.boardThemes.set('temple', {
            name: 'Ancient Temple',
            lightSquareColor: new BABYLON.Color3(0.9, 0.8, 0.6),
            darkSquareColor: new BABYLON.Color3(0.6, 0.5, 0.3),
            baseColor: new BABYLON.Color3(0.5, 0.4, 0.2),
            materialType: 'sandstone',
            textures: {
                light: this.createSandstoneTexture(true),
                dark: this.createSandstoneTexture(false),
                base: this.createSandstoneTexture(false, true)
            },
            properties: {
                roughness: 0.85,
                metallic: 0.0,
                specular: 0.1
            }
        });

        // 7. Glass Elegance Theme
        this.boardThemes.set('glass', {
            name: 'Glass Elegance',
            lightSquareColor: new BABYLON.Color3(0.95, 0.95, 0.95),
            darkSquareColor: new BABYLON.Color3(0.1, 0.1, 0.1),
            baseColor: new BABYLON.Color3(0.5, 0.5, 0.5),
            materialType: 'glass',
            textures: {
                light: this.createGlassTexture(true),
                dark: this.createGlassTexture(false),
                base: this.createGlassTexture(false, true)
            },
            properties: {
                roughness: 0.05,
                metallic: 0.0,
                specular: 0.98,
                alpha: 0.9
            }
        });

        // 8. Volcanic Terrain Theme
        this.boardThemes.set('volcanic', {
            name: 'Volcanic Terrain',
            lightSquareColor: new BABYLON.Color3(0.8, 0.4, 0.2),
            darkSquareColor: new BABYLON.Color3(0.4, 0.2, 0.1),
            baseColor: new BABYLON.Color3(0.3, 0.15, 0.05),
            materialType: 'volcanic',
            textures: {
                light: this.createVolcanicTexture(true),
                dark: this.createVolcanicTexture(false),
                base: this.createVolcanicTexture(false, true)
            },
            emissiveColors: {
                dark: new BABYLON.Color3(0.5, 0.1, 0)
            },
            properties: {
                roughness: 0.9,
                metallic: 0.1,
                specular: 0.2
            }
        });

        // 9. Ice Kingdom Theme
        this.boardThemes.set('ice', {
            name: 'Ice Kingdom',
            lightSquareColor: new BABYLON.Color3(0.9, 0.95, 1.0),
            darkSquareColor: new BABYLON.Color3(0.6, 0.8, 0.9),
            baseColor: new BABYLON.Color3(0.7, 0.85, 0.95),
            materialType: 'ice',
            textures: {
                light: this.createIceTexture(true),
                dark: this.createIceTexture(false),
                base: this.createIceTexture(false, true)
            },
            properties: {
                roughness: 0.2,
                metallic: 0.0,
                specular: 0.9,
                alpha: 0.85
            }
        });

        // 10. Digital Matrix Theme
        this.boardThemes.set('matrix', {
            name: 'Digital Matrix',
            lightSquareColor: new BABYLON.Color3(0.0, 0.2, 0.0),
            darkSquareColor: new BABYLON.Color3(0.0, 0.05, 0.0),
            baseColor: new BABYLON.Color3(0.0, 0.02, 0.0),
            materialType: 'digital',
            textures: {
                light: this.createMatrixTexture(true),
                dark: this.createMatrixTexture(false),
                base: this.createMatrixTexture(false, true)
            },
            emissiveColors: {
                light: new BABYLON.Color3(0, 1, 0),
                dark: new BABYLON.Color3(0, 0.3, 0)
            },
            properties: {
                roughness: 0.1,
                metallic: 0.5,
                specular: 0.8
            }
        });
    }

    initializePieceCollections() {
        // 1. Classic Staunton
        this.pieceCollections.set('staunton', {
            name: 'Classic Staunton',
            style: 'traditional',
            materialProperties: {
                white: {
                    baseColor: new BABYLON.Color3(0.95, 0.95, 0.9),
                    roughness: 0.3,
                    metallic: 0.0
                },
                black: {
                    baseColor: new BABYLON.Color3(0.1, 0.1, 0.1),
                    roughness: 0.3,
                    metallic: 0.0
                }
            }
        });

        // 2. Medieval Knights
        this.pieceCollections.set('medieval', {
            name: 'Medieval Knights',
            style: 'medieval',
            materialProperties: {
                white: {
                    baseColor: new BABYLON.Color3(0.8, 0.8, 0.7),
                    roughness: 0.6,
                    metallic: 0.2
                },
                black: {
                    baseColor: new BABYLON.Color3(0.2, 0.2, 0.15),
                    roughness: 0.6,
                    metallic: 0.2
                }
            }
        });

        // 3. Cyberpunk Warriors
        this.pieceCollections.set('cyberpunk', {
            name: 'Cyberpunk Warriors',
            style: 'futuristic',
            materialProperties: {
                white: {
                    baseColor: new BABYLON.Color3(0.7, 0.8, 0.9),
                    roughness: 0.2,
                    metallic: 0.8,
                    emissiveColor: new BABYLON.Color3(0, 0.3, 0.5)
                },
                black: {
                    baseColor: new BABYLON.Color3(0.2, 0.1, 0.3),
                    roughness: 0.2,
                    metallic: 0.8,
                    emissiveColor: new BABYLON.Color3(0.3, 0, 0.5)
                }
            }
        });

        // 4. Robot Army
        this.pieceCollections.set('robot', {
            name: 'Robot Army',
            style: 'mechanical',
            materialProperties: {
                white: {
                    baseColor: new BABYLON.Color3(0.8, 0.8, 0.8),
                    roughness: 0.3,
                    metallic: 0.9
                },
                black: {
                    baseColor: new BABYLON.Color3(0.1, 0.1, 0.1),
                    roughness: 0.3,
                    metallic: 0.9
                }
            }
        });

        // 5. Fantasy Dragons
        this.pieceCollections.set('fantasy', {
            name: 'Fantasy Dragons',
            style: 'fantasy',
            materialProperties: {
                white: {
                    baseColor: new BABYLON.Color3(0.9, 0.9, 0.8),
                    roughness: 0.4,
                    metallic: 0.1,
                    emissiveColor: new BABYLON.Color3(0.1, 0.1, 0.0)
                },
                black: {
                    baseColor: new BABYLON.Color3(0.2, 0.1, 0.1),
                    roughness: 0.4,
                    metallic: 0.1,
                    emissiveColor: new BABYLON.Color3(0.1, 0.0, 0.0)
                }
            }
        });

        // 6. Roman Legion
        this.pieceCollections.set('roman', {
            name: 'Roman Legion',
            style: 'classical',
            materialProperties: {
                white: {
                    baseColor: new BABYLON.Color3(0.9, 0.8, 0.6),
                    roughness: 0.5,
                    metallic: 0.3
                },
                black: {
                    baseColor: new BABYLON.Color3(0.3, 0.2, 0.1),
                    roughness: 0.5,
                    metallic: 0.3
                }
            }
        });

        // 7. Steam Punk
        this.pieceCollections.set('steampunk', {
            name: 'Steam Punk',
            style: 'steampunk',
            materialProperties: {
                white: {
                    baseColor: new BABYLON.Color3(0.7, 0.6, 0.4),
                    roughness: 0.6,
                    metallic: 0.7
                },
                black: {
                    baseColor: new BABYLON.Color3(0.3, 0.2, 0.1),
                    roughness: 0.6,
                    metallic: 0.7
                }
            }
        });

        // 8. Animal Kingdom
        this.pieceCollections.set('animal', {
            name: 'Animal Kingdom',
            style: 'organic',
            materialProperties: {
                white: {
                    baseColor: new BABYLON.Color3(0.9, 0.8, 0.7),
                    roughness: 0.7,
                    metallic: 0.0
                },
                black: {
                    baseColor: new BABYLON.Color3(0.2, 0.15, 0.1),
                    roughness: 0.7,
                    metallic: 0.0
                }
            }
        });

        // 9. Space Marines
        this.pieceCollections.set('space', {
            name: 'Space Marines',
            style: 'scifi',
            materialProperties: {
                white: {
                    baseColor: new BABYLON.Color3(0.8, 0.8, 0.9),
                    roughness: 0.3,
                    metallic: 0.8
                },
                black: {
                    baseColor: new BABYLON.Color3(0.1, 0.1, 0.2),
                    roughness: 0.3,
                    metallic: 0.8
                }
            }
        });

        // 10. Egyptian Gods
        this.pieceCollections.set('egyptian', {
            name: 'Egyptian Gods',
            style: 'ancient',
            materialProperties: {
                white: {
                    baseColor: new BABYLON.Color3(0.9, 0.8, 0.5),
                    roughness: 0.4,
                    metallic: 0.6
                },
                black: {
                    baseColor: new BABYLON.Color3(0.3, 0.2, 0.1),
                    roughness: 0.4,
                    metallic: 0.6
                }
            }
        });
    }

    // Texture creation methods
    createWoodTexture(isLight, isBase = false) {
        const texture = new BABYLON.DynamicTexture("woodTexture", {width: 512, height: 512}, this.scene);
        const context = texture.getContext();
        
        // Create wood grain pattern
        const baseColor = isLight ? 
            (isBase ? "#8B4513" : "#DEB887") : 
            (isBase ? "#654321" : "#8B4513");
        
        context.fillStyle = baseColor;
        context.fillRect(0, 0, 512, 512);
        
        // Add wood grain lines
        context.strokeStyle = isLight ? "#CD853F" : "#5D4037";
        context.lineWidth = 2;
        
        for (let i = 0; i < 20; i++) {
            context.beginPath();
            context.moveTo(0, i * 25 + Math.random() * 10);
            context.quadraticCurveTo(256, i * 25 + Math.random() * 20, 512, i * 25 + Math.random() * 10);
            context.stroke();
        }
        
        texture.update();
        return texture;
    }

    createStoneTexture(isLight, isBase = false) {
        const texture = new BABYLON.DynamicTexture("stoneTexture", {width: 512, height: 512}, this.scene);
        const context = texture.getContext();
        
        const baseColor = isLight ? 
            (isBase ? "#696969" : "#D3D3D3") : 
            (isBase ? "#2F2F2F" : "#696969");
        
        context.fillStyle = baseColor;
        context.fillRect(0, 0, 512, 512);
        
        // Add stone texture
        for (let i = 0; i < 1000; i++) {
            context.fillStyle = `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100}, 0.3)`;
            context.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
        }
        
        texture.update();
        return texture;
    }

    createCyberpunkTexture(isLight, isBase = false) {
        const texture = new BABYLON.DynamicTexture("cyberpunkTexture", {width: 512, height: 512}, this.scene);
        const context = texture.getContext();
        
        const baseColor = isLight ? "#1a1a2e" : "#0f0f1e";
        context.fillStyle = baseColor;
        context.fillRect(0, 0, 512, 512);
        
        // Add circuit patterns
        context.strokeStyle = isLight ? "#00ffff" : "#ff00ff";
        context.lineWidth = 1;
        
        // Create circuit lines
        for (let i = 0; i < 50; i++) {
            context.beginPath();
            context.moveTo(Math.random() * 512, Math.random() * 512);
            context.lineTo(Math.random() * 512, Math.random() * 512);
            context.stroke();
        }
        
        texture.update();
        return texture;
    }

    createCrystalTexture(isLight, isBase = false) {
        const texture = new BABYLON.DynamicTexture("crystalTexture", {width: 512, height: 512}, this.scene);
        const context = texture.getContext();
        
        // Create gradient for crystal effect
        const gradient = context.createLinearGradient(0, 0, 512, 512);
        if (isLight) {
            gradient.addColorStop(0, "#ffffff");
            gradient.addColorStop(1, "#e6f3ff");
        } else {
            gradient.addColorStop(0, "#b3d9ff");
            gradient.addColorStop(1, "#4d94ff");
        }
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, 512, 512);
        
        texture.update();
        return texture;
    }

    createMetalTexture(isLight, isBase = false) {
        const texture = new BABYLON.DynamicTexture("metalTexture", {width: 512, height: 512}, this.scene);
        const context = texture.getContext();
        
        const baseColor = isLight ? "#C0C0C0" : "#4A4A4A";
        context.fillStyle = baseColor;
        context.fillRect(0, 0, 512, 512);
        
        // Add brushed metal effect
        context.strokeStyle = isLight ? "#E5E5E5" : "#5A5A5A";
        context.lineWidth = 1;
        
        for (let i = 0; i < 512; i += 2) {
            context.beginPath();
            context.moveTo(i, 0);
            context.lineTo(i, 512);
            context.stroke();
        }
        
        texture.update();
        return texture;
    }

    createSandstoneTexture(isLight, isBase = false) {
        const texture = new BABYLON.DynamicTexture("sandstoneTexture", {width: 512, height: 512}, this.scene);
        const context = texture.getContext();
        
        const baseColor = isLight ? "#F4A460" : "#DEB887";
        context.fillStyle = baseColor;
        context.fillRect(0, 0, 512, 512);
        
        // Add sandy texture
        for (let i = 0; i < 5000; i++) {
            context.fillStyle = `rgba(${139 + Math.random() * 50}, ${69 + Math.random() * 50}, ${19 + Math.random() * 50}, 0.1)`;
            context.fillRect(Math.random() * 512, Math.random() * 512, 1, 1);
        }
        
        texture.update();
        return texture;
    }

    createGlassTexture(isLight, isBase = false) {
        const texture = new BABYLON.DynamicTexture("glassTexture", {width: 512, height: 512}, this.scene);
        const context = texture.getContext();
        
        // Create glass gradient
        const gradient = context.createRadialGradient(256, 256, 0, 256, 256, 256);
        if (isLight) {
            gradient.addColorStop(0, "rgba(255, 255, 255, 0.9)");
            gradient.addColorStop(1, "rgba(255, 255, 255, 0.7)");
        } else {
            gradient.addColorStop(0, "rgba(0, 0, 0, 0.9)");
            gradient.addColorStop(1, "rgba(0, 0, 0, 0.7)");
        }
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, 512, 512);
        
        texture.update();
        return texture;
    }

    createVolcanicTexture(isLight, isBase = false) {
        const texture = new BABYLON.DynamicTexture("volcanicTexture", {width: 512, height: 512}, this.scene);
        const context = texture.getContext();
        
        const baseColor = isLight ? "#8B4513" : "#2F1B14";
        context.fillStyle = baseColor;
        context.fillRect(0, 0, 512, 512);
        
        // Add lava cracks
        if (!isLight) {
            context.strokeStyle = "#FF4500";
            context.lineWidth = 2;
            
            for (let i = 0; i < 20; i++) {
                context.beginPath();
                context.moveTo(Math.random() * 512, Math.random() * 512);
                context.lineTo(Math.random() * 512, Math.random() * 512);
                context.stroke();
            }
        }
        
        texture.update();
        return texture;
    }

    createIceTexture(isLight, isBase = false) {
        const texture = new BABYLON.DynamicTexture("iceTexture", {width: 512, height: 512}, this.scene);
        const context = texture.getContext();
        
        // Create ice gradient
        const gradient = context.createLinearGradient(0, 0, 512, 512);
        if (isLight) {
            gradient.addColorStop(0, "#F0F8FF");
            gradient.addColorStop(1, "#E6F3FF");
        } else {
            gradient.addColorStop(0, "#B0E0E6");
            gradient.addColorStop(1, "#87CEEB");
        }
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, 512, 512);
        
        // Add ice crystals
        context.strokeStyle = "rgba(255, 255, 255, 0.5)";
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x + 10, y + 10);
            context.moveTo(x + 10, y);
            context.lineTo(x, y + 10);
            context.stroke();
        }
        
        texture.update();
        return texture;
    }

    createMatrixTexture(isLight, isBase = false) {
        const texture = new BABYLON.DynamicTexture("matrixTexture", {width: 512, height: 512}, this.scene);
        const context = texture.getContext();
        
        const baseColor = isLight ? "#001100" : "#000800";
        context.fillStyle = baseColor;
        context.fillRect(0, 0, 512, 512);
        
        // Add matrix characters
        context.font = "12px monospace";
        context.fillStyle = isLight ? "#00FF00" : "#008800";
        
        const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
        
        for (let x = 0; x < 512; x += 20) {
            for (let y = 0; y < 512; y += 20) {
                if (Math.random() > 0.7) {
                    const char = chars[Math.floor(Math.random() * chars.length)];
                    context.fillText(char, x, y);
                }
            }
        }
        
        texture.update();
        return texture;
    }

    // Apply theme methods
    async applyBoardTheme(themeId) {
        const theme = this.boardThemes.get(themeId);
        if (!theme) {
            console.error(`Theme ${themeId} not found`);
            return;
        }

        this.currentBoardTheme = themeId;
        
        // Update board materials
        await this.updateBoardMaterials(theme);
        
        console.log(`Applied board theme: ${theme.name}`);
    }

    async applyPieceCollection(collectionId) {
        const collection = this.pieceCollections.get(collectionId);
        if (!collection) {
            console.error(`Piece collection ${collectionId} not found`);
            return;
        }

        this.currentPieceCollection = collectionId;
        
        // Update piece materials
        await this.updatePieceMaterials(collection);
        
        console.log(`Applied piece collection: ${collection.name}`);
    }

    async updateBoardMaterials(theme) {
        // Update light square material
        const lightMaterial = this.scene3D.materials.get('lightSquare');
        if (lightMaterial) {
            lightMaterial.baseColor = theme.lightSquareColor;
            lightMaterial.diffuseTexture = theme.textures.light;
            lightMaterial.roughnessFactor = theme.properties.roughness;
            lightMaterial.metallicFactor = theme.properties.metallic;
            
            if (theme.emissiveColors && theme.emissiveColors.light) {
                lightMaterial.emissiveColor = theme.emissiveColors.light;
            }
            
            if (theme.properties.alpha) {
                lightMaterial.alpha = theme.properties.alpha;
            }
        }

        // Update dark square material
        const darkMaterial = this.scene3D.materials.get('darkSquare');
        if (darkMaterial) {
            darkMaterial.baseColor = theme.darkSquareColor;
            darkMaterial.diffuseTexture = theme.textures.dark;
            darkMaterial.roughnessFactor = theme.properties.roughness;
            darkMaterial.metallicFactor = theme.properties.metallic;
            
            if (theme.emissiveColors && theme.emissiveColors.dark) {
                darkMaterial.emissiveColor = theme.emissiveColors.dark;
            }
            
            if (theme.properties.alpha) {
                darkMaterial.alpha = theme.properties.alpha;
            }
        }
    }

    async updatePieceMaterials(collection) {
        // Update white piece material
        const whiteMaterial = this.scene3D.materials.get('whitePiece');
        if (whiteMaterial) {
            const props = collection.materialProperties.white;
            whiteMaterial.baseColor = props.baseColor;
            whiteMaterial.roughnessFactor = props.roughness;
            whiteMaterial.metallicFactor = props.metallic;
            
            if (props.emissiveColor) {
                whiteMaterial.emissiveColor = props.emissiveColor;
            }
        }

        // Update black piece material
        const blackMaterial = this.scene3D.materials.get('blackPiece');
        if (blackMaterial) {
            const props = collection.materialProperties.black;
            blackMaterial.baseColor = props.baseColor;
            blackMaterial.roughnessFactor = props.roughness;
            blackMaterial.metallicFactor = props.metallic;
            
            if (props.emissiveColor) {
                blackMaterial.emissiveColor = props.emissiveColor;
            }
        }
    }

    async loadAllThemes() {
        // Pre-load all textures for smooth theme switching
        console.log('Loading all chess themes...');
        
        // Load board themes
        for (const [themeId, theme] of this.boardThemes) {
            // Textures are created on-demand, no need to preload
            console.log(`Loaded board theme: ${theme.name}`);
        }
        
        // Load piece collections
        for (const [collectionId, collection] of this.pieceCollections) {
            // Materials are applied on-demand
            console.log(`Loaded piece collection: ${collection.name}`);
        }
        
        console.log('All themes loaded successfully');
    }

    getBoardTheme(themeId) {
        return this.boardThemes.get(themeId);
    }

    getPieceCollection(collectionId) {
        return this.pieceCollections.get(collectionId);
    }

    getCurrentBoardTheme() {
        return this.boardThemes.get(this.currentBoardTheme);
    }

    getCurrentPieceCollection() {
        return this.pieceCollections.get(this.currentPieceCollection);
    }

    getAllBoardThemes() {
        return Array.from(this.boardThemes.values());
    }

    getAllPieceCollections() {
        return Array.from(this.pieceCollections.values());
    }
}