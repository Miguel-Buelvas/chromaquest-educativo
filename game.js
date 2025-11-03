// ChromaQuest: El Mundo sin Color - Lógica del Juego
class ChromaQuest {
    constructor() {
        this.currentLevel = 1;
        this.score = 0;
        this.unlockedColors = [];
        this.gameSettings = {
            musicVolume: 70,
            sfxVolume: 80,
            voiceEnabled: true,
            colorblindMode: false
        };
        this.levels = [
            { name: "El Bosque Gris", color: "green", mechanic: "memory" },
            { name: "El Lago Oscuro", color: "blue", mechanic: "mixing" },
            { name: "El Desierto Sin Sol", color: "red", mechanic: "maze" },
            { name: "La Montaña de Sombras", color: "orange", mechanic: "shape" },
            { name: "El Valle del Ritmo", color: "purple", mechanic: "rhythm" },
            { name: "El Cielo Sin Arcoíris", color: "yellow", mechanic: "combination" },
            { name: "El Castillo de Cristal", color: "pink", mechanic: "visual" },
            { name: "El Templo del Tiempo", color: "turquoise", mechanic: "timed" },
            { name: "El Laberinto de Espejos", color: "white", mechanic: "reflection" },
            { name: "El Trono del Rey Gris", color: "rainbow", mechanic: "boss" }
        ];
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.updateColorPalette();
        this.animateTitle();
    }

    loadSettings() {
        const saved = localStorage.getItem('chromaquest-settings');
        if (saved) {
            this.gameSettings = { ...this.gameSettings, ...JSON.parse(saved) };
        }
        this.applySettings();
    }

    saveSettings() {
        localStorage.setItem('chromaquest-settings', JSON.stringify(this.gameSettings));
    }

    applySettings() {
        document.getElementById('musicVolume').value = this.gameSettings.musicVolume;
        document.getElementById('sfxVolume').value = this.gameSettings.sfxVolume;
        document.getElementById('voiceToggle').classList.toggle('active', this.gameSettings.voiceEnabled);
        document.getElementById('colorblindToggle').classList.toggle('active', this.gameSettings.colorblindMode);
    }

    setupEventListeners() {
        // Controles de volumen
        document.getElementById('musicVolume').addEventListener('input', (e) => {
            this.gameSettings.musicVolume = e.target.value;
            this.saveSettings();
        });
        document.getElementById('sfxVolume').addEventListener('input', (e) => {
            this.gameSettings.sfxVolume = e.target.value;
            this.saveSettings();
        });
        // Cerrar modales con tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    animateTitle() {
        // Animación del título principal
        anime({
            targets: '.game-title',
            scale: [0.8, 1],
            opacity: [0, 1],
            duration: 1000,
            easing: 'easeOutElastic(1, .8)',
            delay: 500
        });
        // Animación de las formas flotantes
        anime({
            targets: '.shape',
            translateY: [-20, 20],
            rotate: [0, 360],
            duration: 4000,
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutSine',
            delay: anime.stagger(500)
        });
    }

    startGame() {
        document.getElementById('mainMenu').style.display = 'none';
        document.getElementById('gameLevel').style.display = 'block';
        this.loadLevel(this.currentLevel);
    }

    loadLevel(levelNum) {
        const level = this.levels[levelNum - 1];
        document.getElementById('levelTitle').textContent = `Nivel ${levelNum}: ${level.name}`;
        const gameArea = document.getElementById('gameArea');
        gameArea.innerHTML = '';
        switch (level.mechanic) {
            case 'memory':
                this.createMemoryGame(gameArea);
                break;
            case 'mixing':
                this.createMixingGame(gameArea);
                break;
            case 'maze':
                this.createMazeGame(gameArea);
                break;
            case 'shape':
                this.createShapeGame(gameArea);
                break;
            case 'rhythm':
                this.createRhythmGame(gameArea);
                break;
            default:
                this.createMemoryGame(gameArea);
        }
        this.playSound('levelStart');
        this.showInstructions(level.mechanic);
    }

    createMemoryGame(container) {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
        const sequence = this.generateSequence(3 + this.currentLevel);
        let playerSequence = [];
        let showingSequence = true;
        const gameUI = document.createElement('div');
        gameUI.className = 'memory-game';
        gameUI.innerHTML = `
            <div class="memory-instructions">
                <h3>🧠 Memoriza la secuencia de colores</h3>
                <p>Observa con atención el orden de los colores</p>
            </div>
            <div class="sequence-display" id="sequenceDisplay"></div>
            <div class="color-grid" id="colorGrid"></div>
            <div class="sequence-input" id="sequenceInput"></div>
        `;
        container.appendChild(gameUI);
        // Mostrar secuencia
        this.showSequence(sequence, colors);
        // Crear botones de colores
        const colorGrid = document.getElementById('colorGrid');
        colors.forEach((color, index) => {
            const btn = document.createElement('button');
            btn.className = 'color-btn';
            btn.style.backgroundColor = color;
            btn.onclick = () => this.addToSequence(color, playerSequence, sequence);
            colorGrid.appendChild(btn);
        });
        // Aplicar estilos
        this.applyMemoryGameStyles();
    }

    showSequence(sequence, colors) {
        const display = document.getElementById('sequenceDisplay');
        let i = 0;
        const showNext = () => {
            if (i < sequence.length) {
                display.style.backgroundColor = colors[sequence[i]];
                display.textContent = `Color ${i + 1}`;
                this.playSound('beep');
                setTimeout(() => {
                    display.style.backgroundColor = 'transparent';
                    display.textContent = '';
                    i++;
                    setTimeout(showNext, 300);
                }, 1000);
            } else {
                document.getElementById('sequenceDisplay').innerHTML = '<h3>¡Ahora tú! Repite la secuencia</h3>';
            }
        };
        showNext();
    }

    addToSequence(color, playerSequence, correctSequence) {
        playerSequence.push(color);
        this.playSound('click');
        // Mostrar color seleccionado
        const input = document.getElementById('sequenceInput');
        const dot = document.createElement('div');
        dot.className = 'sequence-dot';
        dot.style.backgroundColor = color;
        input.appendChild(dot);
        // Verificar si completó la secuencia
        if (playerSequence.length === correctSequence.length) {
            setTimeout(() => {
                this.checkSequence(playerSequence, correctSequence);
            }, 500);
        }
    }

    checkSequence(playerSequence, correctSequence) {
        const correctColors = correctSequence.map(i => ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'][i]);
        if (JSON.stringify(playerSequence) === JSON.stringify(correctColors)) {
            this.levelComplete();
        } else {
            this.showError('Secuencia incorrecta. ¡Inténtalo de nuevo!');
            setTimeout(() => {
                this.loadLevel(this.currentLevel);
            }, 2000);
        }
    }

    generateSequence(length) {
        return Array.from({ length }, () => Math.floor(Math.random() * 6));
    }

    createMixingGame(container) {
        const colorMixtureCombinations = {
            'green': ['blue', 'yellow'],
            'orange': ['red', 'yellow'],
            'purple': ['red', 'blue']
        };
        const targetColors = Object.keys(colorMixtureCombinations);
        const targetColor = targetColors[Math.floor(Math.random() * targetColors.length)];
        const gameUI = document.createElement('div');
        gameUI.className = 'mixing-game';
        gameUI.innerHTML = `
            <div class="mixing-instructions">
                <h3>🎨 Mezcla los colores primarios</h3>
                <p>Arrastra DOS colores primarios para crear un color secundario</p>
                <div class="target-color" id="targetColor">Crea el color: ${this.getColorName(targetColor).toUpperCase()}</div>
            </div>
            <div class="mixing-area">
                <div class="color-sources">
                    <div class="color-source" draggable="true" data-color="red" style="background: #FF0000;">🔴</div>
                    <div class="color-source" draggable="true" data-color="yellow" style="background: #FFFF00;">🟡</div>
                    <div class="color-source" draggable="true" data-color="blue" style="background: #0000FF;">🔵</div>
                </div>
                <div class="mixing-pot" id="mixingPot" data-target="${targetColor}">
                    <div class="pot-visual">🥣</div>
                    <p>Arrastra DOS colores aquí</p>
                </div>
                <div class="result-display" id="resultDisplay"></div>
            </div>
        `;
        container.appendChild(gameUI);
        this.setupMixingGame();
        this.applyMixingGameStyles();
    }

    setupMixingGame() {
        const sources = document.querySelectorAll('.color-source');
        const pot = document.getElementById('mixingPot');
        let mixedColors = [];
        const resetPot = () => {
            mixedColors = [];
            pot.style.background = 'transparent';
            pot.style.backgroundColor = 'transparent';
            document.getElementById('resultDisplay').innerHTML = '<p>Colores mezclados: 0/2</p>';
        };
        sources.forEach(source => {
            source.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('color', e.target.dataset.color);
            });
        });
        pot.addEventListener('dragover', (e) => {
            e.preventDefault();
            pot.style.backgroundColor = '#f0f0f0';
        });
        pot.addEventListener('dragleave', () => {
            if (mixedColors.length === 0) pot.style.backgroundColor = 'transparent';
        });
        pot.addEventListener('drop', (e) => {
            e.preventDefault();
            if (mixedColors.length >= 2) return; // ya no acepta más
            const color = e.dataTransfer.getData('color');
            if (mixedColors.includes(color)) return; // evitar duplicados
            mixedColors.push(color);
            this.playSound('drop');
            if (mixedColors.length === 1) {
                pot.style.backgroundColor = color;
            } else if (mixedColors.length === 2) {
                const gradient = `linear-gradient(45deg, ${mixedColors[0]}, ${mixedColors[1]})`;
                pot.style.background = gradient;
                pot.style.backgroundColor = ''; // clear solid background
            }
            document.getElementById('resultDisplay').innerHTML = `<p>Colores mezclados: ${mixedColors.length}/2</p>`;
            if (mixedColors.length === 2) {
                setTimeout(() => {
                    this.checkMixture([...mixedColors], pot.dataset.target);
                    resetPot(); // limpiar después de verificar
                }, 1000);
            }
        });
    }

    checkMixture(colors, targetColor) {
        const colorMixtureCombinations = {
            'green': ['blue', 'yellow'],
            'orange': ['red', 'yellow'],
            'purple': ['red', 'blue']
        };
        const required = colorMixtureCombinations[targetColor];
        // Orden independiente
        const matches = required.every(c => colors.includes(c)) && colors.length === 2;
        if (matches) {
            this.playSound('success');
            this.levelComplete();
        } else {
            this.showError(`¡Mezcla incorrecta! Necesitas crear ${this.getColorName(targetColor)}.`);
            setTimeout(() => {
                this.loadLevel(this.currentLevel);
            }, 3000);
        }
    }

    getColorName(color) {
        const colorNames = {
            'green': 'Verde',
            'orange': 'Naranja', 
            'purple': 'Morado',
            'red': 'Rojo',
            'blue': 'Azul',
            'yellow': 'Amarillo'
        };
        return colorNames[color] || color;
    }

    createMazeGame(container) {
        const gameUI = document.createElement('div');
        gameUI.className = 'maze-game';
        gameUI.innerHTML = `
            <div class="maze-instructions">
                <h3>🗺️ Encuentra la salida del laberinto</h3>
                <p>Usa las flechas para moverte y encuentra la puerta roja</p>
            </div>
            <div class="maze-container" id="mazeContainer">
                <div class="maze-grid" id="mazeGrid"></div>
                <div class="player" id="player">🧙‍♀️</div>
            </div>
            <div class="maze-controls">
                <button class="maze-btn" onclick="game.movePlayer('up')">↑</button>
                <div>
                    <button class="maze-btn" onclick="game.movePlayer('left')">←</button>
                    <button class="maze-btn" onclick="game.movePlayer('down')">↓</button>
                    <button class="maze-btn" onclick="game.movePlayer('right')">→</button>
                </div>
            </div>
        `;
        container.appendChild(gameUI);
        this.generateMaze();
        this.applyMazeGameStyles();
    }

    generateMaze() {
        const maze = [
            [1,1,1,1,1,1,1,1],
            [1,0,0,0,1,0,0,1],
            [1,0,1,0,1,0,1,1],
            [1,0,1,0,0,0,0,1],
            [1,0,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1]
        ];
        const grid = document.getElementById('mazeGrid');
        grid.innerHTML = '';
        for (let y = 0; y < maze.length; y++) {
            for (let x = 0; x < maze[y].length; x++) {
                const cell = document.createElement('div');
                cell.className = 'maze-cell';
                cell.dataset.x = x;
                cell.dataset.y = y;
                if (maze[y][x] === 1) {
                    cell.classList.add('wall');
                } else {
                    cell.classList.add('path');
                }
                if (x === 6 && y === 5) {
                    cell.classList.add('exit');
                    cell.innerHTML = '🚪';
                }
                grid.appendChild(cell);
            }
        }
        this.mazeData = maze;
        this.playerPos = { x: 1, y: 1 };
        this.updatePlayerPosition();
    }

    movePlayer(direction) {
        const { x, y } = this.playerPos;
        let newX = x;
        let newY = y;
        switch (direction) {
            case 'up': newY--; break;
            case 'down': newY++; break;
            case 'left': newX--; break;
            case 'right': newX++; break;
        }
        if (this.mazeData[newY] && this.mazeData[newY][newX] === 0) {
            this.playerPos = { x: newX, y: newY };
            this.updatePlayerPosition();
            this.playSound('move');
            // Verificar si llegó a la salida
            if (newX === 6 && newY === 5) {
                setTimeout(() => {
                    this.levelComplete();
                }, 500);
            }
        } else {
            this.playSound('bump');
        }
    }

    updatePlayerPosition() {
        const player = document.getElementById('player');
        const cellSize = 40; // Tamaño de cada celda
        player.style.left = (this.playerPos.x * cellSize) + 'px';
        player.style.top = (this.playerPos.y * cellSize) + 'px';
    }

    createShapeGame(container) {
        const gameUI = document.createElement('div');
        gameUI.className = 'shape-game';
        gameUI.innerHTML = `
            <div class="shape-instructions">
                <h3>🧩 Encuentra la forma correcta</h3>
                <p>Selecciona la forma que coincide con el patrón de colores</p>
                <div class="target-pattern" id="targetPattern"></div>
            </div>
            <div class="shape-options" id="shapeOptions"></div>
        `;
        container.appendChild(gameUI);
        this.setupShapeGame();
        this.applyShapeGameStyles();
    }

    setupShapeGame() {
        const patterns = [
            { shape: '🔺', colors: ['red', 'blue', 'yellow'] },
            { shape: '⭕', colors: ['green', 'orange', 'purple'] },
            { shape: '⭐', colors: ['yellow', 'red', 'blue'] },
            { shape: '🔷', colors: ['blue', 'green', 'orange'] }
        ];
        const correctPattern = patterns[Math.floor(Math.random() * patterns.length)];
        // Mostrar patrón objetivo
        const target = document.getElementById('targetPattern');
        target.innerHTML = `
            <div class="pattern-display">
                <div class="pattern-shape">${correctPattern.shape}</div>
                <div class="pattern-colors">
                    ${correctPattern.colors.map(color => `<div class="color-sample" style="background: ${color};"></div>`).join('')}
                </div>
            </div>
        `;
        // Crear opciones
        const options = document.getElementById('shapeOptions');
        const shuffledPatterns = [...patterns].sort(() => Math.random() - 0.5);
        shuffledPatterns.forEach(pattern => {
            const option = document.createElement('div');
            option.className = 'shape-option';
            option.innerHTML = `
                <div class="option-shape">${pattern.shape}</div>
                <div class="option-colors">
                    ${pattern.colors.map(color => `<div class="color-sample" style="background: ${color};"></div>`).join('')}
                </div>
            `;
            option.onclick = () => {
                if (pattern === correctPattern) {
                    this.playSound('success');
                    this.levelComplete();
                } else {
                    this.playSound('error');
                    this.showError('¡Forma incorrecta! Intenta de nuevo.');
                }
            };
            options.appendChild(option);
        });
    }

    createRhythmGame(container) {
        const gameUI = document.createElement('div');
        gameUI.className = 'rhythm-game';
        gameUI.innerHTML = `
            <div class="rhythm-instructions">
                <h3>🎵 ¡Toca al ritmo!</h3>
                <p>Toca los botones cuando las notas lleguen al centro</p>
            </div>
            <div class="rhythm-track" id="rhythmTrack">
                <div class="track-line"></div>
                <div class="hit-zone"></div>
            </div>
            <div class="rhythm-controls">
                <button class="rhythm-btn" onclick="game.hitNote(0)">🔴</button>
                <button class="rhythm-btn" onclick="game.hitNote(1)">🔵</button>
                <button class="rhythm-btn" onclick="game.hitNote(2)">🟡</button>
                <button class="rhythm-btn" onclick="game.hitNote(3)">🟢</button>
            </div>
        `;
        container.appendChild(gameUI);
        this.startRhythmGame();
        this.applyRhythmGameStyles();
    }

    startRhythmGame() {
        this.notes = [];
        this.score = 0;
        this.rhythmActive = true;
        const spawnNote = () => {
            if (!this.rhythmActive) return;
            const track = document.getElementById('rhythmTrack');
            const note = document.createElement('div');
            note.className = 'rhythm-note';
            note.style.left = Math.random() * 300 + 'px';
            track.appendChild(note);
            this.notes.push({
                element: note,
                position: 0,
                active: true
            });
            setTimeout(spawnNote, 1000 + Math.random() * 1000);
        };
        this.updateRhythmGame();
        spawnNote();
        // Terminar el juego después de 30 segundos
        setTimeout(() => {
            this.rhythmActive = false;
            if (this.score >= 10) {
                this.levelComplete();
            } else {
                this.showError('¡Necesitas más puntos! Intenta de nuevo.');
            }
        }, 30000);
    }

    updateRhythmGame() {
        if (!this.rhythmActive) return;
        this.notes.forEach((note, index) => {
            if (note.active) {
                note.position += 2;
                note.element.style.top = note.position + 'px';
                if (note.position > 400) {
                    note.element.remove();
                    note.active = false;
                }
            }
        });
        this.notes = this.notes.filter(note => note.active);
        requestAnimationFrame(() => this.updateRhythmGame());
    }

    hitNote(lane) {
        const hitNotes = this.notes.filter(note => {
            const noteLane = parseInt(note.element.style.left) / 75;
            return Math.abs(noteLane - lane) < 1 && note.position > 350 && note.position < 400;
        });
        if (hitNotes.length > 0) {
            const note = hitNotes[0];
            note.element.remove();
            note.active = false;
            this.score++;
            this.playSound('hit');
            // Mostrar efecto visual
            this.showHitEffect(lane);
        } else {
            this.playSound('miss');
        }
    }

    showHitEffect(lane) {
        const effect = document.createElement('div');
        effect.className = 'hit-effect';
        effect.style.left = (lane * 75) + 'px';
        document.getElementById('rhythmTrack').appendChild(effect);
        setTimeout(() => {
            effect.remove();
        }, 500);
    }

    levelComplete() {
        const currentLevelData = this.levels[this.currentLevel - 1];
        // Desbloquear color
        if (!this.unlockedColors.includes(currentLevelData.color)) {
            this.unlockedColors.push(currentLevelData.color);
            this.updateColorPalette();
        }
        // Añadir puntos
        this.score += 100;
        document.getElementById('scoreDisplay').textContent = `Puntos: ${this.score}`;
        // Mostrar modal de victoria
        this.showVictoryModal();
        // Guardar progreso
        this.saveProgress();
        this.playSound('victory');
    }

    showVictoryModal() {
        const modal = document.getElementById('victoryModal');
        modal.style.display = 'flex';
        // Animación de victoria
        anime({
            targets: '.modal-content',
            scale: [0.5, 1],
            opacity: [0, 1],
            duration: 500,
            easing: 'easeOutBack'
        });
    }

    nextLevel() {
        this.closeAllModals();
        if (this.currentLevel < this.levels.length) {
            this.currentLevel++;
            this.loadLevel(this.currentLevel);
        } else {
            this.showGameComplete();
        }
    }

    showGameComplete() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>¡Felicidades! 🏆</h2>
                <p>¡Has restaurado todos los colores del mundo mágico!</p>
                <p>Lúa y todos los habitantes del reino te lo agradecen.</p>
                <p><strong>Puntuación Final: ${this.score} puntos</strong></p>
                <button class="modal-btn" onclick="location.reload()">Jugar de Nuevo</button>
            </div>
        `;
        document.body.appendChild(modal);
        this.playSound('gameComplete');
    }

    showError(message) {
        // Crear notificación de error temporal
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ff4444;
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            z-index: 1000;
            font-weight: 600;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showInstructions(mechanic) {
        const instructions = {
            memory: 'Memoriza la secuencia de colores y repítela en el orden correcto.',
            mixing: 'Mezcla los colores primarios para crear nuevos colores.',
            maze: 'Encuentra la salida del laberinto usando las flechas de dirección.',
            shape: 'Selecciona la forma que coincide con el patrón de colores mostrado.',
            rhythm: 'Toca los botones al ritmo cuando las notas lleguen al centro.'
        };
        // Mostrar instrucciones por voz si está habilitado
        if (this.gameSettings.voiceEnabled) {
            this.speak(instructions[mechanic] || 'Resuelve el desafío para restaurar el color.');
        }
    }

    speak(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'es-ES';
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        }
    }

    playSound(type) {
        // Sistema de sonido básico usando Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        const frequencies = {
            victory: 523.25, // Do
            success: 659.25, // Mi
            error: 220.00,   // La baja
            click: 440.00,    // La
            beep: 880.00,     // La alta
            move: 330.00,     // Mi baja
            drop: 261.63,     // Do baja
            hit: 523.25,      // Do
            miss: 196.00      // Sol baja
        };
        oscillator.frequency.setValueAtTime(frequencies[type] || 440, audioContext.currentTime);
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3 * (this.gameSettings.sfxVolume / 100), audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }

    updateColorPalette() {
        this.unlockedColors.forEach(color => {
            const dot = document.getElementById(color + 'Dot');
            if (dot) {
                dot.classList.remove('locked');
                dot.classList.add('unlocked');
            }
        });
    }

    saveProgress() {
        const progress = {
            currentLevel: this.currentLevel,
            score: this.score,
            unlockedColors: this.unlockedColors
        };
        localStorage.setItem('chromaquest-progress', JSON.stringify(progress));
    }

    loadProgress() {
        const saved = localStorage.getItem('chromaquest-progress');
        if (saved) {
            const progress = JSON.parse(saved);
            this.currentLevel = progress.currentLevel || 1;
            this.score = progress.score || 0;
            this.unlockedColors = progress.unlockedColors || [];
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    // Estilos dinámicos para los juegos
    applyMemoryGameStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .memory-game {
                text-align: center;
                max-width: 600px;
                margin: 0 auto;
            }
            .memory-instructions h3 {
                color: white;
                font-size: 1.8rem;
                margin-bottom: 1rem;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            }
            .memory-instructions p {
                color: #e0e0e0;
                font-size: 1.1rem;
                margin-bottom: 2rem;
            }
            .sequence-display {
                width: 200px;
                height: 100px;
                margin: 0 auto 2rem;
                border: 3px solid white;
                border-radius: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
                font-weight: bold;
                color: white;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                transition: all 0.3s ease;
            }
            .color-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1rem;
                margin-bottom: 2rem;
            }
            .color-btn {
                width: 80px;
                height: 80px;
                border: none;
                border-radius: 15px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            }
            .color-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 12px 35px rgba(0,0,0,0.3);
            }
            .sequence-input {
                display: flex;
                gap: 0.5rem;
                justify-content: center;
                min-height: 50px;
            }
            .sequence-dot {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            }
        `;
        document.head.appendChild(style);
    }

    applyMixingGameStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .mixing-game {
                text-align: center;
                max-width: 700px;
                margin: 0 auto;
            }
            .mixing-instructions h3 {
                color: white;
                font-size: 1.8rem;
                margin-bottom: 1rem;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            }
            .mixing-instructions p {
                color: #e0e0e0;
                font-size: 1.1rem;
                margin-bottom: 1rem;
            }
            .target-color {
                background: rgba(255,255,255,0.2);
                padding: 1rem;
                border-radius: 15px;
                font-size: 1.3rem;
                font-weight: bold;
                color: #2196F3;
                margin-bottom: 2rem;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            }
            .mixing-area {
                display: flex;
                gap: 2rem;
                align-items: center;
                justify-content: center;
                flex-wrap: wrap;
            }
            .color-sources {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            .color-source {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                cursor: grab;
                transition: all 0.3s ease;
                box-shadow: 0 8px 25px rgba(0,0,0,0.2);
                border: 3px solid white;
            }
            .color-source:active {
                cursor: grabbing;
                transform: scale(0.9);
            }
            .color-source:hover {
                transform: scale(1.1);
            }
            .mixing-pot {
                width: 150px;
                height: 150px;
                border: 3px dashed white;
                border-radius: 50%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                background: rgba(255,255,255,0.1);
            }
            .mixing-pot.dragover {
                background: rgba(255,255,255,0.3);
                border-color: #4facfe;
            }
            .pot-visual {
                font-size: 3rem;
                margin-bottom: 0.5rem;
            }
            .mixing-pot p {
                color: white;
                font-size: 0.9rem;
                text-align: center;
            }
            .result-display {
                min-width: 150px;
                text-align: center;
            }
            .result-display p {
                color: white;
                font-size: 1.1rem;
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);
    }

    applyMazeGameStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .maze-game {
                text-align: center;
                max-width: 500px;
                margin: 0 auto;
            }
            .maze-instructions h3 {
                color: white;
                font-size: 1.8rem;
                margin-bottom: 1rem;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            }
            .maze-instructions p {
                color: #e0e0e0;
                font-size: 1.1rem;
                margin-bottom: 2rem;
            }
            .maze-container {
                position: relative;
                display: inline-block;
                margin-bottom: 2rem;
                border: 3px solid white;
                border-radius: 15px;
                overflow: hidden;
                box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            }
            .maze-grid {
                display: grid;
                grid-template-columns: repeat(8, 40px);
                grid-template-rows: repeat(7, 40px);
                gap: 0;
            }
            .maze-cell {
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
            }
            .maze-cell.wall {
                background: #666;
            }
            .maze-cell.path {
                background: #f0f0f0;
            }
            .maze-cell.exit {
                background: #ff4444;
                animation: pulse 1s infinite;
            }
            .player {
                position: absolute;
                width: 30px;
                height: 30px;
                font-size: 1.5rem;
                transition: all 0.3s ease;
                z-index: 10;
                left: 5px;
                top: 5px;
            }
            .maze-controls {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
            }
            .maze-controls div {
                display: flex;
                gap: 0.5rem;
            }
            .maze-btn {
                width: 50px;
                height: 50px;
                border: none;
                border-radius: 10px;
                background: linear-gradient(45deg, #667eea, #764ba2);
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            }
            .maze-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            }
            .maze-btn:active {
                transform: scale(0.9);
            }
        `;
        document.head.appendChild(style);
    }

    applyShapeGameStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .shape-game {
                text-align: center;
                max-width: 600px;
                margin: 0 auto;
            }
            .shape-instructions h3 {
                color: white;
                font-size: 1.8rem;
                margin-bottom: 1rem;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            }
            .shape-instructions p {
                color: #e0e0e0;
                font-size: 1.1rem;
                margin-bottom: 2rem;
            }
            .target-pattern {
                background: rgba(255,255,255,0.2);
                padding: 2rem;
                border-radius: 15px;
                margin-bottom: 2rem;
                border: 3px solid white;
            }
            .pattern-display {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1rem;
            }
            .pattern-shape {
                font-size: 4rem;
            }
            .pattern-colors {
                display: flex;
                gap: 0.5rem;
            }
            .color-sample {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                border: 2px solid white;
            }
            .shape-options {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1.5rem;
            }
            .shape-option {
                background: rgba(255,255,255,0.2);
                padding: 1.5rem;
                border-radius: 15px;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 3px solid transparent;
            }
            .shape-option:hover {
                background: rgba(255,255,255,0.3);
                transform: scale(1.05);
                border-color: #4facfe;
            }
            .option-shape {
                font-size: 3rem;
                margin-bottom: 1rem;
            }
            .option-colors {
                display: flex;
                gap: 0.5rem;
                justify-content: center;
            }
        `;
        document.head.appendChild(style);
    }

    applyRhythmGameStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .rhythm-game {
                text-align: center;
                max-width: 500px;
                margin: 0 auto;
            }
            .rhythm-instructions h3 {
                color: white;
                font-size: 1.8rem;
                margin-bottom: 1rem;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            }
            .rhythm-instructions p {
                color: #e0e0e0;
                font-size: 1.1rem;
                margin-bottom: 2rem;
            }
            .rhythm-track {
                position: relative;
                width: 350px;
                height: 400px;
                margin: 0 auto 2rem;
                background: rgba(255,255,255,0.1);
                border-radius: 15px;
                overflow: hidden;
                border: 3px solid white;
            }
            .track-line {
                position: absolute;
                left: 0;
                right: 0;
                top: 50%;
                height: 2px;
                background: rgba(255,255,255,0.3);
            }
            .hit-zone {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 50px;
                height: 50px;
                background: rgba(79, 172, 254, 0.3);
                border: 2px solid #4facfe;
            }
            .rhythm-note {
                position: absolute;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: linear-gradient(45deg, #ff6b6b, #ffa726);
                border: 3px solid white;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            }
            .rhythm-controls {
                display: flex;
                gap: 1rem;
                justify-content: center;
            }
            .rhythm-btn {
                width: 60px;
                height: 60px;
                border: none;
                border-radius: 50%;
                font-size: 2rem;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 8px 25px rgba(0,0,0,0.2);
                border: 3px solid white;
            }
            .rhythm-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 12px 35px rgba(0,0,0,0.3);
            }
            .rhythm-btn:active {
                transform: scale(0.9);
            }
            .hit-effect {
                position: absolute;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(79, 172, 254, 0.8) 0%, transparent 70%);
                animation: hitEffect 0.5s ease-out;
                bottom: 25px;
            }
            @keyframes hitEffect {
                0% { transform: scale(0.5); opacity: 1; }
                100% { transform: scale(2); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    goBack() {
        document.getElementById('gameLevel').style.display = 'none';
        document.getElementById('mainMenu').style.display = 'block';
        this.rhythmActive = false; // Detener juego de ritmo si está activo
    }

    showGallery() {
        alert('🎨 Galería de Colores\nAquí verás todos los colores que has restaurado en tu aventura.\n¡Completa los niveles para desbloquear más colores!');
    }

    showSettings() {
  const panel = document.getElementById('settingsPanel');
  if (!panel) return;
  panel.style.display = 'block';
  panel.style.top = '50%';
  panel.style.transform = 'translate(-50%, -50%) scale(0.95)';
  anime({
    targets: panel,
    scale: [0.95, 1],
    opacity: [0, 1],
    duration: 300,
    easing: 'easeOutQuad'
  });
}

    closeSettings() {
        const panel = document.getElementById('settingsPanel');
        if (panel) {
            // Primero animamos la salida
            anime({
                targets: panel,
                scale: [1, 0.8],
                opacity: [1, 0],
                duration: 300,
                easing: 'easeInBack',
                complete: function() {
                    panel.style.display = 'none';
                    // Restaurar la posición original
                    panel.style.top = '50%';
                }
            });
        }
    }

    toggleVoice() {
        this.gameSettings.voiceEnabled = !this.gameSettings.voiceEnabled;
        const voiceToggle = document.getElementById('voiceToggle');
        if (voiceToggle) {
            voiceToggle.classList.toggle('active', this.gameSettings.voiceEnabled);
        }
        this.saveSettings();
    }

    toggleColorblind() {
        this.gameSettings.colorblindMode = !this.gameSettings.colorblindMode;
        const colorblindToggle = document.getElementById('colorblindToggle');
        if (colorblindToggle) {
            colorblindToggle.classList.toggle('active', this.gameSettings.colorblindMode);
        }
        this.saveSettings();
        // Aplicar modo daltónico
        if (this.gameSettings.colorblindMode) {
            document.body.classList.add('colorblind-mode');
        } else {
            document.body.classList.remove('colorblind-mode');
        }
    }

    closeWelcomeModal() {
        const modal = document.getElementById('welcomeModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
}

// Funciones globales para los botones
let game;

function startGame() {
    game.startGame();
}

function goBack() {
    game.goBack();
}

function showGallery() {
    game.showGallery();
}

function showSettings() {
    game.showSettings();
}

function closeSettings() {
    game.closeSettings();
}

function nextLevel() {
    game.nextLevel();
}

function closeWelcomeModal() {
    game.closeWelcomeModal();
}

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    game = new ChromaQuest();
    game.loadProgress();
});

// Prevenir el menú contextual en dispositivos táctiles
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Hacer el juego responsive
document.addEventListener('DOMContentLoaded', () => {
    // Ajustar el viewport para dispositivos móviles
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    // Prevenir zoom en dispositivos iOS
    document.addEventListener('gesturestart', (e) => {
        e.preventDefault();
    });
    document.addEventListener('gesturechange', (e) => {
        e.preventDefault();
    });
    document.addEventListener('gestureend', (e) => {
        e.preventDefault();
    });
});
