/**
 * GameEngine - Motor principal del juego
 * Maneja el loop de renderizado, escenas, input y estado global
 */

import { audioManager } from './audioManager.js';
import { personalData } from '../config/personalData.js';

export class GameEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.width = personalData.gameConfig.canvasWidth;
    this.height = personalData.gameConfig.canvasHeight;
    this.scale = 1;

    // Estado del juego
    this.currentScene = null;
    this.currentSceneId = null;
    this.previousSceneId = null;
    this.scenes = new Map();
    this.gameState = {
      started: false,
      completedGifts: new Set(),
      redeemedTickets: new Set(),
      currentDialog: null,
      transitioning: false,
      transitionProgress: 0,
      transitionDirection: 'out', // 'out' | 'in'
      saveData: null
    };

    // Timing
    this.lastTime = 0;
    this.deltaTime = 0;
    this.targetFPS = personalData.gameConfig.targetFPS;
    this.frameInterval = 1000 / this.targetFPS;
    this.accumulator = 0;
    this.running = false;
    this.animationId = null;

    // Screen Shake / Trauma (Game Feel)
    this.trauma = 0;
    this.traumaDecay = 1.5; // por segundo
    this.maxShakeOffset = 6; // pixels
    this.maxShakeRoll = 0.03; // radians
    this.shakeTime = 0;

    // Reduced Motion preference
    this.reducedMotion = false;

    // Input
    this.keys = new Set();
    this.mouse = { x: 0, y: 0, down: false, clicked: false };
    this.touch = { x: 0, y: 0, active: false };

    // Callbacks
    this.onChangeScene = null;
    this.onGameStart = null;
    this.onGameComplete = null;

    // Bind methods
    this.gameLoop = this.gameLoop.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
  }

  /**
   * Inicializar el motor
   */
  async init(canvasId = 'game-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      throw new Error(`Canvas ${canvasId} no encontrado`);
    }

    this.ctx = this.canvas.getContext('2d', { alpha: false });
    if (!this.ctx) {
      throw new Error('No se pudo obtener contexto 2D');
    }

    // Configurar canvas para pixel art crisp
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.msImageSmoothingEnabled = false;

    // Configurar tamano inicial
    this.handleResize();

    // Event listeners
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('mouseup', this.handleMouseUp);
    this.canvas.addEventListener('click', this.handleClick);
    this.canvas.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    this.canvas.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    this.canvas.addEventListener('touchend', this.handleTouchEnd);

    // Cargar estado guardado
    this.loadGame();

    // Inicializar audio
    await audioManager.init();

    return this;
  }

  /**
   * Registrar una escena
   */
  registerScene(sceneId, sceneInstance) {
    this.scenes.set(sceneId, sceneInstance);
    sceneInstance.engine = this;
    if (sceneInstance.init) {
      sceneInstance.init();
    }
  }

  /**
   * Cambiar de escena con transicion
   */
  async changeScene(sceneId, data = {}) {
    if (this.currentSceneId === sceneId) return;
    if (this.gameState.transitioning) return;

    const targetScene = this.scenes.get(sceneId);
    if (!targetScene) {
      console.warn(`Escena no encontrada: ${sceneId}`);
      return;
    }

    this.gameState.transitioning = true;
    this.gameState.transitionDirection = 'out';
    this.gameState.transitionProgress = 0;

    // Fade out
    await this.transition(300);

    // Limpiar escena actual
    if (this.currentScene && this.currentScene.onExit) {
      this.currentScene.onExit();
    }

    // Cambiar escena
    this.previousSceneId = this.currentSceneId;
    this.currentSceneId = sceneId;
    this.currentScene = targetScene;

    // Entrar en nueva escena
    if (this.currentScene.onEnter) {
      this.currentScene.onEnter(data);
    }

    // Fade in
    this.gameState.transitionDirection = 'in';
    await this.transition(300);

    this.gameState.transitioning = false;

    // Notificar cambio
    if (this.onChangeScene) {
      this.onChangeScene(sceneId, this.previousSceneId);
    }
  }

  /**
   * Animacion de transicion (fade)
   */
  transition(duration) {
    return new Promise(resolve => {
      const startTime = performance.now();
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        this.gameState.transitionProgress = Math.min(elapsed / duration, 1);

        if (this.gameState.transitionProgress >= 1) {
          resolve();
        } else {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    });
  }

  /**
   * Loop principal del juego
   */
  gameLoop(timestamp) {
    if (!this.running) return;

    this.deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;
    this.accumulator += this.deltaTime;

    // Fixed timestep para logica
    while (this.accumulator >= this.frameInterval) {
      this.update(this.frameInterval / 1000);
      this.accumulator -= this.frameInterval;
    }

    // Render con interpolacion
    const alpha = this.accumulator / this.frameInterval;
    this.render(alpha);

    this.animationId = requestAnimationFrame(this.gameLoop);
  }

  /**
   * Actualizar logica del juego
   */
  update(dt) {
    // Check reduced motion preference
    if (!this.reducedMotionChecked) {
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.reducedMotionChecked = true;
    }

    // Decay trauma (screen shake) - usa tiempo real, respeta reduced motion
    if (this.trauma > 0 && !this.reducedMotion) {
      this.trauma = Math.max(0, this.trauma - this.traumaDecay * dt);
    }
    this.shakeTime += dt * 30;

    // Actualizar escena actual
    if (this.currentScene && this.currentScene.update) {
      this.currentScene.update(dt);
    }

    // Actualizar transicion
    if (this.gameState.transitioning) {
      // La transicion se maneja en changeScene
    }

    // Reset input de click
    this.mouse.clicked = false;
  }

  /**
   * Anadir trauma para screen shake
   * @param {number} amount - 0.1 a 1.0
   */
  addTrauma(amount) {
    this.trauma = Math.min(1, this.trauma + amount);
  }

  /**
   * Renderizar frame
   */
  render(alpha) {
    // Check high contrast preference
    if (!this.highContrastChecked) {
      this.highContrast = window.matchMedia('(prefers-contrast: high)').matches;
      this.highContrastChecked = true;
    }

    // Asegurar pixel art crisp en cada frame (algunos navegadores lo resetean)
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.msImageSmoothingEnabled = false;

    // Calcular shake offset (respeta reduced motion)
    let shakeX = 0, shakeY = 0, shakeRoll = 0;
    if (this.trauma > 0 && !this.reducedMotion) {
      const traumaSq = this.trauma * this.trauma;
      shakeX = Math.sin(this.shakeTime * 1.7) * this.maxShakeOffset * traumaSq;
      shakeY = Math.sin(this.shakeTime * 2.3) * this.maxShakeOffset * traumaSq;
      shakeRoll = Math.sin(this.shakeTime * 1.1) * this.maxShakeRoll * traumaSq;
    }

    // Aplicar shake transform
    this.ctx.save();
    this.ctx.translate(shakeX, shakeY);
    if (shakeRoll !== 0) this.ctx.rotate(shakeRoll);

    // Limpiar canvas (considerando shake)
    this.ctx.fillStyle = this.highContrast ? '#000000' : '#0f0f1a';
    this.ctx.fillRect(-shakeX, -shakeY, this.width + Math.abs(shakeX) * 2, this.height + Math.abs(shakeY) * 2);

    // Renderizar escena actual
    if (this.currentScene && this.currentScene.render) {
      this.currentScene.render(this.ctx, alpha);
    }

    // Renderizar overlay de transicion
    if (this.gameState.transitioning) {
      this.renderTransition();
    }

    this.ctx.restore();

    // Debug info (opcional)
    if (this.showDebug) {
      this.renderDebug();
    }
  }

  /**
   * Renderizar overlay de transicion
   */
  renderTransition() {
    const progress = this.gameState.transitionDirection === 'out'
      ? this.gameState.transitionProgress
      : 1 - this.gameState.transitionProgress;

    this.ctx.fillStyle = `rgba(15, 15, 26, ${progress})`;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  /**
   * Renderizar info de debug
   */
  renderDebug() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(5, 5, 200, 100);
    this.ctx.font = '8px VT323, monospace';
    this.ctx.fillStyle = '#0f0';
    this.ctx.fillText(`FPS: ${Math.round(1000 / this.deltaTime)}`, 10, 20);
    this.ctx.fillText(`Scene: ${this.currentSceneId}`, 10, 35);
    this.ctx.fillText(`Mouse: ${this.mouse.x}, ${this.mouse.y}`, 10, 50);
    this.ctx.fillText(`Gifts: ${this.gameState.completedGifts.size}/4`, 10, 65);
    this.ctx.fillText(`Tickets: ${this.gameState.redeemedTickets.size}/6`, 10, 80);
  }

  /**
   * Iniciar el loop del juego
   */
  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.animationId = requestAnimationFrame(this.gameLoop);
  }

  /**
   * Detener el loop del juego
   */
  stop() {
    this.running = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Manejar redimensionamiento
   */
  handleResize() {
    const container = this.canvas.parentElement;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Mantener aspect ratio 16:9 (480x270)
    const aspectRatio = this.width / this.height;
    let newWidth, newHeight;

    if (containerWidth / containerHeight > aspectRatio) {
      newHeight = containerHeight;
      newWidth = newHeight * aspectRatio;
    } else {
      newWidth = containerWidth;
      newHeight = newWidth / aspectRatio;
    }

    this.scale = newWidth / this.width;

    this.canvas.style.width = `${newWidth}px`;
    this.canvas.style.height = `${newHeight}px`;

    // Reconfigurar canvas para pixel art crisp (se pierde al cambiar width/height)
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.msImageSmoothingEnabled = false;

    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  /**
   * Convertir coordenadas de pantalla a coordenadas de juego
   */
  screenToGame(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (clientX - rect.left) / this.scale;
    const y = (clientY - rect.top) / this.scale;
    return { x, y };
  }

  // ========== INPUT HANDLERS ==========

  handleKeyDown(e) {
    this.keys.add(e.code);
    if (this.currentScene && this.currentScene.onKeyDown) {
      this.currentScene.onKeyDown(e.code, e);
    }
  }

  handleKeyUp(e) {
    this.keys.delete(e.code);
    if (this.currentScene && this.currentScene.onKeyUp) {
      this.currentScene.onKeyUp(e.code, e);
    }
  }

  handleMouseMove(e) {
    const pos = this.screenToGame(e.clientX, e.clientY);
    this.mouse.x = pos.x;
    this.mouse.y = pos.y;
    if (this.currentScene && this.currentScene.onMouseMove) {
      this.currentScene.onMouseMove(pos.x, pos.y);
    }
  }

  handleMouseDown(e) {
    this.mouse.down = true;
    if (this.currentScene && this.currentScene.onMouseDown) {
      this.currentScene.onMouseDown(this.mouse.x, this.mouse.y);
    }
  }

  handleMouseUp(e) {
    this.mouse.down = false;
    if (this.currentScene && this.currentScene.onMouseUp) {
      this.currentScene.onMouseUp(this.mouse.x, this.mouse.y);
    }
  }

  handleClick(e) {
    this.mouse.clicked = true;
    if (this.currentScene && this.currentScene.onClick) {
      this.currentScene.onClick(this.mouse.x, this.mouse.y);
    }
  }

  handleTouchStart(e) {
    e.preventDefault();
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const pos = this.screenToGame(touch.clientX, touch.clientY);
      this.touch.x = pos.x;
      this.touch.y = pos.y;
      this.touch.active = true;
      this.mouse.x = pos.x;
      this.mouse.y = pos.y;
      this.mouse.down = true;
      if (this.currentScene && this.currentScene.onTouchStart) {
        this.currentScene.onTouchStart(pos.x, pos.y);
      }
    }
  }

  handleTouchMove(e) {
    e.preventDefault();
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const pos = this.screenToGame(touch.clientX, touch.clientY);
      this.touch.x = pos.x;
      this.touch.y = pos.y;
      this.mouse.x = pos.x;
      this.mouse.y = pos.y;
      if (this.currentScene && this.currentScene.onTouchMove) {
        this.currentScene.onTouchMove(pos.x, pos.y);
      }
    }
  }

  handleTouchEnd(e) {
    e.preventDefault();
    this.touch.active = false;
    this.mouse.down = false;
    this.mouse.clicked = true;
    if (this.currentScene && this.currentScene.onTouchEnd) {
      this.currentScene.onTouchEnd(this.touch.x, this.touch.y);
    }
    if (this.currentScene && this.currentScene.onClick) {
      this.currentScene.onClick(this.touch.x, this.touch.y);
    }
  }

  // ========== GAME STATE MANAGEMENT ==========

  /**
   * Marcar regalo como completado
   */
  completeGift(giftKey) {
    this.gameState.completedGifts.add(giftKey);
    this.saveGame();
  }

  /**
   * Verificar si regalo esta completado
   */
  isGiftCompleted(giftKey) {
    return this.gameState.completedGifts.has(giftKey);
  }

  /**
   * Canjear ticket
   */
  redeemTicket(ticketId) {
    this.gameState.redeemedTickets.add(ticketId);
    this.saveGame();
  }

  /**
   * Verificar si ticket esta canjeado
   */
  isTicketRedeemed(ticketId) {
    return this.gameState.redeemedTickets.has(ticketId);
  }

  /**
   * Verificar si todos los regalos completados
   */
  allGiftsCompleted() {
    return this.gameState.completedGifts.size >= personalData.gifts.length;
  }

  /**
   * Guardar juego en localStorage
   */
  saveGame() {
    if (!personalData.gameConfig.autoSave) return;

    const saveData = {
      completedGifts: Array.from(this.gameState.completedGifts),
      redeemedTickets: Array.from(this.gameState.redeemedTickets),
      currentScene: this.currentSceneId,
      timestamp: Date.now()
    };

    try {
      localStorage.setItem(personalData.gameConfig.saveKey, JSON.stringify(saveData));
    } catch (e) {
      console.warn('No se pudo guardar el juego:', e);
    }
  }

  /**
   * Cargar juego de localStorage
   */
  loadGame() {
    try {
      const saved = localStorage.getItem(personalData.gameConfig.saveKey);
      if (saved) {
        const data = JSON.parse(saved);
        this.gameState.completedGifts = new Set(data.completedGifts || []);
        this.gameState.redeemedTickets = new Set(data.redeemedTickets || []);
        this.gameState.saveData = data;
        return data;
      }
    } catch (e) {
      console.warn('No se pudo cargar el juego:', e);
    }
    return null;
  }

  /**
   * Resetear juego completamente
   */
  resetGame() {
    this.gameState.completedGifts.clear();
    this.gameState.redeemedTickets.clear();
    this.gameState.saveData = null;
    try {
      localStorage.removeItem(personalData.gameConfig.saveKey);
    } catch (e) {
      console.warn('No se pudo limpiar save:', e);
    }
  }

  /**
   * Obtener estado actual para UI
   */
  getState() {
    return {
      currentScene: this.currentSceneId,
      completedGifts: this.gameState.completedGifts.size,
      totalGifts: personalData.gifts.length,
      redeemedTickets: this.gameState.redeemedTickets.size,
      totalTickets: personalData.tickets.length,
      allCompleted: this.allGiftsCompleted()
    };
  }

  /**
   * Limpiar recursos
   */
  destroy() {
    this.stop();
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    audioManager.destroy();
  }
}

// Singleton instance
export const gameEngine = new GameEngine();
export default gameEngine;