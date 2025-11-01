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
        const mv = document.getElementById('musicVolume');
        const sv = document.getElementById('sfxVolume');
        const vt = document.getElementById('voiceToggle');
        const ct = document.getElementById('colorblindToggle');
        if (mv) mv.value = this.gameSettings.musicVolume;
        if (sv) sv.value = this.gameSettings.sfxVolume;
        if (vt) vt.classList.toggle('active', this.gameSettings.voiceEnabled);
        if (ct) ct.classList.toggle('active', this.gameSettings.colorblindMode);
    }

    setupEventListeners() {
        // Controles de volumen
        const mv = document.getElementById('musicVolume');
        const sv = document.getElementById('sfxVolume');

        if (mv) mv.addEventListener('input', (e) => {
            this.gameSettings.musicVolume = e.target.value;
            this.saveSettings();
        });

        if (sv) sv.addEventListener('input', (e) => {
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
        // Protegemos anime.js en caso de no existir
        if (typeof anime !== 'undefined') {
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
    }

    startGame() {
        const mainMenu = document.getElementById('mainMenu');
        const gameLevel = document.getElementById('gameLevel');
        if (mainMenu) mainMenu.style.display = 'none';
        if (gameLevel) gameLevel.style.display = 'block';
        this.loadLevel(this.currentLevel);
    }

    loadLevel(levelNum) {
        const level = this.levels[levelNum - 1];
        const titleEl = document.getElementById('levelTitle');
        if (titleEl) titleEl.textContent = `Nivel ${levelNum}: ${level.name}`;

        const gameArea = document.getElementById('gameArea');
        if (!gameArea) return;
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
            btn.setAttribute('aria-label', `Color ${index + 1}`);
            btn.onclick = () => this.addToSequence(color, playerSequence, sequence);
            colorGrid.appendChild(btn);
        });

        // Aplicar estilos
        this.applyMemoryGameStyles();
    }

    showSequence(sequence, colors) {
        const display = document.getElementById('sequenceDisplay');
        if (!display) return;
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
                display.innerHTML = '<h3>¡Ahora tú! Repite la secuencia</h3>';
            }
        };

        showNext();
    }

    addToSequence(color, playerSequence, correctSequence) {
        playerSequence.push(color);
        this.playSound('click');

        // Mostrar color seleccionado
        const input = document.getElementById('sequenceInput');
        if (input) {
            const dot = document.createElement('div');
            dot.className = 'sequence-dot';
            dot.style.backgroundColor = color;
            input.appendChild(dot);
        }

        // Verificar si completó la secuencia
        if (playerSequence.length === correctSequence.length) {
            setTimeout(() => {
                this.checkSequence(playerSequence, correctSequence);
            }, 500);
        }
    }

    checkSequence(playerSequence, correctSequence) {
        const palette = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
        const correctColors = correctSequence.map(i => palette[i]);

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

    /**********************
     * NIVEL 2: MEZCLAS
     **********************/
    createMixingGame(container) {
        // Mapas de color con hex para consistencia visual
        const colorHex = {
            red: '#FF3B30',
            yellow: '#FFCC00',
            blue: '#007AFF',
            green: '#2ECC71',
            orange: '#FF8C42',
            purple: '#9B59B6'
        };

        // Combinaciones válidas (secundarios)
        const colorMixtureCombinations = {
            green: ['blue', 'yellow'],   // Azul + Amarillo = Verde
            orange: ['red', 'yellow'],   // Rojo + Amarillo = Naranja  
            purple: ['red', 'blue']      // Rojo + Azul = Morado
        };

        // Elegir objetivo secundario aleatorio (nunca será primario)
        const targetColors = Object.keys(colorMixtureCombinations);
        const targetColor = targetColors[Math.floor(Math.random() * targetColors.length)];

        const gameUI = document.createElement('div');
        gameUI.className = 'mixing-game';
        gameUI.innerHTML = `
            <div class="mixing-instructions">
                <h3>🎨 Mezcla los colores primarios</h3>
                <p id="mixingHint">Arrastra <strong>dos</strong> colores primarios al caldero para crear el color: <strong id="targetName">${this.getColorName(targetColor).toUpperCase()}</strong></p>
                <div class="target-color" id="targetColor">Objetivo: ${this.getColorName(targetColor)}</div>
            </div>
            <div class="mixing-area">
                <div class="color-sources" aria-label="Paleta de colores">
                    <div class="color-source" draggable="true" data-color="red" data-hex="${colorHex.red}" title="Rojo">🔴</div>
                    <div class="color-source" draggable="true" data-color="yellow" data-hex="${colorHex.yellow}" title="Amarillo">🟡</div>
                    <div class="color-source" draggable="true" data-color="blue" data-hex="${colorHex.blue}" title="Azul">🔵</div>
                </div>
                <div class="mixing-pot" id="mixingPot" data-target="${targetColor}" aria-label="Olla de mezcla">
                    <div class="pot-visual">🥣</div>
                    <p id="potText">Arrastra DOS colores aquí</p>
                </div>
                <div class="result-display" id="resultDisplay" aria-live="polite"></div>
            </div>
        `;

        container.appendChild(gameUI);

        // Aplicar estilos primero para que querySelector encuentre los elementos con tamaños
        this.applyMixingGameStyles();

        // Configuramos la lógica del juego con scope local para evitar filtraciones
        this.setupMixingGame(colorMixtureCombinations, colorHex);
    }

    setupMixingGame(colorMixtureCombinations, colorHex) {
        // Nos aseguramos de tomar los elementos del DOM actuales
        const pot = document.getElementById('mixingPot');
        const sources = document.querySelectorAll('.color-source');
        const resultDisplay = document.getElementById('resultDisplay');
        const potText = document.getElementById('potText');
        let mixedColors = []; // colores por nombre: 'red', 'blue', ...

        // Limpia la olla visualmente al iniciar
        if (pot) {
            pot.style.background = 'transparent';
            pot.classList.remove('mixed');
            potText.textContent = 'Arrastra DOS colores aquí';
        }
        if (resultDisplay) resultDisplay.innerHTML = '';

        // Drag handlers
        sources.forEach(source => {
            source.addEventListener('dragstart', (e) => {
                // Guardamos el color por nombre (ej. 'red') y hex para mostrar
                e.dataTransfer.setData('color', e.target.dataset.color);
                e.dataTransfer.setData('hex', e.target.dataset.hex || '');
            });

            // Hacer fuente también cliqueable para dispositivos táctiles
            source.addEventListener('click', (e) => {
                const col = e.currentTarget.dataset.color;
                if (!mixedColors.includes(col)) {
                    mixedColors.push(col);
                    this.playSound('drop');
                    this.updateMixingPot(mixedColors, colorHex);
                    if (mixedColors.length >= 2) {
                        setTimeout(() => {
                            this.checkMixture(mixedColors, colorMixtureCombinations, colorHex);
                        }, 700);
                    }
                } else {
                    // Si el usuario clickea dos veces, lo ignoramos
                    this.playSound('click');
                }
            });
        });

        if (!pot) return;

        pot.addEventListener('dragover', (e) => {
            e.preventDefault();
            pot.classList.add('dragover');
        });

        pot.addEventListener('dragleave', () => {
            pot.classList.remove('dragover');
        });

        pot.addEventListener('drop', (e) => {
            e.preventDefault();
            pot.classList.remove('dragover');

            const color = e.dataTransfer.getData('color');
            if (!color) return;

            // Evitar duplicados en la mezcla
            if (!mixedColors.includes(color)) {
                mixedColors.push(color);
                this.playSound('drop');
                this.updateMixingPot(mixedColors, colorHex);

                if (mixedColors.length >= 2) {
                    setTimeout(() => {
                        this.checkMixture(mixedColors, colorMixtureCombinations, colorHex);
                    }, 700);
                }
            } else {
                // Mensaje breve para indicar duplicado
                if (resultDisplay) {
                    resultDisplay.innerHTML = `<p>Ya agregaste ${this.getColorName(color)}.</p>`;
                }
                this.playSound('click');
            }
        });

        // Exponer una función para resetear si se recarga el nivel
        this.resetMixing = () => {
            mixedColors = [];
            if (pot) {
                pot.style.background = 'transparent';
                pot.classList.remove('mixed');
                if (potText) potText.textContent = 'Arrastra DOS colores aquí';
            }
            if (resultDisplay) resultDisplay.innerHTML = '';
        };
    }

    updateMixingPot(colors, colorHex) {
        const pot = document.getElementById('mixingPot');
        const display = document.getElementById('resultDisplay');
        const potText = document.getElementById('potText');

        if (!pot) return;

        if (colors.length === 0) {
            pot.style.background = 'transparent';
            if (potText) potText.textContent = 'Arrastra DOS colores aquí';
            if (display) display.innerHTML = '';
            return;
        }

        if (colors.length === 1) {
            const hex = colorHex[colors[0]] || colors[0];
            pot.style.background = hex;
            pot.classList.add('mixed');
            if (potText) potText.textContent = `Has agregado ${this.getColorName(colors[0])}`;
            if (display) display.innerHTML = `<p>Colores mezclados: 1/2</p>`;
        } else if (colors.length === 2) {
            const hex0 = colorHex[colors[0]] || colors[0];
            const hex1 = colorHex[colors[1]] || colors[1];
            const gradient = `linear-gradient(45deg, ${hex0}, ${hex1})`;
            pot.style.background = gradient;
            pot.classList.add('mixed');
            if (potText) potText.textContent = `Mezcla: ${this.getColorName(colors[0])} + ${this.getColorName(colors[1])}`;
            if (display) display.innerHTML = `<p>Colores mezclados: 2/2</p>`;
        } else {
            // Por seguridad no permitimos más de 2 colores
            if (display) display.innerHTML = `<p>Solo se permiten 2 colores. Reiniciando...</p>`;
            setTimeout(() => {
                if (typeof this.resetMixing === 'function') this.resetMixing();
            }, 800);
        }
    }

    checkMixture(colors, colorMixtureCombinations, colorHex) {
        const pot = document.getElementById('mixingPot');
        const targetColor = pot ? pot.dataset.target : null;
        const display = document.getElementById('resultDisplay');

        // protección: si por alguna razón el objetivo es primario (no debería ocurrir), corregimos
        const primaries = ['red', 'blue', 'yellow'];
        if (primaries.includes(targetColor)) {
            // No pedimos crear un primario; corregimos mostrando un secundario educativo
            const fixedTarget = 'green';
            if (pot) pot.dataset.target = fixedTarget;
            if (display) display.innerHTML = `<p>Objetivo inválido (primario). Nuevo objetivo: ${this.getColorName(fixedTarget)}</p>`;
            this.playSound('error');
            setTimeout(() => this.loadLevel(this.currentLevel), 1200);
            return;
        }

        const requiredColors = colorMixtureCombinations[targetColor] || [];
        const correctMixture = requiredColors.every(color => colors.includes(color)) && colors.length === 2;

        if (correctMixture) {
            this.playSound('success');
            // Feedback visual de éxito
            if (display) display.innerHTML = `<p>¡Perfecto! Has creado ${this.getColorName(targetColor)}.</p>`;
            setTimeout(() => {
                this.levelComplete();
            }, 700);
        } else {
            // Mensaje educativo: explicar por qué falla si intentan crear primario o combinación incorrecta
            let hint = `Necesitas crear ${this.getColorName(targetColor)} mezclando `;
            if (requiredColors.length === 2) {
                hint += `${this.getColorName(requiredColors[0])} + ${this.getColorName(requiredColors[1])}.`;
            } else {
                hint = `Intenta mezclar dos colores primarios para conseguir ${this.getColorName(targetColor)}.`;
            }

            if (display) {
                display.innerHTML = `<p>¡Mezcla incorrecta! ${hint}</p>`;
            }
            this.playSound('error');

            // Limpia la olla para otro intento
            setTimeout(() => {
                if (typeof this.resetMixing === 'function') this.resetMixing();
            }, 1400);
        }
    }

    getColorName(color) {
        const colorNames = {
            'green': 'Verde',
            'orange': 'Naranja',
            'purple': 'Morado',
            'red': 'Rojo',
            'blue': 'Azul',
            'yellow': 'Amarillo',
            'pink': 'Rosa',
            'turquoise': 'Turquesa',
            'white': 'Blanco',
            'rainbow': 'Arcoíris'
        };
        return colorNames[color] || color;
    }

    /**********************
     * FIN NIVEL 2
     **********************/

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
        if (!grid) return;
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
        if (!player) return;
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
        if (target) {
            target.innerHTML = `
                <div class="pattern-display">
                    <div class="pattern-shape">${correctPattern.shape}</div>
                    <div class="pattern-colors">
                        ${correctPattern.colors.map(color => `<div class="color-sample" style="background: ${color};"></div>`).join('')}
                    </div>
                </div>
            `;
        }

        // Crear opciones
        const options = document.getElementById('shapeOptions');
        if (!options) return;
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
            if (!track) return;
            const note = document.createElement('div');
            note.className = 'rhythm-note';
            // left as pixel to allow lane calc
            note.style.left = Math.floor(Math.random() * 4) * 75 + 'px';
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
            const noteLane = Math.round(parseInt(note.element.style.left || '0', 10) / 75);
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
        const track = document.getElementById('rhythmTrack');
        if (track) track.appendChild(effect);

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
        const scoreEl = document.getElementById('scoreDisplay');
        if (scoreEl) scoreEl.textContent = `Puntos: ${this.score}`;

        // Mostrar modal de victoria
        this.showVictoryModal();

        // Guardar progreso
        this.saveProgress();

        this.playSound('victory');
    }

    showVictoryModal() {
        const modal = document.getElementById('victoryModal');
        if (!modal) return;
        modal.style.display = 'flex';

        // Animación de victoria si anime.js existe
        if (typeof anime !== 'undefined') {
            anime({
                targets: '.modal-content',
                scale: [0.5, 1],
                opacity: [0, 1],
                duration: 500,
                easing: 'easeOutBack'
            });
        }
    }

    nextLevel() {
        this.closeAllModals();

        // Si hay lógica que necesita resetear antes de cambiar de nivel
        if (typeof this.resetMixing === 'function') {
            // resetear estado del nivel 2 si estaba activo
            this.resetMixing();
        }

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
        if (this.gameSettings.voiceEnabled && instructions[mechanic]) {
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
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            const frequencies = {
                victory: 523.25, // Do
                success: 659.25, // Mi
                error: 220.00,   // La baja
                click: 440.00,   // La
                beep: 880.00,    // La alta
                move: 330.00,    // Mi baja
                drop: 261.63,    // Do baja
                hit: 523.25,     // Do
                miss: 196.00     // Sol baja
            };

            oscillator.frequency.setValueAtTime(frequencies[type] || 440, audioContext.currentTime);
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3 * (this.gameSettings.sfxVolume / 100), audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.18);
        } catch (err) {
            // Silenciar fallos en contextos que no permitan WebAudio
            // console.warn('Audio no disponible', err);
        }
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
        const styleId = 'chroma-memory-styles';
        if (document.getElementById(styleId)) return;
        const style = document.createElement('style');
        style.id = styleId;
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
                width: 220px;
                height: 110px;
                margin: 0 auto 2rem;
                border: 3px solid rgba(255,255,255,0.6);
                border-radius: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
                font-weight: bold;
                color: white;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                transition: all 0.3s ease;
                background: rgba(0,0,0,0.08);
            }
            .color-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1rem;
                margin-bottom: 2rem;
            }
            .color-btn {
                width: 90px;
                height: 90px;
                border: none;
                border-radius: 15px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 8px 25px rgba(0,0,0,0.2);
                border: 3px solid rgba(255,255,255,0.4);
            }
            .color-btn:hover {
                transform: scale(1.06);
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
        const styleId = 'chroma-mixing-styles';
        if (document.getElementById(styleId)) return;
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .mixing-game {
                text-align: center;
                max-width: 760px;
                margin: 0 auto;
            }
            .mixing-instructions h3 {
                color: white;
                font-size: 1.8rem;
                margin-bottom: 0.5rem;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            }
            .mixing-instructions p {
                color: #e0e0e0;
                font-size: 1.05rem;
                margin-bottom: 0.5rem;
            }
            .target-color {
                background: rgba(255,255,255,0.06);
                padding: 0.8rem;
                border-radius: 12px;
                font-size: 1.05rem;
                font-weight: 700;
                color: #ffffff;
                margin-bottom: 1rem;
                border: 2px solid rgba(255,255,255,0.12);
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
                align-items: center;
            }
            .color-source {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                cursor: grab;
                transition: all 0.18s ease;
                box-shadow: 0 10px 30px rgba(0,0,0,0.22);
                border: 3px solid rgba(255,255,255,0.5);
                background-clip: padding-box;
            }
            .color-source:active {
                cursor: grabbing;
                transform: scale(0.96);
            }
            .color-source:hover {
                transform: scale(1.06);
            }
            .mixing-pot {
                width: 180px;
                height: 180px;
                border: 3px dashed rgba(255,255,255,0.25);
                border-radius: 50%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                background: rgba(255,255,255,0.02);
                box-shadow: 0 10px 30px rgba(0,0,0,0.18);
            }
            .mixing-pot.dragover {
                transform: scale(1.02);
                border-color: rgba(79,172,254,0.9);
                background: rgba(79,172,254,0.06);
            }
            .mixing-pot.mixed {
                border-style: solid;
            }
            .pot-visual {
                font-size: 3rem;
                margin-bottom: 0.4rem;
            }
            .mixing-pot p {
                color: white;
                font-size: 0.95rem;
                text-align: center;
            }
            .result-display {
                min-width: 180px;
                text-align: center;
                color: #fff;
                font-weight: 600;
            }
            .result-display p {
                margin: 0;
                padding: 0;
            }
        `;
        document.head.appendChild(style);
    }

    applyMazeGameStyles() {
        const styleId = 'chroma-maze-styles';
        if (document.getElementById(styleId)) return;
        const style = document.createElement('style');
        style.id = styleId;
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
                border: 3px solid rgba(255,255,255,0.12);
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
                font-size: 1.2rem;
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
                font-size: 1.2rem;
                transition: all 0.18s ease;
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
                transform: scale(1.06);
                box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            }
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }

    applyShapeGameStyles() {
        const styleId = 'chroma-shape-styles';
        if (document.getElementById(styleId)) return;
        const style = document.createElement('style');
        style.id = styleId;
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
                background: rgba(255,255,255,0.06);
                padding: 2rem;
                border-radius: 15px;
                margin-bottom: 2rem;
                border: 2px solid rgba(255,255,255,0.12);
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
                background: rgba(255,255,255,0.04);
                padding: 1.5rem;
                border-radius: 15px;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 3px solid transparent;
            }
            .shape-option:hover {
                background: rgba(255,255,255,0.07);
                transform: scale(1.03);
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
        const styleId = 'chroma-rhythm-styles';
        if (document.getElementById(styleId)) return;
        const style = document.createElement('style');
        style.id = styleId;
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
                background: rgba(255,255,255,0.04);
                border-radius: 15px;
                overflow: hidden;
                border: 2px solid rgba(255,255,255,0.08);
            }
            .track-line {
                position: absolute;
                left: 0;
                right: 0;
                top: 50%;
                height: 2px;
                background: rgba(255,255,255,0.2);
            }
            .hit-zone {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 50px;
                height: 50px;
                background: rgba(79, 172, 254, 0.12);
                border: 2px solid rgba(79,172,254,0.25);
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
                border: 3px solid rgba(255,255,255,0.12);
            }
            .rhythm-btn:hover {
                transform: scale(1.06);
                box-shadow: 0 12px 35px rgba(0,0,0,0.3);
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
        const gameLevel = document.getElementById('gameLevel');
        const mainMenu = document.getElementById('mainMenu');
        if (gameLevel) gameLevel.style.display = 'none';
        if (mainMenu) mainMenu.style.display = 'block';
        this.rhythmActive = false; // Detener juego de ritmo si está activo

        // reset mixing if needed
        if (typeof this.resetMixing === 'function') this.resetMixing();
    }

    showGallery() {
        alert('🎨 Galería de Colores\n\nAquí verás todos los colores que has restaurado en tu aventura.\n\n¡Completa los niveles para desbloquear más colores!');
    }

    showSettings() {
        const panel = document.getElementById('settingsPanel');
        if (!panel) return;
        panel.style.display = 'block';

        if (typeof anime !== 'undefined') {
            anime({
                targets: panel,
                scale: [0.8, 1],
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutBack'
            });
        }
    }

    closeSettings() {
        const panel = document.getElementById('settingsPanel');
        if (panel) panel.style.display = 'none';
    }

    toggleVoice() {
        this.gameSettings.voiceEnabled = !this.gameSettings.voiceEnabled;
        const vt = document.getElementById('voiceToggle');
        if (vt) vt.classList.toggle('active', this.gameSettings.voiceEnabled);
        this.saveSettings();
    }

    toggleColorblind() {
        this.gameSettings.colorblindMode = !this.gameSettings.colorblindMode;
        const ct = document.getElementById('colorblindToggle');
        if (ct) ct.classList.toggle('active', this.gameSettings.colorblindMode);
        this.saveSettings();

        // Aplicar modo daltónico
        if (this.gameSettings.colorblindMode) {
            document.body.classList.add('colorblind-mode');
        } else {
            document.body.classList.remove('colorblind-mode');
        }
    }

    closeWelcomeModal() {
        const wm = document.getElementById('welcomeModal');
        if (wm) wm.style.display = 'none';
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
    // Ajustar el viewport para dispositivos móviles (si existe la meta)
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');

    // Prevenir zoom en dispositivos iOS (intento suave)
    ['gesturestart','gesturechange','gestureend'].forEach(evt => {
        document.addEventListener(evt, (e) => {
            if (e.preventDefault) e.preventDefault();
        }, {passive: false});
    });
});
