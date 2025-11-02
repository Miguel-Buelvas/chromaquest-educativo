// ChromaQuest: El Mundo sin Color - Versión completa con 10 niveles
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
      case 'combination':
        this.createCombinationGame(gameArea);
        break;
      case 'visual':
        this.createVisualGame(gameArea);
        break;
      case 'timed':
        this.createTimedGame(gameArea);
        break;
      case 'reflection':
        this.createReflectionGame(gameArea);
        break;
      case 'boss':
        this.createBossGame(gameArea);
        break;
      case 'logic':
        this.createLogicGame(gameArea);
        break;
      case 'sequence':
        this.createSequenceGame(gameArea);
        break;
      case 'sound':
        this.createSoundGame(gameArea);
        break;
      case 'reaction':
        this.createReactionGame(gameArea);
        break;
      case 'strategy':
        this.createStrategyGame(gameArea);
        break;
      default:
        this.showError('Nivel no implementado aún.');
    }

    this.playSound('levelStart');
    this.showInstructions(level.mechanic);
  }
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
  setupMixingGame(colorMixtureCombinations, colorHex) {
    const pot = document.getElementById('mixingPot');
    const sources = document.querySelectorAll('.color-source');
    const resultDisplay = document.getElementById('resultDisplay');
    const potText = document.getElementById('potText');
    let mixedColors = [];

    if (pot) {
      pot.style.background = 'transparent';
      pot.classList.remove('mixed');
      if (potText) potText.textContent = 'Arrastra DOS colores aquí';
    }
    if (resultDisplay) resultDisplay.innerHTML = '';

    sources.forEach(source => {
      source.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('color', e.target.dataset.color);
        e.dataTransfer.setData('hex', e.target.dataset.hex || '');
      });

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
    const requiredColors = colorMixtureCombinations[targetColor] || [];
    const correctMixture = requiredColors.every(color => colors.includes(color)) && colors.length === 2;

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
