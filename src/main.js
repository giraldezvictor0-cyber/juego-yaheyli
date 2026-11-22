/**
 * Main Entry Point - Yaheyli Interactive Experience
 * Inicializa el motor del juego y registra todas las escenas
 */

import { gameEngine } from './engine/gameEngine.js';
import { audioManager } from './engine/audioManager.js';
import { Scene1Intro } from './scenes/scene1_intro.js';
import { Scene2Deny } from './scenes/scene2_deny.js';
import { Scene3Hub } from './scenes/scene3_hub.js';
import { Scene4Letter } from './scenes/scene4_letter.js';
import { Scene5Music } from './scenes/scene5_music.js';
import { Scene6Pokeballs } from './scenes/scene6_pokeballs.js';
import { Scene7Tickets } from './scenes/scene7_tickets.js';
import { Scene8Ending } from './scenes/scene8_ending.js';
import { createBackground } from './art/backgrounds.js';

/**
 * Inicializar y arrancar el juego
 */
async function initGame() {
  // Pantalla de carga
  const loadingScreen = document.getElementById('loading-screen');
  const loadingFill = document.getElementById('loading-fill');
  const loadingText = document.getElementById('loading-text');

  const updateLoading = (percent, text) => {
    if (loadingFill) loadingFill.style.width = `${percent}%`;
    if (loadingText) loadingText.textContent = text;
  };

  updateLoading(10, 'Inicializando motor...');

  try {
    // Inicializar motor
    await gameEngine.init('game-canvas');
    updateLoading(30, 'Cargando audio...');

    // Inicializar audio manager
    await audioManager.init();
    updateLoading(50, 'Registrando escenas...');

    // Registrar escenas implementadas (FASE 1-4 - TODAS LAS 8 ESCENAS)
    gameEngine.registerScene('intro', new Scene1Intro());           // Escena 1: Portada
    gameEngine.registerScene('deny', new Scene2Deny());             // Escena 2: Gatito
    gameEngine.registerScene('hub', new Scene3Hub());               // Escena 3: Hub regalos
    gameEngine.registerScene('letter', new Scene4Letter());         // Escena 4: Carta
    gameEngine.registerScene('music', new Scene5Music());           // Escena 5: Canciones
    gameEngine.registerScene('pokeballs', new Scene6Pokeballs());   // Escena 6: Pokeballs
    gameEngine.registerScene('tickets', new Scene7Tickets());       // Escena 7: Buho + Tickets
    gameEngine.registerScene('ending', new Scene8Ending());         // Escena 8: Final + Galeria

    updateLoading(80, 'Configurando callbacks...');

    // Callbacks del motor
    gameEngine.onChangeScene = (newScene, oldScene) => {
      console.log(`Cambio de escena: ${oldScene} -> ${newScene}`);
    };

    gameEngine.onGameStart = () => {
      console.log('Juego iniciado');
    };

    gameEngine.onGameComplete = () => {
      console.log('Juego completado');
    };

    updateLoading(95, 'Iniciando juego...');

    // Ocultar pantalla de carga
    setTimeout(() => {
      if (loadingScreen) {
        loadingScreen.classList.add('hidden');
      }

      // Iniciar loop del juego
      gameEngine.start();

      // Empezar en la escena de introduccion
      gameEngine.changeScene('intro');
    }, 500);

    updateLoading(100, 'Listo!');

    // Exponer para debug global
    window.gameEngine = gameEngine;
    window.audioManager = audioManager;

    console.log('🎮 Yaheyli - Juego inicializado correctamente');
    console.log('Escenas registradas:', Array.from(gameEngine.scenes.keys()));

  } catch (error) {
    console.error('Error inicializando el juego:', error);
    if (loadingText) {
      loadingText.textContent = 'Error: ' + error.message;
      loadingText.style.color = '#ff4466';
    }
  }
}

// Iniciar cuando el DOM este listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}

// Manejar visibilidad de la pestana
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pausar audio cuando la pestana no esta visible
    if (audioManager.audioContext && audioManager.audioContext.state === 'running') {
      audioManager.audioContext.suspend();
    }
  } else {
    // Reanudar al volver
    if (audioManager.audioContext && audioManager.audioContext.state === 'suspended') {
      audioManager.audioContext.resume();
    }
  }
});

// Prevenir menu contextual en el canvas
document.getElementById('game-canvas')?.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

// Prevenir zoom en doble tap movil
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }
  lastTouchEnd = now;
}, { passive: false });

export { gameEngine, audioManager };