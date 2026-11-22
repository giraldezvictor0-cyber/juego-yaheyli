/**
 * Escena 3: Hub - Seleccion de Regalos
 * Claro del bosque nocturno con flores brillantes
 * 4 regalos animados interactivos:
 * 1. Sobre con corazon (Regalo 1: Carta)
 * 2. Disco CD arcoiris girando (Regalo 2: Musica)
 * 3. Poke Ball (Regalo 3: Minijuego Pokeballs)
 * 4. Ticket verde "TICKET FOR ONE" (Regalo 4: Buho y Tickets)
 * Indicadores de completado (estrellas doradas) y transicion suave
 */

import { BaseScene, DialogBox, PixelButton, Easing } from './baseScene.js';
import { createBackground } from '../art/backgrounds.js';
import { createSprite } from '../art/sprites.js';
import { personalData } from '../config/personalData.js';
import { audioManager } from '../engine/audioManager.js';

export class Scene3Hub extends BaseScene {
  constructor() {
    super();
    this.giftSprites = {};
    this.giftLabels = {};
    this.giftStars = {};
    this.selectedGift = null;
    this.hoveredGift = null;
    this.dialog = null;
    this.btnExit = null;
    this.titleAlpha = 0;
    this.giftsVisible = false;
    this.completionChecked = false;
  }

  init() {
    super.init();

    // Fondo animado
    this.background = createBackground('hub');

    // Posiciones de los 4 regalos (formando un semicirculo)
    const centerX = this.engine.width / 2;
    const centerY = this.engine.height / 2 + 10;
    const radius = 85;

    const positions = [
      { x: centerX - 100, y: centerY - 30, angle: -0.5 },  // Sobre (izq arriba)
      { x: centerX - 20, y: centerY - 70, angle: -1.57 },   // CD (arriba centro)
      { x: centerX + 60, y: centerY - 30, angle: 0.5 },     // Pokeball (der arriba)
      { x: centerX, y: centerY + 40, angle: 1.57 }          // Ticket (abajo centro)
    ];

    // Crear sprites de regalos
    const giftTypes = ['envelope', 'cd', 'pokeball', 'ticket'];
    const giftKeys = ['letter', 'music', 'pokeball', 'ticket'];

    giftTypes.forEach((type, i) => {
      const pos = positions[i];
      const sprite = createSprite(type, pos.x, pos.y);
      sprite.giftKey = giftKeys[i];
      sprite.giftIndex = i;
      sprite.baseX = pos.x;
      sprite.baseY = pos.y;
      sprite.angle = pos.angle;
      sprite.visible = false;
      sprite.alpha = 0;
      this.giftSprites[giftKeys[i]] = sprite;
      this.addSprite(sprite);

      // Etiqueta
      this.giftLabels[giftKeys[i]] = {
        text: personalData.gifts[i].name,
        x: pos.x,
        y: pos.y + 35,
        visible: false,
        alpha: 0
      };

      // Estrella de completado
      this.giftStars[giftKeys[i]] = {
        visible: false,
        x: pos.x + 20,
        y: pos.y - 25,
        alpha: 0,
        pulsePhase: 0
      };
    });

    // Titulo de la escena
    this.titleText = 'ELIGE TU REGALO';

    // Dialogo de confirmacion
    this.dialog = new DialogBox(
      this.engine.width / 2,
      20,
      400,
      '',
      {
        choices: [
          { text: 'SI, ABRIR', action: 'confirm' },
          { text: 'VOLVER', action: 'cancel' }
        ],
        onChoiceSelect: (index) => this.onDialogChoice(index)
      }
    );
    this.dialog.visible = false;
    this.addUIElement(this.dialog);

    // Boton EXIT (esquina superior derecha)
    this.btnExit = new PixelButton(
      this.engine.width - 30,
      20,
      50,
      22,
      'EXIT',
      {
        color: 'exit',
        onClick: () => this.onExitClick()
      }
    );
    this.addUIElement(this.btnExit);

    // Mensaje de instruccion
    this.instructionText = 'Pulsa un regalo para abrirlo';
    this.instructionAlpha = 0;
  }

  onEnter(data = {}) {
    super.onEnter(data);

    // Resetear estado visual
    this.titleAlpha = 0;
    this.giftsVisible = false;
    this.instructionAlpha = 0;
    this.selectedGift = null;
    this.hoveredGift = null;
    this.dialog.visible = false;

    // Actualizar estrellas segun progreso guardado
    this.updateCompletionStars();

    // Animar entrada de regalos escalonada
    this.animateGiftsEntrance();

    // Reproducir tema principal
    audioManager.playMusic('main_theme', true);
    audioManager.setMusicVolume(0.6);

    // Mostrar titulo e instruccion
    setTimeout(() => {
      this.animateTitle();
    }, 500);
  }

  animateGiftsEntrance() {
    const giftKeys = Object.keys(this.giftSprites);
    giftKeys.forEach((key, i) => {
      const sprite = this.giftSprites[key];
      const label = this.giftLabels[key];

      setTimeout(() => {
        sprite.visible = true;
        label.visible = true;

        // Animar alpha y posicion con tween
        sprite.y = sprite.baseY + 30;
        sprite.alpha = 0;
        label.alpha = 0;

        this.tween(sprite, 'alpha', 1.0, 0.6, Easing.easeOutCubic);
        this.tween(sprite, 'y', sprite.baseY, 0.6, Easing.easeOutBack);
        this.tween(label, 'alpha', 1.0, 0.6, Easing.easeOutCubic);

        // Efecto de rebote continuo al final
        setTimeout(() => {
          this._floatGift(sprite);
        }, 600);

        // Sonido escalonado
        setTimeout(() => {
          audioManager.playSFX('firefly');
        }, i * 100);
      }, i * 200);
    });

    // Mostrar instruccion al final
    setTimeout(() => {
      this.giftsVisible = true;
      this.animateInstruction();
    }, giftKeys.length * 200 + 400);
  }

  animateTitle() {
    this.titleAlpha = 0;
    this.tween(this, 'titleAlpha', 1.0, 0.8, Easing.easeOutCubic);
  }

  animateInstruction() {
    this.instructionAlpha = 0;
    this.tween(this, 'instructionAlpha', 1.0, 1.0, Easing.easeOutCubic);
  }

  _floatGift(sprite) {
    this.tween(sprite, 'offsetY', 3, 1.0, Easing.easeInOutCubic).then(() => {
      this.tween(sprite, 'offsetY', -3, 1.0, Easing.easeInOutCubic).then(() => {
        this._floatGift(sprite);
      });
    });
  }

  updateCompletionStars() {
    const completedGifts = this.engine.gameState.completedGifts;
    Object.keys(this.giftStars).forEach(key => {
      const star = this.giftStars[key];
      star.visible = completedGifts.has(key);
      if (star.visible) {
        star.pulsePhase = Math.random() * Math.PI * 2;
      }
    });
  }

  checkAllGiftsCompleted() {
    if (this.engine.allGiftsCompleted() && !this.completionChecked) {
      this.completionChecked = true;
      // Mostrar mensaje o desbloquear escena final
      setTimeout(() => {
        this.showCompletionMessage();
      }, 1000);
    }
  }

  showCompletionMessage() {
    this.dialog.text = 'Has encontrado los 4 regalos!\nSe ha desbloqueado el final...';
    this.dialog.choices = [
      { text: 'VER FINAL', action: 'ending' },
      { text: 'SEGUIR EXPLORANDO', action: 'cancel' }
    ];
    this.dialog.typewriterIndex = 0;
    this.dialog.typewriterComplete = false;
    this.dialog.visible = true;
    audioManager.playSFX('success');
  }

  onDialogChoice(index) {
    const choice = this.dialog.choices[index];
    this.dialog.visible = false;

    if (choice.action === 'ending') {
      audioManager.playSFX('click');
      this.engine.changeScene('ending');
    } else if (choice.action === 'confirm') {
      this.confirmGiftOpen();
    }
  }

  confirmGiftOpen() {
    if (this.selectedGift) {
      const giftKey = this.selectedGift.giftKey;
      const sceneId = this.getSceneForGift(giftKey);
      audioManager.playSFX('click');
      this.engine.changeScene(sceneId, { giftKey });
    }
    this.selectedGift = null;
  }

  getSceneForGift(giftKey) {
    const scenes = {
      'letter': 'letter',
      'music': 'music',
      'pokeball': 'pokeballs',
      'ticket': 'tickets'
    };
    return scenes[giftKey] || 'hub';
  }

  onExitClick() {
    audioManager.playSFX('clickLow');
    this.engine.changeScene('intro');
  }

  update(dt) {
    super.update(dt);

    // Animar estrellas de completado
    Object.values(this.giftStars).forEach(star => {
      if (star.visible) {
        star.pulsePhase += dt * 3;
      }
    });

    // Animar flotacion de regalos
    Object.values(this.giftSprites).forEach(sprite => {
      if (sprite.visible && sprite.alpha >= 1) {
        sprite.offsetY = Math.sin(Date.now() * 0.003 + sprite.angle * 2) * 4;
      }
    });

    // Verificar completacion
    this.checkAllGiftsCompleted();
  }

  render(ctx, alpha) {
    super.render(ctx, alpha);

    // Renderizar titulo
    this.renderTitle(ctx);

    // Renderizar estrellas de completado
    this.renderStars(ctx);

    // Renderizar etiquetas de regalos
    this.renderLabels(ctx);

    // Renderizar instruccion
    this.renderInstruction(ctx);

    // Renderizar destello en regalo hover
    this.renderHoverGlow(ctx);
  }

  renderTitle(ctx) {
    if (this.titleAlpha <= 0) return;

    const centerX = this.engine.width / 2;
    const y = 25;

    ctx.font = '9px "Press Start 2P", cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Sombra
    ctx.fillStyle = `rgba(0,0,0,${0.6 * this.titleAlpha})`;
    ctx.fillText(this.titleText, centerX + 2, y + 2);

    // Texto dorado
    ctx.fillStyle = `rgba(255, 215, 0, ${this.titleAlpha})`;
    ctx.fillText(this.titleText, centerX, y);
  }

  renderStars(ctx) {
    Object.entries(this.giftStars).forEach(([key, star]) => {
      if (!star.visible) return;

      const pulse = 1 + Math.sin(star.pulsePhase) * 0.2;
      const size = 6 * pulse;
      const alpha = 0.8 + Math.sin(star.pulsePhase * 2) * 0.2;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#ffd700';

      // Estrella de 5 puntas
      const cx = star.x;
      const cy = star.y;
      const spikes = 5;
      const outerRadius = size;
      const innerRadius = size / 2;

      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI / spikes) - Math.PI / 2;
        const px = cx + Math.cos(angle) * radius;
        const py = cy + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();

      // Brillo central
      ctx.fillStyle = '#fff8a8';
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  }

  renderLabels(ctx) {
    Object.entries(this.giftLabels).forEach(([key, label]) => {
      if (!label.visible || label.alpha <= 0) return;

      ctx.font = '5px "Silkscreen", cursive';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Sombra
      ctx.fillStyle = `rgba(0,0,0,${0.5 * label.alpha})`;
      ctx.fillText(label.text, label.x + 1, label.y + 1);

      // Texto
      ctx.fillStyle = `rgba(240, 240, 240, ${label.alpha})`;
      ctx.fillText(label.text, label.x, label.y);
    });
  }

  renderInstruction(ctx) {
    if (this.instructionAlpha <= 0) return;

    const centerX = this.engine.width / 2;
    const y = this.engine.height - 20;

    ctx.font = '5px "Silkscreen", cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Parpadeo suave
    const blink = 0.5 + Math.sin(Date.now() * 0.002) * 0.5;
    const alpha = this.instructionAlpha * blink;

    ctx.fillStyle = `rgba(160, 160, 176, ${alpha})`;
    ctx.fillText(this.instructionText, centerX, y);
  }

  renderHoverGlow(ctx) {
    if (!this.hoveredGift) return;

    const sprite = this.hoveredGift;
    const cx = sprite.x;
    const cy = sprite.y;
    const time = Date.now() * 0.005;

    // Anillo pulsante
    const pulse = 1 + Math.sin(time) * 0.15;
    const radius = 25 * pulse;

    ctx.strokeStyle = `rgba(255, 215, 0, ${0.6 * sprite.alpha})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Particulas doradas
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + time;
      const r = radius + Math.sin(time * 3 + i) * 5;
      const px = cx + Math.cos(angle) * r;
      const py = cy + Math.sin(angle) * r;
      const pAlpha = sprite.alpha * (0.5 + Math.sin(time * 4 + i) * 0.3);
      ctx.fillStyle = `rgba(255, 215, 0, ${pAlpha})`;
      ctx.fillRect(px, py, 2, 2);
    }
  }

  // Input handlers
  onMouseMove(x, y) {
    // Verificar hover en regalos
    this.hoveredGift = null;
    Object.values(this.giftSprites).forEach(sprite => {
      if (sprite.visible && sprite.alpha > 0.5 && sprite.containsPoint(x, y)) {
        this.hoveredGift = sprite;
        sprite.setHovered && sprite.setHovered(true);
      } else {
        sprite.setHovered && sprite.setHovered(false);
      }
    });

    // Boton exit
    this.btnExit.handleMouseMove(x, y);
  }

  onMouseDown(x, y) {
    this.btnExit.handleMouseDown(x, y);
  }

  onMouseUp(x, y) {
    this.btnExit.handleMouseUp(x, y);

    // Click en regalos
    if (!this.dialog.visible) {
      Object.values(this.giftSprites).forEach(sprite => {
        if (sprite.visible && sprite.alpha > 0.5 && sprite.containsPoint(x, y)) {
          this.onGiftClick(sprite);
        }
      });
    }
  }

  onClick(x, y) {}

  onGiftClick(sprite) {
    const giftKey = sprite.giftKey;

    // Verificar si ya esta completado
    if (this.engine.isGiftCompleted(giftKey)) {
      // Ya completado - mostrar mensaje
      this.dialog.text = `Ya completaste: ${personalData.gifts.find(g => g.key === giftKey).name}\nQuieres volver a verlo?`;
      this.dialog.choices = [
        { text: 'SI, VER DE NUEVO', action: 'confirm' },
        { text: 'NO, VOLVER', action: 'cancel' }
      ];
    } else {
      // No completado - confirmar apertura
      const giftData = personalData.gifts.find(g => g.key === giftKey);
      this.dialog.text = `Abrir ${giftData.name}?\n${giftData.description}`;
      this.dialog.choices = [
        { text: 'SI, ABRIR', action: 'confirm' },
        { text: 'NO, VOLVER', action: 'cancel' }
      ];
    }

    this.dialog.typewriterIndex = 0;
    this.dialog.typewriterComplete = false;
    this.dialog.visible = true;
    this.selectedGift = sprite;
    audioManager.playSFX('envelope');
  }

  onKeyDown(key) {
    if (key === 'Escape') {
      if (this.dialog.visible) {
        this.dialog.visible = false;
        this.selectedGift = null;
      } else {
        this.onExitClick();
      }
    }
  }
}

export default Scene3Hub;