/**
 * Escena 8: Desenlace y Galeria de Recuerdos
 * Pradera soleada con chibis de Victor y Yaheyli felices
 * Mensaje "ESPERO TE HAYA GUSTADO, YAHEYLI"
 * Botones: VOLVER A JUGAR / GALERIA DE RECUERDOS
 */

import { BaseScene, DialogBox, PixelButton, Easing } from './baseScene.js';
import { createBackground } from '../art/backgrounds.js';
import { createSprite } from '../art/sprites.js';
import { personalData } from '../config/personalData.js';
import { audioManager } from '../engine/audioManager.js';

export class Scene8Ending extends BaseScene {
  constructor() {
    super();
    this.coupleSprite = null;
    this.phase = 'ending'; // 'ending' | 'gallery'
    this.messageAlpha = 0;
    this.messageText = 'ESPERO TE HAYA GUSTADO, YAHEYLI';
    this.btnReplay = null;
    this.btnGallery = null;
    this.galleryPhotos = [];
    this.galleryIndex = 0;
    this.galleryVisible = false;
    this.gallerySprite = null;
  }

  init() {
    super.init();

    // Fondo: pradera soleada alegre
    this.background = createBackground('ending');

    // Chibis de Victor y Yaheyli (inspirados en carta_pokemon_vy.png)
    this.coupleSprite = createSprite('couple-chibi', this.engine.width / 2, this.engine.height / 2 + 20);
    this.coupleSprite.scale = 1.5;
    this.coupleSprite.alpha = 0;
    this.addSprite(this.coupleSprite);

    // Boton VOLVER A JUGAR
    this.btnReplay = new PixelButton(
      this.engine.width / 2 - 90,
      this.engine.height - 50,
      170,
      28,
      'VOLVER A JUGAR',
      {
        color: 'default',
        onClick: () => this.onReplayClick()
      }
    );
    this.btnReplay.alpha = 0;
    this.addUIElement(this.btnReplay);

    // Boton GALERIA DE RECUERDOS
    this.btnGallery = new PixelButton(
      this.engine.width / 2 + 10,
      this.engine.height - 50,
      170,
      28,
      'GALERIA',
      {
        color: 'heart',
        onClick: () => this.onGalleryClick()
      }
    );
    this.btnGallery.alpha = 0;
    this.addUIElement(this.btnGallery);
  }

  onEnter(data = {}) {
    super.onEnter(data);
    this.phase = 'ending';
    this.galleryVisible = false;
    this.galleryIndex = 0;
    this.messageAlpha = 0;

    // Animar entrada
    this.animateEntrance();

    // Reproducir tema principal alegre
    audioManager.playMusic('main_theme', true);
    audioManager.setMusicVolume(0.5);
  }

  animateEntrance() {
    // Screen shake sutil - momento emocional final
    if (this.engine.addTrauma) this.engine.addTrauma(0.2);

    // Chibis - pop animado
    this.tween(this.coupleSprite, 'scale', 1.6, 1.2, Easing.easeOutBack);
    this.tween(this.coupleSprite, 'alpha', 1.0, 0.8, Easing.easeOutCubic);

    // Mensaje - delay
    setTimeout(() => {
      this.tween(this, 'messageAlpha', 1.0, 1.0, Easing.easeOutCubic);

      // Botones - delay adicional
      setTimeout(() => {
        this.tween(this.btnReplay, 'alpha', 1.0, 0.6, Easing.easeOutBack);
        this.tween(this.btnGallery, 'alpha', 1.0, 0.6, Easing.easeOutBack);
      }, 600);
    }, 1000);
  }

  onReplayClick() {
    audioManager.playSFX('click');

    // Resetear juego completo
    this.engine.resetGame();

    // Volver a intro
    this.engine.changeScene('intro');
  }

  onGalleryClick() {
    audioManager.playSFX('click');
    this.openGallery();
  }

  openGallery() {
    this.phase = 'gallery';
    this.galleryVisible = true;
    this.galleryIndex = 0;

    // Ocultar botones principales
    this.btnReplay.visible = false;
    this.btnGallery.visible = false;

    // Crear sprite de galeria
    this.gallerySprite = createSprite('memory-photo', this.engine.width / 2, this.engine.height / 2 - 20, { photoIndex: this.galleryIndex });
    this.gallerySprite.scale = 1.5;
    this.gallerySprite.alpha = 0;
    this.addSprite(this.gallerySprite);

    // Botones de navegacion galeria
    this.btnPrevGallery = new PixelButton(
      50,
      this.engine.height - 40,
      60,
      24,
      '◄ ANTERIOR',
      {
        onClick: () => this.prevGalleryPhoto()
      }
    );
    this.btnPrevGallery.alpha = 0;
    this.addUIElement(this.btnPrevGallery);

    this.btnNextGallery = new PixelButton(
      this.engine.width - 110,
      this.engine.height - 40,
      60,
      24,
      'SIGUIENTE ►',
      {
        onClick: () => this.nextGalleryPhoto()
      }
    );
    this.btnNextGallery.alpha = 0;
    this.addUIElement(this.btnNextGallery);

    // Boton cerrar galeria
    this.btnCloseGallery = new PixelButton(
      this.engine.width / 2 - 40,
      this.engine.height - 40,
      80,
      24,
      'CERRAR',
      {
        color: 'exit',
        onClick: () => this.closeGallery()
      }
    );
    this.btnCloseGallery.alpha = 0;
    this.addUIElement(this.btnCloseGallery);

    // Animar entrada galeria
    this.animateGalleryEntrance();
  }

  animateGalleryEntrance() {
    // Animar sprite de galeria
    this.tween(this.gallerySprite, 'scale', 1.6, 0.6, Easing.easeOutBack);
    this.tween(this.gallerySprite, 'alpha', 1.0, 0.5, Easing.easeOutCubic);

    // Botones
    this.tween(this.btnPrevGallery, 'alpha', 1.0, 0.4, Easing.easeOutCubic);
    this.tween(this.btnNextGallery, 'alpha', 1.0, 0.4, Easing.easeOutCubic);
    this.tween(this.btnCloseGallery, 'alpha', 1.0, 0.4, Easing.easeOutCubic);
  }

  closeGallery() {
    audioManager.playSFX('click');

    // Animar salida con tween
    const fadeOut = this.tween(this.gallerySprite, 'alpha', 0, 0.4, Easing.easeOutCubic);
    this.tween(this.btnPrevGallery, 'alpha', 0, 0.4, Easing.easeOutCubic);
    this.tween(this.btnNextGallery, 'alpha', 0, 0.4, Easing.easeOutCubic);
    this.tween(this.btnCloseGallery, 'alpha', 0, 0.4, Easing.easeOutCubic);

    fadeOut.then(() => {
      this.removeSprite(this.gallerySprite);
      this.removeUIElement(this.btnPrevGallery);
      this.removeUIElement(this.btnNextGallery);
      this.removeUIElement(this.btnCloseGallery);

      this.galleryVisible = false;
      this.phase = 'ending';

      // Restaurar botones principales
      this.btnReplay.visible = true;
      this.btnGallery.visible = true;
    });
  }

  prevGalleryPhoto() {
    audioManager.playSFX('click');
    this.galleryIndex = (this.galleryIndex - 1 + personalData.memories.photos.length) % personalData.memories.photos.length;
    this.updateGalleryPhoto();
  }

  nextGalleryPhoto() {
    audioManager.playSFX('click');
    this.galleryIndex = (this.galleryIndex + 1) % personalData.memories.photos.length;
    this.updateGalleryPhoto();
  }

  updateGalleryPhoto() {
    if (this.gallerySprite) {
      this.gallerySprite.photoIndex = this.galleryIndex;
      this.gallerySprite.loadPhoto();
    }
  }

  onKeyDown(key) {
    if (key === 'Escape') {
      if (this.galleryVisible) {
        this.closeGallery();
      }
    } else if (key === 'ArrowLeft' && this.galleryVisible) {
      this.prevGalleryPhoto();
    } else if (key === 'ArrowRight' && this.galleryVisible) {
      this.nextGalleryPhoto();
    }
  }

  update(dt) {
    super.update(dt);
  }

  render(ctx, alpha) {
    super.render(ctx, alpha);

    // Mensaje principal
    if (this.phase === 'ending' && this.messageAlpha > 0) {
      ctx.font = '9px "Press Start 2P", cursive';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      // Sombra
      ctx.fillStyle = `rgba(26, 26, 46, ${this.messageAlpha})`;
      ctx.fillText(this.messageText, this.engine.width / 2 + 2, 32);

      // Texto dorado
      ctx.fillStyle = `rgba(255, 215, 0, ${this.messageAlpha})`;
      ctx.fillText(this.messageText, this.engine.width / 2, 30);
    }

    // Indicador galeria
    if (this.galleryVisible) {
      // Contador de foto
      ctx.font = '5px "VT323", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#ffd700';
      ctx.fillText(
        `FOTO ${this.galleryIndex + 1} / ${personalData.memories.photos.length}`,
        this.engine.width / 2,
        10
      );

      // Referencia del recuerdo
      const ref = personalData.memories.references[this.galleryIndex % personalData.memories.references.length];
      ctx.font = '5px "Silkscreen", cursive';
      ctx.fillStyle = '#f0f0f0';
      ctx.fillText(ref, this.engine.width / 2, 25);
    }

    // Instruccion teclado en galeria
    if (this.galleryVisible) {
      ctx.font = '4px "VT323", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = '#a0a0b0';
      ctx.fillText('◄ ► NAVEGAR . ESC CERRAR', this.engine.width / 2, this.engine.height - 5);
    }
  }
}

export default Scene8Ending;