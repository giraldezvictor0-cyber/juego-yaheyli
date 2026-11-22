/**
 * Escena 1: Portada/Introduccion
 * Paisaje al atardecer/noche con montanas, lago con reflejos, flores, luciernagas, petalos cayendo
 * Titulo: "Nuestra historia todavia tiene paginas por escribir"
 * Subtitulo: "Quieres ver tu regalo?"
 * Botones: "EMPEZAR" y "DENEGAR"
 */

import { BaseScene, DialogBox, PixelButton, Easing } from './baseScene.js';
import { createBackground } from '../art/backgrounds.js';
import { personalData } from '../config/personalData.js';
import { audioManager } from '../engine/audioManager.js';

export class Scene1Intro extends BaseScene {
  constructor() {
    super();
    this.titleAlpha = 0;
    this.titlePhase = 0;
    this.subtitleAlpha = 0;
    this.buttonsVisible = false;
    this.petalBurst = [];
  }

  init() {
    super.init();

    // Fondo animado
    this.background = createBackground('intro');

    // Titulo principal (animado)
    this.titleText = personalData.title;
    this.subtitleText = 'Quieres ver tu regalo?';

    // Botones
    const btnWidth = 100;
    const btnHeight = 28;
    const centerX = this.engine.width / 2;
    const btnY = 200;

    this.btnStart = new PixelButton(
      centerX - 55, btnY, btnWidth, btnHeight, 'EMPEZAR',
      { onClick: () => this.onStartClick() }
    );

    this.btnDeny = new PixelButton(
      centerX + 55, btnY, btnWidth, btnHeight, 'DENEGAR',
      { onClick: () => this.onDenyClick(), color: 'heart' }
    );

    this.addUIElement(this.btnStart);
    this.addUIElement(this.btnDeny);

    // Inicialmente invisibles
    this.btnStart.visible = false;
    this.btnDeny.visible = false;

    // Particulas de explosion de petalos al aparecer titulo
    this.createPetalBurst();
  }

  createPetalBurst() {
    for (let i = 0; i < 30; i++) {
      this.petalBurst.push({
        x: this.engine.width / 2 + (Math.random() - 0.5) * 200,
        y: 60 + Math.random() * 40,
        vx: (Math.random() - 0.5) * 3,
        vy: -2 - Math.random() * 3,
        size: 2 + Math.random() * 3,
        color: Math.random() > 0.5 ? '#ffd0dc' : '#ffb3c6',
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.1,
        life: 1,
        maxLife: 2 + Math.random() * 2
      });
    }
  }

  onEnter(data = {}) {
    super.onEnter(data);

    // Reiniciar animaciones
    this.titleAlpha = 0;
    this.titlePhase = 0;
    this.subtitleAlpha = 0;
    this.buttonsVisible = false;
    this.btnStart.visible = false;
    this.btnDeny.visible = false;
    this.petalBurst = [];
    this.createPetalBurst();

    // Reproducir tema principal
    audioManager.playMusic('main_theme', true);

    // SFX de entrada
    setTimeout(() => audioManager.playSFX('envelope'), 500);
  }

  onStartClick() {
    audioManager.playSFX('click');
    this.engine.changeScene('hub');
  }

  onDenyClick() {
    audioManager.playSFX('clickLow');
    this.engine.changeScene('deny');
  }

  update(dt) {
    super.update(dt);

    // Animacion de aparicion del titulo
    if (this.titleAlpha < 1) {
      this.titleAlpha += dt * 0.8;
      if (this.titleAlpha >= 1) {
        this.titleAlpha = 1;
        // Iniciar subtitulo despues
        setTimeout(() => {
          this.animateSubtitle();
        }, 800);
      }
    }

    this.titlePhase += dt * 2;

    // Animacion de subtitulo
    if (this.subtitleAlpha < 1 && this.titleAlpha >= 1) {
      this.subtitleAlpha += dt * 1.2;
      if (this.subtitleAlpha >= 1) {
        this.subtitleAlpha = 1;
        // Mostrar botones despues
        setTimeout(() => {
          this.showButtons();
        }, 600);
      }
    }

    // Actualizar explosion de petalos
    this.petalBurst = this.petalBurst.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15; // gravedad
      p.rotation += p.rotSpeed;
      p.life += dt;
      return p.life < p.maxLife && p.y < this.engine.height + 20;
    });

    // Parpadeo sutil del titulo
    if (this.titleAlpha >= 1) {
      this.titlePhase += dt * 1.5;
    }
  }

  animateSubtitle() {
    // El subtitulo se anima en update()
  }

  showButtons() {
    this.buttonsVisible = true;
    this.btnStart.visible = true;
    this.btnDeny.visible = true;

    // Animacion de entrada de botones con tween
    this.btnStart.y = 220;
    this.btnDeny.y = 220;

    const animateBtn = (btn, delay, targetY = 200) => {
      setTimeout(() => {
        this.tween(btn, 'y', targetY, 0.5, Easing.easeOutBack);
      }, delay);
    };

    animateBtn(this.btnStart, 0);
    animateBtn(this.btnDeny, 100);

    audioManager.playSFX('firefly');
  }

  render(ctx, alpha) {
    super.render(ctx, alpha);

    // Renderizar explosion de petalos (sobre el fondo, bajo el texto)
    this.renderPetalBurst(ctx);

    // Titulo principal
    this.renderTitle(ctx);

    // Subtitulo
    this.renderSubtitle(ctx);
  }

  renderPetalBurst(ctx) {
    this.petalBurst.forEach(p => {
      const alpha = 1 - p.life / p.maxLife;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  renderTitle(ctx) {
    const centerX = this.engine.width / 2;
    const y = 70;

    // Sombra del titulo
    ctx.font = '10px "Press Start 2P", cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Efecto de "escritura" progresiva
    const visibleChars = Math.floor(this.titleText.length * this.titleAlpha);
    const displayText = this.titleText.substring(0, visibleChars);

    // Sombra
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillText(displayText, centerX + 2, y + 2);

    // Color principal con pulso
    const pulse = 1 + Math.sin(this.titlePhase) * 0.05;
    const goldR = Math.floor(255 * pulse);
    const goldG = Math.floor(215 * pulse);
    const goldB = Math.floor(0 * pulse);
    ctx.fillStyle = `rgb(${goldR}, ${goldG}, ${goldB})`;
    ctx.fillText(displayText, centerX, y);

    // Brillo exterior
    if (this.titleAlpha >= 1) {
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
      ctx.lineWidth = 2;
      ctx.strokeText(displayText, centerX, y);
    }
  }

  renderSubtitle(ctx) {
    if (this.subtitleAlpha <= 0) return;

    const centerX = this.engine.width / 2;
    const y = 105;

    ctx.font = '6px "Silkscreen", cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Efecto de escritura
    const visibleChars = Math.floor(this.subtitleText.length * this.subtitleAlpha);
    const displayText = this.subtitleText.substring(0, visibleChars);

    // Sombra
    ctx.fillStyle = `rgba(0,0,0,${0.5 * this.subtitleAlpha})`;
    ctx.fillText(displayText, centerX + 1, y + 1);

    // Texto
    ctx.fillStyle = `rgba(240, 240, 240, ${this.subtitleAlpha})`;
    ctx.fillText(displayText, centerX, y);
  }

  // Input handlers
  onMouseMove(x, y) {
    if (this.buttonsVisible) {
      this.btnStart.handleMouseMove(x, y);
      this.btnDeny.handleMouseMove(x, y);
    }
  }

  onMouseDown(x, y) {
    if (this.buttonsVisible) {
      this.btnStart.handleMouseDown(x, y);
      this.btnDeny.handleMouseDown(x, y);
    }
  }

  onMouseUp(x, y) {
    if (this.buttonsVisible) {
      this.btnStart.handleMouseUp(x, y);
      this.btnDeny.handleMouseUp(x, y);
    }
  }

  onClick(x, y) {
    if (this.buttonsVisible) {
      // Los botones manejan su propio click en handleMouseUp
    }
  }

  onKeyDown(key) {
    if (key === 'Enter' || key === 'Space') {
      if (this.buttonsVisible) {
        this.onStartClick();
      }
    } else if (key === 'Escape') {
      if (this.buttonsVisible) {
        this.onDenyClick();
      }
    }
  }
}

export default Scene1Intro;