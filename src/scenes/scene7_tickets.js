/**
 * Escena 7: Regalo 4 - Buho Guia y Tickets Canjeables
 * Buho rosa en bosque nocturno con dialogo de normas
 * Botones ACEPTAR/DENEGAR -> 6 Tickets dorados canjeables (localStorage)
 * Gatitos abrazados en esquina + EXIT
 */

import { BaseScene, DialogBox, PixelButton, Easing } from './baseScene.js';
import { createBackground } from '../art/backgrounds.js';
import { createSprite } from '../art/sprites.js';
import { personalData } from '../config/personalData.js';
import { audioManager } from '../engine/audioManager.js';

export class Scene7Tickets extends BaseScene {
  constructor() {
    super();
    this.phase = 'owl'; // 'owl' | 'tickets'
    this.owlSprite = null;
    this.tickets = [];
    this.huggingCats = null;
    this.messageAlpha = 0;
    this.ticketSprites = [];

    // Datos de tickets de personalData
    this.ticketData = personalData.tickets;
  }

  init() {
    super.init();

    // Fondo: bosque nocturno con buho (usamos el sprite, no el fondo)
    this.background = createBackground('tickets');

    // Crear buho sprite (control total sobre animaciones y dialogo)
    this.owlSprite = createSprite('owl', this.engine.width / 2, 100);
    this.owlSprite.scale = 1.5;
    this.owlSprite.alpha = 0;
    this.addSprite(this.owlSprite);

    // Boton EXIT (solo visible en fase tickets)
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

    // Gatitos abrazados (esquina inf. der. - solo fase tickets)
    this.huggingCats = createSprite('hugging-cats', this.engine.width - 60, this.engine.height - 50);
    this.huggingCats.scale = 1.2;
    this.huggingCats.alpha = 0;
    this.huggingCats.visible = false;
    this.addSprite(this.huggingCats);
  }

  onEnter(data = {}) {
    super.onEnter(data);
    this.phase = 'owl';

    // Animar entrada del buho
    this.animateOwlEntrance();

    // Reproducir tema suave
    audioManager.playMusic('main_theme', true);
    audioManager.setMusicVolume(0.4);
  }

  animateOwlEntrance() {
    // Animar entrada del buho con pop
    this.tween(this.owlSprite, 'scale', 1.6, 1.0, Easing.easeOutBack);
    this.tween(this.owlSprite, 'alpha', 1.0, 0.8, Easing.easeOutCubic);
    this.tween(this, 'messageAlpha', 1.0, 0.6, Easing.easeOutCubic);

    // Activar habla y mostrar dialogo despues
    setTimeout(() => {
      this.owlSprite.setTalking(true);
      setTimeout(() => this.showOwlDialog(), 600);
    }, 1000);
  }

  showOwlDialog() {
    const dialog = new DialogBox(
      this.engine.width / 2,
      this.engine.height / 2 + 40,
      400,
      'POR ULTIMO PERO MENOS IMPORTANTE...\nTIENE NORMAS:\n1. UN SOLO USO.\n2. SE PUEDEN USAR CUANDO DESEES.',
      {
        choices: [
          { text: 'ACEPTAR', action: 'accept' },
          { text: 'DENEGAR', action: 'deny' }
        ],
        onChoiceSelect: (choice) => {
          this.owlSprite.setTalking(false);
          if (choice.action === 'accept') {
            this.onAcceptTickets();
          } else {
            this.onDenyTickets();
          }
        }
      }
    );
    dialog.autoAdvance = false;
    this.showDialog(dialog);
  }

  onAcceptTickets() {
    audioManager.playSFX('success');
    this.phase = 'tickets';

    // Ocultar buho, mostrar tickets
    this.owlSprite.setTalking(false);
    this.removeSprite(this.owlSprite);

    this.btnExit.visible = true;
    this.huggingCats.visible = true;

    // Animar gatitos con tween
    this.huggingCats.alpha = 0;
    this.tween(this.huggingCats, 'alpha', 1.0, 0.8, Easing.easeOutCubic);

    // Crear 6 tickets apilados/desplegados
    this.createTickets();
  }

  onDenyTickets() {
    audioManager.playSFX('clickLow');
    // Ir a escena del gatito (Escena 2)
    this.owlSprite.setTalking(false);
    this.engine.changeScene('deny');
  }

  createTickets() {
    const centerX = this.engine.width / 2;
    const centerY = this.engine.height / 2;
    const ticketWidth = 160;
    const ticketHeight = 55;
    const spacing = 10;

    // Disposicion: 3 columnas x 2 filas
    const positions = [
      { x: centerX - ticketWidth - spacing, y: centerY - ticketHeight - spacing / 2 }, // 0
      { x: centerX, y: centerY - ticketHeight - spacing / 2 },                          // 1
      { x: centerX + ticketWidth + spacing, y: centerY - ticketHeight - spacing / 2 },  // 2
      { x: centerX - ticketWidth - spacing, y: centerY + spacing / 2 },                 // 3
      { x: centerX, y: centerY + spacing / 2 },                                         // 4
      { x: centerX + ticketWidth + spacing, y: centerY + spacing / 2 }                  // 5
    ];

    this.ticketData.forEach((ticket, i) => {
      const pos = positions[i];
      const isRedeemed = this.engine.isTicketRedeemed(ticket.id);

      const ticketSprite = createSprite('ticket', pos.x, pos.y);
      ticketSprite.userData = { ...ticket, isRedeemed, index: i };
      ticketSprite.scale = 0;
      ticketSprite.alpha = 0;
      ticketSprite.visible = true;

      this.tickets.push(ticketSprite);
      this.addSprite(ticketSprite);

      // Animar entrada escalonada con nuevo sistema
      setTimeout(() => {
        this.tween(ticketSprite, 'scale', 1.1, 0.5, Easing.easeOutBack);
        this.tween(ticketSprite, 'alpha', 1.0, 0.4, Easing.easeOutCubic);
      }, i * 80);
    });
  }

  checkTicketClick(x, y) {
    for (const ticket of this.tickets) {
      if (!ticket.visible || ticket.alpha < 0.5) continue;

      const bounds = ticket.getBounds();
      if (x >= bounds.x && x <= bounds.x + bounds.width &&
          y >= bounds.y && y <= bounds.y + bounds.height) {
        return ticket;
      }
    }
    return null;
  }

  onMouseDown(x, y) {
    this.btnExit.handleMouseDown(x, y);
  }

  onMouseUp(x, y) {
    this.btnExit.handleMouseUp(x, y);

    if (this.phase === 'tickets' && !this.dialog?.visible) {
      const clicked = this.checkTicketClick(x, y);
      if (clicked) {
        this.onTicketClick(clicked);
      }
    }
  }

  onTicketClick(ticket) {
    const data = ticket.userData;

    if (data.isRedeemed) {
      audioManager.playSFX('clickLow');
      this.showAlreadyRedeemed(data);
    } else {
      audioManager.playSFX('envelope');
      this.redeemTicket(ticket, data);
    }
  }

  redeemTicket(ticket, data) {
    // Marcar como canjeado en localStorage
    this.engine.redeemTicket(data.id);
    data.isRedeemed = true;

    // Screen shake - recompensa pequena
    if (this.engine.addTrauma) this.engine.addTrauma(0.15);

    // Animar ticket con pop y fade
    this.pop(ticket, 'scale', 0.4, 0.3);
    this.tween(ticket, 'alpha', 0.5, 0.4, Easing.easeOutCubic).then(() => {
      this.showTicketRedeemed(data);
    });
  }

  showTicketRedeemed(data) {
    const dialog = new DialogBox(
      this.engine.width / 2,
      this.engine.height / 2,
      380,
      `TICKET CANJEADO!\n\n"${data.text}"\n\n✨ Guardado en tu coleccion ✨`,
      {
        choices: [{ text: 'GENIAL', action: 'ok' }],
        onChoiceSelect: () => {}
      }
    );
    dialog.autoAdvance = false;
    this.showDialog(dialog);
  }

  showAlreadyRedeemed(data) {
    const dialog = new DialogBox(
      this.engine.width / 2,
      this.engine.height / 2,
      380,
      `ESTE TICKET YA FUE CANJEADO\n\n"${data.text}"\n\nPuedes usarlo cuando quieras.`,
      {
        choices: [{ text: 'ENTENDIDO', action: 'ok' }],
        onChoiceSelect: () => {}
      }
    );
    dialog.autoAdvance = false;
    this.showDialog(dialog);
  }

  onExitClick() {
    audioManager.playSFX('click');
    this.engine.completeGift('ticket');
    this.engine.changeScene('hub');
  }

  onKeyDown(key) {
    if (key === 'Escape') {
      if (this.dialog && this.dialog.visible) {
        this.dialog.visible = false;
      } else if (this.phase === 'tickets') {
        this.onExitClick();
      }
    }
  }

  update(dt) {
    super.update(dt);
  }

  render(ctx, alpha) {
    super.render(ctx, alpha);

    // Titulo en fase tickets
    if (this.phase === 'tickets') {
      ctx.font = '8px "Press Start 2P", cursive';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#ffd700';
      ctx.fillText('TICKETS CANJEABLES', this.engine.width / 2, 10);

      // Sombra
      ctx.fillStyle = '#1a1a2e';
      ctx.fillText('TICKETS CANJEABLES', this.engine.width / 2 + 1, 11);

      // Subtitulo normas
      ctx.font = '5px "Silkscreen", cursive';
      ctx.fillStyle = '#f0f0f0';
      ctx.fillText('Click para canjear . Un solo uso . ESC para volver', this.engine.width / 2, 35);
    }

    // Mensaje del buho
    if (this.phase === 'owl' && this.messageAlpha > 0) {
      ctx.font = '6px "Press Start 2P", cursive';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = `rgba(255, 136, 171, ${this.messageAlpha})`;
      ctx.fillText('HO HO!', this.engine.width / 2, 200);
    }
  }
}

export default Scene7Tickets;