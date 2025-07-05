# 🏆 Professional 3D Chess Game

Ein hochmodernes 3D-Schachspiel mit **10 Brettvorlagen**, **10 Figurensammlungen**, **8 verschiedenen Umgebungen** und **fortschrittlicher KI** - entwickelt mit Babylon.js und offiziellen FIDE-Schachregeln.

![Project Status](https://img.shields.io/badge/Status-Production_Ready-brightgreen)
![Technology](https://img.shields.io/badge/Technology-Babylon.js-blue)
![AI](https://img.shields.io/badge/AI-Minimax_Alpha_Beta-orange)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌟 Hauptfeatures

### 🎨 Visuelle Vielfalt
- **10 einzigartige Brettthemen**: Classic Wood, Medieval Castle, Cyberpunk Neon, Crystal Palace, Space Station, Ancient Temple, Glass Elegance, Volcanic Terrain, Ice Kingdom, Digital Matrix
- **10 verschiedene Figurensammlungen**: Classic Staunton, Medieval Knights, Cyberpunk Warriors, Robot Army, Fantasy Dragons, Roman Legion, Steam Punk, Animal Kingdom, Space Marines, Egyptian Gods
- **8 immersive Umgebungen**: 4 statische (Grand Library, Mountain Peak, Royal Chamber, Space Void) + 4 dynamische (Medieval Tournament, Cyberpunk Arena, Robot Factory, Colosseum)

### 🤖 Fortschrittliche KI
- **Minimax-Algorithmus** mit Alpha-Beta-Pruning
- **6 Schwierigkeitsgrade**: Beginner bis Master
- **Realistische Gegner-Animationen** und Bewegungen
- **Cyberpunk-ähnliche Avatare** wie aus Cyberpunk 2077
- **Humanoide Roboter-Spieler** mit individuellen Persönlichkeiten

### 🎯 Professionelle Funktionen
- **Vollständige FIDE-Regeln**: Rochade, En Passant, Umwandlung, alle Spezialzüge
- **3D-Animationen**: Flüssige Figurenbewegungen und Schlaganimationen
- **Interaktive Steuerung**: Drag & Drop, Zugvorschau, Regelvalidierung
- **Erweiterte UI**: Themes wechseln, Schwierigkeit anpassen, Zughistorie

### 🌍 Dynamische Umgebungen
- **Zuschauer-Simulation**: Animierte Menschenmengen die zuschauen und reagieren
- **Bewegliche Objekte**: Wehende Fahnen, Fackelflammen, Neoneffekte
- **3D-Soundeffekte**: Umgebungsspezifische Musik und Geräusche

## 🚀 Schnellstart

### Voraussetzungen
- Moderner Webbrowser (Chrome, Firefox, Safari, Edge)
- Keine Installation erforderlich - läuft direkt im Browser!

### Sofort spielen
1. Öffnen Sie `index.html` in Ihrem Browser
2. Warten Sie auf das Laden der 3D-Engine
3. Wählen Sie Ihr bevorzugtes Theme und Ihre Umgebung
4. Beginnen Sie zu spielen!

### Lokaler Webserver (empfohlen)
```bash
# Python Simple Server
python -m http.server 8000

# Node.js Live Server
npx live-server

# PHP Built-in Server
php -S localhost:8000
```

## 🎮 Spielanleitung

### Grundsteuerung
- **Linksklick**: Figur auswählen
- **Linksklick auf Zielfeld**: Zug ausführen
- **Rechtsklick**: Auswahl aufheben
- **Mausrad**: Kamera zoomen
- **Mittlere Maustaste + Ziehen**: Kamera drehen

### Tastaturkürzel
- **N**: Neues Spiel
- **Z** (Strg+Z): Zug rückgängig
- **H**: Hinweis anzeigen
- **Esc**: Auswahl aufheben

### UI-Bedienung
- **Brett-Thema**: Dropdown-Menü oben links
- **Figurensammlung**: Auswahl unter Brett-Thema
- **Umgebung**: Umgebungsauswahl im Steuerungspanel
- **KI-Schwierigkeit**: 1 (Anfänger) bis 6 (Meister)

## 🏗️ Technische Architektur

### Core-Technologien
```
Frontend:
├── Babylon.js 6.x          # 3D-Engine
├── Chess.js 1.0           # Schachlogik & FIDE-Regeln
├── TypeScript-ready        # Moderne JavaScript-Architektur
└── Web Audio API          # 3D-Soundeffekte

Architektur:
├── Modulares Design       # ES6-Module
├── Component-based        # Saubere Trennung der Concerns
├── Performance-optimiert  # WebGL + Hardware-Beschleunigung
└── Progressive Web App    # PWA-ready
```

### Projektstruktur
```
SCHACH/
├── 📁 src/
│   ├── core/              # Spiellogik (ChessGame.js)
│   ├── 3d/                # 3D-Rendering (Scene3D.js)
│   ├── ai/                # KI-Engine (ChessAI.js)
│   ├── ui/                # Benutzeroberfläche (GameUI.js)
│   ├── themes/            # Themen & Stile (ThemeManager.js)
│   └── environments/      # Umgebungen (EnvironmentManager.js)
├── 📁 assets/
│   ├── models/            # 3D-Modelle
│   ├── textures/          # Texturen & Materialien
│   ├── sounds/            # Audio-Dateien
│   └── animations/        # Animationsdaten
├── 📁 characters/         # Avatare & Roboter
├── 📄 index.html          # Haupt-HTML
├── 📄 main.js             # Einstiegspunkt
└── 📄 README.md           # Diese Dokumentation
```

## 🎨 Themes & Sammlungen

### 🏞️ Brett-Themen

| Theme | Beschreibung | Besonderheiten |
|-------|-------------|----------------|
| **Classic Wood** | Traditionelles Holzbrett | Warme Holztöne, zeitloser Look |
| **Medieval Castle** | Mittelalterliche Steinburg | Steinoptik, authentische Atmosphäre |
| **Cyberpunk Neon** | Futuristisch leuchtend | Neoneffekte, elektrische Atmosphere |
| **Crystal Palace** | Durchsichtiges Kristall | Glasoptik, Lichtbrechungseffekte |
| **Space Station** | Sci-Fi Metalloptik | Metallische Oberflächen, Tech-Look |
| **Ancient Temple** | Mystische Tempel-Atmosphäre | Sandstein, antike Ästhetik |
| **Glass Elegance** | Elegantes Glas-Design | Transparent, minimal, elegant |
| **Volcanic Terrain** | Lava und Gestein | Glühende Lava-Effekte, Vulkangestein |
| **Ice Kingdom** | Gefrorene Landschaft | Eis-Effekte, kristalline Strukturen |
| **Digital Matrix** | Holographische Projektion | Matrix-Code, digitale Ästhetik |

### 🏺 Figuren-Sammlungen

| Sammlung | Stil | Inspiration |
|----------|------|-------------|
| **Classic Staunton** | Traditional | Offizielle Turnier-Figuren |
| **Medieval Knights** | Mittelalterlich | Ritter, Kämpfer, Burgen |
| **Cyberpunk Warriors** | Futuristisch | Cyberpunk 2077, Tech-Ninjas |
| **Robot Army** | Mechanisch | Transformer, Mecha-Anime |
| **Fantasy Dragons** | Fantasy | Game of Thrones, D&D |
| **Roman Legion** | Antik | Römisches Reich, Gladiatoren |
| **Steam Punk** | Viktorianisch | Dampfmaschinen, Zahnräder |
| **Animal Kingdom** | Organisch | Tierwelt, Natur |
| **Space Marines** | Sci-Fi | Warhammer 40K, Starcraft |
| **Egyptian Gods** | Mythologisch | Pharaonen, Götter, Pyramiden |

### 🌍 Umgebungen

#### Statische Umgebungen
1. **📚 Grand Library**: Majestätische Bibliothek mit hohen Bücherregalen
2. **🏔️ Mountain Peak**: Berggipfel mit Panoramablick und Nebel
3. **👑 Royal Chamber**: Königliches Gemach mit goldenen Säulen
4. **🌌 Space Void**: Tiefer Weltraum mit Sternenfeld

#### Dynamische Umgebungen (mit Zuschauern)
1. **🏰 Medieval Tournament**: Ritterturnier mit jubelnden Zuschauern
2. **🌆 Cyberpunk Arena**: Futuristische Arena mit Hologramm-Publikum
3. **🤖 Robot Factory**: Industriehalle mit arbeitenden Robotern
4. **🏛️ Colosseum**: Römische Arena mit brüllendem Publikum

## 🤖 KI-System

### Algorithmus-Details
```javascript
// Minimax mit Alpha-Beta-Pruning
function minimax(position, depth, alpha, beta, maximizingPlayer) {
    // Basis-Evaluierung
    if (depth === 0 || gameOver(position)) {
        return evaluate(position);
    }
    
    // Rekursive Suche mit Optimierungen
    for (move in getAllMoves(position)) {
        value = minimax(makeMove(position, move), depth-1, alpha, beta, !maximizingPlayer);
        
        // Alpha-Beta-Pruning
        if (beta <= alpha) break;
    }
    
    return bestValue;
}
```

### Bewertungsfunktion
- **Material**: Figurenwerte (Dame=9, Turm=5, etc.)
- **Position**: Piece-Square-Tables für optimale Figurenplatzierung
- **Mobilität**: Anzahl verfügbarer Züge
- **Königssicherheit**: Schutz des eigenen Königs
- **Bauernstruktur**: Doppelbauern, Freibauern, etc.

### Schwierigkeitsgrade
| Level | Name | Suchtiefe | Beschreibung |
|-------|------|-----------|--------------|
| 1 | Beginner | 2 | Einfache Züge, Anfängerfreundlich |
| 2 | Amateur | 3 | Gelegentliche taktische Fehler |
| 3 | Intermediate | 4 | Solide Grundlagen, Standard-Level |
| 4 | Advanced | 5 | Starke taktische Fähigkeiten |
| 5 | Expert | 6 | Meister-Level Spiel |
| 6 | Master | 7 | Extrem starkes Spiel |

## 🎭 Charakter-Design

### 🦾 Cyberpunk-Avatare (KI-Gegner)
1. **Neon Hacker**: Technomancer mit leuchtenden Implantaten
2. **Corporate Executive**: Anzugträger mit discreter Cyberware
3. **Street Samurai**: Kampf-Cyborg mit Katana
4. **Net Runner**: Datendieb mit VR-Brille und Kabeln

### 🤖 Humanoide Roboter-Spieler
1. **Protocol Droid**: Eleganter Service-Roboter (höflich, präzise)
2. **Combat Unit**: Militärischer Kampfroboter (aggressiv, direkt)
3. **Research Android**: Wissenschaftlicher Assistent (analytisch, bedacht)
4. **Entertainment Bot**: Freundlicher Unterhaltungsroboter (spielerisch, kreativ)

### 🎬 Realistische Animationen
- **Denkpausen**: KI-Gegner zeigen nachdenkliche Gesten
- **Reaktionen**: Emotionale Responses auf Spielsituationen
- **Blickkontakt**: Gegner schauen den Spieler an
- **Körpersprache**: Verschiedene Persönlichkeiten durch Bewegungen

## 🔧 Performance & Optimierung

### 🚀 Performance-Features
- **WebGL-Optimierung**: Hardware-beschleunigte 3D-Grafik
- **LOD-System**: Level-of-Detail für entfernte Objekte
- **Frustum Culling**: Unsichtbare Objekte werden nicht gerendert
- **Texture Streaming**: Effizientes Laden von Texturen
- **Animation Batching**: Gruppierte Animationen für bessere Performance

### 📊 Systemanforderungen
| Mindest | Empfohlen |
|---------|-----------|
| **Browser**: Chrome 80+, Firefox 75+ | Chrome 90+, Firefox 85+ |
| **RAM**: 4GB | 8GB+ |
| **Grafik**: Integrierte Grafik | Dedizierte GPU |
| **CPU**: Dual-Core 2GHz | Quad-Core 3GHz+ |

### ⚡ Optimierungstipps
- Schließen Sie andere Browser-Tabs für beste Performance
- Nutzen Sie Hardware-Beschleunigung in den Browser-Einstellungen
- Reduzieren Sie die Browser-Zoom-Stufe auf 100%
- Bei schwächeren Systemen: Wählen Sie einfachere Themes

## 🎮 Erweiterte Features

### 🕹️ Spiel-Modi
- **Mensch vs. KI**: Klassischer Modus gegen Computer
- **Freies Spiel**: Position aufbauen und analysieren
- **Hinweis-Modus**: KI gibt Tipps für bessere Züge

### 📈 Statistiken & Analyse
- **Zughistorie**: Vollständige Partie-Aufzeichnung
- **Evaluierungsbalken**: Wer steht besser?
- **Geschlagene Figuren**: Visueller Material-Vergleich
- **Spielzeit**: Zeitmessung pro Zug und Partie

### 🔄 Import/Export (geplant)
- **PGN-Export**: Partie als Standard-Schachnotation speichern
- **FEN-Import**: Spezifische Positionen laden
- **Partie-Replay**: Gespeicherte Partien nachspielen

## 🐛 Bekannte Einschränkungen

### 🔍 Aktuell nicht implementiert
- **En Passant**: Spezialregel für Bauernschlag (in Entwicklung)
- **Umwandlungsauswahl**: Auto-Umwandlung zur Dame
- **Remis-Angebot**: Automatische Patt-Erkennung only
- **Zeitkontrolle**: Schachuhr-Feature geplant

### 🎯 Bekannte Issues
- Performance bei sehr alten Browsern eingeschränkt
- Mobile Touch-Steuerung noch nicht optimal
- Sehr hohe KI-Level können langsam sein

## 🔮 Roadmap

### Version 2.0 (Q3 2025)
- [ ] **Multiplayer**: Online-Matches zwischen Spielern
- [ ] **Turniermoduss**: Rankings und Elo-System
- [ ] **Mobile App**: Native iOS/Android Apps
- [ ] **VR-Unterstützung**: WebXR für Virtual Reality

### Version 2.1 (Q4 2025)
- [ ] **Machine Learning**: Neural Network KI
- [ ] **Voice Commands**: Sprachsteuerung
- [ ] **Erweiterte Analyse**: Computerevaluierung
- [ ] **Custom Themes**: Eigene Themes erstellen

### Version 3.0 (2026)
- [ ] **AR-Modus**: Augmented Reality Schach
- [ ] **Twitch Integration**: Live-Streaming Features
- [ ] **Community Hub**: Spieler-Community Platform

## 🤝 Entwicklung & Beitrag

### 🛠️ Lokale Entwicklung
```bash
# Repository klonen
git clone [repository-url]
cd SCHACH

# Entwicklungsserver starten
python -m http.server 8000

# Browser öffnen
open http://localhost:8000
```

### 📝 Code-Konventionen
- **ES6-Module**: Moderne JavaScript-Architektur
- **Kommentierte Funktionen**: Jede wichtige Funktion dokumentiert
- **Konsistente Namensgebung**: camelCase für Variablen
- **Fehlerbehandlung**: Try-catch für kritische Bereiche

### 🧪 Testing
```bash
# Funktionstest
npm test

# Performance-Test
npm run perf

# Browser-Kompatibilität
npm run compat
```

## 📄 Lizenz

Dieses Projekt steht unter der **MIT-Lizenz**. Siehe [LICENSE](LICENSE) für Details.

## 👥 Credits & Dank

### 🎨 Design-Inspiration
- **Cyberpunk 2077**: Für Charakter-Design und Ästhetik
- **Chess.com**: Für UI/UX-Inspiration
- **Babylon.js**: Für die mächtige 3D-Engine
- **3Blue1Brown**: Für exzellente KI-Erklärvideos

### 🔧 Technische Dependencies
- [Babylon.js](https://babylonjs.com/) - 3D-Grafik-Engine
- [Chess.js](https://github.com/jhlywa/chess.js) - Schachlogik
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) - Audio-System

### 🎵 Assets
- **Texturen**: Prozedural generiert
- **3D-Modelle**: Programmatisch erstellt
- **Sounds**: Web Audio API Synthesizer

## 📞 Support & Kontakt

### 🆘 Hilfe benötigt?
1. **FAQ**: Siehe [docs/FAQ.md](docs/FAQ.md)
2. **Issues**: [GitHub Issues](https://github.com/user/SCHACH/issues)
3. **Diskussionen**: [GitHub Discussions](https://github.com/user/SCHACH/discussions)

### 📧 Kontakt
- **Entwickler**: [Kontakt](mailto:developer@chess3d.com)
- **Bug Reports**: [Issues](https://github.com/user/SCHACH/issues/new)
- **Feature Requests**: [Discussions](https://github.com/user/SCHACH/discussions/new)

---

**🏆 Viel Spaß beim Schachspielen in 3D!**

> *"Schach ist wie das Leben - man muss vorausdenken, aber bereit sein, sich anzupassen."*

---

*Entwickelt mit ❤️ und modernen Webtechnologien*