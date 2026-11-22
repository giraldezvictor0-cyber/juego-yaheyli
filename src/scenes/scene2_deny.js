/**
 * Escena 2: Denegar - Gatito llorando
 * Templo nocturno con columnas y luna llena
 * Gatito blanco y naranja pixel art llorando con "VA PORFI, INTENTALO..."
 * Boton: "ESTA BIEN..."
 */

import { BaseScene, DialogBox, PixelButton, Easing } from './baseScene.js';
import { createBackground } from '../art/backgrounds.js';
import { createSprite } from '../art/sprites.js';
import { audioManager } from '../engine/audioManager.js';

export class Scene2Deny extends BaseScene {
  constructor() {
    super();
    this.cat = null;
    this.dialog = null;
    this.btnOk = null;
    this.sceneTimer = 0;
    this.dialogShown = false;
  }

  init() {
    super.init();

    // Fondo animado
    this.background = createBackground('deny');

    // Gatito
    this.cat = createSprite('cat', this.engine.width / 2, 140);
    this.addSprite(this.cat);

    // Dialogo
    this.dialog = new DialogBox(
      this.engine.width / 2,
      20,
      400,
      'VA PORFI, INTENTALO...',
      {
        autoAdvance: false,
        onChoiceSelect: () => {}
      }
    );
    this.dialog.y = 20;
    this.addUIElement(this.dialog);

    // Boton "ESTA BIEN..."
    this.btnOk = new PixelButton(
      this.engine.width / 2,
      230,
      140,
      30,
      "ESTA BIEN...",
      {
        color: 'heart',
        onClick: () => this.onOkClick()
      }
    );
    this.addUIElement(this.btnOk);

    // Inicialmente oculto
    this.btnOk.visible = false;
    this.dialog.visible = false;
  }

  onEnter(data = {}) {
    super.onEnter(data);

    this.sceneTimer = 0;
    this.dialogShown = false;
    this.btnOk.visible = false;
    this.dialog.visible = false;

    // Reproducir tema triste
    audioManager.playMusic('main_theme', true); // Usar tema principal por ahora
    audioManager.setMusicVolume(0.4);

    // SFX de aparicion
    setTimeout(() => {
      audioManager.playSFX('heartbeat');
    }, 300);

    // Mostrar dialogo despues de un momento
    setTimeout(() => {
      this.showDialog();
    }, 1500);
  }

  showDialog() {
    this.dialog.visible = true;
    this.dialogShown = true;
    audioManager.playSFX('envelope');

    // Mostrar boton despues del dialogo
    setTimeout(() => {
      this.btnOk.visible = true;
      this.btnOk.y = 250;
      this.tween(this.btnOk, 'y', 230, 0.5, Easing.easeOutBack);
      audioManager.playSFX('firefly');
    }, 2000);
  }

  onOkClick() {
    audioManager.playSFX('click');
    audioManager.setMusicVolume(0.6);
    this.engine.changeScene('hub');
  }

  update(dt) {
    super.update(dt);
    this.sceneTimer += dt;
  }

  render(ctx, alpha) {
    super.render(ctx, alpha);

    // Renderizar luna extra brillante (sobre el fondo)
    this.renderMoonGlow(ctx);
  }

  renderMoonGlow(ctx) {
    const moonX = 400;
    const moonY = 60;
    const time = this.sceneTimer;

    // Resplandor pulsante
    const pulse = 1 + Math.sin(time * 2) * 0.1;
    for (let r = 50 * pulse; r > 35; r -= 3) {
      const alpha = (50 * pulse - r) / (15 * pulse) * 0.08;
      ctx.fillStyle = `rgba(255, 255, 220, ${alpha})`;
      // Dibujar circulo aproximado
      for (let dy = -r; dy <= r; dy++) {
        const dx = Math.floor(Math.sqrt(r * r - dy * dy));
        ctx.fillRect(moonX - dx, moonY + dy, dx * 2, 1);
      }
    }
  }

  // Input handlers
  onMouseMove(x, y) {
    if (this.btnOk.visible) {
      this.btnOk.handleMouseMove(x, y);
    }
  }

  onMouseDown(x, y) {
    if (this.btnOk.visible) {
      this.btnOk.handleMouseDown(x, y);
    }
  }

  onMouseUp(x, y) {
    if (this.btnOk.visible) {
      this.btnOk.handleMouseUp(x, y);
    }
  }

  onClick(x, y) {}

  onKeyDown(key) {
    if ((key === 'Enter' || key === 'Space') && this.btnOk.visible) {
      this.onOkClick();
    }
  }
}

export default Scene2Deny;