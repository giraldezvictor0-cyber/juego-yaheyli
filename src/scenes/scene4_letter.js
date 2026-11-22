/**
 * Escena 4: Regalo 1 - Sobre y Carta
 * Paso A: Sobre gigante en prado con YaheyliChibiSprite y mensaje "PULSA LA CARTA"
 * Paso B: Al pulsar, abre pergamino sobre cielo de nubes al atardecer con boton EXIT rojo,
 *         mostrando progresivamente (typewriter + paginado) la carta sincera de Victor
 */

import { BaseScene, DialogBox, PixelButton, Easing } from './baseScene.js';
import { createBackground, Noise } from '../art/backgrounds.js';
import { createSprite } from '../art/sprites.js';
import { personalData } from '../config/personalData.js';
import { audioManager } from '../engine/audioManager.js';

export class Scene4Letter extends BaseScene {
  constructor() {
    super();
    // Estado de la escena: 'envelope' | 'letter' | 'transitioning'
    this.phase = 'envelope';
    this.envelopeSprite = null;
    this.yaheyliSprite = null;
    this.pulseMessageAlpha = 0;
    this.pulseMessagePhase = 0;

    // Pergamino/carta
    this.letterPages = [];
    this.currentPage = 0;
    this.typewriterIndex = 0;
    this.typewriterTimer = 0;
    this.typewriterSpeed = 0.015; // segundos por caracter
    this.typewriterComplete = false;
    this.pageTransition = false;
    this.pageTransitionProgress = 0;
    this.pageTransitionDirection = 'out';

    // UI
    this.btnExit = null;
    this.btnNextPage = null;
    this.btnPrevPage = null;
    this.instructionText = 'PULSA LA CARTA';
    this.instructionVisible = true;

    // Carta completa de Victor (del PDF)
    this.fullLetterText = this.getFullLetterText();
  }

  getFullLetterText() {
    // Usar el mensaje central del libro + dedicatoria + carta final
    return `${personalData.dedication}\n\n${personalData.centralMessage}\n\n${personalData.iconicPhrases[11]}\n\n${personalData.iconicPhrases[12]}\n\nCon todo mi carino,\nVictor`;
  }

  init() {
    super.init();

    // Fondo: pradera atardecer con nubes
    this.background = createBackground('letter');

    // Sobre gigante (centro)
    this.envelopeSprite = createSprite('envelope', this.engine.width / 2, this.engine.height / 2 + 20);
    this.envelopeSprite.scale = 3.5; // Gigante
    this.addSprite(this.envelopeSprite);

    // Yaheyli chibi (a la derecha del sobre)
    this.yaheyliSprite = createSprite('yaheyli-chibi', this.engine.width / 2 + 80, this.engine.height / 2 + 30);
    this.addSprite(this.yaheyliSprite);

    // Boton EXIT (esquina sup. der.) - solo visible en fase carta
    this.btnExit = new PixelButton(
      this.engine.width - 25,
      20,
      44,
      22,
      'EXIT',
      {
        color: 'exit',
        onClick: () => this.onExitClick()
      }
    );
    this.btnExit.visible = false;
    this.addUIElement(this.btnExit);

    // Botones de paginacion (para fase carta)
    this.btnPrevPage = new PixelButton(
      50,
      this.engine.height - 25,
      50,
      22,
      'ANTERIOR',
      {
        onClick: () => this.prevPage()
      }
    );
    this.btnPrevPage.visible = false;
    this.addUIElement(this.btnPrevPage);

    this.btnNextPage = new PixelButton(
      this.engine.width - 50,
      this.engine.height - 25,
      50,
      22,
      'SIGUIENTE',
      {
        onClick: () => this.nextPage()
      }
    );
    this.btnNextPage.visible = false;
    this.addUIElement(this.btnNextPage);

    // Preparar paginas de la carta (dividir en paginas legibles)
    this.prepareLetterPages();
  }

  prepareLetterPages() {
    const maxCharsPerPage = 420; // Aprox para movil/PC comodo
    const text = this.fullLetterText;

    // Dividir por parrafos primero
    const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);

    let currentPage = '';
    paragraphs.forEach(para => {
      if ((currentPage + para).length > maxCharsPerPage && currentPage.length > 0) {
        this.letterPages.push(currentPage.trim());
        currentPage = para;
      } else {
        currentPage += (currentPage ? '\n\n' : '') + para;
      }
    });
    if (currentPage.trim()) {
      this.letterPages.push(currentPage.trim());
    }

    // Si solo hay una pagina muy larga, forzar division
    if (this.letterPages.length === 1 && this.letterPages[0].length > maxCharsPerPage * 1.5) {
      const full = this.letterPages[0];
      this.letterPages = [];
      for (let i = 0; i < full.length; i += maxCharsPerPage) {
        this.letterPages.push(full.substring(i, i + maxCharsPerPage));
      }
    }

    console.log(`Carta preparada en ${this.letterPages.length} paginas`);
  }

  onEnter(data = {}) {
    super.onEnter(data);

    this.phase = 'envelope';
    this.currentPage = 0;
    this.typewriterIndex = 0;
    this.typewriterTimer = 0;
    this.typewriterComplete = false;
    this.instructionVisible = true;

    this.envelopeSprite.visible = true;
    this.envelopeSprite.alpha = 0;
    this.envelopeSprite.scale = 3.5;
    this.envelopeSprite.y = this.engine.height / 2 + 40;

    this.yaheyliSprite.visible = true;
    this.yaheyliSprite.alpha = 0;
    this.yaheyliSprite.x = this.engine.width / 2 + 100;

    this.btnExit.visible = false;
    this.btnPrevPage.visible = false;
    this.btnNextPage.visible = false;

    // Animar entrada del sobre y chibi
    this.animateEntrance();

    // Reproducir tema principal
    audioManager.playMusic('main_theme', true);
    audioManager.setMusicVolume(0.6);
  }

  animateEntrance() {
    // Sobre: fade in + subir
    this.envelopeSprite.alpha = 0;
    this.envelopeSprite.y = this.engine.height / 2 + 60;
    this.tween(this.envelopeSprite, 'alpha', 1.0, 0.8, Easing.easeOutCubic);
    this.tween(this.envelopeSprite, 'y', this.engine.height / 2 + 40, 0.8, Easing.easeOutCubic).then(() => {
      // Iniciar pulso del mensaje
      this.startInstructionPulse();
      // Yaheyli aparece despues
      setTimeout(() => this.animateYaheyli(), 400);
    });
  }

  animateYaheyli() {
    this.yaheyliSprite.alpha = 0;
    this.yaheyliSprite.x = this.engine.width / 2 + 120;
    this.tween(this.yaheyliSprite, 'alpha', 1.0, 0.6, Easing.easeOutCubic);
    this.tween(this.yaheyliSprite, 'x', this.engine.width / 2 + 80, 0.6, Easing.easeOutBack).then(() => {
      this.yaheyliSprite.wave && this.yaheyliSprite.wave();
    });
  }

  startInstructionPulse() {
    this.pulseMessagePhase = 0;
    this._pulseInstructionMessage();
  }

  _pulseInstructionMessage() {
    if (this.phase !== 'envelope' || !this.instructionVisible) return;
    this.pulseMessagePhase += 0.05;
    this.pulseMessageAlpha = 0.5 + Math.sin(this.pulseMessagePhase) * 0.5;
    requestAnimationFrame(() => this._pulseInstructionMessage());
  }

  onEnvelopeClick() {
    if (this.phase !== 'envelope') return;

    audioManager.playSFX('envelope');
    this.phase = 'transitioning';
    this.instructionVisible = false;

    // Animar sobre abriendose con tween
    this.animateEnvelopeOpen();
  }

  animateEnvelopeOpen() {
    const startScale = this.envelopeSprite.scale;
    const startY = this.envelopeSprite.y;
    const startAlpha = this.envelopeSprite.alpha;

    // Sobre se encoge y desaparece
    this.tween(this.envelopeSprite, 'scale', startScale * 0.2, 0.8, Easing.easeInOutCubic);
    this.tween(this.envelopeSprite, 'y', startY - 60, 0.8, Easing.easeInOutCubic);
    this.tween(this.envelopeSprite, 'alpha', 0, 0.8, Easing.easeInOutCubic);

    // Yaheyli se despide y sale
    this.tween(this.yaheyliSprite, 'x', this.engine.width / 2 + 180, 0.8, Easing.easeInOutCubic);
    this.tween(this.yaheyliSprite, 'alpha', 0, 0.8, Easing.easeInOutCubic).then(() => {
      this.envelopeSprite.visible = false;
      this.yaheyliSprite.visible = false;
      this.transitionToLetter();
    });
  }

  transitionToLetter() {
    this.phase = 'letter';
    this.currentPage = 0;
    this.typewriterIndex = 0;
    this.typewriterTimer = 0;
    this.typewriterComplete = false;

    // Mostrar boton EXIT
    this.btnExit.visible = true;
    this.btnExit.alpha = 0;
    this.tween(this.btnExit, 'alpha', 1.0, 0.5, Easing.easeOutCubic);

    // Mostrar botones de paginacion si hay mas de 1 pagina
    if (this.letterPages.length > 1) {
      this.btnPrevPage.visible = true;
      this.btnNextPage.visible = true;
    }

    audioManager.playSFX('pageTurn');
  }

  onExitClick() {
    audioManager.playSFX('clickLow');
    this.completeGiftAndExit();
  }

  completeGiftAndExit() {
    // Marcar regalo como completado
    this.engine.completeGift('letter');

    // Volver al hub
    this.engine.changeScene('hub');
  }

  nextPage() {
    if (this.currentPage < this.letterPages.length - 1) {
      this.changePage(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.changePage(this.currentPage - 1);
    }
  }

  changePage(newPage) {
    if (this.pageTransition) return;

    audioManager.playSFX('pageTurn');
    this.pageTransition = true;
    this.pageTransitionDirection = 'out';
    this.pageTransitionProgress = 0;

    // Animar salida con tween
    this.tween(this, 'pageTransitionProgress', 1.0, 0.33, Easing.easeInCubic).then(() => {
      this.currentPage = newPage;
      this.typewriterIndex = 0;
      this.typewriterTimer = 0;
      this.typewriterComplete = false;
      this.pageTransitionDirection = 'in';
      this.animateIn();
    });
  }

  animateIn() {
    // Animar entrada con tween
    this.tween(this, 'pageTransitionProgress', 0, 0.33, Easing.easeOutCubic).then(() => {
      this.pageTransition = false;
    });
  }

  update(dt) {
    super.update(dt);

    // Actualizar Yaheyli (respiracion, parpadeo)
    if (this.yaheyliSprite && this.yaheyliSprite.update) {
      this.yaheyliSprite.update(dt);
    }

    // Typewriter effect
    if (this.phase === 'letter' && ! this.typewriterComplete && ! this.pageTransition) {
      this.typewriterTimer += dt;
      const charsPerUpdate = Math.max(1, Math.floor(dt / this.typewriterSpeed));

      for (let i = 0; i < charsPerUpdate; i++) {
        if (this.typewriterIndex < this.letterPages[this.currentPage].length) {
          this.typewriterIndex++;
          // SFX de escritura ocasional
          if (this.typewriterIndex % 3 === 0 && Math.random() < 0.3) {
            audioManager.playSFX('textType');
          }
        } else {
          this.typewriterComplete = true;
          break;
        }
      }
    }

    // Actualizar botones de paginacion
    if (this.btnPrevPage) {
      this.btnPrevPage.enabled = this.currentPage > 0 && this.typewriterComplete && !this.pageTransition;
    }
    if (this.btnNextPage) {
      this.btnNextPage.enabled = this.currentPage < this.letterPages.length - 1 && this.typewriterComplete && !this.pageTransition;
    }
  }

  render(ctx, alpha) {
    super.render(ctx, alpha);

    if (this.phase === 'envelope') {
      this.renderEnvelopePhase(ctx);
    } else if (this.phase === 'letter' || this.phase === 'transitioning') {
      this.renderLetterPhase(ctx);
    }
  }

  renderEnvelopePhase(ctx) {
    // Mensaje "PULSA LA CARTA" pulsante
    if (this.instructionVisible && this.pulseMessageAlpha > 0) {
      const centerX = this.engine.width / 2;
      const y = this.engine.height - 40;

      ctx.font = '6px "Press Start 2P", cursive';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Sombra
      ctx.fillStyle = `rgba(0,0,0,${0.6 * this.pulseMessageAlpha})`;
      ctx.fillText(this.instructionText, centerX + 1, y + 1);

      // Texto con color corazon pulsante
      const r = Math.floor(255 * this.pulseMessageAlpha);
      const g = Math.floor(68 * this.pulseMessageAlpha);
      const b = Math.floor(102 * this.pulseMessageAlpha);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillText(this.instructionText, centerX, y);
    }

    // Indicador de click/tap en el sobre
    if (this.envelopeSprite.visible && this.envelopeSprite.alpha > 0.5) {
      const time = Date.now() * 0.003;
      const bounce = Math.sin(time) * 4;
      ctx.fillStyle = `rgba(255, 215, 0, ${0.5 * this.envelopeSprite.alpha})`;
      ctx.font = '8px "Press Start 2P", cursive';
      ctx.textAlign = 'center';
      ctx.fillText('▼', this.envelopeSprite.x, this.envelopeSprite.y - this.envelopeSprite.height / 2 * this.envelopeSprite.scale - 10 + bounce);
    }
  }

  renderLetterPhase(ctx) {
    // Fondo de pergamino (se dibuja sobre el fondo de pradera)
    this.renderParchment(ctx);

    // Texto de la carta con typewriter
    this.renderLetterText(ctx);

    // Indicador de pagina
    this.renderPageIndicator(ctx);

    // Efecto de transicion de pagina
    if (this.pageTransition) {
      this.renderPageTransition(ctx);
    }
  }

  renderParchment(ctx) {
    const margin = 25;
    const parchmentX = margin;
    const parchmentY = margin;
    const parchmentW = this.engine.width - margin * 2;
    const parchmentH = this.engine.height - margin * 2 - 40; // Espacio para botones

    // Sombra del pergamino
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(parchmentX + 4, parchmentY + 4, parchmentW, parchmentH);

    // Pergamino base (color crema envejecido)
    const parchmentGradient = ctx.createLinearGradient(parchmentX, parchmentY, parchmentX, parchmentY + parchmentH);
    parchmentGradient.addColorStop(0, '#fdf6e3');
    parchmentGradient.addColorStop(0.5, '#f5e6c8');
    parchmentGradient.addColorStop(1, '#ebe0d0');
    ctx.fillStyle = parchmentGradient;
    ctx.fillRect(parchmentX, parchmentY, parchmentW, parchmentH);

    // Borde decorativo (doble linea)
    ctx.strokeStyle = '#c9b896';
    ctx.lineWidth = 2;
    ctx.strokeRect(parchmentX + 3, parchmentY + 3, parchmentW - 6, parchmentH - 6);

    ctx.strokeStyle = '#d4c4a0';
    ctx.lineWidth = 1;
    ctx.strokeRect(parchmentX + 8, parchmentY + 8, parchmentW - 16, parchmentH - 16);

    // Esquinas decorativas
    this.drawParchmentCorners(ctx, parchmentX, parchmentY, parchmentW, parchmentH);

    // Textura sutil de papel (ruido)
    this.renderPaperTexture(ctx, parchmentX, parchmentY, parchmentW, parchmentH);

    // Linea divisoria superior (debajo del titulo implicito)
    ctx.strokeStyle = 'rgba(200, 180, 140, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(parchmentX + 30, parchmentY + 35);
    ctx.lineTo(parchmentX + parchmentW - 30, parchmentY + 35);
    ctx.stroke();
  }

  drawParchmentCorners(ctx, x, y, w, h) {
    const cornerSize = 12;
    const color = '#c9b896';

    // Esquina sup-izq
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 8, y + 8 + cornerSize);
    ctx.lineTo(x + 8, y + 8);
    ctx.lineTo(x + 8 + cornerSize, y + 8);
    ctx.stroke();

    // Esquina sup-der
    ctx.beginPath();
    ctx.moveTo(x + w - 8 - cornerSize, y + 8);
    ctx.lineTo(x + w - 8, y + 8);
    ctx.lineTo(x + w - 8, y + 8 + cornerSize);
    ctx.stroke();

    // Esquina inf-izq
    ctx.beginPath();
    ctx.moveTo(x + 8, y + h - 8 - cornerSize);
    ctx.lineTo(x + 8, y + h - 8);
    ctx.lineTo(x + 8 + cornerSize, y + h - 8);
    ctx.stroke();

    // Esquina inf-der
    ctx.beginPath();
    ctx.moveTo(x + w - 8 - cornerSize, y + h - 8);
    ctx.lineTo(x + w - 8, y + h - 8);
    ctx.lineTo(x + w - 8, y + h - 8 - cornerSize);
    ctx.stroke();
  }

  renderPaperTexture(ctx, x, y, w, h) {
    // Puntos sutiles de textura (deterministicos)
    const noise = new Noise(42);
    ctx.fillStyle = 'rgba(180, 160, 120, 0.04)';
    for (let py = y + 10; py < y + h - 10; py += 4) {
      for (let px = x + 10; px < x + w - 10; px += 4) {
        if (noise.random() < 0.08) {
          ctx.fillRect(px, py, 1, 1);
        }
      }
    }
  }

  renderLetterText(ctx) {
    const margin = 25;
    const textX = margin + 35;
    const textY = margin + 50;
    const maxWidth = this.engine.width - margin * 2 - 70;
    const lineHeight = 13;

    const currentText = this.letterPages[this.currentPage].substring(0, this.typewriterIndex);
    const lines = this.wrapText(currentText, maxWidth);

    // Durante transicion, aplicar alpha
    const alpha = this.pageTransition
      ? (this.pageTransitionDirection === 'out' ? 1 - this.pageTransitionProgress : this.pageTransitionProgress)
      : 1;

    ctx.font = '6px "Silkscreen", cursive';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = `rgba(40, 30, 20, ${alpha})`;

    lines.forEach((line, i) => {
      const lineY = textY + i * lineHeight;
      // No renderizar si se sale del area visible
      if (lineY < this.engine.height - 100) {
        ctx.fillText(line, textX, lineY);
      }
    });
  }

  wrapText(text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    // Aproximacion: 6px Silkscreen ~= 3.6px por caracter
    const charWidth = 3.6;
    const maxChars = Math.floor(maxWidth / charWidth);

    words.forEach(word => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      if (testLine.length <= maxChars) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) lines.push(currentLine);

    return lines;
  }

  renderPageIndicator(ctx) {
    if (this.letterPages.length <= 1) return;

    const centerX = this.engine.width / 2;
    const y = this.engine.height - 65;

    ctx.font = '5px "VT323", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#a0a0b0';

    const indicator = `Pagina ${this.currentPage + 1} / ${this.letterPages.length}`;
    ctx.fillText(indicator, centerX, y);
  }

  renderPageTransition(ctx) {
    const progress = this.pageTransitionProgress;
    const direction = this.pageTransitionDirection;

    // Overlay blanco que se expande/contrae desde el centro
    ctx.fillStyle = `rgba(255, 250, 240, ${progress})`;
    if (direction === 'out') {
      // Expandiendo desde centro
      const radius = progress * Math.max(this.engine.width, this.engine.height);
      ctx.beginPath();
      ctx.arc(this.engine.width / 2, this.engine.height / 2, radius, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Contrayendo hacia centro
      const radius = (1 - progress) * Math.max(this.engine.width, this.engine.height);
      ctx.beginPath();
      ctx.arc(this.engine.width / 2, this.engine.height / 2, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Input handlers
  onMouseMove(x, y) {
    if (this.phase === 'envelope') {
      this.envelopeSprite.hovered = this.envelopeSprite.visible && this.envelopeSprite.containsPoint(x, y);
    } else if (this.phase === 'letter') {
      this.btnExit.handleMouseMove(x, y);
      this.btnPrevPage.handleMouseMove(x, y);
      this.btnNextPage.handleMouseMove(x, y);
    }
  }

  onMouseDown(x, y) {
    if (this.phase === 'letter') {
      this.btnExit.handleMouseDown(x, y);
      this.btnPrevPage.handleMouseDown(x, y);
      this.btnNextPage.handleMouseDown(x, y);
    }
  }

  onMouseUp(x, y) {
    if (this.phase === 'envelope') {
      if (this.envelopeSprite.visible && this.envelopeSprite.containsPoint(x, y)) {
        this.onEnvelopeClick();
      }
    } else if (this.phase === 'letter') {
      this.btnExit.handleMouseUp(x, y);
      this.btnPrevPage.handleMouseUp(x, y);
      this.btnNextPage.handleMouseUp(x, y);
    }
  }

  onClick(x, y) {
    // Click en fase envelope ya manejado en onMouseUp
  }

  onTouchStart(x, y) {
    this.onMouseDown(x, y);
  }

  onTouchEnd(x, y) {
    this.onMouseUp(x, y);
  }

  onKeyDown(key) {
    if (this.phase === 'envelope') {
      if (key === 'Enter' || key === 'Space') {
        this.onEnvelopeClick();
      } else if (key === 'Escape') {
        this.completeGiftAndExit();
      }
    } else if (this.phase === 'letter') {
      if (key === 'Escape') {
        this.completeGiftAndExit();
      } else if (key === 'ArrowRight' && this.currentPage < this.letterPages.length - 1) {
        this.nextPage();
      } else if (key === 'ArrowLeft' && this.currentPage > 0) {
        this.prevPage();
      } else if (key === 'Enter' || key === 'Space') {
        if (!this.typewriterComplete) {
          // Completar typewriter instantaneamente
          this.typewriterIndex = this.letterPages[this.currentPage].length;
          this.typewriterComplete = true;
        }
      }
    }
  }
}

export default Scene4Letter;