/**
 * Backgrounds - Fondos pixel art 16-bit para cada escena
 * Renderizado programatico con Canvas API (image-rendering: pixelated)
 */

// Paleta de colores compartida
export const Colors = {
  // Cielo atardecer/noche
  skyDeep: '#1a1a2e',
  skyMid: '#2d2d44',
  skyLight: '#4a4a6a',
  sunsetOrange: '#ff6b35',
  sunsetPink: '#ff9a8b',
  sunsetGold: '#ffd700',
  sunsetPeach: '#ffb347',
  sunsetRed: '#cc3333',

  // Naturaleza
  grassDark: '#1b4d2e',
  grassMid: '#2d7d3e',
  grassLight: '#4ade80',
  flowerPink: '#ff69b4',
  flowerWhite: '#ffffff',
  flowerYellow: '#fff8a8',
  flowerBlue: '#87ceeb',
  flowerPurple: '#c8a2c8',
  waterDeep: '#0d1b2a',
  waterMid: '#1b3a5c',
  waterReflect: '#3a7ca5',
  waterShine: '#7dd3fc',

  // Montanas
  mountainFar: '#2a2a3e',
  mountainMid: '#3d3d5c',
  mountainNear: '#4a4a6a',

  // UI
  uiPanel: '#1a1a2e',
  uiBorder: '#3d3d5c',
  uiBorderBright: '#5a5a8a',
  uiText: '#f0f0f0',
  uiTextDim: '#a0a0b0',
  uiAccent: '#ffd700',
  uiHeart: '#ff4466',

  // Particulas
  firefly: '#fffac8',
  fireflyGlow: '#ffff88',
  petalLight: '#ffd0dc',
  petalDark: '#ffb3c6',

  // Gatito
  catWhite: '#ffffff',
  catOrange: '#ff8c42',
  catOrangeDark: '#cc6d33',
  catEye: '#000000',
  catTear: '#7dd3fc',

  // Pokeball
  pokeballRed: '#e83e3e',
  pokeballWhite: '#ffffff',
  pokeballBlack: '#1a1a1a',
  pokeballHighlight: '#ffaaaa',

  // Buho
  owlPink: '#ff8fab',
  owlPinkDark: '#e87996',
  owlEye: '#000000',
  owlBeak: '#ff8c42',

  // Ticket
  ticketGold: '#ffd700',
  ticketGoldDark: '#c9a800',
  ticketGreen: '#2d7d3e',
  ticketGreenLight: '#4ade80',

  // Disco/CD
  cdRainbow1: '#ff3366',
  cdRainbow2: '#ff9933',
  cdRainbow3: '#ffff33',
  cdRainbow4: '#33ff66',
  cdRainbow5: '#33ccff',
  cdRainbow6: '#9933ff',

  // Estrella completado
  starGold: '#ffd700',
  starGlow: '#fff8a8'
};

/**
 * Utilidades de dibujo pixel art
 */
export const PixelDraw = {
  /**
   * Dibujar rectangulo pixel perfecto
   */
  rect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
  },

  /**
   * Dibujar linea horizontal
   */
  hline(ctx, x, y, w, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), 1);
  },

  /**
   * Dibujar linea vertical
   */
  vline(ctx, x, y, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), 1, Math.floor(h));
  },

  /**
   * Dibujar pixel individual
   */
  pixel(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
  },

  /**
   * Dibujar circulo relleno (aproximado pixel art)
   */
  circle(ctx, cx, cy, r, color) {
    ctx.fillStyle = color;
    const r2 = r * r;
    for (let dy = -r; dy <= r; dy++) {
      const dx = Math.floor(Math.sqrt(r2 - dy * dy));
      ctx.fillRect(Math.floor(cx - dx), Math.floor(cy + dy), dx * 2 + 1, 1);
    }
  },

  /**
   * Dibujar elipse rellena
   */
  ellipse(ctx, cx, cy, rx, ry, color) {
    ctx.fillStyle = color;
    const rx2 = rx * rx;
    const ry2 = ry * ry;
    for (let dy = -ry; dy <= ry; dy++) {
      const dx = Math.floor(rx * Math.sqrt(1 - (dy * dy) / ry2));
      ctx.fillRect(Math.floor(cx - dx), Math.floor(cy + dy), dx * 2 + 1, 1);
    }
  },

  /**
   * Dibujar triangulo relleno
   */
  triangle(ctx, x1, y1, x2, y2, x3, y3, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(Math.floor(x1), Math.floor(y1));
    ctx.lineTo(Math.floor(x2), Math.floor(y2));
    ctx.lineTo(Math.floor(x3), Math.floor(y3));
    ctx.closePath();
    ctx.fill();
  },

  /**
   * Dibujar texto pixel art (usando font del canvas)
   */
  text(ctx, str, x, y, color, font = '7px "Silkscreen", cursive', align = 'left', baseline = 'top') {
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    ctx.fillText(str, Math.floor(x), Math.floor(y));
  },

  /**
   * Dibujar texto con sombra
   */
  textShadow(ctx, str, x, y, color, shadowColor, font = '7px "Silkscreen", cursive', align = 'left') {
    ctx.font = font;
    ctx.textAlign = align;
    ctx.textBaseline = 'top';
    ctx.fillStyle = shadowColor;
    ctx.fillText(str, Math.floor(x) + 1, Math.floor(y) + 1);
    ctx.fillStyle = color;
    ctx.fillText(str, Math.floor(x), Math.floor(y));
  },

  /**
   * Gradiente vertical simple (simulado con lineas)
   */
  verticalGradient(ctx, x, y, w, h, colorTop, colorBottom) {
    for (let i = 0; i < h; i++) {
      const t = i / h;
      const r = Math.floor(parseInt(colorTop.slice(1, 3), 16) * (1 - t) + parseInt(colorBottom.slice(1, 3), 16) * t);
      const g = Math.floor(parseInt(colorTop.slice(3, 5), 16) * (1 - t) + parseInt(colorBottom.slice(3, 5), 16) * t);
      const b = Math.floor(parseInt(colorTop.slice(5, 7), 16) * (1 - t) + parseInt(colorBottom.slice(5, 7), 16) * t);
      const color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      this.hline(ctx, x, y + i, w, color);
    }
  }
};

/**
 * Generador de ruido simple para texturas
 */
export class Noise {
  constructor(seed = 12345) {
    this.seed = seed;
  }

  random() {
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }

  noise2D(x, y) {
    const n = Math.sin(x * 12.9898 + y * 78.233 + this.seed) * 43758.5453;
    return n - Math.floor(n);
  }
}

/**
 * Clase base para fondos animados
 */
export class AnimatedBackground {
  constructor() {
    this.time = 0;
    this.noise = new Noise();
    this.particles = [];
  }

  update(dt) {
    this.time += dt;
  }

  render(ctx, width, height) {
    // Override en subclases
  }
}

/**
 * ESCENA 1: Paisaje atardecer/noche con lago, montanas, flores, luciernagas, petalos
 */
export class SunsetLakeBackground extends AnimatedBackground {
  constructor() {
    super();
    this.fireflies = [];
    this.petals = [];
    this.stars = [];
    this.waterRipples = [];
    this.initParticles();
  }

  initParticles() {
    // Luciernagas
    for (let i = 0; i < 15; i++) {
      this.fireflies.push({
        x: this.noise.random() * 480,
        y: 20 + this.noise.random() * 150,
        baseY: 20 + this.noise.random() * 150,
        phase: this.noise.random() * Math.PI * 2,
        speed: 0.5 + this.noise.random() * 1,
        brightness: 0.5 + this.noise.random() * 0.5,
        blinkPhase: this.noise.random() * Math.PI * 2,
        blinkSpeed: 1 + this.noise.random() * 2
      });
    }

    // Petalos cayendo
    for (let i = 0; i < 20; i++) {
      this.petals.push({
        x: this.noise.random() * 480,
        y: -this.noise.random() * 270,
        speed: 0.3 + this.noise.random() * 0.5,
        sway: this.noise.random() * Math.PI * 2,
        swaySpeed: 0.5 + this.noise.random() * 1,
        size: 2 + Math.floor(this.noise.random() * 3),
        color: this.noise.random() > 0.5 ? Colors.petalLight : Colors.petalDark,
        rotation: this.noise.random() * Math.PI * 2,
        rotSpeed: (this.noise.random() - 0.5) * 0.02
      });
    }

    // Estrellas
    for (let i = 0; i < 50; i++) {
      this.stars.push({
        x: this.noise.random() * 480,
        y: this.noise.random() * 100,
        brightness: 0.3 + this.noise.random() * 0.7,
        twinklePhase: this.noise.random() * Math.PI * 2,
        twinkleSpeed: 0.5 + this.noise.random() * 1.5
      });
    }

    // Ondas de agua
    for (let i = 0; i < 8; i++) {
      this.waterRipples.push({
        y: 160 + i * 12,
        phase: this.noise.random() * Math.PI * 2,
        amplitude: 2 + this.noise.random() * 3
      });
    }
  }

  update(dt) {
    super.update(dt);

    // Actualizar luciernagas
    this.fireflies.forEach(f => {
      f.phase += dt * f.speed;
      f.x += Math.sin(f.phase) * 0.5;
      f.y = f.baseY + Math.sin(f.phase * 0.7) * 3;
      f.blinkPhase += dt * f.blinkSpeed;
    });

    // Actualizar petalos
    this.petals.forEach(p => {
      p.y += p.speed;
      p.sway += dt * p.swaySpeed;
      p.x += Math.sin(p.sway) * 0.3;
      p.rotation += p.rotSpeed;
      if (p.y > 270 + 10) {
        p.y = -10;
        p.x = this.noise.random() * 480;
      }
    });

    // Actualizar estrellas
    this.stars.forEach(s => {
      s.twinklePhase += dt * s.twinkleSpeed;
    });

    // Actualizar ondas
    this.waterRipples.forEach(w => {
      w.phase += dt * 1.5;
    });
  }

  render(ctx, width, height) {
    const w = width;
    const h = height;

    // === CIELO GRADIENTE ===
    // Noche profunda arriba -> atardecer en el horizonte
    for (let y = 0; y < 140; y++) {
      const t = y / 140;
      // Interpolar entre cielo profundo y atardecer
      let r, g, b;
      if (t < 0.5) {
        // Noche a medio
        const lt = t * 2;
        r = Math.floor(26 * (1 - lt) + 45 * lt);
        g = Math.floor(26 * (1 - lt) + 45 * lt);
        b = Math.floor(46 * (1 - lt) + 68 * lt);
      } else {
        // Medio a atardecer
        const lt = (t - 0.5) * 2;
        r = Math.floor(45 * (1 - lt) + 255 * lt);
        g = Math.floor(45 * (1 - lt) + 107 * lt);
        b = Math.floor(68 * (1 - lt) + 53 * lt);
      }
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(0, y, w, 1);
    }

    // Sol en el horizonte
    const sunY = 135;
    const sunX = 240;
    for (let r = 30; r > 0; r -= 2) {
      const alpha = (30 - r) / 30;
      const sr = Math.floor(255 * (1 - alpha * 0.5));
      const sg = Math.floor(150 * (1 - alpha * 0.3));
      const sb = Math.floor(50 * (1 - alpha));
      PixelDraw.circle(ctx, sunX, sunY, r, `rgb(${sr}, ${sg}, ${sb})`);
    }

    // Estrellas
    this.stars.forEach(s => {
      const brightness = Math.floor(100 + 155 * s.brightness * (0.5 + 0.5 * Math.sin(s.twinklePhase)));
      const color = `rgb(${brightness}, ${brightness}, ${brightness})`;
      PixelDraw.pixel(ctx, s.x, s.y, color);
      if (s.brightness > 0.7) {
        PixelDraw.pixel(ctx, s.x + 1, s.y, color);
        PixelDraw.pixel(ctx, s.x - 1, s.y, color);
        PixelDraw.pixel(ctx, s.x, s.y + 1, color);
        PixelDraw.pixel(ctx, s.x, s.y - 1, color);
      }
    });

    // === MONTANAS (capas paralax) ===
    // Montanas lejanas
    ctx.fillStyle = Colors.mountainFar;
    ctx.beginPath();
    ctx.moveTo(0, 140);
    for (let x = 0; x <= w; x += 20) {
      const h = 140 - 25 - Math.sin((x + this.time * 10) * 0.02) * 8;
      ctx.lineTo(x, h);
    }
    ctx.lineTo(w, 140);
    ctx.closePath();
    ctx.fill();

    // Montanas medias
    ctx.fillStyle = Colors.mountainMid;
    ctx.beginPath();
    ctx.moveTo(0, 145);
    for (let x = 0; x <= w; x += 15) {
      const h = 145 - 35 - Math.sin((x + this.time * 15) * 0.03) * 12;
      ctx.lineTo(x, h);
    }
    ctx.lineTo(w, 145);
    ctx.closePath();
    ctx.fill();

    // Montanas cercanas
    ctx.fillStyle = Colors.mountainNear;
    ctx.beginPath();
    ctx.moveTo(0, 150);
    for (let x = 0; x <= w; x += 10) {
      const h = 150 - 45 - Math.sin((x + this.time * 20) * 0.04) * 15;
      ctx.lineTo(x, h);
    }
    ctx.lineTo(w, 150);
    ctx.closePath();
    ctx.fill();

    // === AGUA (lago con reflejos) ===
    for (let y = 150; y < h; y++) {
      const t = (y - 150) / (h - 150);
      const r = Math.floor(13 * (1 - t) + 27 * t);
      const g = Math.floor(27 * (1 - t) + 58 * t);
      const b = Math.floor(42 * (1 - t) + 92 * t);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(0, y, w, 1);
    }

    // Reflejo del sol en el agua
    for (let i = 0; i < 5; i++) {
      const ry = 155 + i * 8;
      const alpha = 1 - i * 0.18;
      const width = 40 - i * 6;
      const r = Math.floor(255 * alpha);
      const g = Math.floor(150 * alpha);
      const b = Math.floor(50 * alpha);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(sunX - width / 2, ry, width, 3);
    }

    // Ondas de agua animadas
    this.waterRipples.forEach(wr => {
      ctx.strokeStyle = `rgba(125, 211, 252, 0.15)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const wy = wr.y + Math.sin((x + wr.phase) * 0.05) * wr.amplitude;
        if (x === 0) ctx.moveTo(x, wy);
        else ctx.lineTo(x, wy);
      }
      ctx.stroke();
    });

    // === SUELO/ORILLA ===
    // Hierba base
    for (let y = 220; y < h; y++) {
      const t = (y - 220) / (h - 220);
      const r = Math.floor(27 * (1 - t) + 45 * t);
      const g = Math.floor(77 * (1 - t) + 125 * t);
      const b = Math.floor(46 * (1 - t) + 0 * t);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(0, y, w, 1);
    }

    // Flores en el primer plano
    const flowerPositions = [30, 80, 130, 190, 250, 310, 370, 430];
    flowerPositions.forEach((fx, i) => {
      const flowerType = i % 4;
      const fy = 225 + (i % 3) * 8;
      this.drawFlower(ctx, fx, fy, flowerType);
    });

    // === LUCIERNAGAS ===
    this.fireflies.forEach(f => {
      const brightness = Math.floor(200 + 55 * f.brightness * (0.5 + 0.5 * Math.sin(f.blinkPhase)));
      const glowColor = `rgb(${brightness}, ${brightness}, ${Math.floor(brightness * 0.6)})`;
      const coreColor = `rgb(255, 255, ${Math.floor(180 + 75 * f.brightness)})`;

      // Glow
      PixelDraw.pixel(ctx, f.x, f.y, glowColor);
      PixelDraw.pixel(ctx, f.x + 1, f.y, glowColor);
      PixelDraw.pixel(ctx, f.x - 1, f.y, glowColor);
      PixelDraw.pixel(ctx, f.x, f.y + 1, glowColor);
      PixelDraw.pixel(ctx, f.x, f.y - 1, glowColor);
      // Core
      PixelDraw.pixel(ctx, f.x, f.y, coreColor);
    });

    // === PETALOS CAYENDO ===
    this.petals.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      // Petalo simple: elipse pequena
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Detalles extra: hierba en el borde del agua
    for (let x = 0; x < w; x += 4) {
      const grassH = 3 + Math.sin(x * 0.1 + this.time) * 2;
      ctx.fillStyle = Colors.grassLight;
      ctx.fillRect(x, 218 - grassH, 2, grassH);
    }
  }

  drawFlower(ctx, x, y, type) {
    const colors = [
      { petal: Colors.flowerPink, center: Colors.flowerYellow },
      { petal: Colors.flowerWhite, center: Colors.flowerYellow },
      { petal: Colors.flowerBlue, center: Colors.flowerWhite },
      { petal: Colors.flowerPurple, center: Colors.flowerYellow }
    ];
    const c = colors[type];

    // Tallo
    PixelDraw.vline(ctx, x, y, 8, Colors.grassDark);
    PixelDraw.vline(ctx, x + 1, y, 8, Colors.grassMid);

    // Petalos (4 direcciones)
    PixelDraw.pixel(ctx, x, y - 3, c.petal);
    PixelDraw.pixel(ctx, x, y - 4, c.petal);
    PixelDraw.pixel(ctx, x - 2, y - 1, c.petal);
    PixelDraw.pixel(ctx, x - 3, y - 1, c.petal);
    PixelDraw.pixel(ctx, x + 2, y - 1, c.petal);
    PixelDraw.pixel(ctx, x + 3, y - 1, c.petal);
    PixelDraw.pixel(ctx, x - 1, y + 1, c.petal);
    PixelDraw.pixel(ctx, x + 1, y + 1, c.petal);

    // Centro
    PixelDraw.pixel(ctx, x, y - 1, c.center);
    PixelDraw.pixel(ctx, x + 1, y - 1, c.center);
  }
}

/**
 * ESCENA 2: Templo nocturno con columnas y luna llena
 */
export class TempleNightBackground extends AnimatedBackground {
  constructor() {
    super();
    this.stars = [];
    this.clouds = [];
    this.initParticles();
  }

  initParticles() {
    // Estrellas
    for (let i = 0; i < 60; i++) {
      this.stars.push({
        x: this.noise.random() * 480,
        y: this.noise.random() * 180,
        brightness: 0.2 + this.noise.random() * 0.8,
        twinklePhase: this.noise.random() * Math.PI * 2,
        twinkleSpeed: 0.3 + this.noise.random() * 1
      });
    }

    // Nubes lentas
    for (let i = 0; i < 4; i++) {
      this.clouds.push({
        x: this.noise.random() * 480,
        y: 20 + this.noise.random() * 60,
        speed: 0.05 + this.noise.random() * 0.05,
        width: 40 + this.noise.random() * 40,
        opacity: 0.15 + this.noise.random() * 0.1
      });
    }
  }

  update(dt) {
    super.update(dt);

    this.stars.forEach(s => {
      s.twinklePhase += dt * s.twinkleSpeed;
    });

    this.clouds.forEach(c => {
      c.x += c.speed;
      if (c.x > 480 + c.width) c.x = -c.width;
    });
  }

  render(ctx, width, height) {
    const w = width;
    const h = height;

    // Cielo nocturno profundo
    ctx.fillStyle = Colors.skyDeep;
    ctx.fillRect(0, 0, w, h);

    // Gradiente sutil hacia el horizonte
    for (let y = 0; y < 100; y++) {
      const t = y / 100;
      const r = Math.floor(26 + 10 * t);
      const g = Math.floor(26 + 5 * t);
      const b = Math.floor(46 - 10 * t);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(0, y, w, 1);
    }

    // Luna llena
    const moonX = 400;
    const moonY = 60;
    const moonR = 35;

    // Resplandor de la luna
    for (let r = moonR + 15; r > moonR; r -= 2) {
      const alpha = (moonR + 15 - r) / 15 * 0.15;
      ctx.fillStyle = `rgba(255, 255, 220, ${alpha})`;
      PixelDraw.circle(ctx, moonX, moonY, r, `rgba(255, 255, 220, ${alpha})`);
    }

    // Luna base
    PixelDraw.circle(ctx, moonX, moonY, moonR, '#fff8e8');

    // Crateres de la luna
    const craters = [
      { x: -8, y: -5, r: 6 },
      { x: 10, y: 8, r: 4 },
      { x: -5, y: 12, r: 3 },
      { x: 6, y: -10, r: 3 }
    ];
    craters.forEach(c => {
      PixelDraw.circle(ctx, moonX + c.x, moonY + c.y, c.r, '#e8e8d8');
    });

    // Estrellas
    this.stars.forEach(s => {
      const brightness = Math.floor(100 + 155 * s.brightness * (0.5 + 0.5 * Math.sin(s.twinklePhase)));
      const color = `rgb(${brightness}, ${brightness}, ${brightness})`;
      PixelDraw.pixel(ctx, s.x, s.y, color);
    });

    // Nubes
    this.clouds.forEach(c => {
      ctx.fillStyle = `rgba(80, 80, 100, ${c.opacity})`;
      const segments = Math.floor(c.width / 10);
      for (let i = 0; i < segments; i++) {
        const sx = c.x + i * 10;
        const sy = c.y + Math.sin(i * 0.5) * 5;
        const sw = 12 + Math.sin(i) * 4;
        const sh = 8 + Math.cos(i) * 3;
        PixelDraw.ellipse(ctx, sx, sy, sw, sh, `rgba(80, 80, 100, ${c.opacity})`);
      }
    });

    // Suelo del templo
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 180, w, h - 180);

    // Columnas del templo (perspectiva)
    const columns = [
      { x: 40, width: 24, height: 120, shade: 0 },
      { x: 120, width: 28, height: 140, shade: 1 },
      { x: 220, width: 32, height: 160, shade: 2 },
      { x: 330, width: 28, height: 140, shade: 1 },
      { x: 410, width: 24, height: 120, shade: 0 }
    ];

    columns.forEach(col => {
      const colX = col.x;
      const colY = 180 - col.height;
      const colW = col.width;

      // Base de la columna
      const baseColors = ['#3d3d5c', '#4a4a6a', '#5a5a8a'];
      ctx.fillStyle = baseColors[col.shade];
      ctx.fillRect(colX - colW / 2, colY, colW, col.height);

      // Detalles de la columna (ranuras)
      for (let i = 0; i < 3; i++) {
        const rx = colX - colW / 2 + 4 + i * 6;
        ctx.fillStyle = '#2d2d44';
        ctx.fillRect(rx, colY, 2, col.height);
      }

      // Capitel (top)
      ctx.fillStyle = baseColors[Math.min(col.shade + 1, 2)];
      ctx.fillRect(colX - colW / 2 - 4, colY - 6, colW + 8, 8);

      // Base inferior
      ctx.fillRect(colX - colW / 2 - 4, 180 - 4, colW + 8, 4);
    });

    // Escalones del templo
    for (let step = 0; step < 4; step++) {
      const stepY = 180 + step * 8;
      const stepH = 6;
      const alpha = 1 - step * 0.15;
      ctx.fillStyle = `rgba(61, 61, 92, ${alpha})`;
      ctx.fillRect(80, stepY, 320, stepH);
    }

    // Flores en la base
    for (let x = 100; x < 380; x += 40) {
      const fy = 175;
      PixelDraw.vline(ctx, x, fy, 6, Colors.grassDark);
      PixelDraw.pixel(ctx, x, fy - 3, Colors.flowerPink);
      PixelDraw.pixel(ctx, x - 2, fy - 1, Colors.flowerPink);
      PixelDraw.pixel(ctx, x + 2, fy - 1, Colors.flowerPink);
      PixelDraw.pixel(ctx, x, fy - 1, Colors.flowerYellow);
    }
  }
}

/**
 * ESCENA 3: Claro del bosque nocturno con flores brillantes
 */
export class ForestNightBackground extends AnimatedBackground {
  constructor() {
    super();
    this.fireflies = [];
    this.glowFlowers = [];
    this.particles = [];
    this.trees = [];
    this.initParticles();
  }

  initParticles() {
    // Luciernagas
    for (let i = 0; i < 20; i++) {
      this.fireflies.push({
        x: 50 + this.noise.random() * 380,
        y: 50 + this.noise.random() * 180,
        baseX: 50 + this.noise.random() * 380,
        baseY: 50 + this.noise.random() * 180,
        phase: this.noise.random() * Math.PI * 2,
        speed: 0.3 + this.noise.random() * 0.7,
        radius: 15 + this.noise.random() * 20,
        brightness: 0.4 + this.noise.random() * 0.6,
        blinkPhase: this.noise.random() * Math.PI * 2,
        blinkSpeed: 0.8 + this.noise.random() * 1.5
      });
    }

    // Flores brillantes (bioluminiscentes)
    for (let i = 0; i < 12; i++) {
      this.glowFlowers.push({
        x: 60 + this.noise.random() * 360,
        y: 160 + this.noise.random() * 80,
        type: Math.floor(this.noise.random() * 4),
        glowPhase: this.noise.random() * Math.PI * 2,
        glowSpeed: 0.5 + this.noise.random() * 1,
        swayPhase: this.noise.random() * Math.PI * 2,
        swaySpeed: 0.3 + this.noise.random() * 0.5
      });
    }

    // Particulas flotantes (polen/magia)
    for (let i = 0; i < 30; i++) {
      this.particles.push({
        x: this.noise.random() * 480,
        y: this.noise.random() * 270,
        speedX: (this.noise.random() - 0.5) * 0.3,
        speedY: -0.1 - this.noise.random() * 0.3,
        size: 1 + Math.floor(this.noise.random() * 2),
        color: this.noise.random() > 0.5 ? Colors.firefly : Colors.flowerBlue,
        life: this.noise.random() * Math.PI * 2
      });
    }

    // Arboles del fondo
    for (let i = 0; i < 8; i++) {
      this.trees.push({
        x: 30 + i * 60 + this.noise.random() * 20,
        y: 140 + this.noise.random() * 30,
        height: 80 + this.noise.random() * 40,
        width: 20 + this.noise.random() * 15,
        shade: Math.floor(this.noise.random() * 3)
      });
    }
  }

  update(dt) {
    super.update(dt);

    // Luciernagas volando
    this.fireflies.forEach(f => {
      f.phase += dt * f.speed;
      f.x = f.baseX + Math.sin(f.phase) * f.radius;
      f.y = f.baseY + Math.cos(f.phase * 0.7) * (f.radius * 0.5);
      f.blinkPhase += dt * f.blinkSpeed;
    });

    // Flores brillantes
    this.glowFlowers.forEach(fl => {
      fl.glowPhase += dt * fl.glowSpeed;
      fl.swayPhase += dt * fl.swaySpeed;
    });

    // Particulas flotantes
    this.particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.life += dt * 2;
      if (p.y < -10 || p.x < -10 || p.x > 490) {
        p.x = this.noise.random() * 480;
        p.y = 270 + this.noise.random() * 50;
      }
    });
  }

  render(ctx, width, height) {
    const w = width;
    const h = height;

    // Cielo nocturno boscoso
    for (let y = 0; y < h; y++) {
      const t = y / h;
      const r = Math.floor(15 + 20 * t);
      const g = Math.floor(10 + 30 * t);
      const b = Math.floor(30 + 20 * t);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(0, y, w, 1);
    }

    // Arboles del fondo (silhouettes)
    this.trees.forEach(tree => {
      const shades = ['#1a2a1a', '#2a3a2a', '#3a4a3a'];
      ctx.fillStyle = shades[tree.shade];

      // Tronco
      ctx.fillRect(tree.x - 3, tree.y, 6, tree.height - 40);

      // Copa del arbol (triangulos apilados)
      let cy = tree.y - 10;
      let cw = tree.width;
      for (let level = 0; level < 4; level++) {
        PixelDraw.triangle(ctx,
          tree.x, cy - 15,
          tree.x - cw / 2, cy + 5,
          tree.x + cw / 2, cy + 5,
          shades[tree.shade]
        );
        cy -= 12;
        cw *= 0.85;
      }
    });

    // Suelo del bosque
    for (let y = 200; y < h; y++) {
      const t = (y - 200) / (h - 200);
      const r = Math.floor(20 + 15 * t);
      const g = Math.floor(40 + 20 * t);
      const b = Math.floor(15 + 10 * t);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(0, y, w, 1);
    }

    // Hierba
    for (let x = 0; x < w; x += 3) {
      const gh = 4 + Math.sin(x * 0.15 + this.time) * 2;
      ctx.fillStyle = Colors.grassMid;
      ctx.fillRect(x, 198 - gh, 2, gh);
    }

    // Particulas magicas flotantes
    this.particles.forEach(p => {
      const alpha = 0.3 + 0.4 * Math.sin(p.life);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      PixelDraw.pixel(ctx, p.x, p.y, p.color);
      if (p.size > 1) {
        PixelDraw.pixel(ctx, p.x + 1, p.y, p.color);
      }
    });
    ctx.globalAlpha = 1;

    // Flores bioluminiscentes
    const flowerTypes = [
      { petal: Colors.flowerPink, glow: '#ff88cc', center: Colors.flowerYellow },
      { petal: Colors.flowerBlue, glow: '#88ccff', center: Colors.flowerWhite },
      { petal: Colors.flowerPurple, glow: '#cc88ff', center: Colors.flowerYellow },
      { petal: Colors.flowerWhite, glow: '#ffeeaa', center: Colors.flowerPink }
    ];

    this.glowFlowers.forEach(fl => {
      const type = flowerTypes[fl.type];
      const fx = fl.x + Math.sin(fl.swayPhase) * 2;
      const fy = fl.y;
      const glowIntensity = 0.5 + 0.5 * Math.sin(fl.glowPhase);

      // Resplandor alrededor
      const glowR = 8 + glowIntensity * 4;
      for (let r = glowR; r > 4; r -= 2) {
        const alpha = (glowR - r) / glowR * 0.3 * glowIntensity;
        ctx.fillStyle = type.glow.replace('rgb', 'rgba').replace(')', `, ${alpha})`).replace('#', '');
        // Aproximacion simple del glow
        ctx.fillStyle = `rgba(${parseInt(type.glow.slice(1, 3), 16)}, ${parseInt(type.glow.slice(3, 5), 16)}, ${parseInt(type.glow.slice(5, 7), 16)}, ${alpha})`;
        PixelDraw.circle(ctx, fx, fy - 5, r, ctx.fillStyle);
      }

      // Tallo
      ctx.fillStyle = Colors.grassDark;
      ctx.fillRect(fx - 1, fy, 2, 15);

      // Hojas
      ctx.fillStyle = Colors.grassMid;
      ctx.fillRect(fx - 6, fy + 3, 12, 3);
      ctx.fillRect(fx - 5, fy + 8, 10, 3);

      // Petalos
      const petalColor = `rgba(${parseInt(type.petal.slice(1, 3), 16)}, ${parseInt(type.petal.slice(3, 5), 16)}, ${parseInt(type.petal.slice(5, 7), 16)}, ${0.8 + 0.2 * glowIntensity})`;
      ctx.fillStyle = type.petal;
      // 5 petalos
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
        const px = fx + Math.cos(angle) * 5;
        const py = fy - 5 + Math.sin(angle) * 5;
        PixelDraw.ellipse(ctx, px, py, 4, 2, type.petal);
      }

      // Centro
      PixelDraw.circle(ctx, fx, fy - 5, 3, type.center);
    });

    // Luciernagas
    this.fireflies.forEach(f => {
      const brightness = Math.floor(180 + 75 * f.brightness * (0.5 + 0.5 * Math.sin(f.blinkPhase)));
      const coreColor = `rgb(${brightness}, ${brightness}, ${Math.floor(brightness * 0.5)})`;
      const glowColor = `rgba(${brightness}, ${brightness}, ${Math.floor(brightness * 0.3)}, 0.4)`;

      // Glow suave
      ctx.fillStyle = glowColor;
      PixelDraw.circle(ctx, f.x, f.y, 4, glowColor);

      // Core
      ctx.fillStyle = coreColor;
      PixelDraw.pixel(ctx, f.x, f.y, coreColor);
      PixelDraw.pixel(ctx, f.x + 1, f.y, coreColor);
      PixelDraw.pixel(ctx, f.x, f.y + 1, coreColor);
    });
  }
}

/**
 * ESCENA 4: Pradera al atardecer con nubes (para la carta)
 */
export class MeadowSunsetBackground extends AnimatedBackground {
  constructor() {
    super();
    this.clouds = [];
    this.petals = [];
    this.grassBlades = [];
    this.initParticles();
  }

  initParticles() {
    // Nubes suaves en el cielo
    for (let i = 0; i < 8; i++) {
      this.clouds.push({
        x: this.noise.random() * 480,
        y: 20 + this.noise.random() * 80,
        speed: 0.02 + this.noise.random() * 0.03,
        width: 60 + this.noise.random() * 60,
        height: 20 + this.noise.random() * 15,
        opacity: 0.2 + this.noise.random() * 0.15,
        segments: 4 + Math.floor(this.noise.random() * 3)
      });
    }

    // Petalos cayendo (menos que en escena 1)
    for (let i = 0; i < 15; i++) {
      this.petals.push({
        x: this.noise.random() * 480,
        y: -this.noise.random() * 270,
        speed: 0.2 + this.noise.random() * 0.4,
        sway: this.noise.random() * Math.PI * 2,
        swaySpeed: 0.3 + this.noise.random() * 0.7,
        size: 2 + Math.floor(this.noise.random() * 3),
        color: this.noise.random() > 0.5 ? Colors.petalLight : Colors.petalDark,
        rotation: this.noise.random() * Math.PI * 2,
        rotSpeed: (this.noise.random() - 0.5) * 0.015
      });
    }

    // Hierba animada en primer plano
    for (let x = 0; x < 480; x += 6) {
      this.grassBlades.push({
        x: x + this.noise.random() * 3,
        baseHeight: 8 + this.noise.random() * 12,
        swayPhase: this.noise.random() * Math.PI * 2,
        swaySpeed: 0.4 + this.noise.random() * 0.6,
        color: this.noise.random() > 0.6 ? Colors.grassLight : Colors.grassMid
      });
    }
  }

  update(dt) {
    super.update(dt);

    // Nubes moviendose lentamente
    this.clouds.forEach(c => {
      c.x += c.speed;
      if (c.x > 480 + c.width) c.x = -c.width;
    });

    // Petalos
    this.petals.forEach(p => {
      p.y += p.speed;
      p.sway += dt * p.swaySpeed;
      p.x += Math.sin(p.sway) * 0.2;
      p.rotation += p.rotSpeed;
      if (p.y > 270 + 10) {
        p.y = -10;
        p.x = this.noise.random() * 480;
      }
    });

    // Hierba balanceandose
    this.grassBlades.forEach(g => {
      g.swayPhase += dt * g.swaySpeed;
    });
  }

  render(ctx, width, height) {
    const w = width;
    const h = height;

    // === CIELO ATARDECER SUAVE (nubes rosadas/naranjas) ===
    for (let y = 0; y < h; y++) {
      const t = y / h;
      // Gradiente: azul suave arriba -> rosa melocoton medio -> dorado abajo
      let r, g, b;
      if (t < 0.3) {
        // Azul cielo palido
        const lt = t / 0.3;
        r = Math.floor(100 * (1 - lt) + 255 * lt);
        g = Math.floor(150 * (1 - lt) + 180 * lt);
        b = Math.floor(200 * (1 - lt) + 120 * lt);
      } else if (t < 0.6) {
        // Rosa/naranja atardecer
        const lt = (t - 0.3) / 0.3;
        r = Math.floor(255);
        g = Math.floor(180 * (1 - lt) + 120 * lt);
        b = Math.floor(120 * (1 - lt) + 60 * lt);
      } else {
        // Dorado calido cerca del horizonte
        const lt = (t - 0.6) / 0.4;
        r = Math.floor(255);
        g = Math.floor(120 * (1 - lt) + 200 * lt);
        b = Math.floor(60 * (1 - lt) + 100 * lt);
      }
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(0, y, w, 1);
    }

    // Sol bajo en el horizonte (mas grande, mas suave)
    const sunY = 110;
    const sunX = 380;
    for (let r = 40; r > 0; r -= 3) {
      const alpha = (40 - r) / 40;
      const sr = Math.floor(255 * (1 - alpha * 0.3));
      const sg = Math.floor(200 * (1 - alpha * 0.4));
      const sb = Math.floor(100 * (1 - alpha * 0.5));
      PixelDraw.circle(ctx, sunX, sunY, r, `rgb(${sr}, ${sg}, ${sb})`);
    }

    // Nubes con color del atardecer
    this.clouds.forEach(c => {
      ctx.fillStyle = `rgba(255, 220, 180, ${c.opacity})`;
      for (let i = 0; i < c.segments; i++) {
        const segX = c.x + (i / c.segments) * c.width;
        const segY = c.y + Math.sin(i * 0.8) * 8;
        const segW = c.width / c.segments * 1.3;
        const segH = c.height * (0.7 + Math.sin(i) * 0.3);
        PixelDraw.ellipse(ctx, segX, segY, segW, segH, `rgba(255, 220, 180, ${c.opacity})`);
      }
    });

    // === PRADERA (suelo verde con flores) ===
    // Capa base de hierba
    for (let y = 160; y < h; y++) {
      const t = (y - 160) / (h - 160);
      const r = Math.floor(30 * (1 - t) + 50 * t);
      const g = Math.floor(90 * (1 - t) + 130 * t);
      const b = Math.floor(40 * (1 - t) + 20 * t);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(0, y, w, 1);
    }

    // Hierba animada en primer plano
    this.grassBlades.forEach(g => {
      const h = g.baseHeight + Math.sin(g.swayPhase) * 3;
      ctx.fillStyle = g.color;
      ctx.fillRect(g.x, 158 - h, 2, h);
    })

    // Flores dispersas en la pradera
    const flowerPositions = [
      { x: 40, y: 170 }, { x: 100, y: 185 }, { x: 180, y: 175 },
      { x: 260, y: 180 }, { x: 340, y: 170 }, { x: 420, y: 185 },
      { x: 60, y: 200 }, { x: 140, y: 210 }, { x: 220, y: 205 },
      { x: 300, y: 210 }, { x: 380, y: 200 }, { x: 460, y: 215 }
    ];
    flowerPositions.forEach((pos, i) => {
      const flowerType = i % 4;
      this.drawMeadowFlower(ctx, pos.x, pos.y, flowerType);
    });

    // Petalos cayendo
    this.petals.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Arboles lejanos en el horizonte (siluetas suaves)
    ctx.fillStyle = 'rgba(60, 50, 70, 0.4)';
    for (let i = 0; i < 5; i++) {
      const tx = 50 + i * 100;
      const ty = 130;
      const th = 40 + Math.sin(this.time + i) * 5;
      ctx.beginPath();
      ctx.moveTo(tx - 30, 160);
      ctx.lineTo(tx, ty - th);
      ctx.lineTo(tx + 30, 160);
      ctx.closePath();
      ctx.fill();
    }
  }

  drawMeadowFlower(ctx, x, y, type) {
    const colors = [
      { petal: Colors.flowerPink, center: Colors.flowerYellow, stem: Colors.grassDark },
      { petal: Colors.flowerWhite, center: Colors.flowerYellow, stem: Colors.grassDark },
      { petal: Colors.flowerBlue, center: Colors.flowerWhite, stem: Colors.grassMid },
      { petal: Colors.flowerPurple, center: Colors.flowerYellow, stem: Colors.grassDark }
    ];
    const c = colors[type];

    // Tallo
    PixelDraw.vline(ctx, x, y, 12, c.stem);
    PixelDraw.vline(ctx, x + 1, y, 12, c.stem);

    // Hojas
    ctx.fillStyle = c.stem;
    ctx.fillRect(x - 4, y + 4, 8, 2);
    ctx.fillRect(x - 3, y + 8, 6, 2);

    // Petalos (5 petalos estilo margarita)
    ctx.fillStyle = c.petal;
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
      const px = x + Math.cos(angle) * 4;
      const py = y - 2 + Math.sin(angle) * 4;
      PixelDraw.ellipse(ctx, px, py, 3, 1.5, c.petal);
    }

    // Centro
    PixelDraw.circle(ctx, x, y - 2, 2, c.center);
  }
}

/**
 * ESCENA 5: Lago dorado al atardecer con muelle de madera (para las canciones)
 */
export class LakeSunsetBackground extends AnimatedBackground {
  constructor() {
    super();
    this.waterRipples = [];
    this.clouds = [];
    this.fireflies = [];
    this.dockPosts = [];
    this.initParticles();
  }

  initParticles() {
    // Ondas de agua
    for (let i = 0; i < 10; i++) {
      this.waterRipples.push({
        y: 140 + i * 10,
        phase: this.noise.random() * Math.PI * 2,
        amplitude: 1.5 + this.noise.random() * 2,
        speed: 0.8 + this.noise.random() * 0.5
      });
    }

    // Nubes dramaticas al atardecer
    for (let i = 0; i < 6; i++) {
      this.clouds.push({
        x: this.noise.random() * 480,
        y: 15 + this.noise.random() * 60,
        speed: 0.015 + this.noise.random() * 0.02,
        width: 80 + this.noise.random() * 70,
        height: 25 + this.noise.random() * 20,
        opacity: 0.15 + this.noise.random() * 0.1,
        segments: 5 + Math.floor(this.noise.random() * 3),
        colorIndex: Math.floor(this.noise.random() * 3) // Color estable asignado al inicializar
      });
    }

    // Luciernagas cerca del agua
    for (let i = 0; i < 12; i++) {
      this.fireflies.push({
        x: 50 + this.noise.random() * 380,
        y: 150 + this.noise.random() * 80,
        baseX: 50 + this.noise.random() * 380,
        baseY: 150 + this.noise.random() * 80,
        phase: this.noise.random() * Math.PI * 2,
        speed: 0.2 + this.noise.random() * 0.5,
        radius: 10 + this.noise.random() * 15,
        brightness: 0.5 + this.noise.random() * 0.5,
        blinkPhase: this.noise.random() * Math.PI * 2,
        blinkSpeed: 1 + this.noise.random() * 2
      });
    }

    // Postes del muelle
    for (let i = 0; i < 6; i++) {
      this.dockPosts.push({
        x: 180 + i * 25,
        y: 150,
        height: 30 + i * 3,
        lean: (this.noise.random() - 0.5) * 2
      });
    }
  }

  update(dt) {
    super.update(dt);

    // Ondas
    this.waterRipples.forEach(w => {
      w.phase += dt * w.speed;
    });

    // Nubes
    this.clouds.forEach(c => {
      c.x += c.speed;
      if (c.x > 480 + c.width) c.x = -c.width;
    });

    // Luciernagas
    this.fireflies.forEach(f => {
      f.phase += dt * f.speed;
      f.x = f.baseX + Math.sin(f.phase) * f.radius;
      f.y = f.baseY + Math.cos(f.phase * 0.5) * (f.radius * 0.5);
      f.blinkPhase += dt * f.blinkSpeed;
    });
  }

  render(ctx, width, height) {
    const w = width;
    const h = height;

    // === CIELO DRAMATICO ATARDECER (dorado/naranja intenso) ===
    for (let y = 0; y < 140; y++) {
      const t = y / 140;
      let r, g, b;
      if (t < 0.4) {
        // Naranja intenso arriba
        const lt = t / 0.4;
        r = Math.floor(200 + 55 * lt);
        g = Math.floor(80 + 40 * lt);
        b = Math.floor(30 + 10 * lt);
      } else if (t < 0.7) {
        // Dorado brillante medio
        const lt = (t - 0.4) / 0.3;
        r = Math.floor(255);
        g = Math.floor(120 + 80 * lt);
        b = Math.floor(40 - 20 * lt);
      } else {
        // Transicion al agua
        const lt = (t - 0.7) / 0.3;
        r = Math.floor(255 * (1 - lt) + 30 * lt);
        g = Math.floor(200 * (1 - lt) + 60 * lt);
        b = Math.floor(20 * (1 - lt) + 40 * lt);
      }
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(0, y, w, 1);
    }

    // Sol grande y dorado tocando el horizonte
    const sunY = 135;
    const sunX = 240;
    for (let r = 45; r > 0; r -= 3) {
      const alpha = (45 - r) / 45;
      const sr = Math.floor(255);
      const sg = Math.floor(220 * (1 - alpha * 0.5));
      const sb = Math.floor(80 * (1 - alpha * 0.8));
      PixelDraw.circle(ctx, sunX, sunY, r, `rgb(${sr}, ${sg}, ${sb})`);
    }

    // Rayos de sol (crepusculares)
    ctx.strokeStyle = 'rgba(255, 220, 100, 0.08)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI - Math.PI / 2;
      const len = 80 + Math.sin(this.time + i) * 20;
      ctx.beginPath();
      ctx.moveTo(sunX, sunY);
      ctx.lineTo(sunX + Math.cos(angle) * len, sunY + Math.sin(angle) * len);
      ctx.stroke();
    }

    // Nubes con tonos dorados/naranjas
    this.clouds.forEach(c => {
      const cloudColors = [
        'rgba(255, 180, 80, ',
        'rgba(255, 140, 60, ',
        'rgba(220, 100, 40, '
      ];
      const color = cloudColors[c.colorIndex] + c.opacity + ')';
      ctx.fillStyle = color;
      for (let i = 0; i < c.segments; i++) {
        const segX = c.x + (i / c.segments) * c.width;
        const segY = c.y + Math.sin(i * 0.6) * 10;
        const segW = c.width / c.segments * 1.4;
        const segH = c.height * (0.6 + Math.sin(i) * 0.4);
        PixelDraw.ellipse(ctx, segX, segY, segW, segH, color);
      }
    });

    // === AGUA DORADA CON REFLEJO PERFECTO DEL SOL ===
    for (let y = 140; y < h; y++) {
      const t = (y - 140) / (h - 140);
      const r = Math.floor(30 * (1 - t) + 15 * t);
      const g = Math.floor(60 * (1 - t) + 30 * t);
      const b = Math.floor(40 * (1 - t) + 20 * t);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(0, y, w, 1);
    }

    // Reflejo del sol en el agua (larga estela dorada)
    for (let i = 0; i < 15; i++) {
      const ry = 140 + i * 8;
      const alpha = Math.max(0, 1 - i * 0.06);
      const width = 80 - i * 4;
      const r = Math.floor(255 * alpha);
      const g = Math.floor(200 * alpha);
      const b = Math.floor(50 * alpha);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.6})`;
      ctx.fillRect(sunX - width / 2, ry, width, 6);
    }

    // Ondas animadas con brillo dorado
    this.waterRipples.forEach(wr => {
      ctx.strokeStyle = `rgba(255, 220, 100, 0.12)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const wy = wr.y + Math.sin((x + wr.phase) * 0.04) * wr.amplitude;
        if (x === 0) ctx.moveTo(x, wy);
        else ctx.lineTo(x, wy);
      }
      ctx.stroke();

      // Segunda capa de onda mas sutil
      ctx.strokeStyle = `rgba(255, 240, 180, 0.06)`;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const wy = wr.y + 3 + Math.sin((x + wr.phase + 2) * 0.05) * (wr.amplitude * 0.7);
        if (x === 0) ctx.moveTo(x, wy);
        else ctx.lineTo(x, wy);
      }
      ctx.stroke();
    })

    // === MUELLE DE MADERA ===
    // Tablones del muelle (perspectiva)
    const dockY = 155;
    const dockWidth = 150;
    const dockStartX = 165;

    // Sombra del muelle en el agua
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(dockStartX - 5, dockY + 2, dockWidth + 10, 35);

    // Tablones (de lejos a cerca para perspectiva)
    for (let i = 10; i >= 0; i--) {
      const boardY = dockY + i * 3;
      const boardWidth = dockWidth - i * 2;
      const boardX = dockStartX + i;
      const shade = Math.floor(i / 2) % 3;
      const boardColors = ['#8b6b4a', '#7a5a3a', '#6a4a2a'];
      ctx.fillStyle = boardColors[shade];
      ctx.fillRect(boardX, boardY, boardWidth, 3);

      // Lineas entre tablones
      if (i < 10) {
        ctx.fillStyle = '#5a3a1a';
        ctx.fillRect(boardX, boardY + 3, boardWidth, 1);
      }
    }

    // Barandilla del muelle
    ctx.fillStyle = '#5a3a1a';
    // Poste izquierdo
    ctx.fillRect(dockStartX, dockY - 15, 3, 18);
    // Poste derecho
    ctx.fillRect(dockStartX + dockWidth - 3, dockY - 15, 3, 18);
    // Barandilla superior
    ctx.fillRect(dockStartX, dockY - 15, dockWidth, 3);
    // Barandilla media
    ctx.fillRect(dockStartX, dockY - 8, dockWidth, 2);

    // Postes verticales decorativos en el agua
    this.dockPosts.forEach((post, i) => {
      const postX = post.x;
      const postTopY = 145 - post.height;
      ctx.fillStyle = '#4a3a2a';
      ctx.fillRect(postX - 2, postTopY, 4, post.height + 10);
      // Reflejo del poste
      ctx.fillStyle = 'rgba(74, 58, 42, 0.3)';
      ctx.fillRect(postX - 2, 145, 4, post.height * 0.5);
    });

    // Luciernagas cerca del agua
    this.fireflies.forEach(f => {
      const brightness = Math.floor(200 + 55 * f.brightness * (0.5 + 0.5 * Math.sin(f.blinkPhase)));
      const coreColor = `rgb(${brightness}, ${brightness}, ${Math.floor(brightness * 0.5)})`;
      const glowColor = `rgba(${brightness}, ${brightness}, ${Math.floor(brightness * 0.3)}, 0.4)`;

      ctx.fillStyle = glowColor;
      PixelDraw.circle(ctx, f.x, f.y, 3, glowColor);

      ctx.fillStyle = coreColor;
      PixelDraw.pixel(ctx, f.x, f.y, coreColor);
      PixelDraw.pixel(ctx, f.x + 1, f.y, coreColor);
    });

    // Hierba en la orilla (primer plano)
    for (let x = 0; x < w; x += 4) {
      const gh = 5 + Math.sin(x * 0.12 + this.time) * 3;
      ctx.fillStyle = Colors.grassMid;
      ctx.fillRect(x, 152 - gh, 2, gh);
    }

    // Flores en la orilla
    for (let x = 20; x < w; x += 70) {
      const fy = 148;
      PixelDraw.vline(ctx, x, fy, 8, Colors.grassDark);
      PixelDraw.pixel(ctx, x, fy - 3, Colors.flowerYellow);
      PixelDraw.pixel(ctx, x - 2, fy - 1, Colors.flowerYellow);
      PixelDraw.pixel(ctx, x + 2, fy - 1, Colors.flowerYellow);
      PixelDraw.pixel(ctx, x, fy - 1, Colors.flowerWhite);
    }
  }
}

/**
 * ESCENA 6: Campo floral amplio (dia) para minijuego Pokeballs
 */
export class FlowerFieldBackground extends AnimatedBackground {
  constructor() {
    super();
    this.flowers = [];
    this.grassBlades = [];
    this.butterflies = [];
    this.clouds = [];
    this.initParticles();
  }

  initParticles() {
    // Flores dispersas por el campo
    const flowerTypes = 5;
    for (let i = 0; i < 40; i++) {
      this.flowers.push({
        x: 20 + this.noise.random() * 440,
        y: 140 + this.noise.random() * 100,
        type: Math.floor(this.noise.random() * flowerTypes),
        swayPhase: this.noise.random() * Math.PI * 2,
        swaySpeed: 0.3 + this.noise.random() * 0.5,
        scale: 0.8 + this.noise.random() * 0.4
      });
    }

    // Hierba animada
    for (let x = 0; x < 480; x += 4) {
      this.grassBlades.push({
        x: x + this.noise.random() * 2,
        baseHeight: 6 + this.noise.random() * 10,
        swayPhase: this.noise.random() * Math.PI * 2,
        swaySpeed: 0.4 + this.noise.random() * 0.6,
        color: this.noise.random() > 0.5 ? Colors.grassLight : Colors.grassMid
      });
    }

    // Mariposas
    for (let i = 0; i < 6; i++) {
      this.butterflies.push({
        x: this.noise.random() * 480,
        y: 80 + this.noise.random() * 100,
        baseX: this.noise.random() * 480,
        baseY: 80 + this.noise.random() * 100,
        phase: this.noise.random() * Math.PI * 2,
        speed: 0.2 + this.noise.random() * 0.3,
        radius: 20 + this.noise.random() * 30,
        wingPhase: this.noise.random() * Math.PI * 2,
        wingSpeed: 8 + this.noise.random() * 4,
        color: this.noise.random() > 0.5 ? Colors.flowerPink : Colors.flowerYellow
      });
    }

    // Nubes suaves
    for (let i = 0; i < 5; i++) {
      this.clouds.push({
        x: this.noise.random() * 480,
        y: 20 + this.noise.random() * 60,
        speed: 0.02 + this.noise.random() * 0.02,
        width: 60 + this.noise.random() * 50,
        height: 15 + this.noise.random() * 10,
        opacity: 0.2 + this.noise.random() * 0.15,
        segments: 4 + Math.floor(this.noise.random() * 3)
      });
    }
  }

  update(dt) {
    super.update(dt);

    // Flores balanceandose
    this.flowers.forEach(f => {
      f.swayPhase += dt * f.swaySpeed;
    });

    // Hierba
    this.grassBlades.forEach(g => {
      g.swayPhase += dt * g.swaySpeed;
    });

    // Mariposas
    this.butterflies.forEach(b => {
      b.phase += dt * b.speed;
      b.x = b.baseX + Math.sin(b.phase) * b.radius;
      b.y = b.baseY + Math.cos(b.phase * 0.7) * (b.radius * 0.5);
      b.wingPhase += dt * b.wingSpeed;
    });

    // Nubes
    this.clouds.forEach(c => {
      c.x += c.speed;
      if (c.x > 480 + c.width) c.x = -c.width;
    });
  }

  render(ctx, width, height) {
    const w = width;
    const h = height;

    // === CIELO DIA AZUL CLARO ===
    for (let y = 0; y < 140; y++) {
      const t = y / 140;
      const r = Math.floor(135 * (1 - t) + 200 * t);
      const g = Math.floor(206 * (1 - t) + 230 * t);
      const b = Math.floor(235 * (1 - t) + 255 * t);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(0, y, w, 1);
    }

    // Sol brillante
    const sunX = 400;
    const sunY = 50;
    for (let r = 35; r > 0; r -= 3) {
      const alpha = (35 - r) / 35;
      const sr = Math.floor(255);
      const sg = Math.floor(255 * (1 - alpha * 0.3));
      const sb = Math.floor(200 * (1 - alpha * 0.5));
      PixelDraw.circle(ctx, sunX, sunY, r, `rgb(${sr}, ${sg}, ${sb})`);
    }

    // Nubes
    this.clouds.forEach(c => {
      ctx.fillStyle = `rgba(255, 255, 255, ${c.opacity})`;
      for (let i = 0; i < c.segments; i++) {
        const segX = c.x + (i / c.segments) * c.width;
        const segY = c.y + Math.sin(i * 0.6) * 8;
        const segW = c.width / c.segments * 1.3;
        const segH = c.height * (0.7 + Math.sin(i) * 0.3);
        PixelDraw.ellipse(ctx, segX, segY, segW, segH, `rgba(255, 255, 255, ${c.opacity})`);
      }
    });

    // === CAMPOS VERDES (capas de profundidad) ===
    // Capa lejana
    for (let y = 140; y < 200; y++) {
      const t = (y - 140) / 60;
      const r = Math.floor(60 * (1 - t) + 80 * t);
      const g = Math.floor(140 * (1 - t) + 170 * t);
      const b = Math.floor(60 * (1 - t) + 70 * t);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(0, y, w, 1);
    }

    // Capa media
    for (let y = 200; y < 240; y++) {
      const t = (y - 200) / 40;
      const r = Math.floor(50 * (1 - t) + 70 * t);
      const g = Math.floor(130 * (1 - t) + 160 * t);
      const b = Math.floor(50 * (1 - t) + 60 * t);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(0, y, w, 1);
    }

    // Capa cercana (primer plano)
    for (let y = 240; y < h; y++) {
      const t = (y - 240) / (h - 240);
      const r = Math.floor(40 * (1 - t) + 60 * t);
      const g = Math.floor(120 * (1 - t) + 150 * t);
      const b = Math.floor(40 * (1 - t) + 50 * t);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(0, y, w, 1);
    }

    // Hierba animada (primer plano)
    this.grassBlades.forEach(g => {
      const h = g.baseHeight + Math.sin(g.swayPhase) * 2;
      ctx.fillStyle = g.color;
      ctx.fillRect(g.x, 238 - h, 2, h);
    });

    // Flores (ordenadas por Y para profundidad)
    const sortedFlowers = [...this.flowers].sort((a, b) => a.y - b.y);
    sortedFlowers.forEach(f => {
      this.drawFieldFlower(ctx, f.x, f.y, f.type, f.scale, Math.sin(f.swayPhase) * 2);
    });

    // Mariposas
    this.butterflies.forEach(b => {
      const wingAngle = Math.sin(b.wingPhase) * 0.5;
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(wingAngle * 0.3);

      // Alas
      ctx.fillStyle = b.color;
      PixelDraw.ellipse(ctx, -6, -2, 8, 5, b.color);
      PixelDraw.ellipse(ctx, 6, -2, 8, 5, b.color);

      // Cuerpo
      ctx.fillStyle = '#333';
      PixelDraw.ellipse(ctx, 0, 0, 3, 6, '#333');
      ctx.restore();
    });

    // Arboles lejanos en el horizonte
    ctx.fillStyle = 'rgba(80, 120, 80, 0.3)';
    for (let i = 0; i < 6; i++) {
      const tx = 40 + i * 80;
      const ty = 130;
      PixelDraw.triangle(ctx, tx, ty - 40, tx - 20, ty, tx + 20, ty, 'rgba(80, 120, 80, 0.3)');
    }
  }

  drawFieldFlower(ctx, x, y, type, scale = 1, sway = 0) {
    const flowerColors = [
      { petal: Colors.flowerPink, center: Colors.flowerYellow },
      { petal: Colors.flowerWhite, center: Colors.flowerYellow },
      { petal: Colors.flowerBlue, center: Colors.flowerWhite },
      { petal: Colors.flowerPurple, center: Colors.flowerYellow },
      { petal: '#ffcc00', center: Colors.flowerYellow } // Amarillo girasol
    ];
    const c = flowerColors[type % flowerColors.length];
    const s = scale;

    ctx.save();
    ctx.translate(x, y);

    // Tallo
    ctx.fillStyle = Colors.grassDark;
    ctx.fillRect(-1 * s, 0, 2 * s, 12 * s);
    ctx.fillStyle = Colors.grassMid;
    ctx.fillRect(0, 0, 2 * s, 12 * s);

    // Petalos (4 direcciones + diagonales para mas detalle)
    const petalSize = 4 * s;
    ctx.fillStyle = c.petal;
    // Arriba
    PixelDraw.ellipse(ctx, 0, -8 * s + sway, petalSize, petalSize * 0.7, c.petal);
    // Abajo
    PixelDraw.ellipse(ctx, 0, 2 * s + sway, petalSize, petalSize * 0.7, c.petal);
    // Izquierda
    PixelDraw.ellipse(ctx, -7 * s + sway, -3 * s, petalSize * 0.7, petalSize, c.petal);
    // Derecha
    PixelDraw.ellipse(ctx, 7 * s + sway, -3 * s, petalSize * 0.7, petalSize, c.petal);

    // Centro
    ctx.fillStyle = c.center;
    PixelDraw.circle(ctx, 0, -3 * s + sway, Math.ceil(3 * s), c.center);

    ctx.restore();
  }
}

/**
 * ESCENA 7: Bosque nocturno variante para Buho
 */
export class ForestNightOwlBackground extends AnimatedBackground {
  constructor() {
    super();
    this.fireflies = [];
    this.glowFlowers = [];
    this.particles = [];
    this.trees = [];
    this.owl = null;
    this.initParticles();
  }

  initParticles() {
    // Luciernagas
    for (let i = 0; i < 18; i++) {
      this.fireflies.push({
        x: 50 + this.noise.random() * 380,
        y: 50 + this.noise.random() * 180,
        baseX: 50 + this.noise.random() * 380,
        baseY: 50 + this.noise.random() * 180,
        phase: this.noise.random() * Math.PI * 2,
        speed: 0.3 + this.noise.random() * 0.7,
        radius: 15 + this.noise.random() * 20,
        brightness: 0.4 + this.noise.random() * 0.6,
        blinkPhase: this.noise.random() * Math.PI * 2,
        blinkSpeed: 0.8 + this.noise.random() * 1.5
      });
    }

    // Flores bioluminiscentes
    for (let i = 0; i < 10; i++) {
      this.glowFlowers.push({
        x: 60 + this.noise.random() * 360,
        y: 160 + this.noise.random() * 80,
        type: Math.floor(this.noise.random() * 4),
        glowPhase: this.noise.random() * Math.PI * 2,
        glowSpeed: 0.5 + this.noise.random() * 1,
        swayPhase: this.noise.random() * Math.PI * 2,
        swaySpeed: 0.3 + this.noise.random() * 0.5
      });
    }

    // Particulas magicas
    for (let i = 0; i < 25; i++) {
      this.particles.push({
        x: this.noise.random() * 480,
        y: this.noise.random() * 270,
        speedX: (this.noise.random() - 0.5) * 0.2,
        speedY: -0.05 - this.noise.random() * 0.2,
        size: 1 + Math.floor(this.noise.random() * 2),
        color: this.noise.random() > 0.5 ? Colors.firefly : Colors.flowerBlue,
        life: this.noise.random() * Math.PI * 2
      });
    }

    // Arboles del fondo
    for (let i = 0; i < 10; i++) {
      this.trees.push({
        x: 20 + i * 48 + this.noise.random() * 20,
        y: 130 + this.noise.random() * 40,
        height: 90 + this.noise.random() * 50,
        width: 20 + this.noise.random() * 15,
        shade: Math.floor(this.noise.random() * 3)
      });
    }

    // Buho (posicionado en una rama)
    this.owl = {
      x: 240,
      y: 80,
      breathPhase: 0,
      blinkPhase: 0,
      wingPhase: 0,
      talkPhase: 0,
      isTalking: false
    };
  }

  update(dt) {
    super.update(dt);

    // Luciernagas
    this.fireflies.forEach(f => {
      f.phase += dt * f.speed;
      f.x = f.baseX + Math.sin(f.phase) * f.radius;
      f.y = f.baseY + Math.cos(f.phase * 0.7) * (f.radius * 0.5);
      f.blinkPhase += dt * f.blinkSpeed;
    });

    // Flores brillantes
    this.glowFlowers.forEach(fl => {
      fl.glowPhase += dt * fl.glowSpeed;
      fl.swayPhase += dt * fl.swaySpeed;
    });

    // Particulas
    this.particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.life += dt * 2;
      if (p.y < -10 || p.x < -10 || p.x > 490) {
        p.x = this.noise.random() * 480;
        p.y = 270 + this.noise.random() * 50;
      }
    });

    // Buho
    if (this.owl) {
      this.owl.breathPhase += dt * 1.5;
      this.owl.blinkPhase += dt * 0.5;
      this.owl.wingPhase += dt * 3;
      if (this.owl.isTalking) {
        this.owl.talkPhase += dt * 8;
      }
    }
  }

  render(ctx, width, height) {
    const w = width;
    const h = height;

    // Cielo nocturno boscoso
    for (let y = 0; y < h; y++) {
      const t = y / h;
      const r = Math.floor(15 + 20 * t);
      const g = Math.floor(10 + 30 * t);
      const b = Math.floor(30 + 20 * t);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(0, y, w, 1);
    }

    // Luna llena (mas prominente)
    const moonX = 400;
    const moonY = 60;
    const moonR = 35;
    for (let r = moonR + 15; r > moonR; r -= 2) {
      const alpha = (moonR + 15 - r) / 15 * 0.2;
      ctx.fillStyle = `rgba(255, 255, 220, ${alpha})`;
      PixelDraw.circle(ctx, moonX, moonY, r, `rgba(255, 255, 220, ${alpha})`);
    }
    PixelDraw.circle(ctx, moonX, moonY, moonR, '#fff8e8');
    const craters = [{ x: -8, y: -5, r: 6 }, { x: 10, y: 8, r: 4 }, { x: -5, y: 12, r: 3 }, { x: 6, y: -10, r: 3 }];
    craters.forEach(c => PixelDraw.circle(ctx, moonX + c.x, moonY + c.y, c.r, '#e8e8d8'));

    // Arboles del fondo (silhouettes)
    this.trees.forEach(tree => {
      const shades = ['#1a2a1a', '#2a3a2a', '#3a4a3a'];
      ctx.fillStyle = shades[tree.shade];
      ctx.fillRect(tree.x - 3, tree.y, 6, tree.height - 40);
      let cy = tree.y - 10;
      let cw = tree.width;
      for (let level = 0; level < 4; level++) {
        PixelDraw.triangle(ctx, tree.x, cy - 15, tree.x - cw / 2, cy + 5, tree.x + cw / 2, cy + 5, shades[tree.shade]);
        cy -= 12;
        cw *= 0.85;
      }
    });

    // Suelo del bosque
    for (let y = 200; y < h; y++) {
      const t = (y - 200) / (h - 200);
      const r = Math.floor(20 + 15 * t);
      const g = Math.floor(40 + 20 * t);
      const b = Math.floor(15 + 10 * t);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(0, y, w, 1);
    }

    // Hierba
    for (let x = 0; x < w; x += 3) {
      const gh = 4 + Math.sin(x * 0.15 + this.time) * 2;
      ctx.fillStyle = Colors.grassMid;
      ctx.fillRect(x, 198 - gh, 2, gh);
    }

    // Particulas magicas
    this.particles.forEach(p => {
      const alpha = 0.3 + 0.4 * Math.sin(p.life);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      PixelDraw.pixel(ctx, p.x, p.y, p.color);
      ctx.globalAlpha = 1;
    });

    // Flores bioluminiscentes
    this.glowFlowers.forEach(fl => {
      const glowIntensity = 0.5 + 0.5 * Math.sin(fl.glowPhase);
      const sway = Math.sin(fl.swayPhase) * 2;
      const flowerColors = [
        { glow: '#ff69b4', center: '#fff' },
        { glow: '#00ffff', center: '#fff' },
        { glow: '#ffff00', center: '#fff' },
        { glow: '#ff8800', center: '#fff' }
      ];
      const fc = flowerColors[fl.type];

      ctx.save();
      ctx.translate(fl.x + sway, fl.y);

      // Glow
      ctx.fillStyle = fc.glow;
      ctx.globalAlpha = 0.4 * glowIntensity;
      PixelDraw.circle(ctx, 0, -10, 12, fc.glow);
      ctx.globalAlpha = 1;

      // Tallo
      ctx.fillStyle = Colors.grassDark;
      ctx.fillRect(-1, 0, 2, 15);

      // Petalos
      ctx.fillStyle = fc.glow;
      PixelDraw.ellipse(ctx, 0, -12, 4, 6, fc.glow);
      PixelDraw.ellipse(ctx, -5, -6, 3, 5, fc.glow);
      PixelDraw.ellipse(ctx, 5, -6, 3, 5, fc.glow);
      PixelDraw.ellipse(ctx, 0, 0, 4, 5, fc.glow);

      // Centro
      ctx.fillStyle = fc.center;
      PixelDraw.circle(ctx, 0, -9, 2, fc.center);

      ctx.restore();
    });

    // Luciernagas
    this.fireflies.forEach(f => {
      const brightness = Math.floor(180 + 75 * f.brightness * (0.5 + 0.5 * Math.sin(f.blinkPhase)));
      const coreColor = `rgb(${brightness}, ${brightness}, ${Math.floor(brightness * 0.5)})`;
      const glowColor = `rgba(${brightness}, ${brightness}, ${Math.floor(brightness * 0.3)}, 0.5)`;

      ctx.fillStyle = glowColor;
      PixelDraw.circle(ctx, f.x, f.y, 4, glowColor);
      ctx.fillStyle = coreColor;
      PixelDraw.pixel(ctx, f.x, f.y, coreColor);
      PixelDraw.pixel(ctx, f.x + 1, f.y, coreColor);
      PixelDraw.pixel(ctx, f.x, f.y + 1, coreColor);
    });

    // Buho (si esta visible en la escena)
    if (this.owl && this.renderOwl) {
      this.drawOwl(ctx);
    }
  }

  drawOwl(ctx) {
    const o = this.owl;
    const breath = Math.sin(o.breathPhase) * 1.5;
    const wingFlap = Math.sin(o.wingPhase) * 0.3;

    ctx.save();
    ctx.translate(o.x, o.y + breath);

    // Cuerpo
    ctx.fillStyle = Colors.owlPink;
    PixelDraw.ellipse(ctx, 0, 0, 20, 22, Colors.owlPink);

    // Alas
    ctx.fillStyle = Colors.owlPinkDark;
    PixelDraw.ellipse(ctx, -22 + Math.sin(wingFlap) * 3, -2, 10, 18, Colors.owlPinkDark);
    PixelDraw.ellipse(ctx, 22 - Math.sin(wingFlap) * 3, -2, 10, 18, Colors.owlPinkDark);

    // Cabeza
    ctx.fillStyle = Colors.owlPink;
    PixelDraw.circle(ctx, 0, -20, 18, Colors.owlPink);

    // Orejas
    PixelDraw.triangle(ctx, -14, -32, -10, -40, -6, -32, Colors.owlPinkDark);
    PixelDraw.triangle(ctx, 14, -32, 10, -40, 6, -32, Colors.owlPinkDark);

    // Ojos
    const isBlink = Math.sin(o.blinkPhase) > 0.95;
    if (!isBlink) {
      // Ojos abiertos
      ctx.fillStyle = '#1a1a2e';
      PixelDraw.circle(ctx, -7, -22, 5, '#1a1a2e');
      PixelDraw.circle(ctx, 7, -22, 5, '#1a1a2e');
      // Brillo
      ctx.fillStyle = '#fff';
      PixelDraw.pixel(ctx, -5, -24, '#fff');
      PixelDraw.pixel(ctx, 9, -24, '#fff');
    } else {
      // Ojos cerrados
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(-10, -23, 6, 2);
      ctx.fillRect(4, -23, 6, 2);
    }

    // Pico
    ctx.fillStyle = '#ff8844';
    PixelDraw.triangle(ctx, 0, -16, -3, -12, 3, -12, '#ff8844');

    // Patas
    ctx.fillStyle = '#ffaa66';
    PixelDraw.ellipse(ctx, -6, 18, 4, 6, '#ffaa66');
    PixelDraw.ellipse(ctx, 6, 18, 4, 6, '#ffaa66');

    // Corazones al hablar
    if (o.isTalking) {
      const heartScale = 0.5 + 0.5 * Math.sin(o.talkPhase);
      ctx.fillStyle = '#ff4466';
      ctx.globalAlpha = 0.8;
      this.drawHeart(ctx, -30, -35, heartScale);
      this.drawHeart(ctx, 30, -35, heartScale);
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }

  drawHeart(ctx, x, y, scale) {
    const s = scale * 8;
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
 * ESCENA 8: Pradera soleada y alegre para el final
 */
export class SunnyMeadowBackground extends AnimatedBackground {
  constructor() {
    super();
    this.flowers = [];
    this.grassBlades = [];
    this.butterflies = [];
    this.clouds = [];
    this.trees = [];
    this.initParticles();
  }

  initParticles() {
    // Flores abundantes
    for (let i = 0; i < 50; i++) {
      this.flowers.push({
        x: 10 + this.noise.random() * 460,
        y: 160 + this.noise.random() * 90,
        type: Math.floor(this.noise.random() * 5),
        swayPhase: this.noise.random() * Math.PI * 2,
        swaySpeed: 0.2 + this.noise.random() * 0.4,
        scale: 0.7 + this.noise.random() * 0.5
      });
    }

    // Hierba
    for (let x = 0; x < 480; x += 3) {
      this.grassBlades.push({
        x: x + this.noise.random() * 2,
        baseHeight: 8 + this.noise.random() * 12,
        swayPhase: this.noise.random() * Math.PI * 2,
        swaySpeed: 0.4 + this.noise.random() * 0.6,
        color: this.noise.random() > 0.6 ? Colors.grassLight : Colors.grassMid
      });
    }

    // Mariposas
    for (let i = 0; i < 8; i++) {
      this.butterflies.push({
        x: this.noise.random() * 480,
        y: 60 + this.noise.random() * 120,
        baseX: this.noise.random() * 480,
        baseY: 60 + this.noise.random() * 120,
        phase: this.noise.random() * Math.PI * 2,
        speed: 0.15 + this.noise.random() * 0.25,
        radius: 25 + this.noise.random() * 35,
        wingPhase: this.noise.random() * Math.PI * 2,
        wingSpeed: 10 + this.noise.random() * 5,
        color: this.noise.random() > 0.5 ? Colors.flowerPink : '#ffcc00'
      });
    }

    // Nubes esponjosas
    for (let i = 0; i < 6; i++) {
      this.clouds.push({
        x: this.noise.random() * 480,
        y: 20 + this.noise.random() * 50,
        speed: 0.01 + this.noise.random() * 0.015,
        width: 80 + this.noise.random() * 60,
        height: 25 + this.noise.random() * 15,
        opacity: 0.25 + this.noise.random() * 0.15,
        segments: 5 + Math.floor(this.noise.random() * 3)
      });
    }

    // Arboles lejanos
    for (let i = 0; i < 5; i++) {
      this.trees.push({
        x: 40 + i * 100 + this.noise.random() * 20,
        y: 120 + this.noise.random() * 20,
        height: 80 + this.noise.random() * 30,
        width: 30 + this.noise.random() * 20,
        shade: Math.floor(this.noise.random() * 3)
      });
    }
  }

  update(dt) {
    super.update(dt);

    this.flowers.forEach(f => f.swayPhase += dt * f.swaySpeed);
    this.grassBlades.forEach(g => g.swayPhase += dt * g.swaySpeed);

    this.butterflies.forEach(b => {
      b.phase += dt * b.speed;
      b.x = b.baseX + Math.sin(b.phase) * b.radius;
      b.y = b.baseY + Math.cos(b.phase * 0.5) * (b.radius * 0.5);
      b.wingPhase += dt * b.wingSpeed;
    });

    this.clouds.forEach(c => {
      c.x += c.speed;
      if (c.x > 480 + c.width) c.x = -c.width;
    });
  }

  render(ctx, width, height) {
    const w = width;
    const h = height;

    // === CIELO AZUL BRILLANTE DIA ===
    for (let y = 0; y < h; y++) {
      const t = y / h;
      const r = Math.floor(100 * (1 - t) + 180 * t);
      const g = Math.floor(180 * (1 - t) + 220 * t);
      const b = Math.floor(255 * (1 - t) + 255 * t);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(0, y, w, 1);
    }

    // Sol radiante
    const sunX = 80;
    const sunY = 60;
    for (let r = 40; r > 0; r -= 3) {
      const alpha = (40 - r) / 40;
      const sr = Math.floor(255);
      const sg = Math.floor(255 * (1 - alpha * 0.2));
      const sb = Math.floor(200 * (1 - alpha * 0.5));
      PixelDraw.circle(ctx, sunX, sunY, r, `rgb(${sr}, ${sg}, ${sb})`);
    }

    // Rayos de sol
    ctx.strokeStyle = 'rgba(255, 255, 200, 0.1)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const len = 60 + Math.sin(this.time + i) * 15;
      ctx.beginPath();
      ctx.moveTo(sunX, sunY);
      ctx.lineTo(sunX + Math.cos(angle) * len, sunY + Math.sin(angle) * len);
      ctx.stroke();
    }

    // Nubes
    this.clouds.forEach(c => {
      ctx.fillStyle = `rgba(255, 255, 255, ${c.opacity})`;
      for (let i = 0; i < c.segments; i++) {
        const segX = c.x + (i / c.segments) * c.width;
        const segY = c.y + Math.sin(i * 0.5) * 10;
        const segW = c.width / c.segments * 1.4;
        const segH = c.height * (0.7 + Math.sin(i) * 0.3);
        PixelDraw.ellipse(ctx, segX, segY, segW, segH, `rgba(255, 255, 255, ${c.opacity})`);
      }
    });

    // Arboles lejanos
    this.trees.forEach(tree => {
      const shades = ['rgba(80, 140, 80, 0.4)', 'rgba(100, 160, 100, 0.4)', 'rgba(120, 180, 120, 0.4)'];
      ctx.fillStyle = shades[tree.shade];
      ctx.fillRect(tree.x - 4, tree.y, 8, tree.height - 50);
      let cy = tree.y - 15;
      let cw = tree.width;
      for (let level = 0; level < 5; level++) {
        PixelDraw.triangle(ctx, tree.x, cy - 20, tree.x - cw / 2, cy + 5, tree.x + cw / 2, cy + 5, shades[tree.shade]);
        cy -= 15;
        cw *= 0.8;
      }
    });

    // Pradera verde
    for (let y = 160; y < h; y++) {
      const t = (y - 160) / (h - 160);
      const r = Math.floor(50 * (1 - t) + 70 * t);
      const g = Math.floor(150 * (1 - t) + 180 * t);
      const b = Math.floor(50 * (1 - t) + 60 * t);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(0, y, w, 1);
    }

    // Hierba animada
    this.grassBlades.forEach(g => {
      const h = g.baseHeight + Math.sin(g.swayPhase) * 3;
      ctx.fillStyle = g.color;
      ctx.fillRect(g.x, 158 - h, 2, h);
    });

    // Flores (ordenadas por Y)
    const sortedFlowers = [...this.flowers].sort((a, b) => a.y - b.y);
    sortedFlowers.forEach(f => {
      this.drawFieldFlower(ctx, f.x, f.y, f.type, f.scale, Math.sin(f.swayPhase) * 3);
    });

    // Mariposas
    this.butterflies.forEach(b => {
      const wingAngle = Math.sin(b.wingPhase) * 0.5;
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(wingAngle * 0.3);
      ctx.fillStyle = b.color;
      PixelDraw.ellipse(ctx, -7, -2, 9, 6, b.color);
      PixelDraw.ellipse(ctx, 7, -2, 9, 6, b.color);
      ctx.fillStyle = '#333';
      PixelDraw.ellipse(ctx, 0, 0, 3, 7, '#333');
      ctx.restore();
    });

    // Petalos cayendo suaves
    for (let i = 0; i < 12; i++) {
      const px = (this.time * 30 + i * 40) % 520 - 20;
      const py = (this.time * 20 + i * 22) % 300 + 50;
      const rot = this.time + i;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(rot);
      ctx.fillStyle = Colors.petal;
      ctx.beginPath();
      ctx.ellipse(0, 0, 3, 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  drawFieldFlower(ctx, x, y, type, scale = 1, sway = 0) {
    const flowerColors = [
      { petal: Colors.flowerPink, center: Colors.flowerYellow },
      { petal: Colors.flowerWhite, center: Colors.flowerYellow },
      { petal: Colors.flowerBlue, center: Colors.flowerWhite },
      { petal: Colors.flowerPurple, center: Colors.flowerYellow },
      { petal: '#ffcc00', center: Colors.flowerYellow }
    ];
    const c = flowerColors[type % flowerColors.length];
    const s = scale;

    ctx.save();
    ctx.translate(x, y);

    // Tallo
    ctx.fillStyle = Colors.grassDark;
    ctx.fillRect(-1 * s, 0, 2 * s, 14 * s);
    ctx.fillStyle = Colors.grassMid;
    ctx.fillRect(0, 0, 2 * s, 14 * s);

    // Petalos
    const petalSize = 5 * s;
    ctx.fillStyle = c.petal;
    PixelDraw.ellipse(ctx, 0, -10 * s + sway, petalSize, petalSize * 0.7, c.petal);
    PixelDraw.ellipse(ctx, 0, 2 * s + sway, petalSize, petalSize * 0.7, c.petal);
    PixelDraw.ellipse(ctx, -9 * s + sway, -4 * s, petalSize * 0.7, petalSize, c.petal);
    PixelDraw.ellipse(ctx, 9 * s + sway, -4 * s, petalSize * 0.7, petalSize, c.petal);
    // Diagonales
    PixelDraw.ellipse(ctx, -6 * s + sway, -7 * s, petalSize * 0.6, petalSize * 0.6, c.petal);
    PixelDraw.ellipse(ctx, 6 * s + sway, -7 * s, petalSize * 0.6, petalSize * 0.6, c.petal);

    // Centro
    ctx.fillStyle = c.center;
    PixelDraw.circle(ctx, 0, -4 * s + sway, Math.ceil(4 * s), c.center);

    ctx.restore();
  }
}

/**
 * ESCENA 6 FINAL: Escena rosa con corazones para carta Pokemon
 */
export class PinkHeartsBackground extends AnimatedBackground {
  constructor() {
    super();
    this.hearts = [];
    this.particles = [];
    this.clouds = [];
    this.initParticles();
  }

  initParticles() {
    // Corazones flotantes
    for (let i = 0; i < 25; i++) {
      this.hearts.push({
        x: this.noise.random() * 480,
        y: 270 + this.noise.random() * 100,
        baseX: this.noise.random() * 480,
        baseY: 270 + this.noise.random() * 100,
        speed: 0.1 + this.noise.random() * 0.15,
        swayPhase: this.noise.random() * Math.PI * 2,
        swaySpeed: 0.3 + this.noise.random() * 0.5,
        swayAmount: 15 + this.noise.random() * 25,
        scale: 0.4 + this.noise.random() * 0.8,
        rotation: this.noise.random() * Math.PI * 2,
        rotSpeed: (this.noise.random() - 0.5) * 0.02,
        color: this.noise.random() > 0.5 ? '#ff4466' : '#ff88aa',
        alpha: 0.5 + this.noise.random() * 0.4
      });
    }

    // Particulas brillantes
    for (let i = 0; i < 40; i++) {
      this.particles.push({
        x: this.noise.random() * 480,
        y: this.noise.random() * 270,
        speedX: (this.noise.random() - 0.5) * 0.3,
        speedY: -0.2 - this.noise.random() * 0.3,
        size: 1 + Math.floor(this.noise.random() * 3),
        color: this.noise.random() > 0.5 ? '#fff' : '#ffd700',
        life: this.noise.random() * Math.PI * 2,
        twinkleSpeed: 2 + this.noise.random() * 4
      });
    }

    // Nubes rosadas
    for (let i = 0; i < 4; i++) {
      this.clouds.push({
        x: this.noise.random() * 480,
        y: 30 + this.noise.random() * 50,
        speed: 0.005 + this.noise.random() * 0.01,
        width: 100 + this.noise.random() * 60,
        height: 30 + this.noise.random() * 20,
        opacity: 0.15 + this.noise.random() * 0.1,
        segments: 6 + Math.floor(this.noise.random() * 3)
      });
    }
  }

  update(dt) {
    super.update(dt);

    // Corazones subiendo
    this.hearts.forEach(h => {
      h.y -= h.speed;
      h.swayPhase += dt * h.swaySpeed;
      h.x = h.baseX + Math.sin(h.swayPhase) * h.swayAmount;
      h.rotation += h.rotSpeed;
      if (h.y < -30) {
        h.y = 270 + 30;
        h.baseX = this.noise.random() * 480;
        h.baseY = 270 + this.noise.random() * 100;
        h.swayPhase = this.noise.random() * Math.PI * 2;
      }
    });

    // Particulas
    this.particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.life += dt * p.twinkleSpeed;
      if (p.y < -10) {
        p.x = this.noise.random() * 480;
        p.y = 270 + this.noise.random() * 50;
        p.life = this.noise.random() * Math.PI * 2;
      }
    });

    // Nubes
    this.clouds.forEach(c => {
      c.x += c.speed;
      if (c.x > 480 + c.width) c.x = -c.width;
    });
  }

  render(ctx, width, height) {
    const w = width;
    const h = height;

    // === FONDO ROSA GRADIENTE ROMANTICO ===
    for (let y = 0; y < h; y++) {
      const t = y / h;
      let r, g, b;
      if (t < 0.4) {
        // Rosa claro arriba
        const lt = t / 0.4;
        r = Math.floor(255);
        g = Math.floor(220 - 40 * lt);
        b = Math.floor(230 - 30 * lt);
      } else if (t < 0.7) {
        // Rosa medio
        const lt = (t - 0.4) / 0.3;
        r = Math.floor(255);
        g = Math.floor(180 - 40 * lt);
        b = Math.floor(200 - 30 * lt);
      } else {
        // Rosa mas calido abajo
        const lt = (t - 0.7) / 0.3;
        r = Math.floor(255);
        g = Math.floor(140 - 20 * lt);
        b = Math.floor(170 + 30 * lt);
      }
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(0, y, w, 1);
    }

    // Nubes rosadas
    this.clouds.forEach(c => {
      ctx.fillStyle = `rgba(255, 200, 220, ${c.opacity})`;
      for (let i = 0; i < c.segments; i++) {
        const segX = c.x + (i / c.segments) * c.width;
        const segY = c.y + Math.sin(i * 0.5) * 8;
        const segW = c.width / c.segments * 1.3;
        const segH = c.height * (0.7 + Math.sin(i) * 0.3);
        PixelDraw.ellipse(ctx, segX, segY, segW, segH, `rgba(255, 200, 220, ${c.opacity})`);
      }
    });

    // Particulas brillantes
    this.particles.forEach(p => {
      const alpha = 0.3 + 0.5 * Math.sin(p.life);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      PixelDraw.circle(ctx, p.x, p.y, p.size, p.color);
      ctx.globalAlpha = 1;
    });

    // Corazones flotantes
    this.hearts.forEach(h => {
      ctx.save();
      ctx.translate(h.x, h.y);
      ctx.rotate(h.rotation);
      ctx.scale(h.scale, h.scale);
      ctx.fillStyle = h.color;
      ctx.globalAlpha = h.alpha;
      this.drawHeart(ctx, 0, 0, 1);
      ctx.globalAlpha = 1;
      ctx.restore();
    });

    // Brillo central suave
    const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, 200);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 100, 150, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
  }

  drawHeart(ctx, x, y, scale) {
    const s = scale * 12;
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
 * Fabrica de fondos
 */
export function createBackground(sceneId) {
  switch (sceneId) {
    case 'intro':
    case 'scene1':
      return new SunsetLakeBackground();
    case 'deny':
    case 'scene2':
      return new TempleNightBackground();
    case 'hub':
    case 'scene3':
      return new ForestNightBackground();
    case 'letter':
    case 'scene4':
      return new MeadowSunsetBackground();
    case 'music':
    case 'scene5':
      return new LakeSunsetBackground();
    case 'pokeballs':
    case 'scene6':
      return new FlowerFieldBackground();
    case 'tickets':
    case 'scene7':
      return new ForestNightOwlBackground();
    case 'ending':
    case 'scene8':
      return new SunnyMeadowBackground();
    case 'pinkHearts':
    case 'scene6_final':
      return new PinkHeartsBackground();
    default:
      return new SunsetLakeBackground();
  }
}

export default {
  Colors,
  PixelDraw,
  Noise,
  AnimatedBackground,
  SunsetLakeBackground,
  TempleNightBackground,
  ForestNightBackground,
  MeadowSunsetBackground,
  LakeSunsetBackground,
  FlowerFieldBackground,
  ForestNightOwlBackground,
  SunnyMeadowBackground,
  PinkHeartsBackground,
  createBackground
};