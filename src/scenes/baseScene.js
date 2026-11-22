/**
 * BaseScene - Clase base para todas las escenas
 */

// ============================================
// EASING FUNCTIONS (Game Feel)
// ============================================
export const Easing = {
  // Standard
  linear: t => t,
  easeOutCubic: t => 1 - Math.pow(1 - t, 3),
  easeInCubic: t => t * t * t,
  easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,

  // Overshoot/Back - para "pop" en recompensas
  easeOutBack: t => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeInBack: t => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },

  // Bounce - para rebotes suaves
  easeOutBounce: t => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },

  // Elastic - para efectos elasticos sutiles
  easeOutElastic: t => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    const c4 = (2 * Math.PI) / 3;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  }
};

// ============================================
// ANIMATION HELPER - Centralized RAF management
// ============================================
export class AnimationController {
  constructor(scene) {
    this.scene = scene;
    this.animations = new Map(); // id -> { from, to, startTime, durationMs, easing, onUpdate, onComplete, cancelled }
    this.delays = new Set();
    this.nextId = 0;
  }

  /**
   * Animar un valor con easing
   * @param {Object} options - { from, to, duration, easing, onUpdate, onComplete }
   * @returns {Promise} Promise que resuelve al completar, con .cancel() method
   */
  animate(options) {
    const { from = 0, to = 1, duration = 0.5, easing = Easing.easeOutCubic, onUpdate, onComplete } = options;
    const id = ++this.nextId;
    const startTime = performance.now();
    const durationMs = Math.max(1, duration * 1000); // Minimo 1ms para evitar division por cero

    let cancelled = false;

    const anim = {
      id,
      from,
      to,
      startTime,
      durationMs,
      easing,
      onUpdate,
      onComplete,
      get cancelled() { return cancelled; },
      set cancelled(v) { cancelled = v; }
    };

    this.animations.set(id, anim);

    const promise = new Promise((resolve) => {
      const tick = () => {
        if (cancelled) {
          this.animations.delete(id);
          return;
        }

        const elapsed = performance.now() - anim.startTime;
        const progress = Math.min(elapsed / anim.durationMs, 1);
        const eased = anim.easing(progress);
        const value = anim.from + (anim.to - anim.from) * eased;

        if (anim.onUpdate) anim.onUpdate(value, eased);

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          this.animations.delete(id);
          if (anim.onComplete) anim.onComplete();
          resolve();
        }
      };
      requestAnimationFrame(tick);
    });

    // Attach cancel method to promise
    promise.cancel = () => {
      cancelled = true;
      this.animations.delete(id);
    };

    return promise;
  }

  /**
   * Cancelar animacion por Promise
   */
  cancel(promise) {
    if (promise && typeof promise.cancel === 'function') {
      promise.cancel();
    }
  }

  /**
   * Cancelar todas las animaciones
   */
  cancelAll() {
    this.animations.forEach((anim) => {
      anim.cancelled = true;
    });
    this.animations.clear();
  }

  /**
   * Delay helper con cancelacion
   * @returns {Promise} Promise con metodo .cancel()
   */
  delay(ms) {
    let cancelled = false;
    const promise = new Promise((resolve) => {
      const id = setTimeout(() => {
        if (!cancelled) {
          this.delays.delete(id);
          resolve();
        }
      }, ms);
      this.delays.add(id);
    });

    promise.cancel = () => {
      cancelled = true;
      // Note: can't easily cancel setTimeout without tracking id, but flag prevents resolve
    };

    return promise;
  }

  /**
   * Cancelar todos los delays pendientes
   */
  cancelAllDelays() {
    this.delays.forEach(id => clearTimeout(id));
    this.delays.clear();
  }
}

// ============================================
// BASE SCENE
// ============================================
export class BaseScene {
  constructor() {
    this.engine = null;
    this.initialized = false;
    this.background = null;
    this.sprites = [];
    this.uiElements = [];
    this.dialogs = [];
    this.transitionIn = true;
    this.transitionProgress = 0;
    this._fadeOverlayAlpha = 0;

    // Animation management
    this.anim = new AnimationController(this);
    this._pendingPromises = []; // Track promises for cleanup
  }

  init() {
    this.initialized = true;
  }

  onEnter(data = {}) {
    this.transitionIn = true;
    this.transitionProgress = 0;
    // Reset fade overlay
    this._fadeOverlayAlpha = 0;
  }

  onExit() {
    // Limpiar TODOS los recursos de la escena
    this.anim.cancelAll();
    this.anim.cancelAllDelays();

    // Limpiar sprites dinamicos (los que no son persistentes)
    this.sprites.forEach(sprite => {
      if (sprite._dynamic) {
        this.removeSprite(sprite);
      }
    });

    // Limpiar UI dinamica
    this.uiElements.forEach(ui => {
      if (ui._dynamic) this.removeUIElement(ui);
    });

    // Limpiar dialogos
    this.clearDialogs();

    // Reset fade
    this._fadeOverlayAlpha = 0;

    // Limpiar array de promesas pendientes
    this._pendingPromises = [];
  }

  update(dt) {
    // Actualizar fondo
    if (this.background && this.background.update) {
      this.background.update(dt);
    }

    // Actualizar sprites
    this.sprites.forEach(sprite => {
      if (sprite.update) sprite.update(dt);
    });

    // Actualizar UI
    this.uiElements.forEach(ui => {
      if (ui.update) ui.update(dt);
    });

    // Actualizar dialogos
    this.dialogs.forEach(dialog => {
      if (dialog.update) dialog.update(dt);
    });

    // Progreso de transicion de entrada (engine-managed)
    if (this.transitionIn) {
      this.transitionProgress += dt * 2;
      if (this.transitionProgress >= 1) {
        this.transitionIn = false;
        this.transitionProgress = 1;
      }
    }
  }

  render(ctx, alpha) {
    // Renderizar fondo
    if (this.background && this.background.render) {
      this.background.render(ctx, this.engine.width, this.engine.height);
    }

    // Renderizar sprites (ordenados por Y para profundidad)
    const sortedSprites = [...this.sprites].sort((a, b) => (a.y || 0) - (b.y || 0));
    sortedSprites.forEach(sprite => {
      if (sprite.visible && sprite.render) {
        sprite.render(ctx);
      }
    });

    // Renderizar UI
    this.uiElements.forEach(ui => {
      if (ui.visible && ui.render) {
        ui.render(ctx);
      }
    });

    // Renderizar dialogos (sobre todo)
    this.dialogs.forEach(dialog => {
      if (dialog.visible && dialog.render) {
        dialog.render(ctx);
      }
    });

    // Overlay de transicion de entrada (engine-managed)
    if (this.transitionIn) {
      const progress = 1 - this.transitionProgress;
      ctx.fillStyle = `rgba(15, 15, 26, ${progress})`;
      ctx.fillRect(0, 0, this.engine.width, this.engine.height);
    }

    // Overlay de fade manual (scene-managed) - usa el mismo color
    if (this._fadeOverlayAlpha > 0) {
      ctx.fillStyle = `rgba(15, 15, 26, ${this._fadeOverlayAlpha})`;
      ctx.fillRect(0, 0, this.engine.width, this.engine.height);
    }
  }

  // Metodos de input (override en subclases)
  onKeyDown(key, event) {}
  onKeyUp(key, event) {}
  onMouseMove(x, y) {}
  onMouseDown(x, y) {}
  onMouseUp(x, y) {}
  onClick(x, y) {}
  onTouchStart(x, y) {}
  onTouchMove(x, y) {}
  onTouchEnd(x, y) {}

  // Helpers
  addSprite(sprite) {
    this.sprites.push(sprite);
    return sprite;
  }

  removeSprite(sprite) {
    const idx = this.sprites.indexOf(sprite);
    if (idx !== -1) this.sprites.splice(idx, 1);
  }

  addUIElement(element) {
    this.uiElements.push(element);
    // Dar acceso a la escena para callbacks de animacion
    if (element) element.scene = this;
    return element;
  }

  removeUIElement(element) {
    const idx = this.uiElements.indexOf(element);
    if (idx !== -1) this.uiElements.splice(idx, 1);
  }

  showDialog(dialog) {
    this.dialogs.push(dialog);
    dialog.visible = true;
    return dialog;
  }

  hideDialog(dialog) {
    dialog.visible = false;
    const idx = this.dialogs.indexOf(dialog);
    if (idx !== -1) this.dialogs.splice(idx, 1);
  }

  clearDialogs() {
    this.dialogs.forEach(d => d.visible = false);
    this.dialogs = [];
  }

  /**
   * Fade out overlay (negro) - delega al engine si esta transicionando
   */
  fadeOut(duration = 0.5) {
    // Si el engine esta en transicion, no hacer fade adicional
    if (this.engine && this.engine.gameState && this.engine.gameState.transitioning) {
      return Promise.resolve();
    }
    return this._fade(1, duration);
  }

  /**
   * Fade in overlay (desde negro)
   */
  fadeIn(duration = 0.5) {
    if (this.engine && this.engine.gameState && this.engine.gameState.transitioning) {
      return Promise.resolve();
    }
    return this._fade(0, duration);
  }

  _fade(targetAlpha, duration) {
    return this.anim.animate({
      from: this._fadeOverlayAlpha,
      to: targetAlpha,
      duration,
      easing: Easing.easeInOutCubic,
      onUpdate: (value) => { this._fadeOverlayAlpha = value; }
    });
  }

  /**
   * Helper para animar propiedades de sprites/UI con easing profesional
   * @returns {Promise}
   */
  tween(target, property, to, duration = 0.5, easing = Easing.easeOutCubic) {
    const from = target[property];
    return this.anim.animate({
      from, to, duration, easing,
      onUpdate: (value) => { target[property] = value; }
    });
  }

  /**
   * Pop animation - overshoot para recompensas
   * @returns {Promise} Promise que resuelve al completar ambas fases (subida + bajada)
   */
  pop(target, property, intensity = 0.3, duration = 0.3) {
    const baseValue = target[property];
    const peakValue = baseValue * (1 + intensity);

    // Primera fase: subida con overshoot
    return this.anim.animate({
      from: baseValue,
      to: peakValue,
      duration: duration * 0.5,
      easing: Easing.easeOutBack,
      onUpdate: (value) => { target[property] = value; }
    }).then(() => {
      // Segunda fase: regreso suave
      return this.anim.animate({
        from: peakValue,
        to: baseValue,
        duration: duration * 0.5,
        easing: Easing.easeOutCubic,
        onUpdate: (value) => { target[property] = value; }
      });
    });
  }
}

/**
 * DialogBox - Cuadro de dialogo pixel art
 */
export class DialogBox {
  constructor(x, y, width, text, options = {}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.text = text;
    this.visible = true;
    this.portrait = options.portrait || null;
    this.name = options.name || null;
    this.choices = options.choices || [];
    this.selectedChoice = 0;
    this.typewriterIndex = 0;
    this.typewriterSpeed = 0.02; // segundos por caracter
    this.typewriterTimer = 0;
    this.typewriterComplete = false;
    this.padding = 12;
    this.lineHeight = 11;
    this.font = '7px "Silkscreen", cursive';
    this.onChoiceSelect = options.onChoiceSelect || null;
    this.autoAdvance = options.autoAdvance || false;
    this.advanceTimer = 0;
    this.advanceDelay = options.advanceDelay || 2;
  }

  update(dt) {
    // Typewriter effect
    if (!this.typewriterComplete) {
      this.typewriterTimer += dt;
      while (this.typewriterTimer >= this.typewriterSpeed && this.typewriterIndex < this.text.length) {
        this.typewriterIndex++;
        this.typewriterTimer -= this.typewriterSpeed;
      }
      if (this.typewriterIndex >= this.text.length) {
        this.typewriterComplete = true;
        if (this.autoAdvance) {
          this.advanceTimer = 0;
        }
      }
    }

    // Auto advance
    if (this.autoAdvance && this.typewriterComplete) {
      this.advanceTimer += dt;
      if (this.advanceTimer >= this.advanceDelay) {
        this.visible = false;
        if (this.onChoiceSelect) this.onChoiceSelect(0);
      }
    }
  }

  render(ctx) {
    if (!this.visible) return;

    const lines = this.wrapText(this.text.substring(0, this.typewriterIndex));
    const textHeight = lines.length * this.lineHeight;
    const nameHeight = this.name ? 16 : 0;
    const choiceHeight = this.choices.length * 16;
    const portraitHeight = this.portrait ? 40 : 0;
    const height = this.padding * 2 + textHeight + nameHeight + choiceHeight + Math.max(0, portraitHeight - textHeight);

    const boxX = this.x - this.width / 2;
    const boxY = this.y;

    // Sombra
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(boxX + 4, boxY + 4, this.width, height);

    // Fondo del dialogo
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(boxX, boxY, this.width, height);

    // Borde exterior
    ctx.strokeStyle = '#3d3d5c';
    ctx.lineWidth = 3;
    ctx.strokeRect(boxX, boxY, this.width, height);

    // Borde interior brillante
    ctx.strokeStyle = '#5a5a8a';
    ctx.lineWidth = 1;
    ctx.strokeRect(boxX + 3, boxY + 3, this.width - 6, height - 6);

    let currentY = boxY + this.padding;

    // Retrato (si existe)
    if (this.portrait) {
      // Placeholder para retrato - dibujar un sprite simple
      ctx.fillStyle = '#3d3d5c';
      ctx.fillRect(boxX + this.padding, currentY, 32, 32);
      ctx.fillStyle = '#ffd700';
      ctx.font = '10px "Press Start 2P", cursive';
      ctx.textAlign = 'center';
      ctx.fillText('?', boxX + this.padding + 16, currentY + 22);
      currentY += 36;
    }

    // Nombre
    if (this.name) {
      ctx.fillStyle = '#ffd700';
      ctx.font = '7px "Silkscreen", cursive';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(this.name, boxX + this.padding + (this.portrait ? 40 : 0), currentY);
      currentY += 16;
    }

    // Texto
    ctx.fillStyle = '#f0f0f0';
    ctx.font = this.font;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    lines.forEach(line => {
      ctx.fillText(line, boxX + this.padding + (this.portrait ? 40 : 0), currentY);
      currentY += this.lineHeight;
    });

    // Opciones
    if (this.choices.length > 0 && this.typewriterComplete) {
      currentY += 8;
      this.choices.forEach((choice, i) => {
        const isSelected = i === this.selectedChoice;
        const choiceY = currentY + i * 16;

        if (isSelected) {
          // Fondo seleccion
          ctx.fillStyle = '#3d3d5c';
          ctx.fillRect(boxX + this.padding, choiceY, this.width - this.padding * 2, 14);

          // Flecha
          ctx.fillStyle = '#ffd700';
          ctx.font = '7px "Silkscreen", cursive';
          ctx.fillText('►', boxX + this.padding + 2, choiceY + 2);
        }

        ctx.fillStyle = isSelected ? '#ffd700' : '#a0a0b0';
        ctx.font = '7px "Silkscreen", cursive';
        ctx.fillText(choice.text, boxX + this.padding + (isSelected ? 12 : 4), choiceY + 2);
      });
    }

    // Indicador de continuar (si no hay opciones y typewriter complete)
    if (this.choices.length === 0 && this.typewriterComplete && !this.autoAdvance) {
      const indicatorX = boxX + this.width - 20;
      const indicatorY = boxY + height - 16;
      const blink = Math.sin(Date.now() * 0.005) > 0;
      if (blink) {
        ctx.fillStyle = '#ffd700';
        ctx.font = '7px "Silkscreen", cursive';
        ctx.fillText('▼', indicatorX, indicatorY);
      }
    }
  }

  wrapText(text) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    const maxWidth = this.width - this.padding * 2 - (this.portrait ? 40 : 0);

    // Usar measureText aproximado (7px * 0.6 ~= 4.2px por caracter)
    const charWidth = 4.2;
    const maxChars = Math.floor(maxWidth / charWidth);

    words.forEach(word => {
      if ((currentLine + word).length <= maxChars) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) lines.push(currentLine);

    return lines;
  }

  handleInput(key) {
    if (this.choices.length > 0) {
      if (key === 'ArrowUp' || key === 'KeyW') {
        this.selectedChoice = (this.selectedChoice - 1 + this.choices.length) % this.choices.length;
      } else if (key === 'ArrowDown' || key === 'KeyS') {
        this.selectedChoice = (this.selectedChoice + 1) % this.choices.length;
      } else if (key === 'Enter' || key === 'Space' || key === 'KeyZ') {
        if (this.onChoiceSelect) {
          this.onChoiceSelect(this.selectedChoice);
        }
      }
    } else if (key === 'Enter' || key === 'Space' || key === 'KeyZ') {
      if (this.typewriterComplete) {
        this.visible = false;
        if (this.onChoiceSelect) this.onChoiceSelect(0);
      } else {
        // Completar typewriter instantaneamente
        this.typewriterIndex = this.text.length;
        this.typewriterComplete = true;
      }
    }
  }

  handleClick(x, y) {
    if (this.choices.length > 0 && this.typewriterComplete) {
      const boxX = this.x - this.width / 2;
      const boxY = this.y;
      const lines = this.wrapText(this.text);
      const textHeight = lines.length * this.lineHeight;
      const nameHeight = this.name ? 16 : 0;
      const startY = boxY + this.padding * 2 + textHeight + nameHeight + 8;

      this.choices.forEach((choice, i) => {
        const choiceY = startY + i * 16;
        if (y >= choiceY && y <= choiceY + 14 &&
            x >= boxX + this.padding && x <= boxX + this.width - this.padding) {
          this.selectedChoice = i;
          if (this.onChoiceSelect) {
            this.onChoiceSelect(i);
          }
        }
      });
    }
  }
}

/**
 * Button - Boton pixel art para UI
 */
export class PixelButton {
  constructor(x, y, width, height, text, options = {}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.text = text;
    this.visible = true;
    this.enabled = true;
    this.hovered = false;
    this.pressed = false;
    this.font = options.font || '7px "Silkscreen", cursive';
    this.onClick = options.onClick || null;
    this.color = options.color || null; // 'heart', 'exit', 'default'
  }

  update(dt) {}

  render(ctx) {
    if (!this.visible) return;

    const cx = this.x;
    const cy = this.y;
    const w = this.width;
    const h = this.height;

    // Sombra
    if (!this.pressed) {
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(cx - w/2 + 2, cy - h/2 + 2, w, h);
    }

    // Fondo
    let bgColor, borderColor, textColor;
    if (!this.enabled) {
      bgColor = '#1a1a2e';
      borderColor = '#3d3d5c';
      textColor = '#5a5a8a';
    } else if (this.pressed) {
      bgColor = '#1a1a2e';
      borderColor = '#b8860b';
      textColor = '#ffd700';
    } else if (this.hovered) {
      bgColor = '#3d3d5c';
      borderColor = '#ffd700';
      textColor = '#ffd700';
    } else {
      bgColor = '#2d2d44';
      borderColor = '#5a5a8a';
      textColor = '#ffd700';
    }

    // Colores especiales
    if (this.color === 'heart') {
      textColor = this.hovered ? '#1a1a2e' : '#ff4466';
      borderColor = this.hovered ? '#ff4466' : '#ff4466';
      bgColor = this.hovered ? '#ff4466' : '#2d2d44';
    } else if (this.color === 'exit') {
      textColor = this.hovered ? '#1a1a2e' : '#ff4466';
      borderColor = '#ff4466';
      bgColor = this.hovered ? '#ff4466' : 'transparent';
    }

    if (bgColor !== 'transparent') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(cx - w/2, cy - h/2, w, h);
    }

    // Borde
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - w/2, cy - h/2, w, h);

    // Borde interior
    if (this.enabled && (this.hovered || this.pressed)) {
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 1;
      ctx.strokeRect(cx - w/2 + 2, cy - h/2 + 2, w - 4, h - 4);
    }

    // Texto
    ctx.fillStyle = textColor;
    ctx.font = this.font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, cx, cy + (this.pressed ? 1 : 0));
  }

  containsPoint(px, py) {
    return px >= this.x - this.width/2 && px <= this.x + this.width/2 &&
           py >= this.y - this.height/2 && py <= this.y + this.height/2;
  }

  handleMouseMove(px, py) {
    this.hovered = this.enabled && this.containsPoint(px, py);
  }

  handleMouseDown(px, py) {
    if (this.enabled && this.containsPoint(px, py)) {
      this.pressed = true;
    }
  }

  handleMouseUp(px, py) {
    if (this.pressed && this.containsPoint(px, py) && this.onClick) {
      this.onClick();
      // Squash feedback on click
      if (this.scene && this.scene.pop) {
        this.scene.pop(this, 'width', 0.1, 0.15);
        this.scene.pop(this, 'height', 0.1, 0.15);
      }
    }
    this.pressed = false;
  }
}

export default {
  BaseScene,
  DialogBox,
  PixelButton
};