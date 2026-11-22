/**
 * AudioManager - Manejo de musica y efectos de sonido
 * Reproductor de playlist The Marias + SFX retro Web Audio API
 */

export class AudioManager {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.currentMusic = null;
    this.currentMusicIndex = 0;
    this.isPlaying = false;
    this.isMuted = false;
    this.volume = 0.7;
    this.sfxVolume = 0.8;
    this.musicVolume = 0.6;
    this.playlist = [];
    this.loadedBuffers = new Map();
    this.fadeInterval = null;
    this.onTrackChange = null;
    this.onProgressUpdate = null;

    // Configuracion de la playlist (orden segun especificacion)
    this.playlistConfig = [
      {
        id: 'main_theme',
        name: 'No One Noticed (Extended Spanish) - The Marias',
        file: 'No One Noticed (Extended Spanish).mp3',
        loop: true,
        isMain: true
      },
      {
        id: 'lejos_de_ti',
        name: 'Lejos De Ti - The Marias',
        file: 'The Marias - Lejos De Ti.mp3',
        loop: true
      },
      {
        id: 'nobody_new',
        name: 'Nobody New - The Marias',
        file: 'The Marias - Nobody New.mp3',
        loop: true
      },
      {
        id: 'sienna',
        name: 'Sienna - The Marias',
        file: 'The Marias - Sienna (Visualizer).mp3',
        loop: true
      }
    ];

    // SFX presets usando Web Audio API
    this.sfxPresets = {
      click: { type: 'square', frequency: 800, duration: 0.08, volume: 0.3 },
      clickLow: { type: 'square', frequency: 400, duration: 0.1, volume: 0.3 },
      envelope: { type: 'sine', frequency: 600, duration: 0.3, volume: 0.25, attack: 0.01, decay: 0.2 },
      pokeball: { type: 'triangle', frequency: 500, duration: 0.4, volume: 0.3, attack: 0.02, decay: 0.3, vibrato: true },
      pokeballOpen: { type: 'sine', frequency: [800, 1200, 600], duration: 0.6, volume: 0.35 },
      error: { type: 'sawtooth', frequency: 200, duration: 0.5, volume: 0.3, glide: true },
      success: { type: 'square', frequency: [523, 659, 784, 1047], duration: 0.8, volume: 0.4, arpeggio: true },
      firefly: { type: 'sine', frequency: 1200, duration: 0.2, volume: 0.15, attack: 0.01 },
      petal: { type: 'triangle', frequency: 400, duration: 0.3, volume: 0.1, attack: 0.05 },
      textType: { type: 'square', frequency: 1000, duration: 0.03, volume: 0.08 },
      pageTurn: { type: 'noise', duration: 0.2, volume: 0.2 },
      heartbeat: { type: 'sine', frequency: 60, duration: 0.4, volume: 0.25, pattern: [0, 0.15] }
    };
  }

  /**
   * Inicializar el AudioContext (requiere interaccion del usuario)
   */
  async init() {
    if (this.audioContext) return;

    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Crear nodos de ganancia master
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = this.volume;
    this.masterGain.connect(this.audioContext.destination);

    // Nodo para musica
    this.musicGain = this.audioContext.createGain();
    this.musicGain.gain.value = this.musicVolume;
    this.musicGain.connect(this.masterGain);

    // Nodo para SFX
    this.sfxGain = this.audioContext.createGain();
    this.sfxGain.gain.value = this.sfxVolume;
    this.sfxGain.connect(this.masterGain);

    // Cargar playlist
    await this.loadPlaylist();

    // Intentar reanudar contexto si esta suspendido
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  /**
   * Cargar todos los archivos de audio de la playlist
   */
  async loadPlaylist() {
    // Usar ruta relativa para que funcione en GitHub Pages (subpath /juego-yaheyli/)
    const basePath = 'public/assets/audio/';

    for (const track of this.playlistConfig) {
      try {
        const response = await fetch(basePath + track.file);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.loadedBuffers.set(track.id, audioBuffer);
        this.playlist.push({ ...track, buffer: audioBuffer });
      } catch (error) {
        console.warn(`No se pudo cargar: ${track.file}`, error);
      }
    }
  }

  /**
   * Reproducir musica actual o especifica
   */
  async playMusic(trackId = null, fadeIn = true) {
    if (!this.audioContext) await this.init();

    if (trackId !== null) {
      const index = this.playlist.findIndex(t => t.id === trackId);
      if (index !== -1) this.currentMusicIndex = index;
    }

    if (this.playlist.length === 0) return;

    const track = this.playlist[this.currentMusicIndex];
    if (!track || !track.buffer) return;

    // Detener musica actual con fade out
    if (this.currentMusic) {
      await this.stopMusic(fadeIn);
    }

    // Crear nueva fuente
    this.currentMusic = this.audioContext.createBufferSource();
    this.currentMusic.buffer = track.buffer;
    this.currentMusic.loop = track.loop;
    this.currentMusic.connect(this.musicGain);

    // Configurar fade in
    const now = this.audioContext.currentTime;
    if (fadeIn) {
      this.musicGain.gain.setValueAtTime(0, now);
      this.musicGain.gain.linearRampToValueAtTime(this.musicVolume, now + 1.5);
    } else {
      this.musicGain.gain.value = this.musicVolume;
    }

    this.currentMusic.start(0);
    this.isPlaying = true;

    // Notificar cambio de pista
    if (this.onTrackChange) {
      this.onTrackChange(track);
    }

    // Configurar callback de progreso
    this.startProgressTracking(track);

    // Auto-siguiente cuando termine (si no es loop)
    if (!track.loop) {
      this.currentMusic.onended = () => this.playNext();
    }
  }

  /**
   * Detener musica actual
   */
  async stopMusic(fadeOut = true) {
    if (!this.currentMusic) return;

    if (fadeOut && this.audioContext) {
      const now = this.audioContext.currentTime;
      this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
      this.musicGain.gain.linearRampToValueAtTime(0, now + 1);
      await this.sleep(1000);
    }

    try {
      this.currentMusic.stop();
    } catch (e) {
      // Ya detenido
    }
    this.currentMusic = null;
    this.isPlaying = false;
    this.stopProgressTracking();
  }

  /**
   * Pausar/reanudar musica
   */
  togglePlayPause() {
    if (!this.audioContext) return;

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    if (this.isPlaying) {
      this.audioContext.suspend();
      this.isPlaying = false;
    } else {
      this.audioContext.resume();
      this.isPlaying = true;
    }
  }

  /**
   * Reproducir siguiente pista
   */
  playNext() {
    this.currentMusicIndex = (this.currentMusicIndex + 1) % this.playlist.length;
    this.playMusic(null, true);
  }

  /**
   * Reproducir pista anterior
   */
  playPrev() {
    this.currentMusicIndex = (this.currentMusicIndex - 1 + this.playlist.length) % this.playlist.length;
    this.playMusic(null, true);
  }

  /**
   * Establecer volumen maestro (0-1)
   */
  setMasterVolume(value) {
    this.volume = Math.max(0, Math.min(1, value));
    if (this.masterGain) {
      this.masterGain.gain.value = this.volume;
    }
  }

  /**
   * Establecer volumen de musica (0-1)
   */
  setMusicVolume(value) {
    this.musicVolume = Math.max(0, Math.min(1, value));
    if (this.musicGain) {
      this.musicGain.gain.value = this.musicVolume;
    }
  }

  /**
   * Establecer volumen de SFX (0-1)
   */
  setSfxVolume(value) {
    this.sfxVolume = Math.max(0, Math.min(1, value));
    if (this.sfxGain) {
      this.sfxGain.gain.value = this.sfxVolume;
    }
  }

  /**
   * Silenciar/activar todo
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : this.volume;
    }
    return this.isMuted;
  }

  /**
   * Obtener informacion de la pista actual
   */
  getCurrentTrackInfo() {
    if (this.playlist[this.currentMusicIndex]) {
      return {
        ...this.playlist[this.currentMusicIndex],
        currentTime: this.currentMusic ? this.currentMusic.context.currentTime - (this.currentMusic._startTime || 0) : 0,
        duration: this.playlist[this.currentMusicIndex].buffer?.duration || 0,
        isPlaying: this.isPlaying
      };
    }
    return null;
  }

  /**
   * Reproducir efecto de sonido (SFX)
   */
  playSFX(presetName, options = {}) {
    if (!this.audioContext || this.isMuted) return;

    const preset = this.sfxPresets[presetName];
    if (!preset) {
      console.warn(`SFX preset not found: ${presetName}`);
      return;
    }

    const now = this.audioContext.currentTime;
    const volume = (options.volume ?? preset.volume) * this.sfxVolume;

    // Oscilador principal
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.sfxGain);

    // Configurar tipo de onda
    oscillator.type = preset.type;

    // Manejar frecuencias multiples (arpegio, glissando, array)
    if (Array.isArray(preset.frequency)) {
      this.playComplexSFX(preset, options, now, volume);
      return;
    }

    oscillator.frequency.value = preset.frequency;

    // Envelope ADSR simplificado
    const attack = preset.attack || 0.01;
    const decay = preset.decay || 0.1;
    const sustain = preset.sustain || 0.3;
    const release = preset.release || 0.1;
    const duration = preset.duration || 0.2;

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + attack);
    gainNode.gain.linearRampToValueAtTime(volume * sustain, now + attack + decay);
    gainNode.gain.linearRampToValueAtTime(0, now + duration);

    // Vibrato si se especifica
    if (preset.vibrato) {
      const vibrato = this.audioContext.createOscillator();
      const vibratoGain = this.audioContext.createGain();
      vibrato.type = 'sine';
      vibrato.frequency.value = 8;
      vibratoGain.gain.value = 20;
      vibrato.connect(vibratoGain);
      vibratoGain.connect(oscillator.frequency);
      vibrato.start(now);
      vibrato.stop(now + duration);
    }

    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  /**
   * Reproducir SFX complejos (arpegios, glissandos, secuencias)
   */
  playComplexSFX(preset, options, now, volume) {
    const frequencies = preset.frequency;
    const noteDuration = (preset.duration || 0.5) / frequencies.length;

    frequencies.forEach((freq, i) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const noteTime = now + i * noteDuration;

      oscillator.connect(gainNode);
      gainNode.connect(this.sfxGain);
      oscillator.type = preset.type;
      oscillator.frequency.value = freq;

      gainNode.gain.setValueAtTime(0, noteTime);
      gainNode.gain.linearRampToValueAtTime(volume, noteTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, noteTime + noteDuration * 0.9);

      oscillator.start(noteTime);
      oscillator.stop(noteTime + noteDuration);
    });

    // Para glissando (error)
    if (preset.glide) {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(this.sfxGain);
      oscillator.type = preset.type;
      oscillator.frequency.setValueAtTime(frequencies[0], now);
      oscillator.frequency.exponentialRampToValueAtTime(frequencies[1] || 50, now + (preset.duration || 0.5));
      gainNode.gain.setValueAtTime(volume, now);
      gainNode.gain.linearRampToValueAtTime(0, now + (preset.duration || 0.5));
      oscillator.start(now);
      oscillator.stop(now + (preset.duration || 0.5));
    }
  }

  /**
   * Reproducir ruido blanco (para page turn, etc.)
   */
  playNoise(duration = 0.2, volume = 0.2, filterFreq = 2000) {
    if (!this.audioContext || this.isMuted) return;

    const bufferSize = this.audioContext.sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    source.buffer = buffer;
    filter.type = 'lowpass';
    filter.frequency.value = filterFreq;

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.sfxGain);

    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(volume * this.sfxVolume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    source.start(now);
  }

  /**
   * Iniciar tracking de progreso para UI
   */
  startProgressTracking(track) {
    this.stopProgressTracking();
    this.progressInterval = setInterval(() => {
      if (this.currentMusic && this.onProgressUpdate) {
        const currentTime = this.audioContext.currentTime - (this.currentMusic._startTime || this.audioContext.currentTime);
        const duration = track.buffer?.duration || 0;
        this.onProgressUpdate(currentTime, duration);
      }
    }, 100);
  }

  /**
   * Detener tracking de progreso
   */
  stopProgressTracking() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  /**
   * Registrar callback para cambio de pista
   */
  onTrackChangeCallback(callback) {
    this.onTrackChange = callback;
  }

  /**
   * Registrar callback para actualizacion de progreso
   */
  onProgressCallback(callback) {
    this.onProgressUpdate = callback;
  }

  /**
   * Obtener lista de pistas para UI
   */
  getPlaylist() {
    return this.playlist.map((track, index) => ({
      id: track.id,
      name: track.name,
      isCurrent: index === this.currentMusicIndex,
      isPlaying: this.isPlaying && index === this.currentMusicIndex
    }));
  }

  /**
   * Precargar SFX criticos
   */
  preloadCriticalSFX() {
    // Los SFX se generan en tiempo real con Web Audio API
    // No hay buffers que precargar
  }

  /**
   * Limpiar recursos
   */
  destroy() {
    this.stopMusic(false);
    this.stopProgressTracking();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  /**
   * Utilidad: sleep
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Singleton instance
export const audioManager = new AudioManager();
export default audioManager;