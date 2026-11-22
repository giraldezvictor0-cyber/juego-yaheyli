/**
 * Sprites - Pixel art 16-bit sprites para personajes y elementos interactivos
 * Renderizado programatico con Canvas API
 */

import { Colors, PixelDraw } from './backgrounds.js';

/**
 * Clase base para sprites animados
 */
export class Sprite {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.visible = true;
    this.animations = {};
    this.currentAnimation = null;
    this.animationFrame = 0;
    this.animationTimer = 0;
    this.animationSpeed = 0.15; // segundos por frame
    this.flipX = false;
    this.flipY = false;
    this.rotation = 0;
    this.scale = 1;
    this.alpha = 1;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  setAnimation(name) {
    if (this.animations[name] && this.currentAnimation !== name) {
      this.currentAnimation = name;
      this.animationFrame = 0;
      this.animationTimer = 0;
    }
  }

  update(dt) {
    if (this.currentAnimation && this.animations[this.currentAnimation]) {
      const anim = this.animations[this.currentAnimation];
      this.animationTimer += dt;
      if (this.animationTimer >= this.animationSpeed) {
        this.animationTimer = 0;
        this.animationFrame = (this.animationFrame + 1) % anim.frames.length;
      }
    }
  }

  render(ctx) {
    if (!this.visible) return;

    ctx.save();
    ctx.translate(Math.floor(this.x + this.offsetX), Math.floor(this.y + this.offsetY));
    ctx.scale(this.flipX ? -this.scale : this.scale, this.flipY ? -this.scale : this.scale);
    if (this.rotation !== 0) ctx.rotate(this.rotation);
    ctx.globalAlpha = this.alpha;

    if (this.currentAnimation && this.animations[this.currentAnimation]) {
      const anim = this.animations[this.currentAnimation];
      const frame = anim.frames[this.animationFrame % anim.frames.length];
      if (frame && frame.draw) {
        frame.draw(ctx, this);
      }
    } else if (this.draw) {
      this.draw(ctx);
    }

    ctx.restore();
  }

  getBounds() {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width * this.scale,
      height: this.height * this.scale
    };
  }

  containsPoint(px, py) {
    const bounds = this.getBounds();
    return px >= bounds.x && px <= bounds.x + bounds.width &&
           py >= bounds.y && py <= bounds.y + bounds.height;
  }
}

/**
 * Gatito blanco y naranja llorando (Escena 2)
 */
export class CatSprite extends Sprite {
  constructor(x, y) {
    super(x, y, 48, 48);
    this.tearPhase = 0;
    this.tearY = 0;
    this.blinkTimer = 0;
    this.blinkState = 0; // 0: abierto, 1: cerrando, 2: cerrado, 3: abriendo
    this.sobTimer = 0;
    this.sobPhase = 0;

    this.animations = {
      idle: {
        frames: [
          { draw: (ctx) => this.drawCat(ctx, 0) },
          { draw: (ctx) => this.drawCat(ctx, 1) },
          { draw: (ctx) => this.drawCat(ctx, 2) },
          { draw: (ctx) => this.drawCat(ctx, 1) }
        ]
      },
      cry: {
        frames: [
          { draw: (ctx) => this.drawCatCrying(ctx, 0) },
          { draw: (ctx) => this.drawCatCrying(ctx, 1) },
          { draw: (ctx) => this.drawCatCrying(ctx, 2) },
          { draw: (ctx) => this.drawCatCrying(ctx, 3) }
        ]
      }
    };
    this.setAnimation('cry');
    this.animationSpeed = 0.4;
  }

  update(dt) {
    super.update(dt);

    // Lagrimas
    this.tearPhase += dt * 2;
    this.tearY = (this.tearPhase % 1) * 30;

    // Parpadeo
    this.blinkTimer += dt;
    if (this.blinkTimer > 3 + Math.random() * 4) {
      this.blinkTimer = 0;
      this.blinkState = 1;
    }
    if (this.blinkState > 0) {
      this.blinkState += dt * 10;
      if (this.blinkState > 3) this.blinkState = 0;
    }

    // Sollozos
    this.sobTimer += dt;
    this.sobPhase = Math.sin(this.sobTimer * 3) * 2;
  }

  drawCat(ctx, frame) {
    const cx = 0;
    const cy = 0;
    const s = 1;

    // Cuerpo (blanco)
    ctx.fillStyle = Colors.catWhite;
    // Cabeza
    PixelDraw.ellipse(ctx, cx, cy - 10, 18, 16, Colors.catWhite);
    // Orejas
    PixelDraw.triangle(ctx, cx - 14, cy - 18, cx - 8, cy - 28, cx - 2, cy - 18, Colors.catWhite);
    PixelDraw.triangle(ctx, cx + 14, cy - 18, cx + 8, cy - 28, cx + 2, cy - 18, Colors.catWhite);
    // Interior orejas
    PixelDraw.triangle(ctx, cx - 12, cy - 18, cx - 8, cy - 24, cx - 4, cy - 18, '#ffe0e0');
    PixelDraw.triangle(ctx, cx + 12, cy - 18, cx + 8, cy - 24, cx + 4, cy - 18, '#ffe0e0');

    // Manchas naranjas en la cabeza
    ctx.fillStyle = Colors.catOrange;
    PixelDraw.ellipse(ctx, cx - 8, cy - 12, 6, 5, Colors.catOrange);
    PixelDraw.ellipse(ctx, cx + 8, cy - 12, 5, 4, Colors.catOrange);
    PixelDraw.ellipse(ctx, cx, cy + 2, 8, 6, Colors.catOrange);

    // Ojos
    const eyeY = cy - 12;
    if (this.blinkState >= 1 && this.blinkState <= 2) {
      // Ojos cerrados
      ctx.fillStyle = Colors.catEye;
      PixelDraw.hline(ctx, cx - 10, eyeY, 8, Colors.catEye);
      PixelDraw.hline(ctx, cx + 2, eyeY, 8, Colors.catEye);
    } else {
      // Ojos abiertos con lagrimas
      ctx.fillStyle = Colors.catEye;
      PixelDraw.circle(ctx, cx - 7, eyeY, 4, Colors.catEye);
      PixelDraw.circle(ctx, cx + 7, eyeY, 4, Colors.catEye);
      // Brillo
      ctx.fillStyle = Colors.catWhite;
      PixelDraw.pixel(ctx, cx - 6, eyeY - 1, Colors.catWhite);
      PixelDraw.pixel(ctx, cx + 8, eyeY - 1, Colors.catWhite);
    }

    // Nariz
    ctx.fillStyle = '#ff88aa';
    PixelDraw.pixel(ctx, cx, cy - 4, '#ff88aa');
    PixelDraw.pixel(ctx, cx - 1, cy - 3, '#ff88aa');
    PixelDraw.pixel(ctx, cx + 1, cy - 3, '#ff88aa');

    // Boca triste
    ctx.fillStyle = Colors.catEye;
    PixelDraw.pixel(ctx, cx - 2, cy, Colors.catEye);
    PixelDraw.pixel(ctx, cx - 1, cy + 1, Colors.catEye);
    PixelDraw.pixel(ctx, cx, cy + 1, Colors.catEye);
    PixelDraw.pixel(ctx, cx + 1, cy + 1, Colors.catEye);
    PixelDraw.pixel(ctx, cx + 2, cy, Colors.catEye);

    // Bigotes
    ctx.fillStyle = Colors.catEye;
    for (let i = 0; i < 3; i++) {
      PixelDraw.hline(ctx, cx - 18, cy - 4 + i * 2, 10, Colors.catEye);
      PixelDraw.hline(ctx, cx + 8, cy - 4 + i * 2, 10, Colors.catEye);
    }

    // Cuerpo
    ctx.fillStyle = Colors.catWhite;
    PixelDraw.ellipse(ctx, cx, cy + 18, 20, 14, Colors.catWhite);
    // Manchas naranjas en cuerpo
    ctx.fillStyle = Colors.catOrange;
    PixelDraw.ellipse(ctx, cx - 10, cy + 18, 8, 5, Colors.catOrange);
    PixelDraw.ellipse(ctx, cx + 8, cy + 22, 6, 4, Colors.catOrange);

    // Patitas delanteras
    ctx.fillStyle = Colors.catWhite;
    PixelDraw.ellipse(ctx, cx - 12, cy + 28, 6, 4, Colors.catWhite);
    PixelDraw.ellipse(ctx, cx + 12, cy + 28, 6, 4, Colors.catWhite);
    // Patitas traseras
    PixelDraw.ellipse(ctx, cx - 16, cy + 30, 5, 3, Colors.catWhite);
    PixelDraw.ellipse(ctx, cx + 16, cy + 30, 5, 3, Colors.catWhite);

    // Cola
    const tailX = cx + 20 + Math.sin(this.sobPhase) * 3;
    ctx.fillStyle = Colors.catWhite;
    PixelDraw.ellipse(ctx, tailX, cy + 20, 12, 4, Colors.catWhite);
    ctx.fillStyle = Colors.catOrange;
    PixelDraw.ellipse(ctx, tailX + 4, cy + 18, 6, 3, Colors.catOrange);
  }

  drawCatCrying(ctx, frame) {
    this.drawCat(ctx, frame);

    // Lagrimas animadas
    ctx.fillStyle = Colors.catTear;
    // Ojo izquierdo
    PixelDraw.circle(ctx, -7, -12 + this.tearY, 2, Colors.catTear);
    PixelDraw.pixel(ctx, -7, -12 + this.tearY - 1, Colors.catTear);
    // Ojo derecho
    PixelDraw.circle(ctx, 7, -12 + ((this.tearPhase + 0.5) % 1) * 30, 2, Colors.catTear);
    PixelDraw.pixel(ctx, 7, -12 + ((this.tearPhase + 0.5) % 1) * 30 - 1, Colors.catTear);

    // Movimiento de sollozo (cuerpo se mueve ligeramente)
    // Se maneja en el transform del render
  }
}

/**
 * Chibi Yaheyli (Escena 4 - junto al sobre)
 */
export class YaheyliChibiSprite extends Sprite {
  constructor(x, y) {
    super(x, y, 40, 56);
    this.breathPhase = 0;
    this.blinkTimer = 0;
    this.blinkState = 0;
    this.lookDirection = 1; // 1: derecha, -1: izquierda
    this.animations = {
      idle: {
        frames: [
          { draw: (ctx) => this.drawChibi(ctx, 0) },
          { draw: (ctx) => this.drawChibi(ctx, 1) },
          { draw: (ctx) => this.drawChibi(ctx, 2) },
          { draw: (ctx) => this.drawChibi(ctx, 1) }
        ]
      },
      wave: {
        frames: [
          { draw: (ctx) => this.drawChibiWave(ctx, 0) },
          { draw: (ctx) => this.drawChibiWave(ctx, 1) },
          { draw: (ctx) => this.drawChibiWave(ctx, 2) },
          { draw: (ctx) => this.drawChibiWave(ctx, 3) },
          { draw: (ctx) => this.drawChibiWave(ctx, 2) },
          { draw: (ctx) => this.drawChibiWave(ctx, 1) }
        ]
      }
    };
    this.setAnimation('idle');
    this.animationSpeed = 0.5;
  }

  update(dt) {
    super.update(dt);
    this.breathPhase += dt * 1.5;

    this.blinkTimer += dt;
    if (this.blinkTimer > 4 + Math.random() * 3) {
      this.blinkTimer = 0;
      this.blinkState = 1;
    }
    if (this.blinkState > 0) {
      this.blinkState += dt * 15;
      if (this.blinkState > 3) this.blinkState = 0;
    }
  }

  drawChibi(ctx, frame) {
    const cx = 0;
    const cy = 0;
    const breath = Math.sin(this.breathPhase) * 1;

    // Cabeza (grande estilo chibi)
    ctx.fillStyle = '#fdd'; // Piel clara
    PixelDraw.ellipse(ctx, cx, cy - 14 + breath, 18, 16, '#fdd');

    // Cabello negro largo
    ctx.fillStyle = '#1a1a1a';
    // Parte superior
    PixelDraw.ellipse(ctx, cx, cy - 20 + breath, 20, 14, '#1a1a1a');
    // Lados
    PixelDraw.ellipse(ctx, cx - 18, cy - 10 + breath, 8, 20, '#1a1a1a');
    PixelDraw.ellipse(ctx, cx + 18, cy - 10 + breath, 8, 20, '#1a1a1a');
    // Detras
    PixelDraw.ellipse(ctx, cx, cy + 4 + breath, 18, 12, '#1a1a1a');

    // Blusa leopardo/rosada
    ctx.fillStyle = '#ff69b4';
    PixelDraw.ellipse(ctx, cx, cy + 14 + breath, 16, 12, '#ff69b4');
    // Patron leopardo simple
    ctx.fillStyle = '#cc4477';
    PixelDraw.pixel(ctx, cx - 8, cy + 10 + breath, '#cc4477');
    PixelDraw.pixel(ctx, cx + 6, cy + 12 + breath, '#cc4477');
    PixelDraw.pixel(ctx, cx - 4, cy + 18 + breath, '#cc4477');
    PixelDraw.pixel(ctx, cx + 9, cy + 19 + breath, '#cc4477');

    // Ojos grandes estilo anime
    const eyeY = cy - 16 + breath;
    if (this.blinkState >= 1 && this.blinkState <= 2) {
      // Cerrados
      ctx.fillStyle = '#1a1a1a';
      PixelDraw.hline(ctx, cx - 9, eyeY, 6, '#1a1a1a');
      PixelDraw.hline(ctx, cx + 3, eyeY, 6, '#1a1a1a');
    } else {
      // Abiertos
      ctx.fillStyle = '#fff';
      PixelDraw.ellipse(ctx, cx - 7, eyeY, 6, 7, '#fff');
      PixelDraw.ellipse(ctx, cx + 7, eyeY, 6, 7, '#fff');
      // Iris
      ctx.fillStyle = '#4488cc';
      PixelDraw.circle(ctx, cx - 7 + this.lookDirection * 1, eyeY, 3, '#4488cc');
      PixelDraw.circle(ctx, cx + 7 + this.lookDirection * 1, eyeY, 3, '#4488cc');
      // Brillo
      ctx.fillStyle = '#fff';
      PixelDraw.pixel(ctx, cx - 6 + this.lookDirection, eyeY - 2, '#fff');
      PixelDraw.pixel(ctx, cx + 8 + this.lookDirection, eyeY - 2, '#fff');
      PixelDraw.pixel(ctx, cx - 8 + this.lookDirection, eyeY + 1, '#fff');
      PixelDraw.pixel(ctx, cx + 6 + this.lookDirection, eyeY + 1, '#fff');
    }

    // Mejillas sonrojadas
    ctx.fillStyle = '#ffaaaaff';
    PixelDraw.ellipse(ctx, cx - 12, cy - 10 + breath, 3, 2, '#ffaaaaff');
    PixelDraw.ellipse(ctx, cx + 12, cy - 10 + breath, 3, 2, '#ffaaaaff');

    // Boca pequena
    ctx.fillStyle = '#884466';
    PixelDraw.pixel(ctx, cx, cy - 8 + breath, '#884466');

    // Brazos
    ctx.fillStyle = '#fdd';
    PixelDraw.ellipse(ctx, cx - 16, cy + 8 + breath, 5, 10, '#fdd');
    PixelDraw.ellipse(ctx, cx + 16, cy + 8 + breath, 5, 10, '#fdd');

    // Piernas
    PixelDraw.ellipse(ctx, cx - 6, cy + 26 + breath, 6, 8, '#fdd');
    PixelDraw.ellipse(ctx, cx + 6, cy + 26 + breath, 6, 8, '#fdd');

    // Zapatos
    ctx.fillStyle = '#884466';
    PixelDraw.ellipse(ctx, cx - 6, cy + 32 + breath, 6, 3, '#884466');
    PixelDraw.ellipse(ctx, cx + 6, cy + 32 + breath, 6, 3, '#884466');
  }

  drawChibiWave(ctx, frame) {
    this.drawChibi(ctx, frame);

    // Brazo derecho saludando
    const waveProgress = frame / 5;
    const angle = -Math.PI / 2 + waveProgress * Math.PI;
    const handX = 16 + Math.cos(angle) * 18;
    const handY = 8 + Math.sin(angle) * 18;

    ctx.fillStyle = '#fdd';
    // Brazo levantado
    ctx.save();
    ctx.translate(0, 0);
    ctx.rotate(angle);
    PixelDraw.ellipse(ctx, 18, 8, 5, 18, '#fdd');
    ctx.restore();

    // Mano
    ctx.fillStyle = '#fdd';
    PixelDraw.circle(ctx, handX, handY, 5, '#fdd');
  }

  wave() {
    this.setAnimation('wave');
    this.animationSpeed = 0.15;
    // Volver a idle despues
    setTimeout(() => {
      this.setAnimation('idle');
      this.animationSpeed = 0.5;
    }, 900);
  }
}

/**
 * Sobre lacrado con corazon (Regalo 1 - Hub)
 */
export class EnvelopeSprite extends Sprite {
  constructor(x, y) {
    super(x, y, 32, 24);
    this.floatPhase = Math.random() * Math.PI * 2;
    this.glowPhase = 0;
    this.isHovered = false;
    this.animations = {
      idle: {
        frames: [{ draw: (ctx) => this.drawEnvelope(ctx, false) }]
      },
      hover: {
        frames: [{ draw: (ctx) => this.drawEnvelope(ctx, true) }]
      },
      pulse: {
        frames: [
          { draw: (ctx) => this.drawEnvelope(ctx, false, 1.0) },
          { draw: (ctx) => this.drawEnvelope(ctx, false, 1.1) },
          { draw: (ctx) => this.drawEnvelope(ctx, false, 1.0) },
          { draw: (ctx) => this.drawEnvelope(ctx, false, 0.95) }
        ]
      }
    };
    this.setAnimation('idle');
    this.animationSpeed = 0.6;
  }

  update(dt) {
    super.update(dt);
    this.floatPhase += dt * 1.5;
    this.glowPhase += dt * 3;
    this.offsetY = Math.sin(this.floatPhase) * 3;
  }

  setHovered(hovered) {
    this.isHovered = hovered;
    if (hovered) {
      this.setAnimation('hover');
    } else {
      this.setAnimation('pulse');
    }
  }

  drawEnvelope(ctx, hovered, scale = 1) {
    const s = scale;
    const cx = 0;
    const cy = 0;

    // Sombra
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    PixelDraw.ellipse(ctx, cx, cy + 10 * s, 14 * s, 3 * s, 'rgba(0,0,0,0.3)');

    // Cuerpo del sobre (blanco/crema)
    ctx.fillStyle = '#fff8f0';
    PixelDraw.rect(ctx, cx - 14 * s, cy - 10 * s, 28 * s, 18 * s, '#fff8f0');

    // Solapa trasera
    ctx.fillStyle = '#ffe8d8';
    ctx.beginPath();
    ctx.moveTo(cx - 14 * s, cy - 10 * s);
    ctx.lineTo(cx, cy - 18 * s);
    ctx.lineTo(cx + 14 * s, cy - 10 * s);
    ctx.closePath();
    ctx.fill();

    // Solapa frontal (triangulo)
    ctx.fillStyle = '#fff0e0';
    ctx.beginPath();
    ctx.moveTo(cx - 12 * s, cy - 10 * s);
    ctx.lineTo(cx, cy - 16 * s);
    ctx.lineTo(cx + 12 * s, cy - 10 * s);
    ctx.closePath();
    ctx.fill();

    // Linea de cierre
    ctx.fillStyle = '#ddd';
    PixelDraw.hline(ctx, cx - 10 * s, cy - 9 * s, 20 * s, '#ddd');

    // Sello de corazon
    const heartScale = 1 + Math.sin(this.glowPhase) * 0.2;
    const heartColor = hovered ? Colors.uiHeart : Colors.uiHeart;
    this.drawHeart(ctx, cx, cy - 2 * s, heartScale, heartColor);

    // Brillo hover
    if (hovered) {
      ctx.strokeStyle = Colors.uiAccent;
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - 16 * s, cy - 12 * s, 32 * s, 22 * s);
    }
  }

  drawHeart(ctx, x, y, scale, color) {
    const s = scale * 4;
    ctx.fillStyle = color;
    // Corazon pixel art
    PixelDraw.pixel(ctx, x, y - s, color);
    PixelDraw.pixel(ctx, x - s, y, color);
    PixelDraw.pixel(ctx, x + s, y, color);
    PixelDraw.pixel(ctx, x - s, y + s, color);
    PixelDraw.pixel(ctx, x, y + s, color);
    PixelDraw.pixel(ctx, x + s, y + s, color);
    PixelDraw.pixel(ctx, x, y + 2 * s, color);
  }
}

/**
 * Disco CD arcoiris girando (Regalo 2 - Hub)
 */
export class CDSprite extends Sprite {
  constructor(x, y) {
    super(x, y, 36, 36);
    this.rotation = 0;
    this.floatPhase = Math.random() * Math.PI * 2;
    this.animations = {
      spin: {
        frames: [{ draw: (ctx) => this.drawCD(ctx) }]
      }
    };
    this.setAnimation('spin');
  }

  update(dt) {
    super.update(dt);
    this.rotation += dt * 2; // 2 rad/s
    this.floatPhase += dt * 1;
    this.offsetY = Math.sin(this.floatPhase) * 2;
  }

  drawCD(ctx) {
    const cx = 0;
    const cy = 0;
    const r = 16;

    ctx.save();
    ctx.rotate(this.rotation);

    // Sombra
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    PixelDraw.ellipse(ctx, cx, cy + 8, r, 3, 'rgba(0,0,0,0.3)');

    // Anillo exterior (plastico transparente con brillo)
    const rainbowColors = [
      Colors.cdRainbow1, Colors.cdRainbow2, Colors.cdRainbow3,
      Colors.cdRainbow4, Colors.cdRainbow5, Colors.cdRainbow6
    ];

    for (let i = 0; i < 6; i++) {
      const angle = (this.rotation + i * Math.PI / 3) % (Math.PI * 2);
      const rr = r - 1;
      const x = cx + Math.cos(angle) * rr;
      const y = cy + Math.sin(angle) * rr;
      ctx.fillStyle = rainbowColors[i];
      PixelDraw.circle(ctx, x, y, 4, rainbowColors[i]);
    }

    // Disco base (plateado/iridiscente)
    const gradientColors = ['#e8e8f0', '#d0d0e8', '#c0c0e0', '#b0b0d8'];
    for (let ring = 0; ring < 4; ring++) {
      const rr = r - 2 - ring * 3;
      const color = gradientColors[ring];
      PixelDraw.circle(ctx, cx, cy, rr, color);
    }

    // Agujero central
    ctx.fillStyle = '#1a1a2e';
    PixelDraw.circle(ctx, cx, cy, 4, '#1a1a2e');

    // Anillo interno del agujero
    ctx.fillStyle = '#8888a0';
    PixelDraw.circle(ctx, cx, cy, 5, '#8888a0');

    // Datos grabados (lineas radiales)
    ctx.strokeStyle = 'rgba(100,100,140,0.5)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 16; i++) {
      const angle = i * Math.PI / 8;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * 6, cy + Math.sin(angle) * 6);
      ctx.lineTo(cx + Math.cos(angle) * 13, cy + Math.sin(angle) * 13);
      ctx.stroke();
    }

    ctx.restore();
  }
}

/**
 * Poke Ball (Regalo 3 - Hub)
 */
export class PokeballSprite extends Sprite {
  constructor(x, y) {
    super(x, y, 28, 28);
    this.floatPhase = Math.random() * Math.PI * 2;
    this.buttonPhase = 0;
    this.openPhase = 0;
    this.isOpening = false;
    this.animations = {
      idle: {
        frames: [{ draw: (ctx) => this.drawPokeball(ctx, false) }]
      },
      hover: {
        frames: [{ draw: (ctx) => this.drawPokeball(ctx, true) }]
      },
      open: {
        frames: [
          { draw: (ctx) => this.drawPokeballOpening(ctx, 0) },
          { draw: (ctx) => this.drawPokeballOpening(ctx, 1) },
          { draw: (ctx) => this.drawPokeballOpening(ctx, 2) },
          { draw: (ctx) => this.drawPokeballOpening(ctx, 3) }
        ]
      }
    };
    this.setAnimation('idle');
    this.animationSpeed = 0.1;
  }

  update(dt) {
    super.update(dt);
    this.floatPhase += dt * 1.5;
    this.buttonPhase += dt * 4;
    this.offsetY = Math.sin(this.floatPhase) * 3;

    if (this.isOpening) {
      this.openPhase += dt * 5;
      if (this.openPhase >= 1) {
        this.isOpening = false;
        this.openPhase = 0;
        this.setAnimation('idle');
      }
    }
  }

  triggerOpen() {
    this.isOpening = true;
    this.openPhase = 0;
    this.setAnimation('open');
  }

  setHovered(hovered) {
    if (!this.isOpening) {
      this.setAnimation(hovered ? 'hover' : 'idle');
    }
  }

  drawPokeball(ctx, hovered) {
    const cx = 0;
    const cy = 0;
    const r = 12;

    // Sombra
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    PixelDraw.ellipse(ctx, cx, cy + 10, r, 3, 'rgba(0,0,0,0.3)');

    // Parte inferior (blanca)
    ctx.fillStyle = Colors.pokeballWhite;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI, true);
    ctx.fill();

    // Parte superior (roja)
    ctx.fillStyle = Colors.pokeballRed;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI, false);
    ctx.fill();

    // Linea central negra
    ctx.fillStyle = Colors.pokeballBlack;
    ctx.fillRect(cx - r, cy - 1, r * 2, 3);

    // Boton central
    const buttonGlow = 1 + Math.sin(this.buttonPhase) * 0.3;
    ctx.fillStyle = Colors.pokeballBlack;
    PixelDraw.circle(ctx, cx, cy + 1, 5 * buttonGlow, Colors.pokeballBlack);
    ctx.fillStyle = Colors.pokeballWhite;
    PixelDraw.circle(ctx, cx, cy + 1, 3 * buttonGlow, Colors.pokeballWhite);
    ctx.fillStyle = Colors.pokeballRed;
    PixelDraw.circle(ctx, cx, cy + 1, 1 * buttonGlow, Colors.pokeballRed);

    // Brillo superior
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    PixelDraw.ellipse(ctx, cx - 3, cy - 5, 4, 2, 'rgba(255,255,255,0.4)');

    // Resplandor hover
    if (hovered) {
      ctx.strokeStyle = Colors.uiAccent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r + 3, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  drawPokeballOpening(ctx, frame) {
    const progress = frame / 3;
    const cx = 0;
    const cy = 0;
    const r = 12;

    // Sombra
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    PixelDraw.ellipse(ctx, cx, cy + 10, r, 3, 'rgba(0,0,0,0.3)');

    // Partes separandose
    const separation = progress * 20;

    // Tapa superior (roja) subiendo
    ctx.fillStyle = Colors.pokeballRed;
    ctx.save();
    ctx.translate(0, -separation);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI, false);
    ctx.fill();
    ctx.restore();

    // Parte inferior (blanca)
    ctx.fillStyle = Colors.pokeballWhite;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI, true);
    ctx.fill();

    // Linea central
    ctx.fillStyle = Colors.pokeballBlack;
    ctx.fillRect(cx - r, cy - 1, r * 2, 3);

    // Boton
    ctx.fillStyle = Colors.pokeballBlack;
    PixelDraw.circle(ctx, cx, cy + 1, 5, Colors.pokeballBlack);
    ctx.fillStyle = Colors.pokeballWhite;
    PixelDraw.circle(ctx, cx, cy + 1, 3, Colors.pokeballWhite);

    // Particulas de luz saliendo
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + progress * 4;
      const dist = 15 + progress * 20;
      const px = cx + Math.cos(angle) * dist;
      const py = cy + Math.sin(angle) * dist - separation / 2;
      const alpha = 1 - progress;
      ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
      PixelDraw.circle(ctx, px, py, 3 * (1 - progress), `rgba(255, 215, 0, ${alpha})`);
    }
  }
}

/**
 * Ticket verde (Regalo 4 - Hub)
 */
export class TicketSprite extends Sprite {
  constructor(x, y) {
    super(x, y, 30, 40);
    this.floatPhase = Math.random() * Math.PI * 2;
    this.flipPhase = 0;
    this.isFlipping = false;
    this.animations = {
      idle: {
        frames: [{ draw: (ctx) => this.drawTicket(ctx, false) }]
      },
      hover: {
        frames: [{ draw: (ctx) => this.drawTicket(ctx, true) }]
      },
      flip: {
        frames: [
          { draw: (ctx) => this.drawTicketFlipping(ctx, 0) },
          { draw: (ctx) => this.drawTicketFlipping(ctx, 1) },
          { draw: (ctx) => this.drawTicketFlipping(ctx, 2) },
          { draw: (ctx) => this.drawTicketFlipping(ctx, 3) },
          { draw: (ctx) => this.drawTicketFlipping(ctx, 4) },
          { draw: (ctx) => this.drawTicketFlipping(ctx, 5) }
        ]
      }
    };
    this.setAnimation('idle');
    this.animationSpeed = 0.08;
  }

  update(dt) {
    super.update(dt);
    this.floatPhase += dt * 1.2;
    this.offsetY = Math.sin(this.floatPhase) * 2.5;

    if (this.isFlipping) {
      this.flipPhase += dt * 8;
      if (this.flipPhase >= 1) {
        this.isFlipping = false;
        this.flipPhase = 0;
        this.setAnimation('idle');
      }
    }
  }

  triggerFlip() {
    this.isFlipping = true;
    this.flipPhase = 0;
    this.setAnimation('flip');
  }

  setHovered(hovered) {
    if (!this.isFlipping) {
      this.setAnimation(hovered ? 'hover' : 'idle');
    }
  }

  drawTicket(ctx, hovered) {
    const cx = 0;
    const cy = 0;
    const w = 26;
    const h = 36;

    // Sombra
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    PixelDraw.ellipse(ctx, cx, cy + h / 2 + 4, w / 2, 3, 'rgba(0,0,0,0.3)');

    // Cuerpo del ticket (verde)
    ctx.fillStyle = Colors.ticketGreen;
    PixelDraw.rect(ctx, cx - w / 2, cy - h / 2, w, h, Colors.ticketGreen);

    // Bordes dentados (arriba y abajo)
    ctx.fillStyle = Colors.ticketGreenLight;
    for (let i = 0; i < 6; i++) {
      const x = cx - w / 2 + 2 + i * 5;
      // Top
      PixelDraw.triangle(ctx, x, cy - h / 2, x + 2, cy - h / 2 - 3, x + 4, cy - h / 2, Colors.ticketGreenLight);
      // Bottom
      PixelDraw.triangle(ctx, x, cy + h / 2, x + 2, cy + h / 2 + 3, x + 4, cy + h / 2, Colors.ticketGreenLight);
    }

    // Texto "TICKET"
    ctx.fillStyle = '#fff';
    ctx.font = '5px "Press Start 2P", cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TICKET', cx, cy - h / 2 + 8);

    // Texto "FOR ONE"
    ctx.font = '4px "Silkscreen", cursive';
    ctx.fillText('FOR ONE', cx, cy - h / 2 + 16);

    // Linea divisoria
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    PixelDraw.hline(ctx, cx - w / 2 + 4, cy, w - 8, 'rgba(255,255,255,0.5)');

    // Numero de serie
    ctx.font = '5px "VT323", monospace';
    ctx.fillText('#YH-2024', cx, cy + h / 2 - 8);

    // Brillo hover
    if (hovered) {
      ctx.strokeStyle = Colors.ticketGold;
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - w / 2 - 2, cy - h / 2 - 2, w + 4, h + 4);
    }
  }

  drawTicketFlipping(ctx, frame) {
    const progress = frame / 5;
    const scaleX = Math.cos(progress * Math.PI);

    if (scaleX < 0) {
      // Mostrar reverso
      this.drawTicketBack(ctx, Math.abs(scaleX));
    } else {
      // Mostrar frente
      this.drawTicket(ctx, false);
    }
  }

  drawTicketBack(ctx, scaleX) {
    const cx = 0;
    const cy = 0;
    const w = 26 * scaleX;
    const h = 36;

    ctx.fillStyle = Colors.ticketGreenDark || '#1a5a2a';
    PixelDraw.rect(ctx, cx - w / 2, cy - h / 2, w, h, Colors.ticketGreenDark || '#1a5a2a');

    // Simbolo de estrella en el reverso
    ctx.fillStyle = Colors.ticketGold;
    this.drawStar(ctx, cx, cy, 6 * scaleX);
  }

  drawStar(ctx, x, y, size) {
    const spikes = 5;
    const outerRadius = size;
    const innerRadius = size / 2;

    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI / spikes) - Math.PI / 2;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }
}

/**
 * Buho rosa (Escena 7)
 */
export class OwlSprite extends Sprite {
  constructor(x, y) {
    super(x, y, 48, 48);
    this.breathPhase = 0;
    this.blinkTimer = 0;
    this.blinkState = 0;
    this.headBob = 0;
    this.wingPhase = 0;
    this.animations = {
      idle: {
        frames: [
          { draw: (ctx) => this.drawOwl(ctx, 0) },
          { draw: (ctx) => this.drawOwl(ctx, 1) },
          { draw: (ctx) => this.drawOwl(ctx, 2) },
          { draw: (ctx) => this.drawOwl(ctx, 1) }
        ]
      },
      talk: {
        frames: [
          { draw: (ctx) => this.drawOwlTalk(ctx, 0) },
          { draw: (ctx) => this.drawOwlTalk(ctx, 1) },
          { draw: (ctx) => this.drawOwlTalk(ctx, 2) },
          { draw: (ctx) => this.drawOwlTalk(ctx, 1) }
        ]
      }
    };
    this.setAnimation('idle');
    this.animationSpeed = 0.6;
  }

  update(dt) {
    super.update(dt);
    this.breathPhase += dt * 1.2;
    this.wingPhase += dt * 2;
    this.headBob = Math.sin(this.breathPhase * 0.7) * 2;

    this.blinkTimer += dt;
    if (this.blinkTimer > 3 + Math.random() * 4) {
      this.blinkTimer = 0;
      this.blinkState = 1;
    }
    if (this.blinkState > 0) {
      this.blinkState += dt * 12;
      if (this.blinkState > 3) this.blinkState = 0;
    }
  }

  drawOwl(ctx, frame) {
    const cx = 0;
    const cy = 0 + this.headBob;
    const breath = Math.sin(this.breathPhase) * 1;

    // Cuerpo principal (rosa)
    ctx.fillStyle = Colors.owlPink;
    PixelDraw.ellipse(ctx, cx, cy + 8 + breath, 20, 18, Colors.owlPink);

    // Cabeza (mas grande, redonda)
    PixelDraw.circle(ctx, cx, cy - 10 + breath, 20, Colors.owlPink);

    // Orejas/mechones
    ctx.fillStyle = Colors.owlPinkDark;
    PixelDraw.triangle(ctx, cx - 16, cy - 24 + breath, cx - 10, cy - 34 + breath, cx - 4, cy - 24 + breath, Colors.owlPinkDark);
    PixelDraw.triangle(ctx, cx + 16, cy - 24 + breath, cx + 10, cy - 34 + breath, cx + 4, cy - 24 + breath, Colors.owlPinkDark);

    // Ojos grandes
    const eyeY = cy - 14 + breath;
    if (this.blinkState >= 1 && this.blinkState <= 2) {
      // Cerrados
      ctx.fillStyle = Colors.owlEye;
      PixelDraw.hline(ctx, cx - 12, eyeY, 10, Colors.owlEye);
      PixelDraw.hline(ctx, cx + 2, eyeY, 10, Colors.owlEye);
    } else {
      // Abiertos
      ctx.fillStyle = '#fff';
      PixelDraw.circle(ctx, cx - 8, eyeY, 8, '#fff');
      PixelDraw.circle(ctx, cx + 8, eyeY, 8, '#fff');
      // Iris
      ctx.fillStyle = '#2a2a4a';
      PixelDraw.circle(ctx, cx - 8, eyeY, 5, '#2a2a4a');
      PixelDraw.circle(ctx, cx + 8, eyeY, 5, '#2a2a4a');
      // Pupila
      ctx.fillStyle = Colors.owlEye;
      PixelDraw.circle(ctx, cx - 8, eyeY, 2, Colors.owlEye);
      PixelDraw.circle(ctx, cx + 8, eyeY, 2, Colors.owlEye);
      // Brillo
      ctx.fillStyle = '#fff';
      PixelDraw.pixel(ctx, cx - 7, eyeY - 2, '#fff');
      PixelDraw.pixel(ctx, cx + 9, eyeY - 2, '#fff');
    }

    // Pico
    ctx.fillStyle = Colors.owlBeak;
    PixelDraw.triangle(ctx, cx, cy - 4 + breath, cx - 3, cy + 2 + breath, cx + 3, cy + 2 + breath, Colors.owlBeak);

    // Mejillas
    ctx.fillStyle = '#ffaacc';
    PixelDraw.ellipse(ctx, cx - 14, cy - 8 + breath, 4, 2, '#ffaacc');
    PixelDraw.ellipse(ctx, cx + 14, cy - 8 + breath, 4, 2, '#ffaacc');

    // Alas
    const wingOffset = Math.sin(this.wingPhase) * 3;
    ctx.fillStyle = Colors.owlPinkDark;
    // Ala izquierda
    ctx.save();
    ctx.translate(cx - 20, cy + 5 + breath);
    ctx.rotate(-0.3 + wingOffset * 0.05);
    PixelDraw.ellipse(ctx, 0, 0, 14, 8, Colors.owlPinkDark);
    ctx.restore();
    // Ala derecha
    ctx.save();
    ctx.translate(cx + 20, cy + 5 + breath);
    ctx.rotate(0.3 - wingOffset * 0.05);
    PixelDraw.ellipse(ctx, 0, 0, 14, 8, Colors.owlPinkDark);
    ctx.restore();

    // Patas
    ctx.fillStyle = Colors.owlBeak;
    PixelDraw.ellipse(ctx, cx - 8, cy + 22 + breath, 4, 6, Colors.owlBeak);
    PixelDraw.ellipse(ctx, cx + 8, cy + 22 + breath, 4, 6, Colors.owlBeak);

    // Plumas en el pecho
    ctx.fillStyle = Colors.owlPinkDark;
    for (let i = 0; i < 3; i++) {
      PixelDraw.pixel(ctx, cx - 6, cy + 2 + breath + i * 4, Colors.owlPinkDark);
      PixelDraw.pixel(ctx, cx + 6, cy + 2 + breath + i * 4, Colors.owlPinkDark);
      PixelDraw.pixel(ctx, cx, cy + 4 + breath + i * 4, Colors.owlPinkDark);
    }
  }

  drawOwlTalk(ctx, frame) {
    this.drawOwl(ctx, frame);

    // Pico abierto
    const cx = 0;
    const cy = 0 + this.headBob;
    const breath = Math.sin(this.breathPhase) * 1;
    const eyeY = cy - 14 + breath;

    ctx.fillStyle = '#8b2a4a';
    const mouthOpen = frame > 1 ? 6 : 3;
    PixelDraw.triangle(ctx, cx, eyeY + 8, cx - 4, eyeY + 8 + mouthOpen, cx + 4, eyeY + 8 + mouthOpen, '#8b2a4a');
  }

  setTalking(talking) {
    this.setAnimation(talking ? 'talk' : 'idle');
  }
}

/**
 * Gatitos abrazados (Escena 7 - esquina)
 */
export class HuggingCatsSprite extends Sprite {
  constructor(x, y) {
    super(x, y, 48, 32);
    this.breathPhase = 0;
    this.animations = {
      idle: {
        frames: [
          { draw: (ctx) => this.drawCats(ctx, 0) },
          { draw: (ctx) => this.drawCats(ctx, 1) }
        ]
      }
    };
    this.setAnimation('idle');
    this.animationSpeed = 1.0;
  }

  update(dt) {
    super.update(dt);
    this.breathPhase += dt * 0.8;
  }

  drawCats(ctx, frame) {
    const breath = Math.sin(this.breathPhase) * 0.5;

    // Gatito blanco (izquierda)
    this.drawCat(ctx, -18, 0 + breath, Colors.catWhite, Colors.catOrange, false);
    // Gatito naranja (derecha)
    this.drawCat(ctx, 18, 0 + breath, Colors.catOrange, Colors.catWhite, true);
  }

  drawCat(ctx, x, y, mainColor, accentColor, flipped) {
    const dir = flipped ? -1 : 1;

    // Cuerpo
    ctx.fillStyle = mainColor;
    PixelDraw.ellipse(ctx, x, y + 4, 14, 10, mainColor);

    // Cabeza
    PixelDraw.circle(ctx, x + dir * 8, y - 6, 10, mainColor);

    // Orejas
    ctx.fillStyle = mainColor;
    PixelDraw.triangle(ctx, x + dir * 4, y - 14, x + dir * 0, y - 20, x + dir * 8, y - 14, mainColor);
    PixelDraw.triangle(ctx, x + dir * 12, y - 14, x + dir * 8, y - 20, x + dir * 16, y - 14, mainColor);

    // Detalle de color en cabeza
    ctx.fillStyle = accentColor;
    PixelDraw.ellipse(ctx, x + dir * 8, y - 8, 5, 4, accentColor);

    // Ojos cerrados (felices)
    ctx.fillStyle = Colors.catEye;
    PixelDraw.hline(ctx, x + dir * 5, y - 8, 4, Colors.catEye);
    PixelDraw.hline(ctx, x + dir * 11, y - 8, 4, Colors.catEye);

    // Nariz
    ctx.fillStyle = '#ff88aa';
    PixelDraw.pixel(ctx, x + dir * 8, y - 5, '#ff88aa');

    // Cola
    ctx.fillStyle = mainColor;
    PixelDraw.ellipse(ctx, x - dir * 14, y + 2, 8, 3, mainColor);
    if (accentColor !== mainColor) {
      ctx.fillStyle = accentColor;
      PixelDraw.ellipse(ctx, x - dir * 12, y + 1, 4, 2, accentColor);
    }

    // Brazos abrazando
    ctx.fillStyle = mainColor;
    PixelDraw.ellipse(ctx, x + dir * 2, y + 2, 8, 3, mainColor);
  }
}

/**
 * Chibis Victor y Yaheyli juntos (Escena 8 - Final)
 */
export class CoupleChibiSprite extends Sprite {
  constructor(x, y) {
    super(x, y, 80, 56);
    this.breathPhase = 0;
    this.blinkTimer = 0;
    this.blinkState = 0;
    this.animations = {
      idle: {
        frames: [
          { draw: (ctx) => this.drawCouple(ctx, 0) },
          { draw: (ctx) => this.drawCouple(ctx, 1) },
          { draw: (ctx) => this.drawCouple(ctx, 2) },
          { draw: (ctx) => this.drawCouple(ctx, 1) }
        ]
      },
      happy: {
        frames: [
          { draw: (ctx) => this.drawCoupleHappy(ctx, 0) },
          { draw: (ctx) => this.drawCoupleHappy(ctx, 1) }
        ]
      }
    };
    this.setAnimation('idle');
    this.animationSpeed = 0.7;
  }

  update(dt) {
    super.update(dt);
    this.breathPhase += dt * 1.2;

    this.blinkTimer += dt;
    if (this.blinkTimer > 4 + Math.random() * 3) {
      this.blinkTimer = 0;
      this.blinkState = 1;
    }
    if (this.blinkState > 0) {
      this.blinkState += dt * 15;
      if (this.blinkState > 3) this.blinkState = 0;
    }
  }

  drawCouple(ctx, frame) {
    const breath = Math.sin(this.breathPhase) * 1;

    // Victor (izquierda - mas alto 182cm)
    this.drawVictor(ctx, -22, 0 + breath);
    // Yaheyli (derecha - 163cm)
    this.drawYaheyli(ctx, 22, 0 + breath);
  }

  drawCoupleHappy(ctx, frame) {
    const breath = Math.sin(this.breathPhase) * 1;
    // Version mas expresiva, sonriendo
    this.drawVictor(ctx, -22, 0 + breath, true);
    this.drawYaheyli(ctx, 22, 0 + breath, true);
  }

  drawVictor(ctx, x, y, happy = false) {
    // Cuerpo mas alto
    ctx.fillStyle = '#4488cc'; // Camisa azul
    PixelDraw.ellipse(ctx, x, y + 10, 12, 16, '#4488cc');

    // Pantalones
    ctx.fillStyle = '#2a2a4a';
    PixelDraw.ellipse(ctx, x, y + 26, 10, 8, '#2a2a4a');

    // Zapatos
    ctx.fillStyle = '#1a1a1a';
    PixelDraw.ellipse(ctx, x - 6, y + 32, 6, 3, '#1a1a1a');
    PixelDraw.ellipse(ctx, x + 6, y + 32, 6, 3, '#1a1a1a');

    // Brazos
    ctx.fillStyle = '#fdd';
    PixelDraw.ellipse(ctx, x - 14, y + 10, 4, 12, '#fdd');
    PixelDraw.ellipse(ctx, x + 10, y + 10, 4, 12, '#fdd');

    // Cabeza
    ctx.fillStyle = '#fdd';
    PixelDraw.circle(ctx, x, y - 6, 12, '#fdd');

    // Cabello corto oscuro
    ctx.fillStyle = '#2a2a2a';
    PixelDraw.ellipse(ctx, x, y - 14, 14, 8, '#2a2a2a');

    // Ojos
    const eyeY = y - 8;
    if (this.blinkState >= 1 && this.blinkState <= 2) {
      ctx.fillStyle = '#1a1a1a';
      PixelDraw.hline(ctx, x - 6, eyeY, 4, '#1a1a1a');
      PixelDraw.hline(ctx, x + 2, eyeY, 4, '#1a1a1a');
    } else {
      ctx.fillStyle = '#fff';
      PixelDraw.circle(ctx, x - 4, eyeY, 3, '#fff');
      PixelDraw.circle(ctx, x + 4, eyeY, 3, '#fff');
      ctx.fillStyle = '#2a4a6a';
      PixelDraw.circle(ctx, x - 4, eyeY, 1, '#2a4a6a');
      PixelDraw.circle(ctx, x + 4, eyeY, 1, '#2a4a6a');
      ctx.fillStyle = '#fff';
      PixelDraw.pixel(ctx, x - 3, eyeY - 1, '#fff');
      PixelDraw.pixel(ctx, x + 5, eyeY - 1, '#fff');
    }

    // Boca
    ctx.fillStyle = '#884466';
    if (happy) {
      PixelDraw.hline(ctx, x - 3, y - 2, 6, '#884466');
      PixelDraw.pixel(ctx, x - 3, y - 3, '#884466');
      PixelDraw.pixel(ctx, x + 2, y - 3, '#884466');
    } else {
      PixelDraw.pixel(ctx, x, y - 1, '#884466');
    }
  }

  drawYaheyli(ctx, x, y, happy = false) {
    // Cuerpo (mas pequeno)
    ctx.fillStyle = '#ff69b4'; // Blusa rosa
    PixelDraw.ellipse(ctx, x, y + 8, 10, 12, '#ff69b4');

    // Falda
    ctx.fillStyle = '#cc4477';
    PixelDraw.triangle(ctx, x - 10, y + 16, x, y + 28, x + 10, y + 16, '#cc4477');

    // Zapatos
    ctx.fillStyle = '#884466';
    PixelDraw.ellipse(ctx, x - 5, y + 30, 5, 3, '#884466');
    PixelDraw.ellipse(ctx, x + 5, y + 30, 5, 3, '#884466');

    // Brazos
    ctx.fillStyle = '#fdd';
    PixelDraw.ellipse(ctx, x - 12, y + 8, 4, 10, '#fdd');
    PixelDraw.ellipse(ctx, x + 10, y + 8, 4, 10, '#fdd');

    // Cabeza
    ctx.fillStyle = '#fdd';
    PixelDraw.circle(ctx, x, y - 8, 11, '#fdd');

    // Cabello negro largo
    ctx.fillStyle = '#1a1a1a';
    PixelDraw.ellipse(ctx, x, y - 16, 13, 10, '#1a1a1a');
    PixelDraw.ellipse(ctx, x - 12, y - 2, 6, 14, '#1a1a1a');
    PixelDraw.ellipse(ctx, x + 12, y - 2, 6, 14, '#1a1a1a');

    // Ojos grandes
    const eyeY = y - 10;
    if (this.blinkState >= 1 && this.blinkState <= 2) {
      ctx.fillStyle = '#1a1a1a';
      PixelDraw.hline(ctx, x - 5, eyeY, 4, '#1a1a1a');
      PixelDraw.hline(ctx, x + 1, eyeY, 4, '#1a1a1a');
    } else {
      ctx.fillStyle = '#fff';
      PixelDraw.ellipse(ctx, x - 4, eyeY, 4, 5, '#fff');
      PixelDraw.ellipse(ctx, x + 4, eyeY, 4, 5, '#fff');
      ctx.fillStyle = '#4488cc';
      PixelDraw.circle(ctx, x - 4, eyeY, 2, '#4488cc');
      PixelDraw.circle(ctx, x + 4, eyeY, 2, '#4488cc');
      ctx.fillStyle = '#fff';
      PixelDraw.pixel(ctx, x - 3, eyeY - 1, '#fff');
      PixelDraw.pixel(ctx, x + 5, eyeY - 1, '#fff');
    }

    // Mejillas
    ctx.fillStyle = '#ffaaaaff';
    PixelDraw.ellipse(ctx, x - 8, y - 6, 2, 2, '#ffaaaaff');
    PixelDraw.ellipse(ctx, x + 8, y - 6, 2, 2, '#ffaaaaff');

    // Boca
    ctx.fillStyle = '#884466';
    if (happy) {
      PixelDraw.hline(ctx, x - 2, y - 2, 4, '#884466');
      PixelDraw.pixel(ctx, x - 2, y - 3, '#884466');
      PixelDraw.pixel(ctx, x + 1, y - 3, '#884466');
    } else {
      PixelDraw.pixel(ctx, x, y - 1, '#884466');
    }
  }
}

/**
 * Master Ball (Escena 6 - premio)
 */
export class MasterBallSprite extends Sprite {
  constructor(x, y) {
    super(x, y, 32, 32);
    this.rotation = 0;
    this.pulsePhase = 0;
    this.animations = {
      idle: {
        frames: [{ draw: (ctx) => this.drawMasterBall(ctx) }]
      }
    };
    this.setAnimation('idle');
  }

  update(dt) {
    super.update(dt);
    this.rotation += dt * 1.5;
    this.pulsePhase += dt * 3;
  }

  drawMasterBall(ctx) {
    const cx = 0;
    const cy = 0;
    const r = 14;

    // Sombra
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    PixelDraw.ellipse(ctx, cx, cy + 10, r, 3, 'rgba(0,0,0,0.3)');

    // Pulso de brillo
    const pulse = 1 + Math.sin(this.pulsePhase) * 0.15;

    ctx.save();
    ctx.scale(pulse, pulse);
    ctx.rotate(this.rotation);

    // Anillo exterior dorado
    ctx.fillStyle = Colors.ticketGold;
    PixelDraw.circle(ctx, cx, cy, r, Colors.ticketGold);

    // Parte superior (rosa/purpura master ball)
    ctx.fillStyle = Colors.masterballPurple;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 2, 0, Math.PI, false);
    ctx.fill();

    // Parte inferior (rosa)
    ctx.fillStyle = Colors.masterballPink;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 2, 0, Math.PI, true);
    ctx.fill();

    // Linea central dorada
    ctx.fillStyle = Colors.ticketGold;
    ctx.fillRect(cx - r + 2, cy - 1, (r - 2) * 2, 3);

    // Boton central (M)
    ctx.fillStyle = Colors.pokeballBlack;
    PixelDraw.circle(ctx, cx, cy + 1, 6, Colors.pokeballBlack);
    ctx.fillStyle = Colors.ticketGold;
    PixelDraw.circle(ctx, cx, cy + 1, 4, Colors.ticketGold);

    // Letra M
    ctx.fillStyle = Colors.pokeballBlack;
    ctx.font = '8px "Press Start 2P", cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('M', cx, cy + 1);

    // Brillo
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    PixelDraw.ellipse(ctx, cx - 4, cy - 6, 5, 2, 'rgba(255,255,255,0.4)');

    ctx.restore();
  }
}

/**
 * Snorlax feliz (Escena 6 - al encontrar la pokeball correcta)
 */
export class SnorlaxSprite extends Sprite {
  constructor(x, y) {
    super(x, y, 64, 56);
    this.breathPhase = 0;
    this.animations = {
      idle: {
        frames: [
          { draw: (ctx) => this.drawSnorlax(ctx, 0) },
          { draw: (ctx) => this.drawSnorlax(ctx, 1) }
        ]
      },
      happy: {
        frames: [
          { draw: (ctx) => this.drawSnorlaxHappy(ctx, 0) },
          { draw: (ctx) => this.drawSnorlaxHappy(ctx, 1) }
        ]
      }
    };
    this.setAnimation('happy');
    this.animationSpeed = 0.8;
  }

  update(dt) {
    super.update(dt);
    this.breathPhase += dt * 0.8;
  }

  drawSnorlax(ctx, frame) {
    const breath = Math.sin(this.breathPhase) * 1.5;
    const cx = 0;
    const cy = 0 + breath;

    // Cuerpo grande redondo (azul oscuro)
    ctx.fillStyle = '#4a6fa5';
    PixelDraw.ellipse(ctx, cx, cy + 10, 30, 22, '#4a6fa5');

    // Barriga (crema)
    ctx.fillStyle = '#f5f0e0';
    PixelDraw.ellipse(ctx, cx, cy + 14, 18, 14, '#f5f0e0');

    // Cabeza (integrada al cuerpo)
    PixelDraw.circle(ctx, cx, cy - 8, 22, '#4a6fa5');

    // Orejas
    ctx.fillStyle = '#4a6fa5';
    PixelDraw.triangle(ctx, cx - 18, cy - 20, cx - 12, cy - 30, cx - 6, cy - 20, '#4a6fa5');
    PixelDraw.triangle(ctx, cx + 18, cy - 20, cx + 12, cy - 30, cx + 6, cy - 20, '#4a6fa5');
    // Interior orejas
    ctx.fillStyle = '#f5f0e0';
    PixelDraw.triangle(ctx, cx - 16, cy - 20, cx - 12, cy - 26, cx - 8, cy - 20, '#f5f0e0');
    PixelDraw.triangle(ctx, cx + 16, cy - 20, cx + 12, cy - 26, cx + 8, cy - 20, '#f5f0e0');

    // Ojos cerrados (dormido/feliz)
    ctx.fillStyle = '#1a1a1a';
    PixelDraw.hline(ctx, cx - 10, cy - 12, 6, '#1a1a1a');
    PixelDraw.hline(ctx, cx + 4, cy - 12, 6, '#1a1a1a');
    // Pestanas
    PixelDraw.pixel(ctx, cx - 10, cy - 13, '#1a1a1a');
    PixelDraw.pixel(ctx, cx - 5, cy - 13, '#1a1a1a');
    PixelDraw.pixel(ctx, cx + 4, cy - 13, '#1a1a1a');
    PixelDraw.pixel(ctx, cx + 9, cy - 13, '#1a1a1a');

    // Boca sonriendo
    ctx.fillStyle = '#8b2a4a';
    PixelDraw.hline(ctx, cx - 4, cy - 4, 8, '#8b2a4a');
    PixelDraw.pixel(ctx, cx - 4, cy - 5, '#8b2a4a');
    PixelDraw.pixel(ctx, cx + 3, cy - 5, '#8b2a4a');

    // Nariz
    ctx.fillStyle = '#2a2a2a';
    PixelDraw.pixel(ctx, cx, cy - 8, '#2a2a2a');
    PixelDraw.pixel(ctx, cx - 1, cy - 7, '#2a2a2a');
    PixelDraw.pixel(ctx, cx + 1, cy - 7, '#2a2a2a');

    // Brazos
    ctx.fillStyle = '#4a6fa5';
    PixelDraw.ellipse(ctx, cx - 24, cy + 4, 8, 6, '#4a6fa5');
    PixelDraw.ellipse(ctx, cx + 24, cy + 4, 8, 6, '#4a6fa5');
    // Garras
    ctx.fillStyle = '#2a2a2a';
    for (let i = 0; i < 3; i++) {
      PixelDraw.pixel(ctx, cx - 26 + i * 3, cy + 8, '#2a2a2a');
      PixelDraw.pixel(ctx, cx + 20 + i * 3, cy + 8, '#2a2a2a');
    }

    // Piernas (cortas)
    ctx.fillStyle = '#4a6fa5';
    PixelDraw.ellipse(ctx, cx - 14, cy + 28, 10, 6, '#4a6fa5');
    PixelDraw.ellipse(ctx, cx + 14, cy + 28, 10, 6, '#4a6fa5');
    // Garras pies
    ctx.fillStyle = '#2a2a2a';
    for (let i = 0; i < 3; i++) {
      PixelDraw.pixel(ctx, cx - 17 + i * 3, cy + 32, '#2a2a2a');
      PixelDraw.pixel(ctx, cx + 11 + i * 3, cy + 32, '#2a2a2a');
    }

    // Manchas en el cuerpo
    ctx.fillStyle = '#3a5a85';
    PixelDraw.ellipse(ctx, cx - 16, cy + 2, 4, 3, '#3a5a85');
    PixelDraw.ellipse(ctx, cx + 12, cy + 6, 3, 2, '#3a5a85');
    PixelDraw.ellipse(ctx, cx - 8, cy + 18, 3, 2, '#3a5a85');
  }

  drawSnorlaxHappy(ctx, frame) {
    this.drawSnorlax(ctx, frame);

    // Corazones flotando alrededor
    const heartOffset = (frame % 2) * 4;
    ctx.fillStyle = Colors.uiHeart;
    this.drawHeart(ctx, cx - 30, cy - 20 + heartOffset, 0.6);
    this.drawHeart(ctx, cx + 30, cy - 16 - heartOffset, 0.6);
    this.drawHeart(ctx, cx, cy - 35, 0.8);
  }

  drawHeart(ctx, x, y, scale) {
    const s = scale * 4;
    ctx.fillStyle = Colors.uiHeart;
    PixelDraw.pixel(ctx, x, y - s, Colors.uiHeart);
    PixelDraw.pixel(ctx, x - s, y, Colors.uiHeart);
    PixelDraw.pixel(ctx, x + s, y, Colors.uiHeart);
    PixelDraw.pixel(ctx, x - s, y + s, Colors.uiHeart);
    PixelDraw.pixel(ctx, x, y + s, Colors.uiHeart);
    PixelDraw.pixel(ctx, x + s, y + s, Colors.uiHeart);
    PixelDraw.pixel(ctx, x, y + 2 * s, Colors.uiHeart);
  }
}

/**
 * Pikachu triste (Escena 6 - pokeball incorrecta)
 */
export class PikachuSadSprite extends Sprite {
  constructor(x, y) {
    super(x, y, 40, 48);
    this.tearPhase = 0;
    this.animations = {
      sad: {
        frames: [
          { draw: (ctx) => this.drawPikachuSad(ctx, 0) },
          { draw: (ctx) => this.drawPikachuSad(ctx, 1) }
        ]
      }
    };
    this.setAnimation('sad');
    this.animationSpeed = 0.6;
  }

  update(dt) {
    super.update(dt);
    this.tearPhase += dt * 2;
  }

  drawPikachuSad(ctx, frame) {
    const cx = 0;
    const cy = 0;
    const tearY = (this.tearPhase % 1) * 20;

    // Cuerpo amarillo
    ctx.fillStyle = '#ffe444';
    PixelDraw.ellipse(ctx, cx, cy + 8, 16, 14, '#ffe444');

    // Cabeza
    PixelDraw.circle(ctx, cx, cy - 8, 16, '#ffe444');

    // Orejas (puntas negras)
    ctx.fillStyle = '#ffe444';
    PixelDraw.triangle(ctx, cx - 14, cy - 20, cx - 8, cy - 36, cx - 2, cy - 20, '#ffe444');
    PixelDraw.triangle(ctx, cx + 14, cy - 20, cx + 8, cy - 36, cx + 2, cy - 20, '#ffe444');
    // Puntas negras
    ctx.fillStyle = '#1a1a1a';
    PixelDraw.triangle(ctx, cx - 12, cy - 24, cx - 8, cy - 36, cx - 4, cy - 24, '#1a1a1a');
    PixelDraw.triangle(ctx, cx + 12, cy - 24, cx + 8, cy - 36, cx + 4, cy - 24, '#1a1a1a');

    // Mejillas rojas
    ctx.fillStyle = '#ff4444';
    PixelDraw.circle(ctx, cx - 12, cy - 4, 4, '#ff4444');
    PixelDraw.circle(ctx, cx + 12, cy - 4, 4, '#ff4444');

    // Ojos tristes (grandes con lagrimas)
    const eyeY = cy - 10;
    ctx.fillStyle = '#fff';
    PixelDraw.circle(ctx, cx - 7, eyeY, 5, '#fff');
    PixelDraw.circle(ctx, cx + 7, eyeY, 5, '#fff');
    // Iris
    ctx.fillStyle = '#1a1a1a';
    PixelDraw.circle(ctx, cx - 7, eyeY + 1, 3, '#1a1a1a');
    PixelDraw.circle(ctx, cx + 7, eyeY + 1, 3, '#1a1a1a');
    // Brillo
    ctx.fillStyle = '#fff';
    PixelDraw.pixel(ctx, cx - 6, eyeY, '#fff');
    PixelDraw.pixel(ctx, cx + 8, eyeY, '#fff');

    // Cejas tristes (inclinadas hacia arriba en el centro)
    ctx.fillStyle = '#1a1a1a';
    PixelDraw.hline(ctx, cx - 10, eyeY - 6, 6, '#1a1a1a');
    PixelDraw.hline(ctx, cx + 4, eyeY - 6, 6, '#1a1a1a');
    PixelDraw.pixel(ctx, cx - 10, eyeY - 7, '#1a1a1a');
    PixelDraw.pixel(ctx, cx + 9, eyeY - 7, '#1a1a1a');

    // Boca triste
    ctx.fillStyle = '#1a1a1a';
    PixelDraw.pixel(ctx, cx - 2, cy, '#1a1a1a');
    PixelDraw.pixel(ctx, cx - 1, cy + 1, '#1a1a1a');
    PixelDraw.pixel(ctx, cx, cy + 1, '#1a1a1a');
    PixelDraw.pixel(ctx, cx + 1, cy + 1, '#1a1a1a');
    PixelDraw.pixel(ctx, cx + 2, cy, '#1a1a1a');

    // Lagrimas
    ctx.fillStyle = Colors.catTear;
    PixelDraw.circle(ctx, cx - 7, eyeY + 6 + tearY, 2, Colors.catTear);
    PixelDraw.pixel(ctx, cx - 7, eyeY + 5 + tearY, Colors.catTear);
    PixelDraw.circle(ctx, cx + 7, eyeY + 6 + ((this.tearPhase + 0.5) % 1) * 20, 2, Colors.catTear);
    PixelDraw.pixel(ctx, cx + 7, eyeY + 5 + ((this.tearPhase + 0.5) % 1) * 20, Colors.catTear);

    // Brazos
    ctx.fillStyle = '#ffe444';
    PixelDraw.ellipse(ctx, cx - 18, cy + 4, 5, 10, '#ffe444');
    PixelDraw.ellipse(ctx, cx + 18, cy + 4, 5, 10, '#ffe444');

    // Cola (rayo)
    ctx.fillStyle = '#ffe444';
    ctx.beginPath();
    ctx.moveTo(cx + 16, cy + 4);
    ctx.lineTo(cx + 26, cy - 2);
    ctx.lineTo(cx + 20, cy + 2);
    ctx.lineTo(cx + 28, cy + 8);
    ctx.lineTo(cx + 18, cy + 4);
    ctx.closePath();
    ctx.fill();
    // Base marron
    ctx.fillStyle = '#8b6b2a';
    PixelDraw.rect(ctx, cx + 16, cy + 4, 4, 4, '#8b6b2a');
  }
}

/**
 * Sprite para mostrar fotos reales de recuerdos (Escena 6)
 */
export class MemoryPhotoSprite extends Sprite {
  constructor(x, y, photoIndex = 0) {
    super(x, y, 120, 120);
    this.photoIndex = photoIndex;
    this.photoLoaded = false;
    this.photoImage = null;
    this.frame = 0;
    this.floatPhase = 0;
    this.loadPhoto();
  }

  loadPhoto() {
    const photoFiles = [
      'foto_0001.png', 'foto_0002.png', 'foto_0003.png', 'foto_0004.png',
      'foto_0005.png', 'foto_0006.png', 'foto_0007.png', 'foto_0008.png',
      'foto_0009.png', 'foto_0010.png', 'foto_0011.png', 'foto_0012.png',
      'foto_0013.png', 'foto_0014.png', 'foto_0015.png', 'foto_0016.png',
      'foto_0017.png', 'foto_0018.png', 'foto_0019.png', 'foto_0020.png',
      'foto_0021.png', 'foto_0022.png', 'foto_0023.png', 'foto_0024.png',
      'foto_0025.png', 'foto_0026.png', 'foto_0027.png', 'foto_0028.png',
      'foto_0029.png', 'foto_0030.png', 'foto_0031.png', 'foto_0032.png',
      'foto_0033.png', 'foto_0034.png', 'foto_0035.png', 'foto_0036.png',
      'foto_0037.png', 'foto_0038.png', 'foto_0039.png', 'foto_0040.png',
      'foto_0041.png', 'foto_0042.png', 'foto_0043.png'
    ];

    const file = photoFiles[this.photoIndex % photoFiles.length];
    this.photoImage = new Image();
    this.photoImage.onload = () => {
      this.photoLoaded = true;
    };
    this.photoImage.onerror = () => {
      this.photoLoaded = false;
    };
    this.photoImage.src = `/references/documents/${file}`;
  }

  update(dt) {
    super.update(dt);
    this.floatPhase += dt * 1.5;
    this.frame = Math.floor(this.floatPhase * 2) % 2;
  }

  render(ctx) {
    if (!this.visible) return;

    ctx.save();
    ctx.translate(Math.floor(this.x + this.offsetX), Math.floor(this.y + this.offsetY + Math.sin(this.floatPhase) * 3));
    ctx.scale(this.flipX ? -this.scale : this.scale, this.flipY ? -this.scale : this.scale);
    if (this.rotation !== 0) ctx.rotate(this.rotation);
    ctx.globalAlpha = this.alpha;

    // Marco estilo foto Polaroid/pixel art
    const w = 120;
    const h = 120;
    const frameW = w + 16;
    const frameH = h + 24; // Espacio extra abajo para estilo Polaroid

    // Sombra
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    PixelDraw.rect(ctx, 4, 4, frameW, frameH, 'rgba(0, 0, 0, 0.3)');

    // Marco blanco estilo Polaroid
    ctx.fillStyle = '#fff8f0';
    PixelDraw.rect(ctx, -frameW / 2, -frameH / 2, frameW, frameH, '#fff8f0');

    // Borde dorado
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.strokeRect(-frameW / 2 + 1, -frameH / 2 + 1, frameW - 2, frameH - 2);

    // Foto
    if (this.photoLoaded && this.photoImage) {
      ctx.drawImage(this.photoImage, -w / 2, -frameH / 2 + 4, w, h);
    } else {
      // Placeholder mientras carga
      ctx.fillStyle = '#e0e0e0';
      PixelDraw.rect(ctx, -w / 2, -frameH / 2 + 4, w, h, '#e0e0e0');
      ctx.fillStyle = '#888';
      ctx.font = '8px "VT323", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Cargando...', 0, 0);
    }

    // Texto abajo estilo Polaroid
    ctx.fillStyle = '#444';
    ctx.font = '5px "Silkscreen", cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    const memories = [
      'Jugando Fortnite juntos',
      'Con Mateo',
      '182 cm y 163 cm',
      'Panama -> El Paso',
      'Nuestra cancion',
      'Aniversario ~25 dic',
      'Viaje juntos',
      'Recuerdo especial'
    ];
    ctx.fillText(memories[this.photoIndex % memories.length], 0, frameH / 2 - 2);

    ctx.restore();
  }
}

/**
 * Carta Pokemon Holografica (Escena 6 - resultado final)
 */
export class PokemonCardSprite extends Sprite {
  constructor(x, y) {
    super(x, y, 280, 380);
    this.holographicPhase = 0;
    this.cardImage = null;
    this.cardLoaded = false;
    this.loadCardImage();
  }

  loadCardImage() {
    this.cardImage = new Image();
    this.cardImage.onload = () => {
      this.cardLoaded = true;
    };
    this.cardImage.onerror = () => {
      this.cardLoaded = false;
    };
    this.cardImage.src = '/references/photos/carta_pokemon_vy.png';
  }

  update(dt) {
    super.update(dt);
    this.holographicPhase += dt * 2;
  }

  render(ctx) {
    if (!this.visible) return;

    ctx.save();
    ctx.translate(Math.floor(this.x + this.offsetX), Math.floor(this.y + this.offsetY));
    ctx.scale(this.flipX ? -this.scale : this.scale, this.flipY ? -this.scale : this.scale);
    if (this.rotation !== 0) ctx.rotate(this.rotation);
    ctx.globalAlpha = this.alpha;

    const w = 280;
    const h = 380;

    // Efecto holografico de fondo (brillo arcoiris animado)
    const holographicGradient = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
    const phase = this.holographicPhase;
    holographicGradient.addColorStop(0, `hsl(${Math.floor(300 + 60 * Math.sin(phase))}, 80%, 70%)`);
    holographicGradient.addColorStop(0.25, `hsl(${Math.floor(60 + 60 * Math.sin(phase + 1))}, 80%, 70%)`);
    holographicGradient.addColorStop(0.5, `hsl(${Math.floor(180 + 60 * Math.sin(phase + 2))}, 80%, 70%)`);
    holographicGradient.addColorStop(0.75, `hsl(${Math.floor(300 + 60 * Math.sin(phase + 3))}, 80%, 70%)`);
    holographicGradient.addColorStop(1, `hsl(${Math.floor(300 + 60 * Math.sin(phase))}, 80%, 70%)`);

    // Sombra de la carta
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    PixelDraw.rect(ctx, 6, 6, w, h, 'rgba(0, 0, 0, 0.4)');

    // Fondo holografico
    ctx.fillStyle = holographicGradient;
    PixelDraw.rect(ctx, -w / 2, -h / 2, w, h, holographicGradient);

    // Borde dorado grueso estilo carta Pokemon
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 4;
    ctx.strokeRect(-w / 2 + 2, -h / 2 + 2, w - 4, h - 4);

    // Borde interno
    ctx.strokeStyle = '#ffaa00';
    ctx.lineWidth = 2;
    ctx.strokeRect(-w / 2 + 6, -h / 2 + 6, w - 12, h - 12);

    // Nombre de la carta (arriba)
    ctx.fillStyle = '#1a1a2e';
    ctx.font = 'bold 10px "Press Start 2P", cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('TU MAYOR SUERTE <3 444', 0, -h / 2 + 20);

    // Tipo y rareza
    ctx.fillStyle = '#ff4466';
    ctx.font = '7px "Silkscreen", cursive';
    ctx.fillText('TIPO: AMOR  .  HP: inf  .  HOLOGRAFICA', 0, -h / 2 + 50);

    // Imagen central (la ilustracion real de V&Y)
    const imgSize = 180;
    if (this.cardLoaded && this.cardImage) {
      ctx.drawImage(this.cardImage, -imgSize / 2, -h / 2 + 80, imgSize, imgSize);
    } else {
      // Placeholder
      ctx.fillStyle = 'rgba(255, 100, 150, 0.3)';
      PixelDraw.rect(ctx, -imgSize / 2, -h / 2 + 80, imgSize, imgSize, 'rgba(255, 100, 150, 0.3)');
      ctx.fillStyle = '#fff';
      ctx.font = '8px "VT323", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('carta_pokemon_vy.png', 0, -h / 2 + 80 + imgSize / 2);
    }

    // Linea divisoria
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-w / 2 + 20, h / 2 - 120);
    ctx.lineTo(w / 2 - 20, h / 2 - 120);
    ctx.stroke();

    // Ataque
    ctx.fillStyle = '#1a1a2e';
    ctx.font = '9px "Press Start 2P", cursive';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('<3 Te escojo a ti...', -w / 2 + 20, h / 2 - 110);

    // Descripcion del ataque
    ctx.fillStyle = '#444';
    ctx.font = '6px "Silkscreen", cursive';
    const descLines = [
      'Elige a esta persona para',
      'compartir el resto de tus',
      'dias. Efecto: Amor inf.',
      'No falla nunca.'
    ];
    descLines.forEach((line, i) => {
      ctx.fillText(line, -w / 2 + 20, h / 2 - 90 + i * 14);
    });

    // Frase final
    ctx.fillStyle = '#ff4466';
    ctx.font = '7px "Press Start 2P", cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('"Nuestra historia todavia', 0, h / 2 - 20);
    ctx.fillText('tiene paginas por escribir"', 0, h / 2 - 5);

    // Simbolo de energia amor (corazon dorado)
    ctx.fillStyle = '#ffd700';
    this.drawHeart(ctx, 0, h / 2 - 35, 0.8);

    // Efecto de brillo holografico superpuesto
    ctx.globalCompositeOperation = 'screen';
    const shineGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, w);
    shineGradient.addColorStop(0, `rgba(255, 255, 255, ${0.15 + 0.1 * Math.sin(phase * 3)})`);
    shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = shineGradient;
    PixelDraw.rect(ctx, -w / 2, -h / 2, w, h, shineGradient);
    ctx.globalCompositeOperation = 'source-over';

    ctx.restore();
  }

  drawHeart(ctx, x, y, scale) {
    const s = scale * 16;
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.3);
    ctx.bezierCurveTo(x, y - s * 0.3, x - s, y - s * 0.3, x - s, y + s * 0.2);
    ctx.bezierCurveTo(x - s, y + s * 0.5, x, y + s, x, y + s * 0.7);
    ctx.bezierCurveTo(x, y + s, x + s, y + s * 0.5, x + s, y + s * 0.2);
    ctx.bezierCurveTo(x + s, y - s * 0.3, x, y - s * 0.3, x, y + s * 0.3);
    ctx.fill();
  }
}

/**
 * Fabrica de sprites
 */
export function createSprite(type, x, y, options = {}) {
  switch (type) {
    case 'cat':
      return new CatSprite(x, y);
    case 'yaheyli-chibi':
      return new YaheyliChibiSprite(x, y);
    case 'envelope':
      return new EnvelopeSprite(x, y);
    case 'cd':
      return new CDSprite(x, y);
    case 'pokeball':
      return new PokeballSprite(x, y);
    case 'ticket':
      return new TicketSprite(x, y);
    case 'owl':
      return new OwlSprite(x, y);
    case 'hugging-cats':
      return new HuggingCatsSprite(x, y);
    case 'couple-chibi':
      return new CoupleChibiSprite(x, y);
    case 'masterball':
      return new MasterBallSprite(x, y);
    case 'snorlax':
      return new SnorlaxSprite(x, y);
    case 'pikachu-sad':
      return new PikachuSadSprite(x, y);
    case 'memory-photo':
      return new MemoryPhotoSprite(x, y, options.photoIndex);
    case 'pokemon-card':
      return new PokemonCardSprite(x, y);
    default:
      return new Sprite(x, y, 32, 32);
  }
}

export default {
  Sprite,
  CatSprite,
  YaheyliChibiSprite,
  EnvelopeSprite,
  CDSprite,
  PokeballSprite,
  TicketSprite,
  OwlSprite,
  HuggingCatsSprite,
  CoupleChibiSprite,
  MasterBallSprite,
  SnorlaxSprite,
  PikachuSadSprite,
  createSprite
};