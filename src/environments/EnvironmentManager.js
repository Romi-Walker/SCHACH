/**
 * EnvironmentManager.js - Manages 8 different chess environments
 * 4 Static environments + 4 Dynamic environments with spectators and animations
 */

export class EnvironmentManager {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        
        // Environment definitions
        this.environments = new Map();
        this.currentEnvironment = null;
        this.environmentMeshes = [];
        this.spectators = [];
        this.animations = [];
        
        // Crowd simulation
        this.crowdSystem = null;
        
        this.initializeEnvironments();
    }

    initializeEnvironments() {
        this.initializeStaticEnvironments();
        this.initializeDynamicEnvironments();
    }

    initializeStaticEnvironments() {
        // 1. Grand Library - Majestic library setting
        this.environments.set('library', {
            name: 'Grand Library',
            type: 'static',
            lighting: {
                ambient: { intensity: 0.3, color: new BABYLON.Color3(0.9, 0.8, 0.7) },
                directional: { intensity: 0.6, direction: new BABYLON.Vector3(-0.5, -1, -0.3) },
                pointLights: [
                    { position: new BABYLON.Vector3(-10, 8, -10), intensity: 0.4, color: new BABYLON.Color3(1, 0.9, 0.7) },
                    { position: new BABYLON.Vector3(10, 8, 10), intensity: 0.4, color: new BABYLON.Color3(1, 0.9, 0.7) }
                ]
            },
            skybox: { color: new BABYLON.Color3(0.2, 0.15, 0.1) },
            fog: { enabled: true, start: 20, end: 60, color: new BABYLON.Color3(0.1, 0.1, 0.08) },
            props: ['bookshelves', 'pillars', 'chandelier', 'reading_tables']
        });

        // 2. Mountain Peak - High altitude mountain setting
        this.environments.set('mountain', {
            name: 'Mountain Peak',
            type: 'static',
            lighting: {
                ambient: { intensity: 0.4, color: new BABYLON.Color3(0.7, 0.8, 0.9) },
                directional: { intensity: 0.8, direction: new BABYLON.Vector3(-0.3, -1, -0.5) },
                pointLights: []
            },
            skybox: { color: new BABYLON.Color3(0.4, 0.6, 0.8) },
            fog: { enabled: true, start: 30, end: 100, color: new BABYLON.Color3(0.6, 0.7, 0.8) },
            props: ['mountain_rocks', 'snow_patches', 'wind_effects', 'distant_peaks']
        });

        // 3. Royal Chamber - Luxurious royal setting
        this.environments.set('chamber', {
            name: 'Royal Chamber',
            type: 'static',
            lighting: {
                ambient: { intensity: 0.2, color: new BABYLON.Color3(0.8, 0.7, 0.6) },
                directional: { intensity: 0.5, direction: new BABYLON.Vector3(0, -1, 0) },
                pointLights: [
                    { position: new BABYLON.Vector3(-8, 6, -8), intensity: 0.6, color: new BABYLON.Color3(1, 0.8, 0.5) },
                    { position: new BABYLON.Vector3(8, 6, 8), intensity: 0.6, color: new BABYLON.Color3(1, 0.8, 0.5) }
                ]
            },
            skybox: { color: new BABYLON.Color3(0.1, 0.05, 0.02) },
            fog: { enabled: false },
            props: ['throne', 'tapestries', 'golden_columns', 'red_carpet']
        });

        // 4. Space Void - Deep space setting
        this.environments.set('void', {
            name: 'Space Void',
            type: 'static',
            lighting: {
                ambient: { intensity: 0.1, color: new BABYLON.Color3(0.2, 0.2, 0.4) },
                directional: { intensity: 0.3, direction: new BABYLON.Vector3(-1, -0.5, -1) },
                pointLights: [
                    { position: new BABYLON.Vector3(-15, 10, -15), intensity: 0.3, color: new BABYLON.Color3(0, 0.5, 1) },
                    { position: new BABYLON.Vector3(15, 10, 15), intensity: 0.3, color: new BABYLON.Color3(1, 0.5, 0) }
                ]
            },
            skybox: { type: 'starfield', color: new BABYLON.Color3(0.01, 0.01, 0.02) },
            fog: { enabled: false },
            props: ['stars', 'nebulae', 'distant_planets', 'space_debris']
        });
    }

    initializeDynamicEnvironments() {
        // 5. Medieval Tournament - Tournament with cheering crowd
        this.environments.set('tournament', {
            name: 'Medieval Tournament',
            type: 'dynamic',
            lighting: {
                ambient: { intensity: 0.4, color: new BABYLON.Color3(0.9, 0.8, 0.6) },
                directional: { intensity: 0.7, direction: new BABYLON.Vector3(-0.3, -1, -0.2) },
                pointLights: [
                    { position: new BABYLON.Vector3(-12, 8, -12), intensity: 0.3, color: new BABYLON.Color3(1, 0.7, 0.3) },
                    { position: new BABYLON.Vector3(12, 8, 12), intensity: 0.3, color: new BABYLON.Color3(1, 0.7, 0.3) }
                ]
            },
            skybox: { color: new BABYLON.Color3(0.5, 0.7, 0.9) },
            fog: { enabled: true, start: 25, end: 80, color: new BABYLON.Color3(0.4, 0.5, 0.6) },
            props: ['tournament_stands', 'banners', 'flags'],
            spectators: {
                count: 50,
                positions: 'stands',
                animations: ['cheer', 'clap', 'wave'],
                sounds: ['crowd_cheer', 'medieval_music']
            },
            dynamicElements: ['waving_flags', 'torch_flames', 'crowd_waves']
        });

        // 6. Cyberpunk Arena - Futuristic arena with holographic audience
        this.environments.set('arena', {
            name: 'Cyberpunk Arena',
            type: 'dynamic',
            lighting: {
                ambient: { intensity: 0.2, color: new BABYLON.Color3(0.3, 0.3, 0.5) },
                directional: { intensity: 0.4, direction: new BABYLON.Vector3(0, -1, 0) },
                pointLights: [
                    { position: new BABYLON.Vector3(-10, 8, -10), intensity: 0.5, color: new BABYLON.Color3(0, 1, 1) },
                    { position: new BABYLON.Vector3(10, 8, 10), intensity: 0.5, color: new BABYLON.Color3(1, 0, 1) },
                    { position: new BABYLON.Vector3(0, 15, 0), intensity: 0.3, color: new BABYLON.Color3(0, 0.5, 1) }
                ]
            },
            skybox: { type: 'cyberpunk', color: new BABYLON.Color3(0.05, 0.05, 0.1) },
            fog: { enabled: true, start: 20, end: 50, color: new BABYLON.Color3(0.1, 0.1, 0.2) },
            props: ['neon_walls', 'holographic_displays', 'cyber_pillars'],
            spectators: {
                count: 30,
                positions: 'floating_platforms',
                animations: ['cyber_dance', 'hologram_flicker', 'data_stream'],
                sounds: ['electronic_music', 'cyber_ambience']
            },
            dynamicElements: ['neon_pulses', 'hologram_effects', 'data_streams']
        });

        // 7. Robot Factory - Industrial setting with robot workers
        this.environments.set('factory', {
            name: 'Robot Factory',
            type: 'dynamic',
            lighting: {
                ambient: { intensity: 0.3, color: new BABYLON.Color3(0.6, 0.6, 0.7) },
                directional: { intensity: 0.6, direction: new BABYLON.Vector3(-0.5, -1, -0.3) },
                pointLights: [
                    { position: new BABYLON.Vector3(-8, 6, -8), intensity: 0.4, color: new BABYLON.Color3(0.8, 0.9, 1) },
                    { position: new BABYLON.Vector3(8, 6, 8), intensity: 0.4, color: new BABYLON.Color3(0.8, 0.9, 1) }
                ]
            },
            skybox: { color: new BABYLON.Color3(0.2, 0.2, 0.25) },
            fog: { enabled: true, start: 15, end: 40, color: new BABYLON.Color3(0.15, 0.15, 0.2) },
            props: ['assembly_lines', 'robotic_arms', 'control_panels', 'pipes'],
            spectators: {
                count: 20,
                positions: 'work_stations',
                animations: ['welding', 'assembly', 'scanning'],
                sounds: ['factory_ambience', 'mechanical_sounds']
            },
            dynamicElements: ['moving_conveyor_belts', 'robotic_arms', 'steam_vents']
        });

        // 8. Colosseum - Roman arena with roaring crowd
        this.environments.set('colosseum', {
            name: 'Colosseum',
            type: 'dynamic',
            lighting: {
                ambient: { intensity: 0.5, color: new BABYLON.Color3(0.9, 0.8, 0.6) },
                directional: { intensity: 0.8, direction: new BABYLON.Vector3(0, -1, -0.3) },
                pointLights: []
            },
            skybox: { color: new BABYLON.Color3(0.7, 0.6, 0.4) },
            fog: { enabled: true, start: 30, end: 100, color: new BABYLON.Color3(0.6, 0.5, 0.3) },
            props: ['stone_arches', 'sand_floor', 'emperor_box', 'gladiator_gates'],
            spectators: {
                count: 80,
                positions: 'circular_stands',
                animations: ['roman_cheer', 'thumbs_up', 'thumbs_down', 'standing_ovation'],
                sounds: ['crowd_roar', 'roman_fanfare']
            },
            dynamicElements: ['falling_sand', 'torch_flames', 'banner_waves']
        });
    }

    async setEnvironment(environmentId) {
        const environment = this.environments.get(environmentId);
        if (!environment) {
            console.error(`Environment ${environmentId} not found`);
            return;
        }

        // Clear current environment
        await this.clearCurrentEnvironment();

        this.currentEnvironment = environmentId;
        
        // Set up new environment
        await this.setupEnvironment(environment);
        
        console.log(`Set environment: ${environment.name}`);
    }

    async clearCurrentEnvironment() {
        // Remove all environment meshes
        this.environmentMeshes.forEach(mesh => {
            mesh.dispose();
        });
        this.environmentMeshes = [];

        // Clear spectators
        this.spectators.forEach(spectator => {
            spectator.dispose();
        });
        this.spectators = [];

        // Stop animations
        this.animations.forEach(animation => {
            animation.stop();
        });
        this.animations = [];

        // Clear skybox
        if (this.scene.skyBox) {
            this.scene.skyBox.dispose();
        }
    }

    async setupEnvironment(environment) {
        // Set up lighting
        this.setupLighting(environment.lighting);
        
        // Set up skybox
        this.setupSkybox(environment.skybox);
        
        // Set up fog
        this.setupFog(environment.fog);
        
        // Create environment props
        await this.createEnvironmentProps(environment.props);
        
        // Set up dynamic elements
        if (environment.type === 'dynamic') {
            await this.setupDynamicElements(environment);
        }
    }

    setupLighting(lighting) {
        // Update ambient light
        if (this.scene.lights) {
            const hemisphericLight = this.scene.lights.find(light => light.name === 'hemisphericLight');
            if (hemisphericLight) {
                hemisphericLight.intensity = lighting.ambient.intensity;
                hemisphericLight.diffuse = lighting.ambient.color;
            }
        }

        // Update directional light
        const directionalLight = this.scene.lights.find(light => light.name === 'directionalLight');
        if (directionalLight) {
            directionalLight.intensity = lighting.directional.intensity;
            directionalLight.direction = lighting.directional.direction;
        }

        // Remove existing point lights
        const existingPointLights = this.scene.lights.filter(light => 
            light.name.startsWith('envPointLight'));
        existingPointLights.forEach(light => light.dispose());

        // Add new point lights
        lighting.pointLights.forEach((lightConfig, index) => {
            const pointLight = new BABYLON.PointLight(
                `envPointLight${index}`,
                lightConfig.position,
                this.scene
            );
            pointLight.intensity = lightConfig.intensity;
            pointLight.diffuse = lightConfig.color;
            pointLight.range = 30;
        });
    }

    setupSkybox(skyboxConfig) {
        if (skyboxConfig.type === 'starfield') {
            this.createStarfieldSkybox();
        } else if (skyboxConfig.type === 'cyberpunk') {
            this.createCyberpunkSkybox();
        } else {
            this.createColorSkybox(skyboxConfig.color);
        }
    }

    createColorSkybox(color) {
        const skybox = BABYLON.MeshBuilder.CreateSphere("skyBox", {diameter:200}, this.scene);
        const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.emissiveColor = color;
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = true;
        this.scene.skyBox = skybox;
    }

    createStarfieldSkybox() {
        const skybox = BABYLON.MeshBuilder.CreateSphere("skyBox", {diameter:200}, this.scene);
        const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
        
        // Create starfield texture
        const starTexture = new BABYLON.DynamicTexture("starTexture", {width: 1024, height: 1024}, this.scene);
        const context = starTexture.getContext();
        
        // Black background
        context.fillStyle = "#000011";
        context.fillRect(0, 0, 1024, 1024);
        
        // Add stars
        context.fillStyle = "#ffffff";
        for (let i = 0; i < 2000; i++) {
            const x = Math.random() * 1024;
            const y = Math.random() * 1024;
            const size = Math.random() * 2;
            context.fillRect(x, y, size, size);
        }
        
        starTexture.update();
        
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.diffuseTexture = starTexture;
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = true;
        this.scene.skyBox = skybox;
    }

    createCyberpunkSkybox() {
        const skybox = BABYLON.MeshBuilder.CreateSphere("skyBox", {diameter:200}, this.scene);
        const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
        
        // Create cyberpunk texture
        const cyberTexture = new BABYLON.DynamicTexture("cyberTexture", {width: 1024, height: 1024}, this.scene);
        const context = cyberTexture.getContext();
        
        // Dark background with grid
        context.fillStyle = "#001122";
        context.fillRect(0, 0, 1024, 1024);
        
        // Add grid lines
        context.strokeStyle = "#0088ff";
        context.lineWidth = 1;
        
        for (let i = 0; i < 1024; i += 50) {
            context.beginPath();
            context.moveTo(i, 0);
            context.lineTo(i, 1024);
            context.stroke();
            
            context.beginPath();
            context.moveTo(0, i);
            context.lineTo(1024, i);
            context.stroke();
        }
        
        cyberTexture.update();
        
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.diffuseTexture = cyberTexture;
        skyboxMaterial.emissiveColor = new BABYLON.Color3(0.1, 0.2, 0.3);
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = true;
        this.scene.skyBox = skybox;
    }

    setupFog(fogConfig) {
        if (fogConfig.enabled) {
            this.scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
            this.scene.fogStart = fogConfig.start;
            this.scene.fogEnd = fogConfig.end;
            this.scene.fogColor = fogConfig.color;
        } else {
            this.scene.fogMode = BABYLON.Scene.FOGMODE_NONE;
        }
    }

    async createEnvironmentProps(props) {
        for (const propType of props) {
            await this.createProp(propType);
        }
    }

    async createProp(propType) {
        switch (propType) {
            case 'bookshelves':
                this.createBookshelves();
                break;
            case 'pillars':
                this.createPillars();
                break;
            case 'mountain_rocks':
                this.createMountainRocks();
                break;
            case 'tournament_stands':
                this.createTournamentStands();
                break;
            case 'neon_walls':
                this.createNeonWalls();
                break;
            case 'assembly_lines':
                this.createAssemblyLines();
                break;
            case 'stone_arches':
                this.createStoneArches();
                break;
            // Add more props as needed
        }
    }

    createBookshelves() {
        for (let i = 0; i < 8; i++) {
            const bookshelf = BABYLON.MeshBuilder.CreateBox("bookshelf", {
                width: 2,
                height: 4,
                depth: 0.5
            }, this.scene);
            
            const angle = (i * Math.PI * 2) / 8;
            const radius = 12;
            bookshelf.position.x = Math.cos(angle) * radius;
            bookshelf.position.z = Math.sin(angle) * radius;
            bookshelf.position.y = 2;
            
            const material = new BABYLON.StandardMaterial("bookshelfMat", this.scene);
            material.diffuseColor = new BABYLON.Color3(0.4, 0.2, 0.1);
            bookshelf.material = material;
            
            this.environmentMeshes.push(bookshelf);
        }
    }

    createPillars() {
        for (let i = 0; i < 4; i++) {
            const pillar = BABYLON.MeshBuilder.CreateCylinder("pillar", {
                height: 8,
                diameterTop: 1,
                diameterBottom: 1.2,
                tessellation: 12
            }, this.scene);
            
            const positions = [
                new BABYLON.Vector3(-8, 4, -8),
                new BABYLON.Vector3(8, 4, -8),
                new BABYLON.Vector3(-8, 4, 8),
                new BABYLON.Vector3(8, 4, 8)
            ];
            
            pillar.position = positions[i];
            
            const material = new BABYLON.StandardMaterial("pillarMat", this.scene);
            material.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.7);
            pillar.material = material;
            
            this.environmentMeshes.push(pillar);
        }
    }

    createMountainRocks() {
        for (let i = 0; i < 15; i++) {
            const rock = BABYLON.MeshBuilder.CreateSphere("rock", {
                diameter: 1 + Math.random() * 3
            }, this.scene);
            
            rock.position.x = (Math.random() - 0.5) * 40;
            rock.position.z = (Math.random() - 0.5) * 40;
            rock.position.y = 0;
            
            // Deform the sphere to make it look more rock-like
            rock.scaling.x = 0.8 + Math.random() * 0.4;
            rock.scaling.y = 0.6 + Math.random() * 0.8;
            rock.scaling.z = 0.8 + Math.random() * 0.4;
            
            const material = new BABYLON.StandardMaterial("rockMat", this.scene);
            material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.4);
            rock.material = material;
            
            this.environmentMeshes.push(rock);
        }
    }

    createTournamentStands() {
        // Create circular stands around the chess board
        const standRadius = 18;
        const standHeight = 6;
        
        for (let section = 0; section < 8; section++) {
            const stand = BABYLON.MeshBuilder.CreateBox("stand", {
                width: 4,
                height: standHeight,
                depth: 3
            }, this.scene);
            
            const angle = (section * Math.PI * 2) / 8;
            stand.position.x = Math.cos(angle) * standRadius;
            stand.position.z = Math.sin(angle) * standRadius;
            stand.position.y = standHeight / 2;
            
            stand.rotation.y = angle + Math.PI; // Face inward
            
            const material = new BABYLON.StandardMaterial("standMat", this.scene);
            material.diffuseColor = new BABYLON.Color3(0.6, 0.4, 0.2);
            stand.material = material;
            
            this.environmentMeshes.push(stand);
        }
    }

    createNeonWalls() {
        for (let i = 0; i < 4; i++) {
            const wall = BABYLON.MeshBuilder.CreateBox("neonWall", {
                width: 20,
                height: 8,
                depth: 0.5
            }, this.scene);
            
            const positions = [
                new BABYLON.Vector3(0, 4, -15),
                new BABYLON.Vector3(0, 4, 15),
                new BABYLON.Vector3(-15, 4, 0),
                new BABYLON.Vector3(15, 4, 0)
            ];
            
            const rotations = [0, 0, Math.PI / 2, Math.PI / 2];
            
            wall.position = positions[i];
            wall.rotation.y = rotations[i];
            
            const material = new BABYLON.StandardMaterial("neonWallMat", this.scene);
            material.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.2);
            material.emissiveColor = new BABYLON.Color3(0, 0.3, 0.6);
            wall.material = material;
            
            this.environmentMeshes.push(wall);
        }
    }

    createAssemblyLines() {
        for (let i = 0; i < 3; i++) {
            const line = BABYLON.MeshBuilder.CreateBox("assemblyLine", {
                width: 1,
                height: 0.5,
                depth: 20
            }, this.scene);
            
            line.position.x = (i - 1) * 8;
            line.position.y = 0.25;
            line.position.z = 0;
            
            const material = new BABYLON.StandardMaterial("lineMat", this.scene);
            material.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.4);
            line.material = material;
            
            this.environmentMeshes.push(line);
        }
    }

    createStoneArches() {
        for (let i = 0; i < 6; i++) {
            // Create arch using torus
            const arch = BABYLON.MeshBuilder.CreateTorus("arch", {
                diameter: 6,
                thickness: 0.8,
                tessellation: 20
            }, this.scene);
            
            const angle = (i * Math.PI * 2) / 6;
            const radius = 20;
            arch.position.x = Math.cos(angle) * radius;
            arch.position.z = Math.sin(angle) * radius;
            arch.position.y = 3;
            arch.rotation.x = Math.PI / 2;
            arch.rotation.y = angle;
            
            const material = new BABYLON.StandardMaterial("archMat", this.scene);
            material.diffuseColor = new BABYLON.Color3(0.7, 0.6, 0.5);
            arch.material = material;
            
            this.environmentMeshes.push(arch);
        }
    }

    async setupDynamicElements(environment) {
        if (environment.spectators) {
            await this.createSpectators(environment.spectators);
        }
        
        if (environment.dynamicElements) {
            await this.createDynamicElements(environment.dynamicElements);
        }
    }

    async createSpectators(spectatorConfig) {
        for (let i = 0; i < spectatorConfig.count; i++) {
            const spectator = await this.createSpectator(spectatorConfig, i);
            this.spectators.push(spectator);
        }
    }

    async createSpectator(config, index) {
        // Create simple spectator representation
        const spectator = BABYLON.MeshBuilder.CreateCylinder("spectator", {
            height: 1.8,
            diameterTop: 0.3,
            diameterBottom: 0.5,
            tessellation: 8
        }, this.scene);
        
        // Position based on configuration
        const position = this.getSpectatorPosition(config.positions, index, config.count);
        spectator.position = position;
        
        // Add head
        const head = BABYLON.MeshBuilder.CreateSphere("spectatorHead", {
            diameter: 0.3
        }, this.scene);
        head.position.y = 1.1;
        head.parent = spectator;
        
        // Material
        const material = new BABYLON.StandardMaterial("spectatorMat", this.scene);
        material.diffuseColor = new BABYLON.Color3(
            0.3 + Math.random() * 0.4,
            0.3 + Math.random() * 0.4,
            0.3 + Math.random() * 0.4
        );
        spectator.material = material;
        
        // Add animation
        this.addSpectatorAnimation(spectator, config.animations);
        
        return spectator;
    }

    getSpectatorPosition(positionType, index, total) {
        switch (positionType) {
            case 'stands':
                const angle = (index * Math.PI * 2) / total;
                const radius = 15 + Math.random() * 3;
                return new BABYLON.Vector3(
                    Math.cos(angle) * radius,
                    3 + Math.random() * 2,
                    Math.sin(angle) * radius
                );
                
            case 'circular_stands':
                const circleAngle = (index * Math.PI * 2) / total;
                const circleRadius = 16 + (Math.floor(index / 20) * 2);
                return new BABYLON.Vector3(
                    Math.cos(circleAngle) * circleRadius,
                    2 + Math.floor(index / 20) * 1.5,
                    Math.sin(circleAngle) * circleRadius
                );
                
            case 'floating_platforms':
                return new BABYLON.Vector3(
                    (Math.random() - 0.5) * 30,
                    8 + Math.random() * 4,
                    (Math.random() - 0.5) * 30
                );
                
            case 'work_stations':
                return new BABYLON.Vector3(
                    (index % 5 - 2) * 4,
                    1,
                    Math.floor(index / 5) * 4 - 8
                );
                
            default:
                return new BABYLON.Vector3(
                    (Math.random() - 0.5) * 20,
                    1,
                    (Math.random() - 0.5) * 20
                );
        }
    }

    addSpectatorAnimation(spectator, animations) {
        const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
        
        switch (randomAnimation) {
            case 'cheer':
                this.createCheerAnimation(spectator);
                break;
            case 'wave':
                this.createWaveAnimation(spectator);
                break;
            case 'cyber_dance':
                this.createCyberDanceAnimation(spectator);
                break;
            case 'hologram_flicker':
                this.createHologramFlickerAnimation(spectator);
                break;
        }
    }

    createCheerAnimation(spectator) {
        const cheerAnimation = BABYLON.Animation.CreateAndStartAnimation(
            "cheerAnimation",
            spectator,
            "rotation.y",
            30,
            60,
            0,
            Math.PI * 2,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
        );
        
        this.animations.push(cheerAnimation);
    }

    createWaveAnimation(spectator) {
        const waveAnimation = BABYLON.Animation.CreateAndStartAnimation(
            "waveAnimation",
            spectator,
            "position.y",
            30,
            120,
            spectator.position.y,
            spectator.position.y + 0.5,
            BABYLON.Animation.ANIMATIONLOOPMODE_YOYO
        );
        
        this.animations.push(waveAnimation);
    }

    createCyberDanceAnimation(spectator) {
        const danceAnimation = BABYLON.Animation.CreateAndStartAnimation(
            "cyberDanceAnimation",
            spectator,
            "scaling",
            30,
            90,
            new BABYLON.Vector3(1, 1, 1),
            new BABYLON.Vector3(1.1, 0.9, 1.1),
            BABYLON.Animation.ANIMATIONLOOPMODE_YOYO
        );
        
        this.animations.push(danceAnimation);
    }

    createHologramFlickerAnimation(spectator) {
        const flickerAnimation = BABYLON.Animation.CreateAndStartAnimation(
            "hologramFlickerAnimation",
            spectator.material,
            "alpha",
            30,
            60,
            1,
            0.3,
            BABYLON.Animation.ANIMATIONLOOPMODE_YOYO
        );
        
        this.animations.push(flickerAnimation);
    }

    async createDynamicElements(elements) {
        for (const element of elements) {
            await this.createDynamicElement(element);
        }
    }

    async createDynamicElement(elementType) {
        switch (elementType) {
            case 'waving_flags':
                this.createWavingFlags();
                break;
            case 'torch_flames':
                this.createTorchFlames();
                break;
            case 'neon_pulses':
                this.createNeonPulses();
                break;
            case 'moving_conveyor_belts':
                this.createMovingConveyorBelts();
                break;
        }
    }

    createWavingFlags() {
        for (let i = 0; i < 6; i++) {
            const flagPole = BABYLON.MeshBuilder.CreateCylinder("flagPole", {
                height: 8,
                diameter: 0.1
            }, this.scene);
            
            const angle = (i * Math.PI * 2) / 6;
            flagPole.position.x = Math.cos(angle) * 20;
            flagPole.position.z = Math.sin(angle) * 20;
            flagPole.position.y = 4;
            
            const flag = BABYLON.MeshBuilder.CreatePlane("flag", {
                width: 2,
                height: 1.2
            }, this.scene);
            flag.position.x = flagPole.position.x + 1;
            flag.position.z = flagPole.position.z;
            flag.position.y = 6;
            
            // Wave animation
            const waveAnimation = BABYLON.Animation.CreateAndStartAnimation(
                "flagWaveAnimation",
                flag,
                "rotation.z",
                30,
                120,
                0,
                Math.PI / 8,
                BABYLON.Animation.ANIMATIONLOOPMODE_YOYO
            );
            
            this.environmentMeshes.push(flagPole, flag);
            this.animations.push(waveAnimation);
        }
    }

    createTorchFlames() {
        // Create particle system for torch flames
        for (let i = 0; i < 4; i++) {
            const particleSystem = new BABYLON.ParticleSystem("torchFlame", 2000, this.scene);
            
            const positions = [
                new BABYLON.Vector3(-10, 6, -10),
                new BABYLON.Vector3(10, 6, -10),
                new BABYLON.Vector3(-10, 6, 10),
                new BABYLON.Vector3(10, 6, 10)
            ];
            
            particleSystem.particleTexture = new BABYLON.Texture("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==", this.scene);
            particleSystem.emitter = positions[i];
            
            particleSystem.minEmitBox = new BABYLON.Vector3(-0.2, 0, -0.2);
            particleSystem.maxEmitBox = new BABYLON.Vector3(0.2, 0, 0.2);
            
            particleSystem.color1 = new BABYLON.Color4(1, 0.5, 0, 1);
            particleSystem.color2 = new BABYLON.Color4(1, 0, 0, 1);
            particleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0);
            
            particleSystem.minSize = 0.1;
            particleSystem.maxSize = 0.3;
            
            particleSystem.minLifeTime = 0.5;
            particleSystem.maxLifeTime = 1.0;
            
            particleSystem.emitRate = 1000;
            
            particleSystem.direction1 = new BABYLON.Vector3(-0.2, 1, -0.2);
            particleSystem.direction2 = new BABYLON.Vector3(0.2, 1, 0.2);
            
            particleSystem.minEmitPower = 1;
            particleSystem.maxEmitPower = 3;
            
            particleSystem.gravity = new BABYLON.Vector3(0, -1, 0);
            
            particleSystem.start();
        }
    }

    createNeonPulses() {
        // Create pulsing neon effects on walls
        this.environmentMeshes.forEach(mesh => {
            if (mesh.name.includes('neonWall')) {
                const pulseAnimation = BABYLON.Animation.CreateAndStartAnimation(
                    "neonPulseAnimation",
                    mesh.material,
                    "emissiveColor",
                    30,
                    120,
                    new BABYLON.Color3(0, 0.3, 0.6),
                    new BABYLON.Color3(0, 0.8, 1),
                    BABYLON.Animation.ANIMATIONLOOPMODE_YOYO
                );
                
                this.animations.push(pulseAnimation);
            }
        });
    }

    createMovingConveyorBelts() {
        // Animate conveyor belt textures
        this.environmentMeshes.forEach(mesh => {
            if (mesh.name.includes('assemblyLine')) {
                // Create moving texture effect
                const moveAnimation = BABYLON.Animation.CreateAndStartAnimation(
                    "conveyorMoveAnimation",
                    mesh,
                    "rotation.y",
                    30,
                    360,
                    0,
                    Math.PI * 2,
                    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
                );
                
                this.animations.push(moveAnimation);
            }
        });
    }

    async loadAllEnvironments() {
        console.log('Loading all chess environments...');
        
        // All environments are created on-demand
        for (const [envId, env] of this.environments) {
            console.log(`Environment ready: ${env.name} (${env.type})`);
        }
        
        console.log('All environments loaded successfully');
    }

    getCurrentEnvironment() {
        return this.environments.get(this.currentEnvironment);
    }

    getAllEnvironments() {
        return Array.from(this.environments.values());
    }

    dispose() {
        this.clearCurrentEnvironment();
        this.environments.clear();
    }
}