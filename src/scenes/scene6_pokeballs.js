/**
 * Escena 6: Regalo 3 - Minijuego Pokeballs
 * Campo floral con multiples Pokeballs dispersas
 * Algunas contienen recuerdos (fotos reales), otras Pikachu triste, una Master Ball con Snorlax
 * Al encontrar la correcta -> escena rosa corazones -> Carta Pokemon holografica
 */

import { BaseScene, DialogBox, PixelButton, Easing } from './baseScene.js';
import { createBackground } from '../art/backgrounds.js';
import { createSprite } from '../art/sprites.js';
import { personalData } from '../config/personalData.js';
import { audioManager } from '../engine/audioManager.js';

export class Scene6Pokeballs extends BaseScene {
  constructor() {
    super();
    this.pokeballs = [];
    this.phase = 'field'; // 'field' | 'memory' | 'pikachu' | 'success' | 'pinkHearts' | 'pokemonCard'
    this.selectedPokeball = null;
    this.foundCorrect = false;
    this.messageAlpha = 0;
    this.messageText = '';
    this.instructionVisible = true;
    this.instructionAlpha = 1;

    // Cartas de recuerdo para mostrar
    this.memoryData = [
      { text: 'Jugando Fortnite juntos', ref: 'ella queria jugar fortnite. entonces jugamos fortnite' },
      { text: 'Con Mateo', ref: 'quien es el bebe tikito de mami?' },
      { text: '182 cm y 163 cm', ref: 'diecinueve centimetros de diferencia' },
      { text: 'Panama -> El Paso', ref: 'viaje desde panama hasta el paso' },
      { text: 'Nuestra cancion', ref: 'ebrio de amor (en vivo) - alta consigna' },
      { text: 'Aniversario ~25 dic', ref: 'celebrar nuestro aniversario, alrededor del 25 de diciembre' }
    ];
  }

  init() {
    super.init();

    // Fondo: campo floral dia
    this.background = createBackground('pokeballs');

    // Crear Pokeballs dispersas por el campo
    this.createPokeballs();

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

    // Mensaje principal
    this.messageText = 'Una de estas pokeballs contiene tu regalo. Descubre cual!';
  }

  createPokeballs() {
    // Posiciones dispersas por el campo (evitando UI)
    const positions = [
      { x: 80, y: 180 }, { x: 180, y: 160 }, { x: 300, y: 190 }, { x: 400, y: 170 },
      { x: 60, y: 230 }, { x: 160, y: 240 }, { x: 260, y: 220 }, { x: 360, y: 250 },
      { x: 440, y: 230 }, { x: 120, y: 270 }, { x: 220, y: 280 }, { x: 340, y: 270 },
      { x: 100, y: 140 }, { x: 200, y: 130 }, { x: 380, y: 140 }, { x: 460, y: 200 }
    ];

    // Una es la correcta (Master Ball), 5 son recuerdos, resto son Pikachu triste
    const correctIndex = 7; // La del medio-ish
    const memoryIndices = [1, 3, 5, 9, 11]; // 5 recuerdos

    positions.forEach((pos, i) => {
      let type, data;

      if (i === correctIndex) {
        type = 'masterball';
        data = { isCorrect: true };
      } else if (memoryIndices.includes(i)) {
        type = 'pokeball';
        data = {
          isMemory: true,
          memoryIndex: memoryIndices.indexOf(i),
          memory: this.memoryData[memoryIndices.indexOf(i)]
        };
      } else {
        type = 'pokeball';
        data = { isPikachu: true };
      }

      const pokeball = createSprite(type, pos.x, pos.y);
      pokeball.userData = { ...data, index: i, originalX: pos.x, originalY: pos.y };
      pokeball.scale = 0.8;
      pokeball.alpha = 0;
      pokeball.visible = true;

      this.pokeballs.push(pokeball);
      this.addSprite(pokeball);
    });

    // Animar entrada escalonada
    this.animatePokeballsEntrance();
  }

  animatePokeballsEntrance() {
    this.pokeballs.forEach((pb, i) => {
      setTimeout(() => {
        this.tween(pb, 'alpha', 1.0, 0.5, Easing.easeOutCubic);
        this.tween(pb, 'scale', 1.0, 0.5, Easing.easeOutBack);
      }, i * 80);
    });

    setTimeout(() => {
      this.instructionVisible = true;
      // Animar instructionAlpha con pulso
      this.tween(this, 'instructionAlpha', 1.0, 0.5, Easing.easeOutCubic).then(() => {
        // Pulso continuo
        this._pulseInstruction();
      });
    }, this.pokeballs.length * 80 + 300);
  }

  onEnter(data = {}) {
    super.onEnter(data);
    this.phase = 'field';
    this.foundCorrect = false;
    this.selectedPokeball = null;
    this.messageAlpha = 1;

    // Reproducir tema jugueton
    audioManager.playMusic('main_theme', true);
    audioManager.setMusicVolume(0.5);
  }

  onExitClick() {
    audioManager.playSFX('click');
    this.engine.changeScene('hub');
  }

  _pulseInstruction() {
    if (!this.instructionVisible) return;
    this.tween(this, 'instructionAlpha', 0.5, 0.8, Easing.easeInOutCubic).then(() => {
      this.tween(this, 'instructionAlpha', 1.0, 0.8, Easing.easeInOutCubic).then(() => {
        this._pulseInstruction();
      });
    });
  }

  checkPokeballClick(x, y) {
    for (const pb of this.pokeballs) {
      if (!pb.visible || pb.alpha < 0.5) continue;

      const bounds = pb.getBounds();
      if (x >= bounds.x && x <= bounds.x + bounds.width &&
          y >= bounds.y && y <= bounds.y + bounds.height) {
        return pb;
      }
    }
    return null;
  }

  onMouseDown(x, y) {
    this.btnExit.handleMouseDown(x, y);
  }

  onMouseUp(x, y) {
    this.btnExit.handleMouseUp(x, y);

    if (this.phase === 'field' && !this.dialog?.visible) {
      const clicked = this.checkPokeballClick(x, y);
      if (clicked) {
        this.onPokeballClick(clicked);
      }
    }
  }

  onPokeballClick(pokeball) {
    audioManager.playSFX('pokeball');
    this.selectedPokeball = pokeball;
    const data = pokeball.userData;

    // Animar pokeball seleccionada
    this.animatePokeballOpen(pokeball).then(() => {
      if (data.isCorrect) {
        // Correcta! Snorlax + Master Ball
        this.onCorrectPokeball(pokeball);
      } else if (data.isMemory) {
        // Recuerdo real
        this.showMemory(data.memory);
      } else if (data.isPikachu) {
        // Pikachu triste
        this.showPikachuSad();
      }
    });
  }

  animatePokeballOpen(pokeball) {
    return this.tween(pokeball, 'scale', 1.2, 0.5, Easing.easeOutBack).then(() => {
      audioManager.playSFX('pokeballOpen');
    });
  }

  showMemory(memory) {
    this.phase = 'memory';

    // Crear sprite de foto de recuerdo
    const photoIndex = this.memoryData.indexOf(memory);
    this.memoryPhotoSprite = createSprite('memory-photo', this.engine.width / 2, this.engine.height / 2 - 20, { photoIndex });
    this.memoryPhotoSprite.scale = 1.0;
    this.memoryPhotoSprite.alpha = 0;
    this.memoryPhotoSprite._dynamic = true;
    this.addSprite(this.memoryPhotoSprite);

    // Animar entrada con nuevo sistema
    this.tween(this.memoryPhotoSprite, 'scale', 1.3, 0.5, Easing.easeOutBack);
    this.tween(this.memoryPhotoSprite, 'alpha', 1.0, 0.4, Easing.easeOutCubic);

    // Mostrar dialogo despues
    setTimeout(() => {
      const dialog = new DialogBox(
        this.engine.width / 2,
        this.engine.height / 2 + 80,
        380,
        `"${memory.text}"\n\n${memory.ref}`,
        {
          choices: [{ text: 'SEGUIR BUSCANDO', action: 'continue' }],
          onChoiceSelect: () => {
            this.removeSprite(this.memoryPhotoSprite);
            this.phase = 'field';
            this.selectedPokeball = null;
          }
        }
      );
      dialog.autoAdvance = false;
      this.showDialog(dialog);
    }, 400);
  }

  showPikachuSad() {
    this.phase = 'pikachu';

    // Crear Pikachu triste sprite
    this.pikachuSprite = createSprite('pikachu-sad', this.engine.width / 2, this.engine.height / 2 + 20);
    this.pikachuSprite.scale = 1.5;
    this.pikachuSprite.alpha = 0;
    this.pikachuSprite._dynamic = true;
    this.addSprite(this.pikachuSprite);

    // Animar entrada
    this.tween(this.pikachuSprite, 'scale', 2.0, 0.5, Easing.easeOutBack);
    this.tween(this.pikachuSprite, 'alpha', 1.0, 0.4, Easing.easeOutCubic);

    // Mostrar dialogo despues
    setTimeout(() => {
      const dialog = new DialogBox(
        this.engine.width / 2,
        this.engine.height / 2 + 80,
        380,
        'OH NO!\nPOKEBALL INCORRECTA.\nVUELVE A INTENTARLO...',
        {
          choices: [{ text: 'TRY AGAIN', action: 'retry' }],
          onChoiceSelect: () => {
            this.removeSprite(this.pikachuSprite);
            this.phase = 'field';
            this.selectedPokeball = null;
          }
        }
      );
      dialog.autoAdvance = false;
      this.showDialog(dialog);
      audioManager.playSFX('error');

      // Screen shake - error medio
      if (this.engine.addTrauma) this.engine.addTrauma(0.3);
    }, 400);
  }

  onCorrectPokeball(pokeball) {
    this.phase = 'success';
    this.foundCorrect = true;
    audioManager.playSFX('success');

    // Screen shake - exito grande
    if (this.engine.addTrauma) this.engine.addTrauma(0.5);

    // Pop effect en la pokeball correcta antes de reemplazar
    this.pop(pokeball, 'scale', 0.5, 0.2);

    // Reemplazar pokeball con Master Ball tras breve delay
    setTimeout(() => {
      const masterBall = createSprite('masterball', pokeball.x, pokeball.y);
      masterBall.scale = 0.8;
      masterBall.alpha = 0;
      masterBall._dynamic = true;
      this.removeSprite(pokeball);
      this.addSprite(masterBall);

      // Crear Snorlax
      this.snorlaxSprite = createSprite('snorlax', this.engine.width / 2, this.engine.height / 2 + 30);
      this.snorlaxSprite.scale = 1.5;
      this.snorlaxSprite.alpha = 0;
      this.snorlaxSprite._dynamic = true;
      this.addSprite(this.snorlaxSprite);

      // Animar aparicion con nuevo sistema
      this.tween(masterBall, 'scale', 1.3, 0.6, Easing.easeOutBack);
      this.tween(masterBall, 'alpha', 1.0, 0.5, Easing.easeOutCubic);
      this.tween(this.snorlaxSprite, 'scale', 2.0, 0.6, Easing.easeOutBack);
      this.tween(this.snorlaxSprite, 'alpha', 1.0, 0.5, Easing.easeOutCubic);

      // Mostrar mensaje de exito
      setTimeout(() => {
        const dialog = new DialogBox(
          this.engine.width / 2,
          this.engine.height / 2 + 90,
          400,
          'FELICIDADES!\nHAS ENCONTRADO LA BOLA CORRECTA.\nPULSA EN ELLA!',
          {
            choices: [{ text: 'ABRIR MASTER BALL', action: 'openMaster' }],
            onChoiceSelect: () => {
              this.transitionToPinkHearts();
            }
          }
        );
        dialog.autoAdvance = false;
        this.showDialog(dialog);
      }, 700);
    }, 200);
  }

  transitionToPinkHearts() {
    this.phase = 'pinkHearts';

    // Cambiar fondo a rosa corazones (sin fade manual - el engine maneja la transicion de escena)
    this.background = createBackground('pinkHearts');

    // Limpiar sprites actuales
    this.sprites.forEach(s => this.removeSprite(s));

    // Crear carta Pokemon holografica
    this.pokemonCard = createSprite('pokemon-card', this.engine.width / 2, this.engine.height / 2);
    this.pokemonCard.scale = 0.7;
    this.pokemonCard.alpha = 0;
    this.pokemonCard._dynamic = true; // Para limpieza en onExit
    this.addSprite(this.pokemonCard);

    // Boton EXIT
    this.btnExit = new PixelButton(
      this.engine.width - 25,
      20,
      44,
      22,
      'EXIT',
      {
        color: 'exit',
        onClick: () => this.onPokeballComplete()
      }
    );
    this.btnExit._dynamic = true;
    this.addUIElement(this.btnExit);

    // Animar carta con nuevo sistema de animacion (pop con overshoot)
    this.tween(this.pokemonCard, 'scale', 1.0, 0.8, Easing.easeOutBack);
    this.tween(this.pokemonCard, 'alpha', 1.0, 0.6, Easing.easeOutCubic);
  }

  onPokeballComplete() {
    audioManager.playSFX('click');
    this.engine.completeGift('pokeball');
    this.engine.changeScene('hub');
  }

  update(dt) {
    super.update(dt);

    // Flotacion sutil de pokeballs en campo
    if (this.phase === 'field') {
      this.pokeballs.forEach((pb, i) => {
        if (pb.visible && pb.alpha > 0.5) {
          const floatPhase = this.time * 1.5 + i * 0.5;
          pb.offsetY = Math.sin(floatPhase) * 3;
          pb.rotation = Math.sin(floatPhase * 0.7) * 0.05;
        }
      });
    }
  }

  render(ctx, alpha) {
    super.render(ctx, alpha);

    // Mensaje principal
    if (this.phase === 'field' && this.messageAlpha > 0) {
      ctx.font = '7px "Press Start 2P", cursive';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = `rgba(255, 215, 0, ${this.messageAlpha})`;
      ctx.fillText(this.messageText, this.engine.width / 2, 15);

      // Sombra del texto
      ctx.fillStyle = `rgba(26, 26, 46, ${this.messageAlpha})`;
      ctx.fillText(this.messageText, this.engine.width / 2 + 1, 16);
    }

    // Instruccion
    if (this.phase === 'field' && this.instructionVisible) {
      ctx.font = '5px "Silkscreen", cursive';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = `rgba(240, 240, 240, ${this.instructionAlpha * 0.7})`;
      ctx.fillText('Click en una pokeball para abrirla', this.engine.width / 2, this.engine.height - 10);
    }

    // Indicador de pokeballs restantes (opcional)
    if (this.phase === 'field') {
      const remaining = this.pokeballs.filter(p => p.visible && p.alpha > 0.5).length;
      ctx.font = '5px "VT323", monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#ffd700';
      ctx.fillText(`POKEBALLS: ${remaining}`, 10, 10);
    }
  }
}

export default Scene6Pokeballs;