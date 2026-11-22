/**
 * Escena 5: Regalo 2 - Canciones
 * Escenario: Lago dorado al atardecer con muelle
 * Titulo: "CANCIONES QUE ME RECUERDAN A TI"
 * Tarjetas musicales pixel-art interactivas para 5 canciones:
 * 1. Ebrio de Amor (En Vivo) - Alta Consigna
 * 2. No One Noticed (Extended Spanish) - The Marias
 * 3. Lejos De Ti - The Marias
 * 4. Nobody New - The Marias
 * 5. Sienna - The Marias
 */

import { BaseScene, DialogBox, PixelButton, Easing } from './baseScene.js';
import { createBackground } from '../art/backgrounds.js';
import { personalData } from '../config/personalData.js';
import { audioManager } from '../engine/audioManager.js';

export class Scene5Music extends BaseScene {
  constructor() {
    super();
    this.musicCards = [];
    this.selectedCardIndex = -1;
    this.hoveredCardIndex = -1;
    this.titleAlpha = 0;
    this.cardsVisible = false;
    this.instructionAlpha = 0;
    this.nowPlayingIndex = -1;
    this.playerVisible = false;
    this.miniPlayer = null;
  }

  init() {
    super.init();

    // Fondo: lago dorado atardecer con muelle
    this.background = createBackground('music');

    // Definir las 5 canciones con datos reales
    this.songs = [
      {
        id: 0,
        title: 'Ebrio de Amor (En Vivo)',
        artist: 'Alta Consigna',
        description: 'Nuestra cancion',
        file: null, // No tenemos el archivo MP3
        color: '#cc3333', // Rojo calido
        accent: '#ff6666',
        icon: 'heart',
        hasAudio: false
      },
      {
        id: 1,
        title: 'No One Noticed (Extended Spanish)',
        artist: 'The Marias',
        description: 'Nuestra segunda cancion',
        file: 'No One Noticed (Extended Spanish).mp3',
        color: '#6a4c93', // Purpura Marias
        accent: '#b886d8',
        icon: 'music',
        hasAudio: true
      },
      {
        id: 2,
        title: 'Lejos De Ti',
        artist: 'The Marias',
        description: 'La distancia nunca fue lo que mas me importo',
        file: 'The Marias - Lejos De Ti.mp3',
        color: '#4a7c59', // Verde agua
        accent: '#7dd3a0',
        icon: 'music',
        hasAudio: true
      },
      {
        id: 3,
        title: 'Nobody New',
        artist: 'The Marias',
        description: 'No hay nadie nuevo que me haga sentir asi',
        file: 'The Marias - Nobody New.mp3',
        color: '#8b5a3c', // Marron calido
        accent: '#d4a574',
        icon: 'music',
        hasAudio: true
      },
      {
        id: 4,
        title: 'Sienna',
        artist: 'The Marias',
        description: 'Visualizer - recuerdo dorado',
        file: 'The Marias - Sienna (Visualizer).mp3',
        color: '#c9a800', // Dorado
        accent: '#ffe066',
        icon: 'music',
        hasAudio: true
      }
    ];

    // Crear tarjetas musicales
    this.createMusicCards();

    // Boton EXIT
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
    this.addUIElement(this.btnExit);

    // Mini reproductor integrado (pequeno, en la tarjeta seleccionada)
    this.createMiniPlayer();
  }

  createMusicCards() {
    const centerX = this.engine.width / 2;
    const centerY = this.engine.height / 2;
    const cardWidth = 140;
    const cardHeight = 180;
    const spacing = 15;

    // Disposicion: 3 arriba, 2 abajo (centradas)
    const positions = [
      { x: centerX - (cardWidth + spacing) * 1.5, y: centerY - 100 }, // 0
      { x: centerX - (cardWidth + spacing) / 2, y: centerY - 100 },   // 1
      { x: centerX + (cardWidth + spacing) / 2, y: centerY - 100 },   // 2
      { x: centerX - (cardWidth + spacing), y: centerY + 85 },        // 3
      { x: centerX, y: centerY + 85 }                                  // 4
    ];

    this.songs.forEach((song, index) => {
      const pos = positions[index];
      const card = {
        ...song,
        x: pos.x,
        y: pos.y,
        baseY: pos.y,
        width: cardWidth,
        height: cardHeight,
        visible: false,
        alpha: 0,
        scale: 1,
        offsetY: 0,
        hoverScale: 1,
        playing: false,
        progress: 0,
        duration: 0,
        currentTime: 0
      };
      this.musicCards.push(card);
    });
  }

  createMiniPlayer() {
    // El mini reproductor se dibuja dentro de la tarjeta seleccionada
    this.miniPlayer = {
      visible: false,
      cardIndex: -1,
      isPlaying: false,
      progress: 0,
      currentTime: 0,
      duration: 0
    };
  }

  onEnter(data = {}) {
    super.onEnter(data);

    this.titleAlpha = 0;
    this.cardsVisible = false;
    this.instructionAlpha = 0;
    this.selectedCardIndex = -1;
    this.hoveredCardIndex = -1;
    this.miniPlayer.visible = false;

    // Resetear tarjetas
    this.musicCards.forEach((card, i) => {
      card.visible = false;
      card.alpha = 0;
      card.scale = 0.8;
      card.y = card.baseY + 50;
      card.playing = false;
      card.progress = 0;
    });

    // Animar entrada
    this.animateEntrance();

    // Reproducir tema principal
    audioManager.playMusic('main_theme', true);
    audioManager.setMusicVolume(0.5);

    // Callbacks de audio
    audioManager.onProgressCallback((currentTime, duration) => {
      if (this.nowPlayingIndex >= 0) {
        this.musicCards[this.nowPlayingIndex].currentTime = currentTime;
        this.musicCards[this.nowPlayingIndex].duration = duration;
        this.musicCards[this.nowPlayingIndex].progress = duration > 0 ? currentTime / duration : 0;
        this.miniPlayer.currentTime = currentTime;
        this.miniPlayer.duration = duration;
        this.miniPlayer.progress = duration > 0 ? currentTime / duration : 0;
      }
    });

    audioManager.onTrackChangeCallback((track) => {
      // Actualizar indice de reproduccion
      const idx = this.songs.findIndex(s => s.file === track.file);
      if (idx >= 0) {
        this.nowPlayingIndex = idx;
        this.musicCards.forEach((c, i) => c.playing = i === idx);
        this.miniPlayer.isPlaying = true;
        this.miniPlayer.cardIndex = idx;
      }
    });
  }

  animateEntrance() {
    // Titulo
    this.titleAlpha = 0;
    this.tween(this, 'titleAlpha', 1.0, 0.8, Easing.easeOutCubic).then(() => {
      // Tarjetas escalonadas
      this.animateCardsEntrance();
    });
  }

  animateCardsEntrance() {
    this.musicCards.forEach((card, i) => {
      setTimeout(() => {
        card.visible = true;
        card.alpha = 0;
        card.scale = 0.8;
        card.y = card.baseY + 50;

        this.tween(card, 'alpha', 1.0, 0.6, Easing.easeOutCubic);
        this.tween(card, 'scale', 1.0, 0.6, Easing.easeOutBack);
        this.tween(card, 'y', card.baseY, 0.6, Easing.easeOutCubic).then(() => {
          if (i === this.musicCards.length - 1) {
            // Ultima tarjeta - mostrar instruccion
            setTimeout(() => this.animateInstruction(), 300);
          }
        });

        // Sonido escalonado
        setTimeout(() => audioManager.playSFX('firefly'), i * 80);
      }, i * 150);
    });
  }

  animateInstruction() {
    this.instructionAlpha = 0;
    this.tween(this, 'instructionAlpha', 1.0, 1.0, Easing.easeOutCubic).then(() => {
      this.cardsVisible = true;
    });
  }

  onExitClick() {
    // Detener cualquier reproduccion
    if (this.nowPlayingIndex >= 0) {
      audioManager.stopMusic(false);
      this.nowPlayingIndex = -1;
      this.musicCards.forEach(c => c.playing = false);
    }
    audioManager.playSFX('clickLow');
    this.completeGiftAndExit();
  }

  completeGiftAndExit() {
    this.engine.completeGift('music');
    this.engine.changeScene('hub');
  }

  onCardClick(cardIndex) {
    const card = this.musicCards[cardIndex];

    if (!card.hasAudio) {
      // Cancion sin audio (Alta Consigna) - mostrar mensaje
      audioManager.playSFX('click');
      this.showNoAudioDialog(card);
      return;
    }

    audioManager.playSFX('click');

    if (this.nowPlayingIndex === cardIndex && this.miniPlayer.isPlaying) {
      // Misma cancion reproduciendose -> pausar
      audioManager.togglePlayPause();
      this.miniPlayer.isPlaying = audioManager.isPlaying;
      card.playing = this.miniPlayer.isPlaying;
    } else if (this.nowPlayingIndex === cardIndex && !this.miniPlayer.isPlaying) {
      // Misma cancion pausada -> reanudar
      audioManager.togglePlayPause();
      this.miniPlayer.isPlaying = audioManager.isPlaying;
      card.playing = this.miniPlayer.isPlaying;
    } else {
      // Nueva cancion -> reproducir
      this.playSong(cardIndex);
    }
  }

  playSong(cardIndex) {
    const card = this.musicCards[cardIndex];
    const trackId = this.getTrackIdForSong(card);

    if (trackId) {
      this.nowPlayingIndex = cardIndex;
      this.miniPlayer.visible = true;
      this.miniPlayer.cardIndex = cardIndex;
      this.miniPlayer.isPlaying = true;
      this.musicCards.forEach((c, i) => c.playing = i === cardIndex);

      audioManager.playMusic(trackId, true);
    }
  }

  getTrackIdForSong(card) {
    const trackMap = {
      'No One Noticed (Extended Spanish).mp3': 'main_theme',
      'The Marias - Lejos De Ti.mp3': 'lejos_de_ti',
      'The Marias - Nobody New.mp3': 'nobody_new',
      'The Marias - Sienna (Visualizer).mp3': 'sienna'
    };
    return trackMap[card.file] || null;
  }

  showNoAudioDialog(card) {
    const dialog = new DialogBox(
      this.engine.width / 2,
      this.engine.height / 2 - 40,
      380,
      `"${card.title}" - ${card.artist}\n\n${card.description}\n\nEsta cancion no esta disponible en la playlist digital, pero vive en nuestro recuerdo.`,
      {
        choices: [{ text: 'ENTENDIDO', action: 'ok' }],
        onChoiceSelect: () => {}
      }
    );
    dialog.autoAdvance = false;
    this.showDialog(dialog);
  }

  update(dt) {
    super.update(dt);

    // Animacion de flotacion de tarjetas
    this.musicCards.forEach((card, i) => {
      if (card.visible && card.alpha > 0.5) {
        card.offsetY = Math.sin(Date.now() * 0.002 + i) * 3;
      }
    });

    // Actualizar mini player visibility
    if (this.nowPlayingIndex >= 0) {
      this.miniPlayer.visible = true;
    } else {
      this.miniPlayer.visible = false;
    }
  }

  render(ctx, alpha) {
    super.render(ctx, alpha);

    // Titulo
    this.renderTitle(ctx);

    // Tarjetas musicales
    this.renderMusicCards(ctx);

    // Instruccion
    this.renderInstruction(ctx);
  }

  renderTitle(ctx) {
    if (this.titleAlpha <= 0) return;

    const centerX = this.engine.width / 2;
    const y = 22;

    ctx.font = '8px "Press Start 2P", cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Sombra
    ctx.fillStyle = `rgba(0,0,0,${0.6 * this.titleAlpha})`;
    ctx.fillText('CANCIONES QUE ME RECUERDAN A TI', centerX + 1, y + 1);

    // Texto dorado
    ctx.fillStyle = `rgba(255, 215, 0, ${this.titleAlpha})`;
    ctx.fillText('CANCIONES QUE ME RECUERDAN A TI', centerX, y);
  }

  renderMusicCards(ctx) {
    this.musicCards.forEach((card, index) => {
      if (!card.visible || card.alpha <= 0) return;

      const isHovered = index === this.hoveredCardIndex;
      const isPlaying = card.playing;
      const isSelected = index === this.selectedCardIndex;

      ctx.save();
      ctx.globalAlpha = card.alpha;
      ctx.translate(card.x + card.width / 2, card.y + card.height / 2 + card.offsetY);
      ctx.scale(card.scale * card.hoverScale, card.scale * card.hoverScale);
      ctx.translate(-card.width / 2, -card.height / 2);

      this.drawMusicCard(ctx, card, index, isHovered, isPlaying, isSelected);

      ctx.restore();
    });
  }

  drawMusicCard(ctx, card, index, isHovered, isPlaying, isSelected) {
    const w = card.width;
    const h = card.height;
    const radius = 4; // Esquinas ligeramente redondeadas estilo pixel art

    // Sombra
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    this.drawRoundedRect(ctx, 2, 2, w, h, radius);
    ctx.fill();

    // Fondo de la tarjeta (color tematico)
    const bgColor = card.color;
    ctx.fillStyle = bgColor;
    this.drawRoundedRect(ctx, 0, 0, w, h, radius);
    ctx.fill();

    // Borde decorativo
    const borderColor = isHovered ? card.accent : '#fff8';
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = isHovered ? 3 : 2;
    this.drawRoundedRect(ctx, 1, 1, w - 2, h - 2, radius - 1);
    ctx.stroke();

    // Borde interior brillante
    if (isHovered) {
      ctx.strokeStyle = '#fff4';
      ctx.lineWidth = 1;
      this.drawRoundedRect(ctx, 4, 4, w - 8, h - 8, radius - 2);
      ctx.stroke();
    }

    // === AREA DE PORTADA (superior 60%) ===
    const coverH = Math.floor(h * 0.6);
    const coverY = 8;

    // Fondo de portada (ligeramente mas oscuro)
    ctx.fillStyle = this.darkenColor(bgColor, 0.15);
    this.drawRoundedRect(ctx, 8, coverY, w - 16, coverH - 16, radius - 2);
    ctx.fill();

    // Icono central de la portada
    this.drawCoverIcon(ctx, card, w / 2, coverY + coverH / 2, isPlaying);

    // Efecto de "vinilo" girando si esta reproduciendo
    if (isPlaying) {
      this.drawVinylEffect(ctx, w / 2, coverY + coverH / 2, coverH);
    }

    // === AREA DE INFO (inferior 40%) ===
    const infoY = coverY + coverH + 4;
    const infoH = h - infoY - 8;

    // Titulo de la cancion
    ctx.font = '5px "Press Start 2P", cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#fff';
    const titleLines = this.wrapTextForCard(card.title, w - 16);
    titleLines.forEach((line, i) => {
      ctx.fillText(line, w / 2, infoY + 6 + i * 9);
    });

    // Artista
    ctx.font = '4px "Silkscreen", cursive';
    ctx.fillStyle = '#ffe0';
    ctx.fillText(card.artist, w / 2, infoY + 6 + titleLines.length * 9 + 4);

    // Descripcion (pequena, una linea)
    ctx.font = '4px "VT323", monospace';
    ctx.fillStyle = '#ddc8';
    const desc = card.description.length > 28 ? card.description.substring(0, 28) + '...' : card.description;
    ctx.fillText(desc, w / 2, infoY + 6 + titleLines.length * 9 + 18);

    // === INDICADOR DE REPRODUCCION (si esta sonando) ===
    if (isPlaying) {
      this.drawPlayingIndicator(ctx, w, h, card);
    }

    // === BADGE "SIN AUDIO" para Alta Consigna ===
    if (!card.hasAudio) {
      this.drawNoAudioBadge(ctx, w, h);
    }

    // === EFECTO HOVER: particulas doradas ===
    if (isHovered) {
      this.drawHoverParticles(ctx, w, h);
    }
  }

  drawRoundedRect(ctx, x, y, w, h, r) {
    // Rectangulo con esquinas estilo pixel art (esquinas de 1 pixel)
    const pr = Math.min(r, Math.floor(w/2), Math.floor(h/2));
    ctx.beginPath();
    ctx.moveTo(x + pr, y);
    ctx.lineTo(x + w - pr, y);
    ctx.lineTo(x + w, y + pr);
    ctx.lineTo(x + w, y + h - pr);
    ctx.lineTo(x + w - pr, y + h);
    ctx.lineTo(x + pr, y + h);
    ctx.lineTo(x, y + h - pr);
    ctx.lineTo(x, y + pr);
    ctx.closePath();
  }

  darkenColor(hex, amount) {
    const r = Math.max(0, Math.floor(parseInt(hex.slice(1, 3), 16) * (1 - amount)));
    const g = Math.max(0, Math.floor(parseInt(hex.slice(3, 5), 16) * (1 - amount)));
    const b = Math.max(0, Math.floor(parseInt(hex.slice(5, 7), 16) * (1 - amount)));
    return `rgb(${r}, ${g}, ${b})`;
  }

  drawCoverIcon(ctx, card, cx, cy, isPlaying) {
    const iconSize = 18;

    if (card.icon === 'heart') {
      // Corazon para "Ebrio de Amor"
      ctx.fillStyle = '#ff4466';
      this.drawHeart(ctx, cx, cy, iconSize);
      // Brillo
      ctx.fillStyle = '#ff88aa';
      this.drawHeart(ctx, cx - 2, cy - 2, iconSize * 0.4);
    } else {
      // Nota musical para The Marias
      ctx.fillStyle = '#fff';
      this.drawMusicNote(ctx, cx, cy, iconSize, isPlaying);
    }
  }

  drawHeart(ctx, x, y, size) {
    const s = size;
    ctx.beginPath();
    ctx.moveTo(x, y - s * 0.3);
    ctx.bezierCurveTo(x, y - s * 0.6, x - s * 0.6, y - s * 0.6, x - s * 0.6, y);
    ctx.bezierCurveTo(x - s * 0.6, y + s * 0.4, x, y + s, x, y + s * 0.7);
    ctx.bezierCurveTo(x, y + s, x + s * 0.6, y + s * 0.4, x + s * 0.6, y);
    ctx.bezierCurveTo(x + s * 0.6, y - s * 0.6, x, y - s * 0.6, x, y - s * 0.3);
    ctx.fill();
  }

  drawMusicNote(ctx, x, y, size, animated) {
    const s = size;
    const bounce = animated ? Math.sin(Date.now() * 0.01) * 2 : 0;

    // Cabeza de la nota
    ctx.beginPath();
    ctx.ellipse(x - 2, y + 4 + bounce, s * 0.35, s * 0.25, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Tallo
    ctx.fillRect(x + 1, y - s * 0.5 + bounce, 2, s * 0.9);

    // Bandera (corchea)
    ctx.beginPath();
    ctx.moveTo(x + 3, y - s * 0.5 + bounce);
    ctx.quadraticCurveTo(x + 6, y - s * 0.4 + bounce, x + 3, y - s * 0.2 + bounce);
    ctx.fill();

    // Segunda nota pequena
    ctx.beginPath();
    ctx.ellipse(x + 6, y + 2 + bounce, s * 0.25, s * 0.18, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x + 8, y - s * 0.3 + bounce, 1.5, s * 0.6);
  }

  drawVinylEffect(ctx, cx, cy, coverH) {
    const time = Date.now() * 0.002;
    const rings = 3;

    for (let r = 0; r < rings; r++) {
      const radius = 15 + r * 10 + Math.sin(time + r) * 3;
      const alpha = 0.08 * (1 - r * 0.2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Centro del vinilo
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  drawPlayingIndicator(ctx, w, h, card) {
    // Barra de progreso en la parte inferior
    const barY = h - 14;
    const barW = w - 20;
    const barX = 10;

    // Fondo
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(barX, barY, barW, 6);

    // Progreso
    const progress = card.progress || 0;
    const progressColor = card.accent;
    ctx.fillStyle = progressColor;
    ctx.fillRect(barX, barY, barW * progress, 6);

    // Brillo en el borde
    ctx.fillStyle = '#fff4';
    ctx.fillRect(barX + barW * progress - 2, barY, 4, 6);

    // Tiempo actual / total
    ctx.font = '3px "VT323", monospace';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fff8';
    const current = this.formatTime(card.currentTime || 0);
    const total = this.formatTime(card.duration || 0);
    ctx.fillText(`${current} / ${total}`, w - 10, barY + 10);
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  drawNoAudioBadge(ctx, w, h) {
    const badgeW = 60;
    const badgeH = 14;
    const x = w - badgeW - 6;
    const y = 6;

    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(x, y, badgeW, badgeH);

    ctx.fillStyle = '#ffaa44';
    ctx.strokeStyle = '#cc8822';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, badgeW, badgeH);

    ctx.font = '3px "Silkscreen", cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.fillText('SIN AUDIO', x + badgeW / 2, y + badgeH / 2 + 1);
  }

  drawHoverParticles(ctx, w, h) {
    const time = Date.now() * 0.003;
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 + time;
      const r = 50 + Math.sin(time * 2 + i) * 8;
      const px = w / 2 + Math.cos(angle) * r;
      const py = h / 2 + Math.sin(angle) * r;
      const alpha = 0.4 + Math.sin(time * 3 + i) * 0.3;
      ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
      ctx.fillRect(px, py, 2, 2);
    }
  }

  wrapTextForCard(text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    const charWidth = 4.5; // 5px Press Start 2P
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

    return lines.length > 2 ? [lines[0], lines.slice(1).join(' ')] : lines;
  }

  renderInstruction(ctx) {
    if (this.instructionAlpha <= 0) return;

    const centerX = this.engine.width / 2;
    const y = this.engine.height - 18;

    ctx.font = '4px "Silkscreen", cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const blink = 0.4 + Math.sin(Date.now() * 0.002) * 0.4;
    const alpha = this.instructionAlpha * blink;

    ctx.fillStyle = `rgba(160, 160, 176, ${alpha})`;
    ctx.fillText('Click una cancion para reproducirla  .  ESC para volver', centerX, y);
  }

  // Input handlers
  onMouseMove(x, y) {
    // Detectar hover en tarjetas
    this.hoveredCardIndex = -1;
    this.musicCards.forEach((card, index) => {
      if (card.visible && card.alpha > 0.5) {
        const cardLeft = card.x - card.width / 2 * card.scale;
        const cardRight = card.x + card.width / 2 * card.scale;
        const cardTop = card.y - card.height / 2 * card.scale + card.offsetY * card.scale;
        const cardBottom = card.y + card.height / 2 * card.scale + card.offsetY * card.scale;

        if (x >= cardLeft && x <= cardRight && y >= cardTop && y <= cardBottom) {
          this.hoveredCardIndex = index;
          card.hoverScale = 1.05;
        } else {
          card.hoverScale = 1;
        }
      }
    });

    this.btnExit.handleMouseMove(x, y);
  }

  onMouseDown(x, y) {
    this.btnExit.handleMouseDown(x, y);
  }

  onMouseUp(x, y) {
    this.btnExit.handleMouseUp(x, y);

    // Click en tarjetas
    if (!this.dialog || !this.dialog.visible) {
      this.musicCards.forEach((card, index) => {
        if (card.visible && card.alpha > 0.5) {
          const cardLeft = card.x - card.width / 2 * card.scale;
          const cardRight = card.x + card.width / 2 * card.scale;
          const cardTop = card.y - card.height / 2 * card.scale + card.offsetY * card.scale;
          const cardBottom = card.y + card.height / 2 * card.scale + card.offsetY * card.scale;

          if (x >= cardLeft && x <= cardRight && y >= cardTop && y <= cardBottom) {
            this.onCardClick(index);
          }
        }
      });
    }
  }

  onClick(x, y) {}

  onKeyDown(key) {
    if (key === 'Escape') {
      if (this.dialog && this.dialog.visible) {
        this.dialog.visible = false;
      } else {
        this.onExitClick();
      }
    } else if (key === 'Enter' || key === 'Space') {
      if (this.hoveredCardIndex >= 0) {
        this.onCardClick(this.hoveredCardIndex);
      }
    } else if (key === 'ArrowLeft' && this.hoveredCardIndex > 0) {
      // Navegacion con teclado
      this.hoveredCardIndex--;
    } else if (key === 'ArrowRight' && this.hoveredCardIndex < this.musicCards.length - 1) {
      this.hoveredCardIndex++;
    }
  }
}

export default Scene5Music;