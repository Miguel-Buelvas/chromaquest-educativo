// ==========================================================
//  ChromaQuest: El Mundo sin Color  –  VERSIÓN ARREGLADA
// ==========================================================
class ChromaQuest {
  constructor() {
    this.currentLevel = 1;
    this.score      = 0;
    this.unlockedColors = [];
    this.rhythmActive   = false;   // evita loops fantasmas

    this.gameSettings = {
      musicVolume: 70,
      sfxVolume: 80,
      voiceEnabled: true,
      colorblindMode: false
    };

    this.levels = [
      { name: "El Bosque Gris",          color: "green",     mechanic: "memory"      },
      { name: "El Lago Oscuro",          color: "blue",      mechanic: "mixing"      },
      { name: "El Desierto Sin Sol",     color: "red",       mechanic: "maze"        },
      { name: "La Montaña de Sombras",   color: "orange",    mechanic: "shape"       },
      { name: "El Valle del Ritmo",      color: "purple",    mechanic: "rhythm"      },
      { name: "El Cielo Sin Arcoíris",   color: "yellow",    mechanic: "combination" },
      { name: "El Castillo de Cristal",  color: "pink",      mechanic: "visual"      },
      { name: "El Templo del Tiempo",    color: "turquoise", mechanic: "timed"       },
      { name: "El Laberinto de Espejos", color: "white",     mechanic: "reflection"  },
      { name: "El Trono del Rey Gris",   color: "rainbow",   mechanic: "boss"        }
    ];

    this.init();
  }

  /*  ==========================================
      1.  INICIALIZACIÓN
      ========================================== */
  init() {
    this.loadSettings();
    this.setupEventListeners();
    this.updateColorPalette();
    this.animateTitle();
    this.exposeGlobals();      // <-- clave para que los botones inline funcionen
  }

  exposeGlobals() {
    window.startGame   = () => this.startGame();
    window.goBack      = () => this.goBack();
    window.showGallery = () => this.showGallery();
    window.showSettings= () => this.showSettings();
    window.closeSettings=()=>this.closeSettings();
    window.nextLevel   = () => this.nextLevel();
    window.closeWelcomeModal=()=>this.closeWelcomeModal();
    window.game        = this; // para movePlayer, hitNote, etc.
  }

  /*  ==========================================
      2.  CARGA / GUARDA  (settings & progreso)
      ========================================== */
  loadSettings() {
    const saved = localStorage.getItem('chromaquest-settings');
    if (saved) Object.assign(this.gameSettings, JSON.parse(saved));
    this.applySettings();
  }
  saveSettings() {
    localStorage.setItem('chromaquest-settings', JSON.stringify(this.gameSettings));
  }
  applySettings() {
    const el = id => document.getElementById(id);
    el('musicVolume').value = this.gameSettings.musicVolume;
    el('sfxVolume').value   = this.gameSettings.sfxVolume;
    el('voiceToggle').classList.toggle('active', this.gameSettings.voiceEnabled);
    el('colorblindToggle').classList.toggle('active', this.gameSettings.colorblindMode);
  }

  loadProgress() {
    const saved = localStorage.getItem('chromaquest-progress');
    if (saved) {
      const p = JSON.parse(saved);
      this.currentLevel    = p.currentLevel || 1;
      this.score           = p.score        || 0;
      this.unlockedColors  = p.unlockedColors || [];
    }
  }
  saveProgress() {
    localStorage.setItem('chromaquest-progress', JSON.stringify({
      currentLevel: this.currentLevel,
      score: this.score,
      unlockedColors: this.unlockedColors
    }));
  }

  /*  ==========================================
      3.  LISTENERS  (volumen, ESC, etc.)
      ========================================== */
  setupEventListeners() {
    const el = id => document.getElementById(id);

    el('musicVolume').addEventListener('input', e => {
      this.gameSettings.musicVolume = e.target.value;
      this.saveSettings();
    });
    el('sfxVolume').addEventListener('input', e => {
      this.gameSettings.sfxVolume = e.target.value;
      this.saveSettings();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.closeAllModals();
    });
  }

  /*  ==========================================
      4.  ANIMACIONES  (título y formas)
      ========================================== */
  animateTitle() {
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

  /*  ==========================================
      5.  FLUJO  (menú → juego → victoria → siguiente)
      ========================================== */
  startGame() {
    document.getElementById('mainMenu').style.display   = 'none';
    document.getElementById('gameLevel').style.display  = 'block';
    this.loadLevel(this.currentLevel);
  }

  goBack() {
    this.rhythmActive = false;               // para el caso del nivel 5
    document.getElementById('gameLevel').style.display = 'none';
    document.getElementById('mainMenu').style.display  = 'block';
  }

  loadLevel(levelNum) {
    const level = this.levels[levelNum - 1];
    document.getElementById('levelTitle').textContent = `Nivel ${levelNum}: ${level.name}`;
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = '';

    switch (level.mechanic) {
      case 'memory':      this.createMemoryGame(gameArea);      break;
      case 'mixing':      this.createMixingGame(gameArea);      break;
      case 'maze':        this.createMazeGame(gameArea);        break;
      case 'shape':       this.createShapeGame(gameArea);       break;
      case 'rhythm':      this.createRhythmGame(gameArea);      break;
      case 'combination': this.createCombinationGame(gameArea); break;
      case 'visual':      this.createVisualGame(gameArea);      break;
      case 'timed':       this.createTimedGame(gameArea);       break;
      case 'reflection':  this.createReflectionGame(gameArea);  break;
      case 'boss':        this.createBossGame(gameArea);        break;
      default:            this.createMemoryGame(gameArea);      break;
    }

    this.playSound('levelStart');
    this.showInstructions(level.mechanic);
  }

  /*  ==========================================
      6.  NIVELES 1-10  (implementaciones mínimas)
      ========================================== */
  createMemoryGame(container) { /* … ya lo tenías … */ }
  createMixingGame(container) { /* … ya lo tenías … */ }
  createMazeGame(container)    { /* … ya lo tenías … */ }
  createShapeGame(container)   { /* … ya lo tenías … */ }
  createRhythmGame(container)  { /* … ya lo tenías … */ }

  /*  NIVELES 6-10  (placeholder para que no rompan)  */
  createCombinationGame(container) {
    container.innerHTML = `<div style="text-align:center;color:white"><h2>🔮 Nivel 6: Combination</h2><p>Pronto un mini-juego de combinaciones.</p><button onclick="game.levelComplete()">Simular victoria</button></div>`;
  }
  createVisualGame(container) {
    container.innerHTML = `<div style="text-align:center;color:white"><h2>👁 Nivel 7: Visual</h2><p>Prueba visual en construcción.</p><button onclick="game.levelComplete()">Simular victoria</button></div>`;
  }
  createTimedGame(container) {
    container.innerHTML = `<div style="text-align:center;color:white"><h2>⏱ Nivel 8: Timed</h2><p>Desafío con tiempo muy pronto.</p><button onclick="game.levelComplete()">Simular victoria</button></div>`;
  }
  createReflectionGame(container) {
    container.innerHTML = `<div style="text-align:center;color:white"><h2>🪞 Nivel 9: Reflection</h2><p>Espejos mágicos en camino.</p><button onclick="game.levelComplete()">Simular victoria</button></div>`;
  }
  createBossGame(container) {
    container.innerHTML = `<div style="text-align:center;color:white"><h2>👑 Nivel 10: Boss Final</h2><p>¡Rey Gris te espera!</p><button onclick="game.levelComplete()">Simular victoria</button></div>`;
  }

  /*  ==========================================
      7.  MECÁNICAS  (memory, mixing, maze, shape, rhythm)
      ========================================== */
  /* ---------- MEMORY ---------- */
  generateSequence(len) { return Array.from({length: len}, () => Math.floor(Math.random()*6)); }
  createMemoryGame(container) {
    const colors = ['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7','#DDA0DD'];
    const sequence = this.generateSequence(3 + this.currentLevel);
    let playerSequence = [];

    const gameUI = document.createElement('div');
    gameUI.className = 'memory-game';
    gameUI.innerHTML = `
      <div class="memory-instructions">
        <h3>🧠 Memoriza la secuencia de colores</h3><p>Observa con atención el orden de los colores</p>
      </div>
      <div class="sequence-display" id="sequenceDisplay"></div>
      <div class="color-grid" id="colorGrid"></div>
      <div class="sequence-input" id="sequenceInput"></div>`;
    container.appendChild(gameUI);

    this.showSequence(sequence, colors);
    const colorGrid = document.getElementById('colorGrid');
    colors.forEach((color, idx) => {
      const btn = document.createElement('button');
      btn.className = 'color-btn'; btn.style.backgroundColor = color;
      btn.onclick = () => this.addToSequence(color, playerSequence, sequence, colors);
      colorGrid.appendChild(btn);
    });
    this.applyMemoryGameStyles();
  }
  showSequence(seq, colors) {
    const display = document.getElementById('sequenceDisplay');
    let i = 0;
    const showNext = () => {
      if (i < seq.length) {
        display.style.backgroundColor = colors[seq[i]];
        display.textContent = `Color ${i+1}`; this.playSound('beep');
        setTimeout(() => {
          display.style.backgroundColor = 'transparent'; display.textContent = '';
          i++; setTimeout(showNext, 300);
        }, 1000);
      } else {
        display.innerHTML = '<h3>¡Ahora tú! Repite la secuencia</h3>';
      }
    }; showNext();
  }
  addToSequence(color, playerSeq, correctSeq, colors) {
    playerSeq.push(color); this.playSound('click');
    const input = document.getElementById('sequenceInput');
    const dot = document.createElement('div'); dot.className = 'sequence-dot'; dot.style.backgroundColor = color;
    input.appendChild(dot);
    if (playerSeq.length === correctSeq.length) {
      setTimeout(() => {
        const correctColors = correctSeq.map(i => colors[i]);
        if (JSON.stringify(playerSeq) === JSON.stringify(correctColors)) this.levelComplete();
        else { this.showError('Secuencia incorrecta. ¡Inténtalo de nuevo!'); setTimeout(()=>this.loadLevel(this.currentLevel), 2000); }
      }, 500);
    }
  }

  /* ---------- MIXING ---------- */
  createMixingGame(container) {
    const combos = { green: ['blue','yellow'], orange: ['red','yellow'], purple: ['red','blue'] };
    const target = Object.keys(combos)[Math.floor(Math.random()*3)];
    const gameUI = document.createElement('div'); gameUI.className = 'mixing-game';
    gameUI.innerHTML = `
      <div class="mixing-instructions">
        <h3>🎨 Mezcla los colores primarios</h3><p>Arrastra DOS colores primarios para crear un color secundario</p>
        <div class="target-color" id="targetColor">Crea el color: ${this.getColorName(target).toUpperCase()}</div>
      </div>
      <div class="mixing-area">
        <div class="color-sources">
          <div class="color-source" draggable="true" data-color="red" style="background:#FF0000;">🔴</div>
          <div class="color-source" draggable="true" data-color="yellow" style="background:#FFFF00;">🟡</div>
          <div class="color-source" draggable="true" data-color="blue" style="background:#0000FF;">🔵</div>
        </div>
        <div class="mixing-pot" id="mixingPot" data-target="${target}"><div class="pot-visual">🥣</div><p>Arrastra DOS colores aquí</p></div>
        <div class="result-display" id="resultDisplay"></div>
      </div>`;
    container.appendChild(gameUI); this.setupMixingGame(); this.applyMixingGameStyles();
  }
  setupMixingGame() {
    const sources = document.querySelectorAll('.color-source');
    const pot     = document.getElementById('mixingPot');
    let mixed     = [];
    sources.forEach(s => s.addEventListener('dragstart', e => e.dataTransfer.setData('color', s.dataset.color)));
    pot.addEventListener('dragover', e => { e.preventDefault(); pot.style.backgroundColor = '#f0f0f0'; });
    pot.addEventListener('dragleave', () => pot.style.backgroundColor = 'transparent');
    pot.addEventListener('drop', e => {
      e.preventDefault(); const color = e.dataTransfer.getData('color');
      if (!mixed.includes(color)) { mixed.push(color); this.playSound('drop'); this.updateMixingPot(mixed); if (mixed.length >= 2) setTimeout(() => this.checkMixture(mixed), 1000); }
    });
  }
  updateMixingPot(colors) {
    const pot = document.getElementById('mixingPot');
    const display = document.getElementById('resultDisplay');
    if (colors.length === 1) pot.style.backgroundColor = colors[0];
    else if (colors.length === 2) pot.style.background = `linear-gradient(45deg, ${colors[0]}, ${colors[1]})`;
    display.innerHTML = `<p>Colores mezclados: ${colors.length}/2</p>`;
  }
  checkMixture(colors) {
    const combos = { green: ['blue','yellow'], orange: ['red','yellow'], purple: ['red','blue'] };
    const target = document.getElementById('mixingPot').dataset.target;
    const needed = combos[target];
    const ok = needed.every(c => colors.includes(c)) && colors.length === 2;
    if (ok) { this.playSound('success'); this.levelComplete(); }
    else { this.showError(`¡Mezcla incorrecta! Necesitas crear ${this.getColorName(target)}.`); setTimeout(()=>this.loadLevel(this.currentLevel), 3000); }
  }
  getColorName(c) {
    return { red: 'Rojo', blue: 'Azul', yellow: 'Amarillo', green: 'Verde', orange: 'Naranja', purple: 'Morado' }[c] || c;
  }

  /* ---------- MAZE ---------- */
  createMazeGame(container) {
    const gameUI = document.createElement('div'); gameUI.className = 'maze-game';
    gameUI.innerHTML = `
      <div class="maze-instructions"><h3>🗺️ Encuentra la salida del laberinto</h3><p>Usa las flechas para moverte y encuentra la puerta roja</p></div>
      <div class="maze-container" id="mazeContainer"><div class="maze-grid" id="mazeGrid"></div><div class="player" id="player">🧙‍♀️</div></div>
      <div class="maze-controls">
        <button class="maze-btn" onclick="game.movePlayer('up')">↑</button><div>
        <button class="maze-btn" onclick="game.movePlayer('left')">←</button>
        <button class="maze-btn" onclick="game.movePlayer('down')">↓</button>
        <button class="maze-btn" onclick="game.movePlayer('right')">→</button></div>
      </div>`;
    container.appendChild(gameUI); this.generateMaze(); this.applyMazeGameStyles();
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
    const grid = document.getElementById('mazeGrid'); grid.innerHTML = '';
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        const cell = document.createElement('div'); cell.className = 'maze-cell'; cell.dataset.x = x; cell.dataset.y = y;
        cell.classList.add(maze[y][x] === 1 ? 'wall' : 'path');
        if (x === 6 && y === 5) { cell.classList.add('exit'); cell.innerHTML = '🚪'; }
        grid.appendChild(cell);
      }
    }
    this.mazeData = maze; this.playerPos = { x: 1, y: 1 }; this.updatePlayerPosition();
  }
  movePlayer(dir) {
    const { x, y } = this.playerPos; let nx = x, ny = y;
    switch (dir) {
      case 'up': ny--; break; case 'down': ny++; break;
      case 'left': nx--; break; case 'right': nx++; break;
    }
    if (this.mazeData[ny] && this.mazeData[ny][nx] === 0) {
      this.playerPos = { x: nx, y: ny }; this.updatePlayerPosition(); this.playSound('move');
      if (nx === 6 && ny === 5) setTimeout(() => this.levelComplete(), 500);
    } else this.playSound('bump');
  }
  updatePlayerPosition() {
    const player = document.getElementById('player');
    player.style.left = (this.playerPos.x * 40) + 'px';
    player.style.top  = (this.playerPos.y * 40) + 'px';
  }

  /* ---------- SHAPE ---------- */
  createShapeGame(container) {
    const gameUI = document.createElement('div'); gameUI.className = 'shape-game';
    gameUI.innerHTML = `
      <div class="shape-instructions"><h3>🧩 Encuentra la forma correcta</h3><p>Selecciona la forma que coincide con el patrón de colores</p><div class="target-pattern" id="targetPattern"></div></div>
      <div class="shape-options" id="shapeOptions"></div>`;
    container.appendChild(gameUI); this.setupShapeGame(); this.applyShapeGameStyles();
  }
  setupShapeGame() {
    const patterns = [
      { shape: '🔺', colors: ['red','blue','yellow'] },
      { shape: '⭕', colors: ['green','orange','purple'] },
      { shape: '⭐', colors: ['yellow','red','blue'] },
      { shape: '🔷', colors: ['blue','green','orange'] }
    ];
    const correct = patterns[Math.floor(Math.random() * patterns.length)];
    const target = document.getElementById('targetPattern');
    target.innerHTML = `
      <div class="pattern-display">
        <div class="pattern-shape">${correct.shape}</div>
        <div class="pattern-colors">${correct.colors.map(c=>`<div class="color-sample" style="background:${c};"></div>`).join('')}</div>
      </div>`;
    const options = document.getElementById('shapeOptions');
    const shuffled = [...patterns].sort(() => Math.random() - 0.5);
    shuffled.forEach(p => {
      const div = document.createElement('div'); div.className = 'shape-option';
      div.innerHTML = `<div class="option-shape">${p.shape}</div><div class="option-colors">${p.colors.map(c=>`<div class="color-sample" style="background:${c};"></div>`).join('')}</div>`;
      div.onclick = () => {
        if (p === correct) { this.playSound('success'); this.levelComplete(); }
        else { this.playSound('error'); this.showError('¡Forma incorrecta! Intenta de nuevo.'); }
      }; options.appendChild(div);
    });
  }

  /* ---------- RHYTHM ---------- */
  createRhythmGame(container) {
    const gameUI = document.createElement('div'); gameUI.className = 'rhythm-game';
    gameUI.innerHTML = `
      <div class="rhythm-instructions"><h3>🎵 ¡Toca al ritmo!</h3><p>Toca los botones cuando las notas lleguen al centro</p></div>
      <div class="rhythm-track" id="rhythmTrack"><div class="track-line"></div><div class="hit-zone"></div></div>
      <div class="rhythm-controls">
        <button class="rhythm-btn" onclick="game.hitNote(0)">🔴</button><button class="rhythm-btn" onclick="game.hitNote(1)">🔵</button>
        <button class="rhythm-btn" onclick="game.hitNote(2)">🟡</button><button class="rhythm-btn" onclick="game.hitNote(3)">🟢</button>
      </div>`;
    container.appendChild(gameUI); this.startRhythmGame(); this.applyRhythmGameStyles();
  }
  startRhythmGame() {
    this.notes = []; this.score = 0; this.rhythmActive = true;
    const spawn = () => {
      if (!this.rhythmActive) return;
      const track = document.getElementById('rhythmTrack');
      const note = document.createElement('div'); note.className = 'rhythm-note';
      note.style.left = Math.random() * 300 + 'px'; track.appendChild(note);
      this.notes.push({ element: note, position: 0, active: true });
      setTimeout(spawn, 1000 + Math.random() * 1000);
    };
    this.updateRhythmGame(); spawn();
    setTimeout(() => {
      this.rhythmActive = false;
      if (this.score >= 10) this.levelComplete();
      else { this.showError('¡Necesitas más puntos! Intenta de nuevo.'); }
    }, 30000);
  }
  updateRhythmGame() {
    if (!this.rhythmActive) return;
    this.notes.forEach(n => {
      if (n.active) {
        n.position += 2; n.element.style.top = n.position + 'px';
        if (n.position > 400) { n.element.remove(); n.active = false; }
      }
    });
    this.notes = this.notes.filter(n => n.active);
    requestAnimationFrame(() => this.updateRhythmGame());
  }
  hitNote(lane) {
    const hit = this.notes.filter(n => {
      const l = parseInt(n.element.style.left) / 75;
      return Math.abs(l - lane) < 1 && n.position > 350 && n.position < 400;
    });
    if (hit.length) {
      const n = hit[0]; n.element.remove(); n.active = false; this.score++; this.playSound('hit'); this.showHitEffect(lane);
    } else this.playSound('miss');
  }
  showHitEffect(lane) {
    const fx = document.createElement('div'); fx.className = 'hit-effect'; fx.style.left = (lane * 75) + 'px';
    document.getElementById('rhythmTrack').appendChild(fx);
    setTimeout(() => fx.remove(), 500);
  }

  /*  ==========================================
      8.  VICTORIA / DERROTA  /  SIGUIENTE NIVEL
      ========================================== */
  levelComplete() {
    const lvl = this.levels[this.currentLevel - 1];
    if (!this.unlockedColors.includes(lvl.color)) { this.unlockedColors.push(lvl.color); this.updateColorPalette(); }
    this.score += 100;
    document.getElementById('scoreDisplay').textContent = `Puntos: ${this.score}`;
    this.showVictoryModal(); this.saveProgress(); this.playSound('victory');
  }
  showVictoryModal() {
    const modal = document.getElementById('victoryModal');
    modal.style.display = 'flex';
    anime({ targets: '.modal-content', scale: [0.5, 1], opacity: [0, 1], duration: 500, easing: 'easeOutBack' });
 button class="maze-btn" onclick="game.movePlayer('left')">←</button>
        <button class="maze-btn" onclick="game.movePlayer('down')">↓</button>
        <button class="maze-btn" onclick="game.movePlayer('right')">→</button></div>
      </div>`;
    container.appendChild(gameUI); this.generateMaze(); this.applyMazeGameStyles();
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
    const grid = document.getElementById('mazeGrid'); grid.innerHTML = '';
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        const cell = document.createElement('div'); cell.className = 'maze-cell'; cell.dataset.x = x; cell.dataset.y = y;
        cell.classList.add(maze[y][x] === 1 ? 'wall' : 'path');
        if (x === 6 && y === 5) { cell.classList.add('exit'); cell.innerHTML = '🚪'; }
        grid.appendChild(cell);
      }
    }
    this.mazeData = maze; this.playerPos = { x: 1, y: 1 }; this.updatePlayerPosition();
  }
  movePlayer(dir) {
    const { x, y } = this.playerPos; let nx = x, ny = y;
    switch (dir) { case 'up': ny--; break; case 'down': ny++; break; case 'left': nx--; break; case 'right': nx++; break; }
    if (this.mazeData[ny] && this.mazeData[ny][nx] === 0) {
      this.playerPos = { x: nx, y: ny }; this.updatePlayerPosition(); this.playSound('move');
      if (nx === 6 && ny === 5) setTimeout(() => this.levelComplete(), 500);
    } else this.playSound('bump');
  }
  updatePlayerPosition() {
    const player = document.getElementById('player'); const cellSize = 40;
    player.style.left = (this.playerPos.x * cellSize + 5) + 'px';
    player.style.top  = (this.playerPos.y * cellSize + 5) + 'px';
  }

  /* ---------- SHAPE ---------- */
  createShapeGame(container) {
    const gameUI = document.createElement('div'); gameUI.className = 'shape-game';
    gameUI.innerHTML = `
      <div class="shape-instructions"><h3>🧩 Encuentra la forma correcta</h3><p>Selecciona la forma que coincide con el patrón de colores</p><div class="target-pattern" id="targetPattern"></div></div>
      <div class="shape-options" id="shapeOptions"></div>`;
    container.appendChild(gameUI); this.setupShapeGame(); this.applyShapeGameStyles();
  }
  setupShapeGame() {
    const patterns = [
      { shape: '🔺', colors: ['red', 'blue', 'yellow'] },
      { shape: '⭕', colors: ['green', 'orange', 'purple'] },
      { shape: '⭐', colors: ['yellow', 'red', 'blue'] },
      { shape: '🔷', colors: ['blue', 'green', 'orange'] }
    ];
    const correct = patterns[Math.floor(Math.random() * patterns.length)];
    const target = document.getElementById('targetPattern');
    target.innerHTML = `
      <div class="pattern-display">
        <div class="pattern-shape">${correct.shape}</div>
        <div class="pattern-colors">${correct.colors.map(c => `<div class="color-sample" style="background:${c};"></div>`).join('')}</div>
      </div>`;
    const options = document.getElementById('shapeOptions');
    const shuffled = [...patterns].sort(() => Math.random() - 0.5);
    shuffled.forEach(p => {
      const opt = document.createElement('div'); opt.className = 'shape-option';
      opt.innerHTML = `
        <div class="option-shape">${p.shape}</div>
        <div class="option-colors">${p.colors.map(c => `<div class="color-sample" style="background:${c};"></div>`).join('')}</div>`;
      opt.onclick = () => {
        if (p === correct) { this.playSound('success'); this.levelComplete(); }
        else { this.playSound('error'); this.showError('¡Forma incorrecta! Intenta de nuevo.'); }
      };
      options.appendChild(opt);
    });
  }

  /* ---------- RHYTHM ---------- */
  createRhythmGame(container) {
    const gameUI = document.createElement('div'); gameUI.className = 'rhythm-game';
    gameUI.innerHTML = `
      <div class="rhythm-instructions"><h3>🎵 ¡Toca al ritmo!</h3><p>Toca los botones cuando las notas lleguen al centro</p></div>
      <div class="rhythm-track" id="rhythmTrack"><div class="track-line"></div><div class="hit-zone"></div></div>
      <div class="rhythm-controls">
        <button class="rhythm-btn" onclick="game.hitNote(0)">🔴</button>
        <button class="rhythm-btn" onclick="game.hitNote(1)">🔵</button>
        <button class="rhythm-btn" onclick="game.hitNote(2)">🟡</button>
        <button class="rhythm-btn" onclick="game.hitNote(3)">🟢</button>
      </div>`;
    container.appendChild(gameUI); this.startRhythmGame(); this.applyRhythmGameStyles();
  }
  startRhythmGame() {
    this.notes = []; this.rhythmScore = 0; this.rhythmActive = true;
    const spawn = () => {
      if (!this.rhythmActive) return;
      const track = document.getElementById('rhythmTrack');
      const note = document.createElement('div'); note.className = 'rhythm-note';
      note.style.left = Math.floor(Math.random() * 4) * 75 + 'px';
      track.appendChild(note);
      this.notes.push({ element: note, position: 0, active: true });
      setTimeout(spawn, 1000 + Math.random() * 1000);
    };
    this.updateRhythmGame(); spawn();
    setTimeout(() => {
      this.rhythmActive = false;
      if (this.rhythmScore >= 10) this.levelComplete();
      else { this.showError('¡Necesitas más puntos! Intenta de nuevo.'); setTimeout(()=>this.loadLevel(this.currentLevel), 2000); }
    }, 30000);
  }
  updateRhythmGame() {
    if (!this.rhythmActive) return;
    this.notes.forEach((n, idx) => {
      if (n.active) {
        n.position += 2; n.element.style.top = n.position + 'px';
        if (n.position > 400) { n.element.remove(); n.active = false; }
      }
    });
    this.notes = this.notes.filter(n => n.active);
    requestAnimationFrame(() => this.updateRhythmGame());
  }
  hitNote(lane) {
    const hitNotes = this.notes.filter(n => {
      const nLane = parseInt(n.element.style.left) / 75;
      return Math.abs(nLane - lane) < 1 && n.position > 350 && n.position < 400;
    });
    if (hitNotes.length) {
      const note = hitNotes[0]; note.element.remove(); note.active = false; this.rhythmScore++;
      this.playSound('hit'); this.showHitEffect(lane);
    } else this.playSound('miss');
  }
  showHitEffect(lane) {
    const effect = document.createElement('div'); effect.className = 'hit-effect';
    effect.style.left = (lane * 75) + 'px';
    document.getElementById('rhythmTrack').appendChild(effect);
    setTimeout(() => effect.remove(), 500);
  }

  /*  ==========================================
      8.  FLUJO  (victoria, siguiente nivel, errores, progreso)
      ========================================== */
  levelComplete() {
    const lvl = this.levels[this.currentLevel - 1];
    if (!this.unlockedColors.includes(lvl.color)) { this.unlockedColors.push(lvl.color); this.updateColorPalette(); }
    this.score += 100;
    document.getElementById('scoreDisplay').textContent = `Puntos: ${this.score}`;
    this.showVictoryModal(); this.saveProgress(); this.playSound('victory');
  }
  showVictoryModal() {
    const modal = document.getElementById('victoryModal');
    modal.style.display = 'flex';
    anime({ targets: '.modal-content', scale: [0.5, 1], opacity: [0, 1], duration: 500, easing: 'easeOutBack' });
  }
  nextLevel() {
    this.closeAllModals();
    if (this.currentLevel < this.levels.length) { this.currentLevel++; this.loadLevel(this.currentLevel); }
    else this.showGameComplete();
  }
  showGameComplete() {
    const modal = document.createElement('div'); modal.className = 'modal'; modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="modal-content">
        <h2>¡Felicidades! 🏆</h2><p>¡Has restaurado todos los colores del mundo mágico!</p>
        <p>Lúa y todos los habitantes del reino te lo agradecen.</p>
        <p><strong>Puntuación Final: ${this.score} puntos</strong></p>
        <button class="modal-btn" onclick="location.reload()">Jugar de Nuevo</button>
      </div>`;
    document.body.appendChild(modal); this.playSound('gameComplete');
  }
  showError(msg) {
    const notif = document.createElement('div'); notif.className = 'error-notification';
    notif.textContent = msg; notif.style.cssText = `position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#ff4444;color:white;padding:1rem 2rem;border-radius:25px;z-index:1000;font-weight:600;box-shadow:0 8px 25px rgba(0,0,0,.3);`;
    document.body.appendChild(notif); setTimeout(() => notif.remove(), 3000);
  }
  showInstructions(mechanic) {
    const inst = {
      memory: 'Memoriza la secuencia de colores y repítela en el orden correcto.',
      mixing: 'Mezcla los colores primarios para crear nuevos colores.',
      maze: 'Encuentra la salida del laberinto usando las flechas de dirección.',
      shape: 'Selecciona la forma que coincide con el patrón de colores mostrado.',
      rhythm: 'Toca los botones al ritmo cuando las notas lleguen al centro.'
    };
    if (this.gameSettings.voiceEnabled) this.speak(inst[mechanic] || 'Resuelve el desafío para restaurar el color.');
  }
  speak(text) {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text); u.lang = 'es-ES'; u.rate = 0.8; speechSynthesis.speak(u);
    }
  }

  /*  ==========================================
      9.  AUDIO  (efectos de sonido)
      ========================================== */
  playSound(type) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    const freq = {
      victory: 523.25, success: 659.25, error: 220, click: 440, beep: 880,
      move: 330, drop: 261.63, hit: 523.25, miss: 196
    };
    osc.frequency.setValueAtTime(freq[type] || 440, ctx.currentTime);
    osc.type = 'sine';
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3 * (this.gameSettings.sfxVolume / 100), ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.3);
  }

  /*  ==========================================
      10.  PROGRESO  (localStorage)
      ========================================== */
  updateColorPalette() {
    this.unlockedColors.forEach(color => {
      const dot = document.getElementById(color + 'Dot');
      if (dot) { dot.classList.remove('locked'); dot.classList.add('unlocked'); }
    });
  }
  saveProgress() {
    localStorage.setItem('chromaquest-progress', JSON.stringify({ currentLevel: this.currentLevel, score: this.score, unlockedColors: this.unlockedColors }));
  }
  loadProgress() {
    const saved = localStorage.getItem('chromaquest-progress');
    if (saved) {
      const p = JSON.parse(saved);
      this.currentLevel = p.currentLevel || 1;
      this.score = p.score || 0;
      this.unlockedColors = p.unlockedColors || [];
      document.getElementById('scoreDisplay').textContent = `Puntos: ${this.score}`;
    }
  }
  closeAllModals() { document.querySelectorAll('.modal').forEach(m => m.style.display = 'none'); }

  /*  ==========================================
      11.  ESTILOS DINÁMICOS  (por juego)
      ========================================== */
  applyMemoryGameStyles() {
    const s = document.createElement('style'); s.textContent = `
      .memory-game{text-align:center;max-width:600px;margin:0 auto}
      .memory-instructions h3{color:white;font-size:1.8rem;margin-bottom:1rem;text-shadow:2px 2px 4px rgba(0,0,0,.5)}
      .memory-instructions p{color:#e0e0e0;font-size:1.1rem;margin-bottom:2rem}
      .sequence-display{width:200px;height:100px;margin:0 auto 2rem;border:3px solid white;border-radius:15px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:bold;color:white;text-shadow:2px 2px 4px rgba(0,0,0,.5);transition:all .3s ease}
      .color-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:2rem}
      .color-btn{width:80px;height:80px;border:none;border-radius:15px;cursor:pointer;transition:all .3s ease;box-shadow:0 8px 25px rgba(0,0,0,.2)}
      .color-btn:hover{transform:scale(1.1);box-shadow:0 12px 35px rgba(0,0,0,.3)}
      .sequence-input{display:flex;gap:.5rem;justify-content:center;min-height:50px}
      .sequence-dot{width:40px;height:40px;border-radius:50%;border:3px solid white;box-shadow:0 4px 15px rgba(0,0,0,.2)}
    `; document.head.appendChild(s);
  }
  applyMixingGameStyles() {
    const s = document.createElement('style'); s.textContent = `
      .mixing-game{text-align:center;max-width:700px;margin:0 auto}
      .mixing-instructions h3{color:white;font-size:1.8rem;margin-bottom:1rem;text-shadow:2px 2px 4px rgba(0,0,0,.5)}
      .mixing-instructions p{color:#e0e0e0;font-size:1.1rem;margin-bottom:1rem}
      .target-color{background:rgba(255,255,255,.2);padding:1rem;border-radius:15px;font-size:1.3rem;font-weight:bold;color:#2196F3;margin-bottom:2rem;text-shadow:2px 2px 4px rgba(0,0,0,.5)}
      .mixing-area{display:flex;gap:2rem;align-items:center;justify-content:center;flex-wrap:wrap}
      .color-sources{display:flex;flex-direction:column;gap:1rem}
      .color-source{width:60px;height:60px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2rem;cursor:grab;transition:all .3s ease;box-shadow:0 8px 25px rgba(0,0,0,.2);border:3px solid white}
      .color-source:active{cursor:grabbing;transform:scale(.9)}
      .color-source:hover{transform:scale(1.1)}
      .mixing-pot{width:150px;height:150px;border:3px dashed white;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:all .3s ease;background:rgba(255,255,255,.1)}
      .mixing-pot.dragover{background:rgba(255,255,255,.3);border-color:#4facfe}
      .pot-visual{font-size:3rem;margin-bottom:.5rem}
      .mixing-pot p{color:white;font-size:.9rem;text-align:center}
      .result-display{min-width:150px;text-align:center}
      .result-display p{color:white;font-size:1.1rem;font-weight:bold}
    `; document.head.appendChild(s);
  }
  applyMazeGameStyles() {
    const s = document.createElement('style'); s.textContent = `
      .maze-gamebutton class="maze-btn" onclick="game.movePlayer('left')">←</button>
        <button class="maze-btn" onclick="game.movePlayer('down')">↓</button>
        <button class="maze-btn" onclick="game.movePlayer('right')">→</button></div>
      </div>`;
    container.appendChild(gameUI); this.generateMaze(); this.applyMazeGameStyles();
  }
  generateMaze() {
    const maze = [
      [1,1,1,1,1,1,1,1],[1,0,0,0,1,0,0,1],[1,0,1,0,1,0,1,1],[1,0,1,0,0,0,0,1],
      [1,0,1,1,1,1,0,1],[1,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1]
    ];
    const grid = document.getElementById('mazeGrid'); grid.innerHTML = '';
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        const cell = document.createElement('div'); cell.className = 'maze-cell'; cell.dataset.x = x; cell.dataset.y = y;
        cell.classList.add(maze[y][x] === 1 ? 'wall' : 'path');
        if (x === 6 && y === 5) { cell.classList.add('exit'); cell.innerHTML = '🚪'; }
        grid.appendChild(cell);
      }
    }
    this.mazeData = maze; this.playerPos = { x: 1, y: 1 }; this.updatePlayerPosition();
  }
  movePlayer(dir) {
    const { x, y } = this.playerPos; let nx = x, ny = y;
    switch (dir) { case 'up': ny--; break; case 'down': ny++; break; case 'left': nx--; break; case 'right': nx++; break; }
    if (this.mazeData[ny] && this.mazeData[ny][nx] === 0) {
      this.playerPos = { x: nx, y: ny }; this.updatePlayerPosition(); this.playSound('move');
      if (nx === 6 && ny === 5) setTimeout(() => this.levelComplete(), 500);
    } else this.playSound('bump');
  }
  updatePlayerPosition() {
    const player = document.getElementById('player');
    player.style.left = (this.playerPos.x * 40) + 'px';
    player.style.top  = (this.playerPos.y * 40) + 'px';
  }

  /* ---------- SHAPE ---------- */
  createShapeGame(container) {
    const gameUI = document.createElement('div'); gameUI.className = 'shape-game';
    gameUI.innerHTML = `
      <div class="shape-instructions"><h3>🧩 Encuentra la forma correcta</h3><p>Selecciona la forma que coincide con el patrón de colores</p><div class="target-pattern" id="targetPattern"></div></div>
      <div class="shape-options" id="shapeOptions"></div>`;
    container.appendChild(gameUI); this.setupShapeGame(); this.applyShapeGameStyles();
  }
  setupShapeGame() {
    const patterns = [
      { shape: '🔺', colors: ['red', 'blue', 'yellow'] }, { shape: '⭕', colors: ['green', 'orange', 'purple'] },
      { shape: '⭐', colors: ['yellow', 'red', 'blue'] }, { shape: '🔷', colors: ['blue', 'green', 'orange'] }
    ];
    const correct = patterns[Math.floor(Math.random()*patterns.length)];
    const target = document.getElementById('targetPattern');
    target.innerHTML = `
      <div class="pattern-display">
        <div class="pattern-shape">${correct.shape}</div>
        <div class="pattern-colors">${correct.colors.map(c=>`<div class="color-sample" style="background:${c};"></div>`).join('')}</div>
      </div>`;
    const options = document.getElementById('shapeOptions');
    [...patterns].sort(()=>Math.random()-0.5).forEach(p=>{
      const opt = document.createElement('div'); opt.className = 'shape-option';
      opt.innerHTML = `<div class="option-shape">${p.shape}</div><div class="option-colors">${p.colors.map(c=>`<div class="color-sample" style="background:${c};"></div>`).join('')}</div>`;
      opt.onclick = () => { if (p === correct) { this.playSound('success'); this.levelComplete(); } else { this.playSound('error'); this.showError('¡Forma incorrecta! Intenta de nuevo.'); } };
      options.appendChild(opt);
    });
  }

  /* ---------- RHYTHM ---------- */
  createRhythmGame(container) {
    const gameUI = document.createElement('div'); gameUI.className = 'rhythm-game';
    gameUI.innerHTML = `
      <div class="rhythm-instructions"><h3>🎵 ¡Toca al ritmo!</h3><p>Toca los botones cuando las notas lleguen al centro</p></div>
      <div class="rhythm-track" id="rhythmTrack"><div class="track-line"></div><div class="hit-zone"></div></div>
      <div class="rhythm-controls">
        <button class="rhythm-btn" onclick="game.hitNote(0)">🔴</button><button class="rhythm-btn" onclick="game.hitNote(1)">🔵</button>
        <button class="rhythm-btn" onclick="game.hitNote(2)">🟡</button><button class="rhythm-btn" onclick="game.hitNote(3)">🟢</button>
      </div>`;
    container.appendChild(gameUI); this.startRhythmGame(); this.applyRhythmGameStyles();
  }
  startRhythmGame() {
    this.notes = []; this.rhythmScore = 0; this.rhythmActive = true;
    const spawn = () => {
      if (!this.rhythmActive) return;
      const track = document.getElementById('rhythmTrack');
      const note = document.createElement('div'); note.className = 'rhythm-note';
      note.style.left = Math.floor(Math.random()*4)*75 + 'px'; track.appendChild(note);
      this.notes.push({ element: note, position: 0, active: true });
      setTimeout(spawn, 1000 + Math.random()*1000);
    };
    this.updateRhythmGame(); spawn();
    setTimeout(() => {
      this.rhythmActive = false;
      if (this.rhythmScore >= 10) this.levelComplete();
      else { this.showError('¡Necesitas más puntos! Intenta de nuevo.'); setTimeout(()=>this.loadLevel(this.currentLevel), 2000); }
    }, 30000);
  }
  updateRhythmGame() {
    if (!this.rhythmActive) return;
    this.notes.forEach(n => { if (n.active) { n.position += 2; n.element.style.top = n.position + 'px'; if (n.position > 400) { n.element.remove(); n.active = false; } } });
    this.notes = this.notes.filter(n => n.active);
    requestAnimationFrame(() => this.updateRhythmGame());
  }
  hitNote(lane) {
    const hitNotes = this.notes.filter(n => { const ln = parseInt(n.element.style.left)/75; return Math.abs(ln - lane) < 1 && n.position > 350 && n.position < 400; });
    if (hitNotes.length) {
      const note = hitNotes[0]; note.element.remove(); note.active = false; this.rhythmScore++; this.playSound('hit'); this.showHitEffect(lane);
    } else this.playSound('miss');
  }
  showHitEffect(lane) {
    const fx = document.createElement('div'); fx.className = 'hit-effect'; fx.style.left = (lane*75) + 'px';
    document.getElementById('rhythmTrack').appendChild(fx);
    setTimeout(() => fx.remove(), 500);
  }

  /*  ==========================================
      8.  FLUJO  (victoria / derrota / siguiente)
      ========================================== */
  levelComplete() {
    const lvl = this.levels[this.currentLevel - 1];
    if (!this.unlockedColors.includes(lvl.color)) { this.unlockedColors.push(lvl.color); this.updateColorPalette(); }
    this.score += 100;
    document.getElementById('scoreDisplay').textContent = `Puntos: ${this.score}`;
    this.showVictoryModal(); this.saveProgress(); this.playSound('victory');
  }
  showVictoryModal() {
    const modal = document.getElementById('victoryModal');
    modal.style.display = 'flex';
    anime({ targets: '.modal-content', scale: [0.5, 1], opacity: [0, 1], duration: 500, easing: 'easeOutBack' });
  }
  nextLevel() {
    this.closeAllModals();
    if (this.currentLevel < this.levels.length) { this.currentLevel++; this.loadLevel(this.currentLevel); }
    else this.showGameComplete();
  }
  showGameComplete() {
    const modal = document.createElement('div'); modal.className = 'modal'; modal.style.display = 'flex';
    modal.innerHTML = `<div class="modal-content"><h2>¡Felicidades! 🏆</h2><p>¡Has restaurado todos los colores del mundo mágico!</p><p>Lúa y todos los habitantes del reino te lo agradecen.</p><p><strong>Puntuación Final: ${this.score} puntos</strong></p><button class="modal-btn" onclick="location.reload()">Jugar de Nuevo</button></div>`;
    document.body.appendChild(modal); this.playSound('gameComplete');
  }
  showError(msg) {
    const notif = document.createElement('div'); notif.className = 'error-notification'; notif.textContent = msg;
    notif.style.cssText = `position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#ff4444;color:white;padding:1rem 2rem;border-radius:25px;z-index:1000;font-weight:600;box-shadow:0 8px 25px rgba(0,0,0,.3);`;
    document.body.appendChild(notif); setTimeout(() => notif.remove(), 3000);
  }
  showInstructions(mechanic) {
    const txt = {
      memory: 'Memoriza la secuencia de colores y repítela en el orden correcto.',
      mixing: 'Mezcla los colores primarios para crear nuevos colores.',
      maze: 'Encuentra la salida del laberinto usando las flechas de dirección.',
      shape: 'Selecciona la forma que coincide con el patrón de colores mostrado.',
      rhythm: 'Toca los botones al ritmo cuando las notas lleguen al centro.'
    }[mechanic] || 'Resuelve el desafío para restaurar el color.';
    if (this.gameSettings.voiceEnabled) this.speak(txt);
  }
  speak(text) { if ('speechSynthesis' in window) { const u = new SpeechSynthesisUtterance(text); u.lang = 'es-ES'; u.rate = 0.8; speechSynthesis.speak(u); } }

  /*  ==========================================
      9.  AUDIO  (efectos simples)
      ========================================== */
  playSound(type) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    const freq = { victory: 523.25, success: 659.25, error: 220, click: 440, beep: 880, move: 330, drop: 261.63, hit: 523.25, miss: 196 }[type] || 440;
    osc.frequency.setValueAtTime(freq, ctx.currentTime); osc.type = 'sine';
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3 * (this.gameSettings.sfxVolume / 100), ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.3);
  }

  /*  ==========================================
      10.  ESTILOS  (inyección dinámica)
      ========================================== */
  applyMemoryGameStyles() {
    const s = document.createElement('style'); s.textContent = `
      .memory-game{text-align:center;max-width:600px;margin:0 auto;}
      .memory-instructions h3{color:white;font-size:1.8rem;margin-bottom:1rem;text-shadow:2px 2px 4px rgba(0,0,0,.5);}
      .memory-instructions p{color:#e0e0e0;font-size:1.1rem;margin-bottom:2rem;}
      .sequence-display{width:200px;height:100px;margin:0 auto 2rem;border:3px solid white;border-radius:15px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:bold;color:white;text-shadow:2px 2px 4px rgba(0,0,0,.5);transition:all .3s ease;}
      .color-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:2rem;}
      .color-btn{width:80px;height:80px;border:none;border-radius:15px;cursor:pointer;transition:all .3s ease;box-shadow:0 8px 25px rgba(0,0,0,.2);}
      .color-btn:hover{transform:scale(1.1);box-shadow:0 12px 35px rgba(0,0,0,.3);}
      .sequence-input{display:flex;gap:.5rem;justify-content:center;min-height:50px;}
      .sequence-dot{width:40px;height:40px;border-radius:50%;border:3px solid white;box-shadow:0 4px 15px rgba(0,0,0,.2);}
    `; document.head.appendChild(s);
  }
  applyMixingGameStyles() {
    const s = document.createElement('style'); s.textContent = `
      .mixing-game{text-align:center;max-width:700px;margin:0 auto;}
      .mixing-instructions h3{color:white;font-size:1.8rem;margin-bottom:1rem;text-shadow:2px 2px 4px rgba(0,0,0,.5);}
      .mixing-instructions p{color:#e0e0e0;font-size:1.1rem;margin-bottom:1rem;}
      .target-color{background:rgba(255,255,255,.2);padding:1rem;border-radius:15px;font-size:1.3rem;font-weight:bold;color:#2196F3;margin-bottom:2rem;text-shadow:2px 2px 4px rgba(0,0,0,.5);}
      .mixing-area{display:flex;gap:2rem;align-items:center;justify-content:center;flex-wrap:wrap;}
      .color-sources{display:flex;flex-direction:column;gap:1rem;}
      .color-source{width:60px;height:60px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2rem;cursor:grab;transition:all .3s ease;box-shadow:0 8px 25px rgba(0,0,0,.2);border:3px solid white;}
      .color-source:active{cursor:grabbing;transform:scale(.9);}
      .color-source:hover{transform:scale(1.1);}
      .mixing-pot{width:150px;height:150px;border:3px dashed white;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:all .3s ease;background:rgba(255,255,255,.1);}
      .mixing-pot.dragover{background:rgba(255,255,255,.3);border-color:#4facfe;}
      .pot-visual{font-size:3rem;margin-bottom:.5rem;}
      .mixing-pot p{color:white;font-size:.9rem;text-align:center;}
      .result-display{min-width:150px;text-align:center;}
      .result-display p{color:white;font-size:1.1rem;font-weight:bold;}
    `; document.head.appendChild(s);
  }
  applyMazeGameStyles() {
    const s = document.createElement('style'); s.textContent = `
      .maze-game{text-align:center;max-width:500px;margin:0 auto;}
      .maze-instructions h3{color:white;font-size:1.8rem;margin-bottom:1rem;text-shadow:2px 2px 4px rgba(0,0,0,.5);}
      .maze-instructions p{color:#e0e0e0;font-size:1.1rem;margin-bottom:2rem;}
      .maze-container{position:relative;display:inline-block;margin-bottom:2rem;border:3px solid white;border-radius:15px;overflow:hidden;box-shadow:0 8px 25px rgba(0,0,0,.2);}
      .maze-grid{display:grid;grid-template-columns:repeat(8,40px);grid-template-rows:repeat(7,40px);gap:0;}
      .maze-cell{width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;}
      .maze-cell.wall{background:#666;}
      .maze-cell.path{background:#f0f0f0;}
      .maze-cell.exit{background:#ff4444;animation:pulse 1s infinite;}
      .player{position:absolute;width:30px;height:30px;font-size:1.5rem;transition:all .3s ease;z-index:10;left:5px;top:5px;}
      .maze-controls{display:flex;flex-direction:column;align-items:center;gap:.5rem;}
      .maze-controls div{display:flex;gap:.5rem;}
      .maze-btn{widthbutton class="maze-btn" onclick="game.movePlayer('left')">←</button>
        <button class="maze-btn" onclick="game.movePlayer('down')">↓</button>
        <button class="maze-btn" onclick="game.movePlayer('right')">→</button></div>
      </div>`;
    container.appendChild(gameUI); this.generateMaze(); this.applyMazeGameStyles();
  }
  generateMaze() {
    const maze = [
      [1,1,1,1,1,1,1,1],[1,0,0,0,1,0,0,1],[1,0,1,0,1,0,1,1],[1,0,1,0,0,0,0,1],
      [1,0,1,1,1,1,0,1],[1,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1]
    ];
    const grid = document.getElementById('mazeGrid'); grid.innerHTML = '';
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        const cell = document.createElement('div'); cell.className = 'maze-cell';
        cell.dataset.x = x; cell.dataset.y = y;
        cell.classList.add(maze[y][x] === 1 ? 'wall' : 'path');
        if (x === 6 && y === 5) { cell.classList.add('exit'); cell.innerHTML = '🚪'; }
        grid.appendChild(cell);
      }
    }
    this.mazeData = maze; this.playerPos = { x: 1, y: 1 }; this.updatePlayerPosition();
  }
  movePlayer(dir) {
    const { x, y } = this.playerPos; let nx = x, ny = y;
    switch (dir) { case 'up': ny--; break; case 'down': ny++; break; case 'left': nx--; break; case 'right': nx++; break; }
    if (this.mazeData[ny] && this.mazeData[ny][nx] === 0) {
      this.playerPos = { x: nx, y: ny }; this.updatePlayerPosition(); this.playSound('move');
      if (nx === 6 && ny === 5) setTimeout(() => this.levelComplete(), 500);
    } else this.playSound('bump');
  }
  updatePlayerPosition() {
    const player = document.getElementById('player');
    player.style.left = (this.playerPos.x * 40) + 'px';
    player.style.top  = (this.playerPos.y * 40) + 'px';
  }

  /* ---------- SHAPE ---------- */
  createShapeGame(container) {
    const patterns = [
      { shape: '🔺', colors: ['red','blue','yellow'] },
      { shape: '⭕', colors: ['green','orange','purple'] },
      { shape: '⭐', colors: ['yellow','red','blue'] },
      { shape: '🔷', colors: ['blue','green','orange'] }
    ];
    const correct = patterns[Math.floor(Math.random()*patterns.length)];
    const gameUI = document.createElement('div'); gameUI.className = 'shape-game';
    gameUI.innerHTML = `
      <div class="shape-instructions"><h3>🧩 Encuentra la forma correcta</h3><p>Selecciona la forma que coincide con el patrón de colores</p><div class="target-pattern" id="targetPattern"></div></div>
      <div class="shape-options" id="shapeOptions"></div>`;
    container.appendChild(gameUI);
    const target = document.getElementById('targetPattern');
    target.innerHTML = `
      <div class="pattern-display">
        <div class="pattern-shape">${correct.shape}</div>
        <div class="pattern-colors">${correct.colors.map(c=>`<div class="color-sample" style="background:${c};"></div>`).join('')}</div>
      </div>`;
    const options = document.getElementById('shapeOptions');
    [...patterns].sort(()=>Math.random()-0.5).forEach(p=>{
      const opt = document.createElement('div'); opt.className = 'shape-option';
      opt.innerHTML = `<div class="option-shape">${p.shape}</div><div class="option-colors">${p.colors.map(c=>`<div class="color-sample" style="background:${c};"></div>`).join('')}</div>`;
      opt.onclick = () => { if (p === correct) { this.playSound('success'); this.levelComplete(); } else { this.playSound('error'); this.showError('¡Forma incorrecta! Intenta de nuevo.'); } };
      options.appendChild(opt);
    });
    this.applyShapeGameStyles();
  }

  /* ---------- RHYTHM ---------- */
  createRhythmGame(container) {
    const gameUI = document.createElement('div'); gameUI.className = 'rhythm-game';
    gameUI.innerHTML = `
      <div class="rhythm-instructions"><h3>🎵 ¡Toca al ritmo!</h3><p>Toca los botones cuando las notas lleguen al centro</p></div>
      <div class="rhythm-track" id="rhythmTrack"><div class="track-line"></div><div class="hit-zone"></div></div>
      <div class="rhythm-controls">
        <button class="rhythm-btn" onclick="game.hitNote(0)">🔴</button>
        <button class="rhythm-btn" onclick="game.hitNote(1)">🔵</button>
        <button class="rhythm-btn" onclick="game.hitNote(2)">🟡</button>
        <button class="rhythm-btn" onclick="game.hitNote(3)">🟢</button>
      </div>`;
    container.appendChild(gameUI); this.startRhythmGame(); this.applyRhythmGameStyles();
  }
  startRhythmGame() {
    this.notes = []; this.rhythmScore = 0; this.rhythmActive = true;
    const spawn = () => {
      if (!this.rhythmActive) return;
      const track = document.getElementById('rhythmTrack');
      const note = document.createElement('div'); note.className = 'rhythm-note';
      note.style.left = Math.random()*300 + 'px'; track.appendChild(note);
      this.notes.push({ element: note, position: 0, active: true });
      setTimeout(spawn, 1000 + Math.random()*1000);
    };
    this.updateRhythmGame(); spawn();
    setTimeout(() => {
      this.rhythmActive = false;
      if (this.rhythmScore >= 10) this.levelComplete();
      else { this.showError('¡Necesitas más puntos! Intenta de nuevo.'); setTimeout(()=>this.loadLevel(this.currentLevel), 2000); }
    }, 30000);
  }
  updateRhythmGame() {
    if (!this.rhythmActive) return;
    this.notes.forEach((note,idx)=>{
      if (note.active) {
        note.position += 2; note.element.style.top = note.position + 'px';
        if (note.position > 400) { note.element.remove(); note.active = false; }
      }
    });
    this.notes = this.notes.filter(n=>n.active);
    requestAnimationFrame(()=>this.updateRhythmGame());
  }
  hitNote(lane) {
    const hitNotes = this.notes.filter(n => { const ln = parseInt(n.element.style.left)/75; return Math.abs(ln - lane) < 1 && n.position > 350 && n.position < 400; });
    if (hitNotes.length) {
        const note = hitNotes[0]; note.element.remove(); note.active = false; this.rhythmScore++; this.playSound('hit'); this.showHitEffect(lane);
    } else this.playSound('miss');
}
showHitEffect(lane) {
    const fx = document.createElement('div'); fx.className = 'hit-effect'; fx.style.left = (lane*75) + 'px';
    document.getElementById('rhythmTrack').appendChild(fx);
    setTimeout(() => fx.remove(), 500);
}
/*  ==========================================
8.  FLUJO  (victoria, siguiente, error, progreso)
========================================== */
levelComplete() {
    const lvl = this.levels[this.currentLevel - 1];
    if (!this.unlockedColors.includes(lvl.color)) { this.unlockedColors.push(lvl.color); this.updateColorPalette(); }
    this.score += 100;
    document.getElementById('scoreDisplay').textContent = `Puntos: ${this.score}`;
    this.showVictoryModal(); this.saveProgress(); this.playSound('victory');
}
showVictoryModal() {
    const modal = document.getElementById('victoryModal');
    modal.style.display = 'flex';
    anime({ targets: '.modal-content', scale: [0.5, 1], opacity: [0, 1], duration: 500, easing: 'easeOutBack' });
}
nextLevel() {
    this.closeAllModals();
    if (this.currentLevel < this.levels.length) { this.currentLevel++; this.loadLevel(this.currentLevel); }
    else this.showGameComplete();
}
showGameComplete() {
    const modal = document.createElement('div'); modal.className = 'modal'; modal.style.display = 'flex';
    modal.innerHTML = `<div class="modal-content"><h2>¡Felicidades! 🏆</h2><p>¡Has restaurado todos los colores del mundo mágico!</p><p>Lúa y todos los habitantes del reino te lo agradecen.</p><p><strong>Puntuación Final: ${this.score} puntos</strong></p><button class="modal-btn" onclick="location.reload()">Jugar de Nuevo</button></div>`;
    document.body.appendChild(modal); this.playSound('gameComplete');
}
showError(msg) {
    const notif = document.createElement('div'); notif.className = 'error-notification'; notif.textContent = msg;
    notif.style.cssText = `position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#ff4444;color:white;padding:1rem 2rem;border-radius:25px;z-index:1000;font-weight:600;box-shadow:0 8px 25px rgba(0,0,0,.3);`;
    document.body.appendChild(notif); setTimeout(() => notif.remove(), 3000);
}
showInstructions(mechanic) {
    const txt = {
        memory: 'Memoriza la secuencia de colores y repítela en el orden correcto.',
        mixing: 'Mezcla los colores primarios para crear nuevos colores.',
        maze: 'Encuentra la salida del laberinto usando las flechas de dirección.',
        shape: 'Selecciona la forma que coincide con el patrón de colores mostrado.',
        rhythm: 'Toca los botones al ritmo cuando las notas lleguen al centro.'
    }[mechanic] || 'Resuelve el desafío para restaurar el color.';
    if (this.gameSettings.voiceEnabled) this.speak(txt);
}
speak(text) { if ('speechSynthesis' in window) { const u = new SpeechSynthesisUtterance(text); u.lang = 'es-ES'; u.rate = 0.8; speechSynthesis.speak(u); } }
/*  ==========================================
9.  AUDIO  (sencillito)
========================================== */
playSound(type) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    const freq = { victory: 523.25, success: 659.25, error: 220, click: 440, beep: 880, move: 330, drop: 261.63, hit: 523.25, miss: 196 }[type] || 440;
    osc.frequency.setValueAtTime(freq, ctx.currentTime); osc.type = 'sine';
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3 * (this.gameSettings.sfxVolume / 100), ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.3);
}
/*  ==========================================
10.  PROGRESO  (colores desbloqueados)
========================================== */
updateColorPalette() {
    this.unlockedColors.forEach(color => {
        const dot = document.getElementById(color + 'Dot');
        if (dot) { dot.classList.remove('locked'); dot.classList.add('unlocked'); }
    });
}
saveProgress() {
    localStorage.setItem('chromaquest-progress', JSON.stringify({ currentLevel: this.currentLevel, score: this.score, unlockedColors: this.unlockedColors }));
}
loadProgress() {
    const saved = localStorage.getItem('chromaquest-progress');
    if (saved) {
        const p = JSON.parse(saved);
        this.currentLevel = p.currentLevel || 1;
        this.score = p.score || 0;
        this.unlockedColors = p.unlockedColors || [];
        document.getElementById('scoreDisplay').textContent = `Puntos: ${this.score}`;
    }
}
closeAllModals() { document.querySelectorAll('.modal').forEach(m => m.style.display = 'none'); }
/*  ==========================================
11.  ESTILOS  (por juego)
========================================== */
applyMemoryGameStyles() {
    const s = document.createElement('style'); s.textContent = `.memory-game{text-align:center;max-width:600px;margin:0 auto;}
      .memory-instructions h3{color:white;font-size:1.8rem;margin-bottom:1rem;text-shadow:2px 2px 4px rgba(0,0,0,.5);}
      .memory-instructions p{color:#e0e0e0;font-size:1.1rem;margin-bottom:2rem;}
      .sequence-display{width:200px;height:100px;margin:0 auto 2rem;border:3px solid white;border-radius:15px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:bold;color:white;text-shadow:2px 2px 4px rgba(0,0,0,.5);transition:all .3s ease;}
      .color-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:2rem;}
      .color-btn{width:80px;height:80px;border:none;border-radius:15px;cursor:pointer;transition:all .3s ease;box-shadow:0 8px 25px rgba(0,0,0,.2);}
      .color-btn:hover{transform:scale(1.1);box-shadow:0 12px 35px rgba(0,0,0,.3);}
      .sequence-input{display:flex;gap:.5rem;justify-content:center;min-height:50px;}
      .sequence-dot{width:40px;height:40px;border-radius:50%;border:3px solid white;box-shadow:0 4px 15px rgba(0,0,0,.2);}
   `;
    document.head.appendChild(s);
}
applyMixingGameStyles() {
    const s = document.createElement('style'); s.textContent = `.mixing-game{text-align:center;max-width:700px;margin:0 auto;}
      .mixing-instructions h3{color:white;font-size:1.8rem;margin-bottom:1rem;text-shadow:2px 2px 4px rgba(0,0,0,.5);}
      .mixing-instructions p{color:#e0e0e0;font-size:1.1rem;margin-bottom:1rem;}
      .target-color{background:rgba(255,255,255,.2);padding:1rem;border-radius:15px;font-size:1.3rem;font-weight:bold;color:#2196F3;margin-bottom:2rem;text-shadow:2px 2px 4px rgba(0,0,0,.5);}
      .mixing-area{display:flex;gap:2rem;align-items:center;justify-content:center;flex-wrap:wrap;}
      .color-sources{display:flex;flex-direction:column;gap:1rem;}
      .color-source{width:60px;height:60px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2rem;cursor:grab;transition:all .3s ease;box-shadow:0 8px 25px rgba(0,0,0,.2);border:3px solid white;}
      .color-source:active{cursor:grabbing;transform:scale(.9);}
      .color-source:hover{transform:scale(1.1);}
      .mixing-pot{width:150px;height:150px;border:3px dashed white;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:all .3s ease;background:rgba(255,255,255,.1);}
      .mixing-pot.dragover{background:rgba(255,255,255,.3);border-color:#4facfe;}
      .pot-visual{font-size:3rem;margin-bottom:.5rem;}
      .mixing-pot p{color:white;font-size:.9rem;text-align:center;}
      .result-display{min-width:150px;text-align:center;}
      .result-display p{color:white;font-size:1.1rem;font-weight:bold;}
   `;
    document.head.appendChild(s);
}
applyMazeGameStyles() {
    const s = document.createElement('style'); s.textContent = `.maze-game{text-align:center;max-width:500px;margin:0 auto;}
      .maze-instructions h3{color:white;font-size:1.8rem;margin-bottom:1rem;text-shadow:2px 2px 4px rgba(0,0,0,.5);}
      .maze-instructions p{color:#e0e0e0;font-size:1.1rem;margin-bottom:2rem;}
      .maze-container{position:relative;display:inline-block;margin-bottom:2rem;border:3px solid white;border-radius:15px;overflow:hidden;box-shadow:0 8px 25px rgba(0,0,0,.2);}
      .maze-grid{display:grid;grid-template-columns:repeat(8,40px);grid-template-rows:repeat(7,40px);gap:0;}
      .maze-cell{width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;}
      .maze-cell.wall{background:#666;}
      .maze-cell.path{background:#f0f0f0;}
      .maze-cell.exit{background:#ff4444;animation:pulse 1s infinite;}
      .player{position:absolute;width:30px;height:30px;font-size:1.5rem;transition:all .3s ease;z-index:10;left:5px;top:5px;}
      .maze-controls{display:flex;flex-direction:column;align-items:center;gap:.5rem;}
      .maze-controls div{display:flex;gap:.5rem;}
      .maze-btn{width:50px;height:50px;border:none;border-radius:10px;background:linear-gradient(45deg,#667eea,#764ba2);color:white;font-size:1.5rem;cursor:pointer;transition:all .3s ease;box-shadow:0 4px 15px rgba(0,0,0,.2);}
      .maze-btn:hover{transform:scale(1.1);box-shadow:0 8px 25px rgba(0,0,0,.3);}
      .maze-btn:active{transform:scale(.9);}
   `;
    document.head.appendChild(s);
}
applyShapeGameStyles() {
    const s = document.createElement('style'); s.textContent = `.shape-game{text-align:center;max-width:600px;margin:0 auto;}
      .shape-instructions h3{color:white;font-size:1.8rem;margin-bottom:1rem;text-shadow:2px 2px 4px rgba(0,0,0,.5);}
      .shape-instructions p{color:#e0e0e0;font-size:1.1rem;margin-bottom:2rem;}
      .target-pattern{background:rgba(255,255,255,.2);padding:2rem;border-radius:15px;margin-bottom:2rem;border:3px solid white;}
      .pattern-display{display:flex;flex-direction:column;align-items:center;gap:1rem;}
      .pattern-shape{font-size:4rem;}
      .pattern-colors{display:flex;gap:.5rem;}
      .color-sample{width:30px;height:30px;border-radius:50%;border:2px solid white;}
      .shape-options{display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem;}
      .shape-option{background:rgba(255,255,255,.2);padding:1.5rem;border-radius:15px;cursor:pointer;transition:all .3s ease;border:3px solid transparent;}
      .shape-option:hover{background:rgba(255,255,255,.3);transform:scale(1.05);border-color:#4facfe;}
      .option-shape{font-size:3rem;margin-bottom:1rem;}
      .option-colors{display:flex;gap:.5rem;justify-content:center;}
   `;
    document.head.appendChild(s);
}
applyRhythmGameStyles() {
    const s = document.createElement('style'); s.textContent = `.rhythm-game{text-align:center;max-width:500px;margin:0 auto;}
      .rhythm-instructions h3{color:white;font-size:1.8rem;margin-bottom:1rem;text-shadow:2px 2px 4px rgba(0,0,0,.5);}
      .rhythm-instructions p{color:#e0e0e0;font-size:1.1rem;margin-bottom:2rem;}
      .rhythm-track{position:relative;width:350px;height:400px;margin:0 auto 2rem;background:rgba(255,255,255,.1);border-radius:15px;overflow:hidden;border:3px solid white;}
      .track-line{position:absolute;left:0;right:0;top:50%;height:2px;background:rgba(255,255,255,.3);}
      .hit-zone{position:absolute;left:0;right:0;bottom:50px;height:50px;background:rgba(79,172,254,.3);border:2px solid #4facfe;}
      .rhythm-note{position:absolute;width:40px;height:40px;border-radius:50%;background:linear-gradient(45deg,#ff6b6b,#ffa726);border:3px solid white;box-shadow:0 4px 15px rgba(0,0,0,.3);}
      .rhythm-controls{display:flex;gap:1rem;justify-content:center;}
      .rhythm-btn{width:60px;height:60px;border:none;border-radius:50%;font-size:2rem;cursor:pointer;transition:all .3s ease;box-shadow:0 8px 25px rgba(0,0,0,.2);border:3px solid white;}
      .rhythm-btn:hover{transform:scale(1.1);box-shadow:0 12px 35px rgba(0,0,0,.3);}
      .rhythm-btn:active{transform:scale(.9);}
      .hit-effect{position:absolute;width:60px;height:60px;border-radius:50%;background:radial-gradient(circle,rgba(79,172,254,.8) 0%,transparent 70%);animation:hitEffect .5s ease-out;bottom:25px;}
      @keyframes hitEffect{0%{transform:scale(.5);opacity:1;}100%{transform:scale(2);opacity:0;}}
   `;
    document.head.appendChild(s);
}
/*  ==========================================
12.  GLOBALES  (botones inline)
========================================== */
let game;
window.addEventListener('DOMContentLoaded', () => {
    game = new ChromaQuest();
    game.loadProgress();
});
/*  ==========================================
13.  PREVENIR ZOOM  (iOS / móviles)
========================================== */
document.addEventListener('gesturestart', e => e.preventDefault());
document.addEventListener('gesturechange', e => e.preventDefault());
document.addEventListener('gestureend', e => e.preventDefault());
