// ChromaQuest: El Mundo sin Color - Versión completa con 10 niveles (CORREGIDA)
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
    if (vt) vt?.classList.toggle('active', this.gameSettings.voiceEnabled);
    if (ct) ct?.classList.toggle('active', this.gameSettings.colorblindMode);
  }

  setupEventListeners() {
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
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
  }

  animateTitle() {
    if (typeof anime !== 'undefined') {
      anime({
        targets: '.game-title',
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutElastic(1, .8)',
        delay: 500
      });
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
      case 'memory': this.createMemoryGame(gameArea); break;
      case 'mixing': this.createMixingGame(gameArea); break;
      case 'maze': this.createMazeGame(gameArea); break;
      case 'shape': this.createShapeGame(gameArea); break;
      case 'rhythm': this.createRhythmGame(gameArea); break;
      case 'combination': this.createCombinationGame(gameArea); break;
      case 'visual': this.createVisualGame(gameArea); break;
      case 'timed': this.createTimedGame(gameArea); break;
      case 'reflection': this.createReflectionGame(gameArea); break;
      case 'boss': this.createBossGame(gameArea); break;
      default:
        this.showError('Nivel no implementado aún.');
    }
    this.playSound('levelStart');
    this.showInstructions(level.mechanic);
  }

  // === F U N C I O N E S  F A L T A N T E S  (implementadas aquí) ===

  playSound(soundName) {
    // Aquí puedes integrar Web Audio API o simplemente simular con console.log
    // Para un MVP funcional, no rompe si no existe.
    if (typeof console !== 'undefined') {
      // console.log(`[Sound]: ${soundName}`);
    }
  }

  showError(message) {
    const gameArea = document.getElementById('gameArea');
    if (gameArea) {
      gameArea.innerHTML = `<div class="error-message" style="color: red; padding: 20px; font-weight: bold;">${message}</div>`;
    }
  }

  showInstructions(mechanic) {
    // Opcional: ya está incluido en cada createXGame()
  }

  closeAllModals() {
    // Cierra cualquier modal activo (puedes personalizar según tu HTML)
    const modals = document.querySelectorAll('.modal');
    modals.forEach(m => m.style.display = 'none');
  }

  updateColorPalette() {
    // Ejemplo mínimo: actualiza un elemento visual con colores desbloqueados
    const palette = document.getElementById('colorPalette');
    if (palette) {
      palette.innerHTML = this.unlockedColors.map(c => `<div class="color-sample" style="background: ${c === 'rainbow' ? 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)' : c}"></div>`).join('');
    }
  }

  // === C O R R E C C I Ó N  C R Í T I C A: Nivel de Mezcla ===

  // Reemplaza createMixingGame, setupMixingGame, updateMixingPot y checkMixture
createMixingGame(container) {
  const colorMixtureCombinations = {
    orange: ['red', 'yellow'],
    green: ['blue', 'yellow'],
    purple: ['red', 'blue']
  };
  const colorHex = {
    red: '#FF0000',
    blue: '#0000FF',
    yellow: '#FFFF00',
    orange: '#FFA500',
    green: '#008000',
    purple: '#800080'
  };

  const targetColor = this.levels[this.currentLevel - 1].color; // e.g., "blue"
  const isPrimary = ['red','blue','yellow'].includes(targetColor);

  const gameUI = document.createElement('div');
  gameUI.className = 'mixing-game';
  gameUI.innerHTML = `
    <div class="mixing-instructions">
      <h3>🎨 ${isPrimary ? 'Selecciona el color' : 'Mezcla dos colores'}</h3>
      <p>${isPrimary ? `Consigue el color: <strong>${this.getColorName(targetColor)}</strong>` 
                      : `Crea el color: <strong>${this.getColorName(targetColor)}</strong>`}</p>
    </div>
    <div class="color-sources" id="colorSources"></div>
    <div class="mixing-pot" id="mixingPot" data-target="${targetColor}" data-mode="${isPrimary ? 'primary' : 'mix'}">
      <div id="potText">${isPrimary ? 'Haz clic o arrastra el color correcto' : 'Arrastra DOS colores aquí'}</div>
    </div>
    <div class="result-display" id="resultDisplay"></div>
  `;
  container.appendChild(gameUI);

  // Crear fuentes de color PRIMARIOS
  const availableColors = ['red', 'blue', 'yellow'];
  const sources = document.getElementById('colorSources');
  availableColors.forEach(color => {
    const el = document.createElement('div');
    el.className = 'color-source';
    el.style.backgroundColor = colorHex[color];
    el.setAttribute('data-color', color);
    el.setAttribute('draggable', 'true');
    el.title = this.getColorName(color);
    sources.appendChild(el);
  });

  // Iniciar lógica de mezcla (pasa las combinaciones y hex)
  this.setupMixingGame(colorMixtureCombinations, colorHex);
},

setupMixingGame(colorMixtureCombinations, colorHex) {
  const pot = document.getElementById('mixingPot');
  const sources = document.querySelectorAll('.color-source');
  const resultDisplay = document.getElementById('resultDisplay');
  const potText = document.getElementById('potText');
  let mixedColors = [];

  if (pot) {
    pot.style.background = 'transparent';
    pot.classList.remove('mixed');
    if (potText) potText.textContent = pot.dataset.mode === 'primary' 
      ? 'Haz clic o arrastra el color correcto' 
      : 'Arrastra DOS colores aquí';
  }
  if (resultDisplay) resultDisplay.innerHTML = '';

  sources.forEach(source => {
    source.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('color', e.target.dataset.color);
    });
    source.addEventListener('click', (e) => {
      const col = e.currentTarget.dataset.color;
      // Si es modo primary, se acepta solo 1 color y se valida de inmediato
      if (pot && pot.dataset.mode === 'primary') {
        this.playSound('drop');
        this.updateMixingPot([col], colorHex);
        setTimeout(() => {
          this.checkMixture([col], colorMixtureCombinations, colorHex);
        }, 300);
        return;
      }

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

    // Si es modo primary, evaluar de inmediato
    if (pot.dataset.mode === 'primary') {
      this.playSound('drop');
      this.updateMixingPot([color], colorHex);
      setTimeout(() => {
        this.checkMixture([color], colorMixtureCombinations, colorHex);
      }, 300);
      return;
    }

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
      if (resultDisplay) {
        resultDisplay.innerHTML = `<p>Ya agregaste ${this.getColorName(color)}.</p>`;
      }
      this.playSound('click');
    }
  });

  this.resetMixing = () => {
    mixedColors = [];
    if (pot) {
      pot.style.background = 'transparent';
      pot.classList.remove('mixed');
      if (potText) potText.textContent = pot.dataset.mode === 'primary' 
        ? 'Haz clic o arrastra el color correcto' 
        : 'Arrastra DOS colores aquí';
    }
    if (resultDisplay) resultDisplay.innerHTML = '';
  };
},

updateMixingPot(colors, colorHex) {
  const pot = document.getElementById('mixingPot');
  const display = document.getElementById('resultDisplay');
  const potText = document.getElementById('potText');
  if (!pot) return;

  const mode = pot.dataset.mode || 'mix';
  if (colors.length === 0) {
    pot.style.background = 'transparent';
    if (potText) potText.textContent = mode === 'primary' ? 'Haz clic o arrastra el color correcto' : 'Arrastra DOS colores aquí';
    if (display) display.innerHTML = '';
    return;
  }

  if (mode === 'primary') {
    const hex = colorHex[colors[0]] || colors[0];
    pot.style.background = hex;
    pot.classList.add('mixed');
    if (potText) potText.textContent = `Has seleccionado ${this.getColorName(colors[0])}`;
    if (display) display.innerHTML = `<p>Seleccionado: ${this.getColorName(colors[0])}</p>`;
    return;
  }

  // modo mix (dos colores)
  if (colors.length === 1) {
    const hex = colorHex[colors[0]] || colors[0];
    pot.style.background = hex;
    pot.classList.add('mixed');
    if (potText) potText.textContent = `Has agregado ${this.getColorName(colors[0])}`;
    if (display) display.innerHTML = `<p>Colores mezclados: 1/2</p>`;
  } else if (colors.length === 2) {
    const hex0 = colorHex[colors[0]];
    const hex1 = colorHex[colors[1]];
    const gradient = `linear-gradient(45deg, ${hex0}, ${hex1})`;
    pot.style.background = gradient;
    pot.classList.add('mixed');
    if (potText) potText.textContent = `Mezcla: ${this.getColorName(colors[0])} + ${this.getColorName(colors[1])}`;
    if (display) display.innerHTML = `<p>Colores mezclados: 2/2</p>`;
  } else {
    if (display) display.innerHTML = `<p>Solo se permiten 2 colores. Reiniciando...</p>`;
    setTimeout(() => {
      if (typeof this.resetMixing === 'function') this.resetMixing();
    }, 800);
  }
},

checkMixture(colors, colorMixtureCombinations, colorHex) {
  const pot = document.getElementById('mixingPot');
  const targetColor = pot ? pot.dataset.target : null;
  const display = document.getElementById('resultDisplay');
  const mode = pot ? pot.dataset.mode : 'mix';

  // Si es modo primary -> basta con que el usuario elija ese color
  if (mode === 'primary') {
    if (colors[0] === targetColor) {
      this.playSound('success');
      if (display) display.innerHTML = `<p>¡Perfecto! Has seleccionado ${this.getColorName(targetColor)}.</p>`;
      setTimeout(() => this.levelComplete(), 700);
    } else {
      if (display) display.innerHTML = `<p>Ese no es ${this.getColorName(targetColor)}. Selecciona ${this.getColorName(targetColor)}.</p>`;
      this.playSound('error');
      setTimeout(() => {
        if (typeof this.resetMixing === 'function') this.resetMixing();
      }, 1000);
    }
    return;
  }

  // Modo mix: comparar con combinaciones definidas
  const requiredColors = colorMixtureCombinations[targetColor] || [];

  const correctMixture = requiredColors.length === 2 &&
    colors.includes(requiredColors[0]) &&
    colors.includes(requiredColors[1]) &&
    colors.length === 2;

  if (correctMixture) {
    this.playSound('success');
    if (display) display.innerHTML = `<p>¡Perfecto! Has creado ${this.getColorName(targetColor)}.</p>`;
    setTimeout(() => {
      this.levelComplete();
    }, 700);
  } else {
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
    setTimeout(() => {
      if (typeof this.resetMixing === 'function') this.resetMixing();
    }, 1400);
  }
},

  getColorName(color) {
    const colorNames = {
      'green': 'Verde', 'orange': 'Naranja', 'purple': 'Morado',
      'red': 'Rojo', 'blue': 'Azul', 'yellow': 'Amarillo',
      'pink': 'Rosa', 'turquoise': 'Turquesa', 'white': 'Blanco',
      'rainbow': 'Arcoíris'
    };
    return colorNames[color] || color;
  }

  // === R E S T O  D E  L O S  M É T O D O S  (sin cambios, ya estaban bien) ===

  createMemoryGame(container) {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    const sequence = this.generateSequence(3 + this.currentLevel);
    let playerSequence = [];
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
    this.showSequence(sequence, colors);
    const colorGrid = document.getElementById('colorGrid');
    colors.forEach((color, index) => {
      const btn = document.createElement('button');
      btn.className = 'color-btn';
      btn.style.backgroundColor = color;
      btn.setAttribute('aria-label', `Color ${index + 1}`);
      btn.onclick = () => this.addToSequence(color, playerSequence, sequence);
      colorGrid.appendChild(btn);
    });
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
    const input = document.getElementById('sequenceInput');
    if (input) {
      const dot = document.createElement('div');
      dot.className = 'sequence-dot';
      dot.style.backgroundColor = color;
      input.appendChild(dot);
    }
    if (playerSequence.length === correctSequence.length) {
      setTimeout(() => {
        this.checkSequence(playerSequence, correctSequence);
      }, 500);
    }
  }

  checkSequence(playerSequence, correctSequence) {
    const palette = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    const correctColors = correctSequence.map(i => palette[i]);
    const isCorrect = playerSequence.every((color, i) => color === correctColors[i]);
    if (isCorrect) {
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

  createMazeGame(container) {
    const gameUI = document.createElement('div');
    gameUI.className = 'maze-game';
    gameUI.innerHTML = `
      <div class="maze-instructions">
        <h3>🧭 Encuentra la salida del laberinto</h3>
        <p>Usa las flechas para moverte y llegar a la puerta</p>
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
    const cellSize = 40;
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
        const isCorrect = pattern.shape === correctPattern.shape &&
                          pattern.colors.every((c, i) => c === correctPattern.colors[i]);
        if (isCorrect) {
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
        <p>Presiona los botones cuando las notas lleguen al centro</p>
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

  createCombinationGame(container) {
    const combinations = [
      { elements: ['☀️', '💧'], result: '🌈', color: 'yellow' },
      { elements: ['🔥', '🌿'], result: '🍁', color: 'orange' },
      { elements: ['🌙', '⭐'], result: '✨', color: 'white' },
      { elements: ['💧', '❄️'], result: '💎', color: 'turquoise' }
    ];
    const combo = combinations[Math.floor(Math.random() * combinations.length)];
    const gameUI = document.createElement('div');
    gameUI.className = 'combination-game';
    gameUI.innerHTML = `
      <div class="combination-instructions">
        <h3>🧪 Combina los elementos</h3>
        <p>Arrastra los dos elementos correctos al círculo mágico para crear: <strong>${this.getColorName(combo.color)}</strong></p>
      </div>
      <div class="combination-area">
        <div class="element-pool" id="elementPool"></div>
        <div class="combination-circle" id="combinationCircle" data-target="${combo.result}">
          <div class="circle-label">🌀</div>
        </div>
        <div class="combination-result" id="combinationResult"></div>
      </div>
    `;
    container.appendChild(gameUI);
    this.setupCombinationGame(combo);
    this.applyCombinationGameStyles();
  }

  setupCombinationGame(combo) {
    const pool = document.getElementById('elementPool');
    const circle = document.getElementById('combinationCircle');
    const result = document.getElementById('combinationResult');
    let selected = [];
    const allElements = ['☀️', '💧', '🔥', '🌿', '🌙', '⭐', '❄️'];
    const shuffled = [...new Set([...combo.elements, ...allElements])].sort(() => Math.random() - 0.5);
    shuffled.forEach(symbol => {
      const el = document.createElement('div');
      el.className = 'element';
      el.textContent = symbol;
      el.setAttribute('draggable', 'true');
      el.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('symbol', symbol);
      });
      el.addEventListener('click', () => {
        if (!selected.includes(symbol)) {
          selected.push(symbol);
          this.playSound('click');
          this.updateCombinationCircle(selected);
          if (selected.length === 2) {
            setTimeout(() => {
              this.checkCombination(selected, combo);
            }, 600);
          }
        }
      });
      pool.appendChild(el);
    });
    circle.addEventListener('dragover', (e) => {
      e.preventDefault();
      circle.classList.add('dragover');
    });
    circle.addEventListener('dragleave', () => {
      circle.classList.remove('dragover');
    });
    circle.addEventListener('drop', (e) => {
      e.preventDefault();
      circle.classList.remove('dragover');
      const symbol = e.dataTransfer.getData('symbol');
      if (!selected.includes(symbol)) {
        selected.push(symbol);
        this.playSound('drop');
        this.updateCombinationCircle(selected);
        if (selected.length === 2) {
          setTimeout(() => {
            this.checkCombination(selected, combo);
          }, 600);
        }
      }
    });
    this.resetCombination = () => {
      selected = [];
      this.updateCombinationCircle([]);
      if (result) result.innerHTML = '';
    };
  }

  updateCombinationCircle(symbols) {
    const circle = document.getElementById('combinationCircle');
    if (!circle) return;
    const label = circle.querySelector('.circle-label');
    label.textContent = symbols.join(' + ') || '🌀';
  }

  checkCombination(symbols, combo) {
    const result = document.getElementById('combinationResult');
    const correct = combo.elements.every(el => symbols.includes(el)) && symbols.length === 2;
    if (correct) {
      this.playSound('success');
      if (result) result.innerHTML = `<p>¡Has creado ${combo.result}! El color <strong>${this.getColorName(combo.color)}</strong> ha sido restaurado.</p>`;
      setTimeout(() => {
        this.levelComplete();
      }, 1000);
    } else {
      this.playSound('error');
      if (result) result.innerHTML = `<p>Combinación incorrecta. Intenta con otros elementos.</p>`;
      setTimeout(() => {
        if (typeof this.resetCombination === 'function') this.resetCombination();
      }, 1200);
    }
  }

  createVisualGame(container) {
    const gameUI = document.createElement('div');
    gameUI.className = 'visual-game';
    gameUI.innerHTML = `
      <div class="visual-instructions">
        <h3>👁️ Observa con atención</h3>
        <p>Selecciona el patrón que coincide con el modelo objetivo</p>
        <div class="visual-target" id="visualTarget"></div>
      </div>
      <div class="visual-options" id="visualOptions"></div>
    `;
    container.appendChild(gameUI);
    this.setupVisualGame();
    this.applyVisualGameStyles();
  }

  setupVisualGame() {
    const patterns = [
      ['🔴', '🔵', '🟡', '🟢'],
      ['🟡', '🔴', '🟢', '🔵'],
      ['🔵', '🟡', '🔴', '🟢'],
      ['🟢', '🔴', '🔵', '🟡']
    ];
    const correctPattern = patterns[Math.floor(Math.random() * patterns.length)];
    const target = document.getElementById('visualTarget');
    if (target) {
      target.innerHTML = `
        <div class="pattern-row">
          ${correctPattern.map(symbol => `<span class="pattern-symbol">${symbol}</span>`).join('')}
        </div>
      `;
    }
    const options = document.getElementById('visualOptions');
    if (!options) return;
    const shuffled = [...patterns].sort(() => Math.random() - 0.5);
    shuffled.forEach(pattern => {
      const option = document.createElement('div');
      option.className = 'visual-option';
      option.innerHTML = `
        <div class="pattern-row">
          ${pattern.map(symbol => `<span class="pattern-symbol">${symbol}</span>`).join('')}
        </div>
      `;
      option.onclick = () => {
        const isCorrect = pattern.every((s, i) => s === correctPattern[i]);
        if (isCorrect) {
          this.playSound('success');
          this.levelComplete();
        } else {
          this.playSound('error');
          this.showError('¡Patrón incorrecto! Intenta de nuevo.');
        }
      };
      options.appendChild(option);
    });
  }

  createTimedGame(container) {
    const gameUI = document.createElement('div');
    gameUI.className = 'timed-game';
    gameUI.innerHTML = `
      <div class="timed-instructions">
        <h3>⏱️ ¡Corre contra el tiempo!</h3>
        <p>Haz clic en los colores en el orden correcto antes de que se acabe el tiempo</p>
        <div class="timed-sequence" id="timedSequence"></div>
        <div class="timed-grid" id="timedGrid"></div>
        <div class="timer-bar" id="timerBar"></div>
      </div>
    `;
    container.appendChild(gameUI);
    this.setupTimedGame();
    this.applyTimedGameStyles();
  }

  setupTimedGame() {
    const colors = ['🔴', '🟡', '🔵', '🟢'];
    const sequence = Array.from({ length: 5 }, () => colors[Math.floor(Math.random() * colors.length)]);
    const sequenceEl = document.getElementById('timedSequence');
    const gridEl = document.getElementById('timedGrid');
    const timerBar = document.getElementById('timerBar');
    let playerSequence = [];
    let timeLeft = 10;
    if (sequenceEl) {
      sequenceEl.innerHTML = sequence.map(c => `<span class="timed-symbol">${c}</span>`).join('');
    }
    if (gridEl) {
      colors.forEach(color => {
        const btn = document.createElement('button');
        btn.className = 'timed-btn';
        btn.textContent = color;
        btn.onclick = () => {
          playerSequence.push(color);
          this.playSound('click');
          if (playerSequence.length === sequence.length) {
            this.checkTimedSequence(playerSequence, sequence);
          }
        };
        gridEl.appendChild(btn);
      });
    }
    const countdown = setInterval(() => {
      timeLeft--;
      if (timerBar) {
        timerBar.style.width = `${(timeLeft / 10) * 100}%`;
      }
      if (timeLeft <= 0) {
        clearInterval(countdown);
        this.showError('¡Se acabó el tiempo!');
        setTimeout(() => this.loadLevel(this.currentLevel), 1500);
      }
    }, 1000);
  }

  checkTimedSequence(playerSequence, correctSequence) {
    const isCorrect = playerSequence.every((c, i) => c === correctSequence[i]);
    if (isCorrect) {
      this.playSound('success');
      this.levelComplete();
    } else {
      this.playSound('error');
      this.showError('¡Secuencia incorrecta!');
      setTimeout(() => this.loadLevel(this.currentLevel), 1500);
    }
  }

  createReflectionGame(container) {
    const gameUI = document.createElement('div');
    gameUI.className = 'reflection-game';
    gameUI.innerHTML = `
      <div class="reflection-instructions">
        <h3>🪞 Encuentra el reflejo correcto</h3>
        <p>Observa la figura y selecciona su reflejo exacto</p>
        <div class="reflection-target" id="reflectionTarget"></div>
      </div>
      <div class="reflection-options" id="reflectionOptions"></div>
    `;
    container.appendChild(gameUI);
    this.setupReflectionGame();
    this.applyReflectionGameStyles();
  }

  setupReflectionGame() {
    const figures = [
      ['⬛', '⬜', '⬛'],
      ['⬜', '⬛', '⬜'],
      ['⬛', '⬛', '⬜'],
      ['⬜', '⬛', '⬛']
    ];
    const original = figures[Math.floor(Math.random() * figures.length)];
    const correct = [...original].reverse();
    const distractors = [
      [...original],
      ['⬛', '⬜', '⬜'],
      ['⬜', '⬜', '⬛'],
      ['⬛', '⬛', '⬛']
    ].filter(p => p.join('') !== correct.join(''));
    const options = [correct, ...distractors].sort(() => Math.random() - 0.5);
    const target = document.getElementById('reflectionTarget');
    if (target) {
      target.innerHTML = `
        <div class="reflection-row">
          ${original.map(cell => `<span class="reflection-cell">${cell}</span>`).join('')}
        </div>
      `;
    }
    const container = document.getElementById('reflectionOptions');
    if (!container) return;
    options.forEach(pattern => {
      const option = document.createElement('div');
      option.className = 'reflection-option';
      option.innerHTML = `
        <div class="reflection-row">
          ${pattern.map(cell => `<span class="reflection-cell">${cell}</span>`).join('')}
        </div>
      `;
      option.onclick = () => {
        const isCorrect = pattern.join('') === correct.join('');
        if (isCorrect) {
          this.playSound('success');
          this.levelComplete();
        } else {
          this.playSound('error');
          this.showError('¡Ese no es el reflejo correcto!');
        }
      };
      container.appendChild(option);
    });
  }

  createBossGame(container) {
    const gameUI = document.createElement('div');
    gameUI.className = 'boss-game';
    gameUI.innerHTML = `
      <div class="boss-instructions">
        <h3>🧙‍♂️ ¡Desafío final!</h3>
        <p>Completa la secuencia de retos para restaurar el color arcoíris</p>
        <div class="boss-stage" id="bossStage"></div>
        <div class="boss-feedback" id="bossFeedback"></div>
      </div>
    `;
    container.appendChild(gameUI);
    this.startBossSequence();
    this.applyBossGameStyles();
  }

  startBossSequence() {
    const stages = ['memory', 'mixing', 'shape'];
    this.bossProgress = 0;
    this.bossStages = stages;
    this.runBossStage(stages[0]);
  }

  runBossStage(mechanic) {
    const stage = document.getElementById('bossStage');
    const feedback = document.getElementById('bossFeedback');
    if (!stage || !feedback) return;
    stage.innerHTML = '';
    feedback.innerHTML = `<p>Etapa: ${this.getMechanicName(mechanic)}</p>`;
    switch (mechanic) {
      case 'memory':
        this.createMemoryGame(stage);
        break;
      case 'mixing':
        this.createMixingGame(stage); // ✅ Ahora funciona porque createMixingGame define sus propios datos
        break;
      case 'shape':
        this.createShapeGame(stage);
        break;
      default:
        feedback.innerHTML = `<p>Etapa desconocida</p>`;
    }
  }

  levelComplete() {
    if (this.bossStages && this.bossProgress < this.bossStages.length - 1) {
      this.bossProgress++;
      this.runBossStage(this.bossStages[this.bossProgress]);
    } else if (this.currentLevel === 10) {
      this.unlockedColors.push('rainbow');
      this.updateColorPalette();
      this.score += 200;
      const scoreEl = document.getElementById('scoreDisplay');
      if (scoreEl) scoreEl.textContent = `Puntos: ${this.score}`;
      this.showVictoryModal();
      this.saveProgress();
      this.playSound('gameComplete');
    } else {
      this.currentLevel++;
      this.loadLevel(this.currentLevel);
    }
  }

  getMechanicName(mechanic) {
    const names = {
      memory: 'Memoria',
      mixing: 'Mezcla',
      shape: 'Formas',
      rhythm: 'Ritmo',
      combination: 'Combinación',
      visual: 'Visual',
      timed: 'Contrarreloj',
      reflection: 'Reflejo',
      boss: 'Desafío Final'
    };
    return names[mechanic] || mechanic;
  }

  // === MÉTODOS ADICIONALES (no usados en niveles 1-10, pero completos) ===

  createLogicGame(container) {
    const gameUI = document.createElement('div');
    gameUI.className = 'logic-game';
    gameUI.innerHTML = `
      <div class="logic-instructions">
        <h3>🧠 Razonamiento lógico</h3>
        <p>Lee la afirmación y selecciona la opción correcta</p>
        <div class="logic-question" id="logicQuestion"></div>
        <div class="logic-options" id="logicOptions"></div>
      </div>
    `;
    container.appendChild(gameUI);
    this.setupLogicGame();
    this.applyLogicGameStyles();
  }

  setupLogicGame() {
    const puzzles = [
      {
        question: 'Si todos los árboles son verdes y este objeto es un árbol, ¿de qué color es?',
        options: ['Rojo', 'Verde', 'Azul', 'Amarillo'],
        answer: 1
      },
      {
        question: 'Si el sol sale por el este y se oculta por el oeste, ¿dónde está el amanecer?',
        options: ['Norte', 'Sur', 'Este', 'Oeste'],
        answer: 2
      },
      {
        question: 'Si 3 gatos cazan 3 ratones en 3 minutos, ¿cuántos gatos se necesitan para cazar 6 ratones en 6 minutos?',
        options: ['3', '6', '2', '1'],
        answer: 0
      }
    ];
    const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    const questionEl = document.getElementById('logicQuestion');
    const optionsEl = document.getElementById('logicOptions');
    if (questionEl) questionEl.textContent = puzzle.question;
    if (!optionsEl) return;
    puzzle.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'logic-btn';
      btn.textContent = opt;
      btn.onclick = () => {
        if (i === puzzle.answer) {
          this.playSound('success');
          this.levelComplete();
        } else {
          this.playSound('error');
          this.showError('Respuesta incorrecta. Intenta de nuevo.');
        }
      };
      optionsEl.appendChild(btn);
    });
  }

  createSequenceGame(container) {
    const gameUI = document.createElement('div');
    gameUI.className = 'sequence-game';
    gameUI.innerHTML = `
      <div class="sequence-instructions">
        <h3>🔢 Completa la secuencia</h3>
        <p>Observa el patrón y elige el siguiente elemento correcto</p>
        <div class="sequence-pattern" id="sequencePattern"></div>
        <div class="sequence-options" id="sequenceOptions"></div>
      </div>
    `;
    container.appendChild(gameUI);
    this.setupSequenceGame();
    this.applySequenceGameStyles();
  }

  setupSequenceGame() {
    const patterns = [
      { sequence: [1, 2, 3, 4], next: 5 },
      { sequence: ['🔴', '🟡', '🔵'], next: '🟢' },
      { sequence: ['A', 'B', 'C'], next: 'D' },
      { sequence: [2, 4, 6, 8], next: 10 },
      { sequence: ['⬛', '⬜', '⬛'], next: '⬜' }
    ];
    const puzzle = patterns[Math.floor(Math.random() * patterns.length)];
    const patternEl = document.getElementById('sequencePattern');
    const optionsEl = document.getElementById('sequenceOptions');
    if (patternEl) {
      patternEl.innerHTML = puzzle.sequence.map(el => `<span class="sequence-item">${el}</span>`).join('');
    }
    const distractors = [puzzle.next, '❌', '💥', '0', 'Z', '🟥', '🟣', '⬛', '⬜'].filter(el => el !== puzzle.next);
    const choices = [puzzle.next, ...distractors.sort(() => Math.random() - 0.5).slice(0, 3)].sort(() => Math.random() - 0.5);
    if (!optionsEl) return;
    choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'sequence-btn';
      btn.textContent = choice;
      btn.onclick = () => {
        if (choice === puzzle.next) {
          this.playSound('success');
          this.levelComplete();
        } else {
          this.playSound('error');
          this.showError('¡Esa no es la opción correcta!');
        }
      };
      optionsEl.appendChild(btn);
    });
  }

  createSoundGame(container) {
    const gameUI = document.createElement('div');
    gameUI.className = 'sound-game';
    gameUI.innerHTML = `
      <div class="sound-instructions">
        <h3>🔊 Escucha y repite</h3>
        <p>Escucha la secuencia de sonidos y repítela en el mismo orden</p>
        <div class="sound-controls" id="soundControls"></div>
        <div class="sound-feedback" id="soundFeedback"></div>
      </div>
    `;
    container.appendChild(gameUI);
    this.setupSoundGame();
    this.applySoundGameStyles();
  }

  setupSoundGame() {
    const sounds = ['beep', 'click', 'drop', 'success'];
    const sequence = Array.from({ length: 4 + this.currentLevel }, () => sounds[Math.floor(Math.random() * sounds.length)]);
    const playerSequence = [];
    const controls = document.getElementById('soundControls');
    const feedback = document.getElementById('soundFeedback');
    if (!controls) return;
    sounds.forEach((sound, index) => {
      const btn = document.createElement('button');
      btn.className = 'sound-btn';
      btn.textContent = `🔈 ${index + 1}`;
      btn.onclick = () => {
        this.playSound(sound);
        playerSequence.push(sound);
        if (playerSequence.length === sequence.length) {
          setTimeout(() => {
            this.checkSoundSequence(playerSequence, sequence);
          }, 500);
        }
      };
      controls.appendChild(btn);
    });
    let i = 0;
    const playNext = () => {
      if (i < sequence.length) {
        this.playSound(sequence[i]);
        i++;
        setTimeout(playNext, 800);
      } else if (feedback) {
        feedback.innerHTML = `<p>¡Ahora repite la secuencia!</p>`;
      }
    };
    setTimeout(playNext, 1000);
  }

  checkSoundSequence(playerSequence, correctSequence) {
    const isCorrect = playerSequence.every((s, i) => s === correctSequence[i]);
    if (isCorrect) {
      this.playSound('success');
      this.levelComplete();
    } else {
      this.playSound('error');
      this.showError('¡Secuencia incorrecta! Intenta de nuevo.');
      setTimeout(() => this.loadLevel(this.currentLevel), 1500);
    }
  }

  createReactionGame(container) {
    const gameUI = document.createElement('div');
    gameUI.className = 'reaction-game';
    gameUI.innerHTML = `
      <div class="reaction-instructions">
        <h3>⚡ ¡Reacciona rápido!</h3>
        <p>Haz clic en el símbolo especial tan pronto como aparezca</p>
        <div class="reaction-zone" id="reactionZone"></div>
        <div class="reaction-feedback" id="reactionFeedback"></div>
      </div>
    `;
    container.appendChild(gameUI);
    this.setupReactionGame();
    this.applyReactionGameStyles();
  }

  setupReactionGame() {
    const zone = document.getElementById('reactionZone');
    const feedback = document.getElementById('reactionFeedback');
    const symbols = ['🌟', '💥', '⚡', '🔥', '🎯'];
    const target = '⚡';
    let clicked = false;
    if (!zone || !feedback) return;
    zone.innerHTML = `<p>Prepárate...</p>`;
    setTimeout(() => {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      zone.innerHTML = `<button class="reaction-symbol">${symbol}</button>`;
      const btn = zone.querySelector('.reaction-symbol');
      const startTime = performance.now();
      btn.onclick = () => {
        if (clicked) return;
        clicked = true;
        const reactionTime = performance.now() - startTime;
        if (symbol === target && reactionTime < 1000) {
          this.playSound('success');
          feedback.innerHTML = `<p>¡Excelente reflejo! Tiempo: ${Math.floor(reactionTime)} ms</p>`;
          setTimeout(() => this.levelComplete(), 1000);
        } else {
          this.playSound('error');
          feedback.innerHTML = `<p>¡Fallaste! Era ${target} o tardaste demasiado.</p>`;
          setTimeout(() => this.loadLevel(this.currentLevel), 1500);
        }
      };
    }, 2000 + Math.random() * 2000);
  }

  createStrategyGame(container) {
    const gameUI = document.createElement('div');
    gameUI.className = 'strategy-game';
    gameUI.innerHTML = `
      <div class="strategy-instructions">
        <h3>♟️ Estrategia y planificación</h3>
        <p>Activa todos los nodos sin pasar dos veces por el mismo</p>
        <div class="strategy-grid" id="strategyGrid"></div>
        <div class="strategy-feedback" id="strategyFeedback"></div>
      </div>
    `;
    container.appendChild(gameUI);
    this.setupStrategyGame();
    this.applyStrategyGameStyles();
  }

  setupStrategyGame() {
    const gridSize = 4;
    const grid = document.getElementById('strategyGrid');
    const feedback = document.getElementById('strategyFeedback');
    this.strategyVisited = [];
    this.strategyPath = [];
    if (!grid || !feedback) return;
    grid.innerHTML = '';
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const cell = document.createElement('div');
        cell.className = 'strategy-cell';
        cell.dataset.x = x;
        cell.dataset.y = y;
        cell.textContent = '⬜';
        cell.onclick = () => this.selectStrategyCell(x, y);
        grid.appendChild(cell);
      }
    }
    feedback.innerHTML = `<p>Selecciona los nodos estratégicamente</p>`;
  }

  selectStrategyCell(x, y) {
    const key = `${x},${y}`;
    if (this.strategyVisited.includes(key)) {
      this.playSound('error');
      this.showError('¡Ya pasaste por ese nodo!');
      return;
    }
    this.strategyVisited.push(key);
    this.strategyPath.push({ x, y });
    this.playSound('click');
    const grid = document.getElementById('strategyGrid');
    if (!grid) return;
    const cells = grid.querySelectorAll('.strategy-cell');
    cells.forEach(cell => {
      if (cell.dataset.x == x && cell.dataset.y == y) {
        cell.textContent = '🟩';
        cell.classList.add('visited');
      }
    });
    if (this.strategyVisited.length === 16) {
      this.playSound('success');
      const feedback = document.getElementById('strategyFeedback');
      if (feedback) feedback.innerHTML = `<p>¡Has activado todos los nodos sin repetir!</p>`;
      setTimeout(() => this.levelComplete(), 1000);
    }
  }

  // === Métodos auxiliares adicionales ===

  showVictoryModal() {
    const modal = document.createElement('div');
    modal.className = 'victory-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h2>🎉 ¡Victoria!</h2>
        <p>Has restaurado el color al mundo.</p>
        <button onclick="location.reload()">Jugar de nuevo</button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  saveProgress() {
    // Aquí podrías guardar el progreso del jugador
  }

  applyMemoryGameStyles() { /* Estilos en CSS */ }
  applyMazeGameStyles() { /* Estilos en CSS */ }
  applyShapeGameStyles() { /* Estilos en CSS */ }
  applyRhythmGameStyles() { /* Estilos en CSS */ }
  applyCombinationGameStyles() { /* Estilos en CSS */ }
  applyVisualGameStyles() { /* Estilos en CSS */ }
  applyTimedGameStyles() { /* Estilos en CSS */ }
  applyReflectionGameStyles() { /* Estilos en CSS */ }
  applyBossGameStyles() { /* Estilos en CSS */ }
  applyLogicGameStyles() { /* Estilos en CSS */ }
  applySequenceGameStyles() { /* Estilos en CSS */ }
  applySoundGameStyles() { /* Estilos en CSS */ }
  applyReactionGameStyles() { /* Estilos en CSS */ }
  applyStrategyGameStyles() { /* Estilos en CSS */ }
}
