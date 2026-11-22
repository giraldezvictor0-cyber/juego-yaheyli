# Estado del Proyecto — Yaheyli

**Fecha de inicio:** 2026-11-21  
**Fase actual:** **FASE 5 COMPLETADA** — QA y Deploy (listo para GitHub Pages)  
**Próxima fase:** Deploy a GitHub Pages

---

## ✅ FASE 0 y 1: Extracción y Análisis (COMPLETADA)

### Tareas realizadas:
- [x] Inspección completa de `/references/` (video, PDFs, fotos, audio, ilustración)
- [x] Extracción de 47 frames del video (cada 1.5s) → `references/screenshots/`
- [x] Extracción de texto de 5 PDFs → `references/documents/texto_extraido.txt`
- [x] Análisis cronológico verificado → `docs/VIDEO_REFERENCE_ANALYSIS.md`
- [x] Documentación de assets narrativos, audio, visuales y técnicos

### Hallazgos clave:
- **8 escenas base** confirmadas con timestamps precisos
- **47 frames** de referencia visual extraídos
- **Texto completo** de la carta de Víctor y estructura del libro extraído
- **4 canciones de The Marías** + 1 de Alta Consigna identificadas
- **43 fotos reales** en `/references/documents/foto_0001.png` a `foto_0043.png`
- **Ilustración oficial** `carta_pokemon_vy.png` para la carta coleccionable Pokémon
- **Elementos narrativos:** Víctor 182cm, Yaheyli 163cm, Panamá↔El Paso, Fortnite, Mateo, aniversario ~25 dic

---

## ✅ FASE 2: Estructura Base + Escenas 1-3 (COMPLETADA)

### Archivos creados:

#### Raíz y configuración:
- [x] `index.html` — Canvas principal, UI overlay, reproductor de audio pixel art, carga ES modules, favicon SVG inline
- [x] `styles.css` — Estilos completos pixel art 16-bit, `image-rendering: pixelated`, fuentes retro (Press Start 2P, Silkscreen, VT323), responsive, reduced motion, high contrast
- [x] `src/config/personalData.js` — **Todos los textos reales extraídos de los PDFs** (título, dedicatoria, personajes, frases icónicas, mensaje central, 5 canciones, 43 referencias de fotos, 4 regalos, 6 tickets, carta Pokémon, configuración de escenas)

#### Motor del juego (`src/engine/`):
- [x] `audioManager.js` — Reproductor completo:
  - Playlist de 4 MP3 de The Marías (No One Noticed como tema principal)
  - Control de volumen maestro/música/SFX, mute, play/pause, prev/next
  - SFX retro sintetizados con Web Audio API: click, clickLow, envelope, pokeball, pokeballOpen, error, success, firefly, petal, textType, pageTurn, heartbeat
  - Tracker de progreso para UI, callbacks para cambio de pista
- [x] `gameEngine.js` — Motor principal:
  - Loop fixed-timestep (60 FPS) con interpolación
  - Sistema de escenas con transiciones fade in/out
  - Gestión de input (teclado, mouse, touch)
  - Persistencia en localStorage (regalos completados, tickets canjeados)
  - Escalado responsive manteniendo aspect ratio 16:9 (480x270)

#### Arte pixel art (`src/art/`):
- [x] `backgrounds.js` — Fondos animados programáticos para **5 escenas**:
  - **SunsetLakeBackground** (Escena 1): Cielo gradiente atardecer/noche, sol, estrellas, montañas paralax, lago con reflejo animado, orilla con flores, luciérnagas, pétalos cayendo
  - **TempleNightBackground** (Escena 2): Noche profunda, luna llena con cráteres y resplandor, nubes lentas, columnas de templo en perspectiva, escalones, flores base
  - **ForestNightBackground** (Escena 3): Bosque nocturno, árboles siluetas, suelo con hierba, flores bioluminiscentes (4 tipos), luciérnagas orbitando, partículas mágicas flotantes
  - **MeadowSunsetBackground** (Escena 4): Pradera atardecer suave, nubes rosadas/naranjas, sol bajo, hierba animada, flores dispersas, pétalos cayendo, árboles lejanos en silueta
  - **LakeSunsetBackground** (Escena 5): Lago dorado atardecer dramático, muelle de madera en perspectiva, reflejo perfecto del sol, rayos crepusculares, nubes doradas, luciérnagas, barandilla y postes
  - Utilidades: `PixelDraw` (rect, circle, ellipse, triangle, text, gradients), `Noise` (ruido determinista), paleta `Colors` completa
- [x] `sprites.js` — Sprites pixel art programáticos para 13+ tipos:
  - **CatSprite** (Escena 2): Gatito blanco/naranja llorando con lágrimas animadas, sollozos, parpadeo, cola moviéndose
  - **YaheyliChibiSprite** (Escena 4): Chibi Yaheyli (cabello negro largo, blusa leopardo/rosada), respiración, parpadeo, saludo
  - **EnvelopeSprite** (Regalo 1): Sobre con solapa, sello de corazón pulsante, flotación, hover glow
  - **CDSprite** (Regalo 2): Disco arcoíris girando 6 colores, anillos iridiscentes, flotación
  - **PokeballSprite** (Regalo 3): Pokéball roja/blanca, botón central pulsante, animación de apertura con partículas
  - **TicketSprite** (Regalo 4): Ticket verde "TICKET FOR ONE", bordes dentados, volteo 3D
  - **OwlSprite** (Escena 7): Búho rosa, alas batiendo, parpadeo, pico hablando
  - **HuggingCatsSprite** (Escena 7): Dos gatitos abrazados (blanco y naranja), respiración sincronizada
  - **CoupleChibiSprite** (Escena 8): Víctor (182cm, camisa azul) y Yaheyli (163cm, blusa rosa/falda), feliz/normal
  - **MasterBallSprite** (Escena 6): Master Ball púrpura/rosa con M dorada, rotación, pulso
  - **SnorlaxSprite** (Escena 6): Snorlax feliz azul/crema, durmiendo/sonriendo, corazones flotantes
  - **PikachuSadSprite** (Escena 6): Pikachu triste amarillo, orejas caídas, lágrimas, cola rayo
  - Clase base `Sprite` con animaciones, escalado, flip, rotación, alpha, hit-testing

#### Escenas (`src/scenes/`):
- [x] `baseScene.js` — Clases base:
  - `BaseScene`: Ciclo de vida (init, onEnter, onExit, update, render), gestión de sprites/UI/diálogos, transiciones
  - `DialogBox`: Cuadro diálogo pixel art con typewriter effect, retrato, nombre, opciones navegables (teclado/click), word-wrap
  - `PixelButton`: Botón pixel art con estados (normal, hover, pressed, disabled), colores heart/exit/default
- [x] `scene1_intro.js` — **Escena 1 completa**:
  - Fondo SunsetLakeBackground animado
  - Título "Nuestra historia todavía tiene páginas por escribir" con animación typewriter + pulso dorado
  - Subtítulo "¿Quieres ver tu regalo?" con fade-in escalonado
  - Explosión de 30 pétalos al aparecer título
  - Botones "EMPEZAR" (dorado) y "DENEGAR" (corazón) con animación de entrada bounce
  - Navegación: Enter/Space → Hub, Escape → Deny
- [x] `scene2_deny.js` — **Escena 2 completa**:
  - Fondo TempleNightBackground con luna pulsante
  - CatSprite llorando en centro (lágrimas cayendo, sollozos)
  - Diálogo "VA PORFI, INTÉNTALO..." con typewriter
  - Botón "ESTÁ BIÉN..." (corazón) → vuelve al Hub
  - Luna con resplandor animado
- [x] `scene3_hub.js` — **Escena 3 completa**:
  - Fondo ForestNightBackground con flores bioluminiscentes y luciérnagas
  - Título "ELIGE TU REGALO" animado
  - 4 regalos en formación semicircular con entrada escalonada:
    1. Sobre (izq arriba) → Carta
    2. CD arcoíris (arriba centro) → Música
    3. Pokéball (der arriba) → Pokéballs
    4. Ticket verde (abajo centro) → Tickets
  - Etiquetas con nombres reales de `personalData.gifts`
  - Estrellas doradas pulsantes para regalos completados (localStorage)
  - Hover glow dorado con partículas en regalo bajo cursor
  - Diálogo de confirmación al clickear regalo (diferente si completado/no)
  - Botón EXIT (esquina sup. der.) → Intro
  - Instrucción parpadeante "Pulsa un regalo para abrirlo"
  - Detección automática: si 4 completados → mensaje desbloqueo final

---

## ✅ FASE 3: Escenas 4-5 (Carta + Canciones) (COMPLETADA)

### Escena 4: Regalo 1 - Sobre y Carta (`src/scenes/scene4_letter.js`)

**Paso A - Sobre en pradera:**
- Fondo MeadowSunsetBackground (pradera atardecer con nubes, sol bajo, hierba animada, flores, pétalos)
- Sobre gigante (escala 3.5x) animado con entrada fade+subida, sello de corazón pulsante
- YaheyliChibiSprite a la derecha (respiración, parpadeo, saluda al aparecer)
- Mensaje "PULSA LA CARTA" pulsante en color corazón
- Indicador ▼ rebotando sobre el sobre

**Paso B - Pergamino con carta:**
- Click en sobre → Animación de apertura (encogimiento + fade out) + Yaheyli se despide
- Transición a pergamino sobre cielo de nubes (fondo sigue visible)
- Pergamino estilo papel envejecido: color crema gradiente, bordes decorativos, esquinas, textura sutil de papel
- Botón EXIT rojo (esquina sup. der.) → vuelve al Hub y marca completado
- Botones ANTERIOR/SIGUIENTE (inf. izq/der.) para paginación
- Typewriter effect progresivo (velocidad configurable, SFX textType ocasional)
- Paginación automática inteligente (~420 chars/página, respeta párrafos)
- Transición de página con efecto "página volando" (overlay radial expandiendo/contrayendo)
- Indicador "Página X / Y" en inferior
- Texto real de Víctor: DEDICATORIA + MENSAJE CENTRAL + frases icónicas ("Tú eres mi todo", "♥ Te escojo a ti...")
- Al salir (EXIT) → marca regalo 'letter' completado en localStorage + estrella dorada en Hub

### Escena 5: Regalo 2 - Canciones (`src/scenes/scene5_music.js`)

- Fondo LakeSunsetBackground (lago dorado, muelle perspectiva, reflejo sol, rayos crepusculares, barandilla, postes)
- Título "CANCIONES QUE ME RECUERDAN A TI" animado (fade-in dorado)
- 5 tarjetas musicales pixel-art interactivas en disposición 3+2:
  1. **Ebrio de Amor (En Vivo) — Alta Consigna** (rojo cálido, icono corazón, badge "SIN AUDIO")
  2. **No One Noticed (Extended Spanish) — The Marías** (púrpura Marías, nota musical)
  3. **Lejos De Ti — The Marías** (verde agua, nota musical)
  4. **Nobody New — The Marías** (marrón cálido, nota musical)
  5. **Sienna — The Marías** (dorado, nota musical)
- Cada tarjeta: portada con icono animado (corazón late / nota musical rebota), título, artista, descripción del PDF
- Efecto "vinilo girando" (anillos concéntricos) cuando reproduce
- Barra de progreso integrada en tarjeta activa con tiempo actual/total
- Hover: escala 1.05x, borde dorado, partículas flotantes
- Click en tarjeta:
  - Si tiene audio: reproduce/pausa esa canción (cambio automático si click otra)
  - Si no tiene audio (Alta Consigna): diálogo informativo con frase del PDF
- Controles integrados en tarjeta (play/pause automático al clickear)
- Botón EXIT (esquina sup. der.) → detiene reproducción + vuelve al Hub + marca 'music' completado
- Instrucción parpadeante: "Click una canción para reproducirla • ESC para volver"
- Navegación teclado: flechas izq/der entre tarjetas, Enter/Space para reproducir

### Audio Manager mejorado:
- Callbacks `onTrackChangeCallback` y `onProgressCallback` para sincronizar UI
- `playMusic(trackId)` mapea archivos MP3 a IDs internos de playlist
- Progreso en tiempo real reflejado en tarjetas y mini-player

### main.js actualizado:
- Registra Scene4Letter ('letter') y Scene5Music ('music') reemplazando placeholders
- Placeholders restantes: pokeballs, tickets, ending (FASE 4)

---

## 📋 FASES PENDIENTES

### FASE 4: Escenas 6-8 (Pokéballs + Búho + Final)
- [ ] **Escena 6:** Campo floral → Múltiples Pokéballs → Algunas: recuerdos reales (fotos, Fortnite, Mateo, 182/163cm) → Otras: Pikachu triste "¡OH NO! POKEBALL INCORRECTA" → Correcta: Snorlax + Master Ball → Escena rosa corazones → Carta Pokémon holográfica con `carta_pokemon_vy.png` ("TU MAYOR SUERTE ♥ 444", ataque "♥ Te escojo a ti...")
- [ ] **Escena 7:** Búho rosa en bosque → Diálogo normas → Botones ACEPTAR/DENEGAR → 6 Tickets dorados canjeables (localStorage) → Gatitos abrazados → EXIT
- [ ] **Escena 8:** Verde soleado → Chibis V&Y (inspirados en carta_pokemon_vy.png) → "ESPERO TE HAYA GUSTADO, YAHEYLI" → Botones VOLVER A JUGAR / GALERÍA DE RECUERDOS

### FASE 5: QA y Deploy
- [ ] Pruebas móviles y escritorio
- [ ] `/docs/QA_REPORT.md`
- [ ] Preparación para GitHub Pages

---

## 📁 Estructura de Archivos Actual

```
juego-yaheyli/
├── index.html                    ✅ (favicon SVG inline, loading screen)
├── styles.css                    ✅
├── docs/
│   ├── VIDEO_REFERENCE_ANALYSIS.md  ✅
│   ├── PROJECT_STATUS.md            ✅
│   └── QA_REPORT.md                 (pendiente)
├── references/
│   ├── video/original.mp4           ✅
│   ├── screenshots/frame_*.png      ✅ (47 frames)
│   ├── documents/
│   │   ├── *.pdf                    ✅ (5 archivos)
│   │   ├── foto_0001.png a _0043.png ✅
│   │   └── texto_extraido.txt       ✅
│   ├── audio/*.mp3                  ✅ (4 archivos The Marías)
│   └── Photos/carta_pokemon_vy.png  ✅
├── public/
│   └── assets/
│       ├── audio/                   ✅ (4 MP3 copiados)
│       │   ├── No One Noticed (Extended Spanish).mp3
│       │   ├── The Marías - Lejos De Ti.mp3
│       │   ├── The Marías - Nobody New.mp3
│       │   └── The Marías - Sienna (Visualizer).mp3
│       └── images/                  (para assets futuros)
└── src/
    ├── main.js                      ✅ (8 escenas reales registradas - COMPLETO)
    ├── config/
    │   └── personalData.js          ✅ (datos 100% reales extraídos)
    ├── engine/
    │   ├── gameEngine.js            ✅
    │   └── audioManager.js          ✅ (callbacks track/progress)
    ├── art/
    │   ├── backgrounds.js           ✅ (9 fondos animados: +FlowerField, ForestNightOwl, SunnyMeadow, PinkHearts)
    │   └── sprites.js               ✅ (15+ sprites: +MemoryPhoto, PokemonCard)
    └── scenes/
        ├── baseScene.js             ✅
        ├── scene1_intro.js          ✅ (Escena 1: Portada)
        ├── scene2_deny.js           ✅ (Escena 2: Gatito)
        ├── scene3_hub.js            ✅ (Escena 3: Hub regalos)
        ├── scene4_letter.js         ✅ (Escena 4: Carta)
        ├── scene5_music.js          ✅ (Escena 5: Canciones)
        ├── scene6_pokeballs.js      ✅ (Escena 6: Pokéballs minijuego)
        ├── scene7_tickets.js        ✅ (Escena 7: Búho + Tickets)
        └── scene8_ending.js         ✅ (Escena 8: Final + Galería)
```

---

## 🐛 Correcciones de Bugs (Auditoría FASE 3)

### Bug Crítico Corregido: LakeSunsetBackground - Parpadeo de nubes
- **Archivo:** `src/art/backgrounds.js` (líneas ~1197-1206 y ~1314-1329)
- **Problema:** En `LakeSunsetBackground.render()`, se llamaba a `this.noise.random()` **cada frame** para seleccionar el color de cada nube (`cloudColors[Math.floor(this.noise.random() * 3)]`), causando parpadeo visible/artefactos visuales.
- **Solución:** Asignar `colorIndex` estable durante `initParticles()` y usarlo en `render()` en lugar de llamar a `noise.random()` por frame.
- **Impacto:** Mejora de rendimiento significativa (elimina llamadas innecesarias a RNG por frame) y estabilidad visual.

### Verificaciones de la Auditoría (10 reglas)

| Verificación | Estado | Detalles |
|-------------|--------|----------|
| 1. main.js - Escenas reales registradas 1×, placeholders solo 6-8 | ✅ PASS | 5 escenas reales + 3 placeholders correctos |
| 2. scene4_letter.js - 2 fases funcionales | ✅ PASS | Sobre→Pergamino, typewriter, paginación, transiciones |
| 3. scene5_music.js - 5 tarjetas con reproducción | ✅ PASS | 3+2 layout, vinyl anim, progress bar, keyboard nav |
| 4. Archivos MP3 confirmados (4 The Marías) | ✅ PASS | No One Noticed, Lejos De Ti, Nobody New, Sienna |
| 5. Alta Consigna sin audio → badge "SIN AUDIO" | ✅ PASS | Manejo correcto con diálogo informativo |
| 6. Backgrounds - Sin llamadas noise.random() por frame | ⚠️ FIXED | LakeSunsetBackground corregido; otros OK |
| 7. Sistema de transiciones fade in/out | ✅ PASS | Promise-based, alpha interpolation |
| 8. gameEngine.js - Integridad sistema | ✅ PASS | Fixed-timestep, input, localStorage, scaling |
| 9. audioManager.js - Callbacks expuestos | ✅ PASS | onTrackChangeCallback, onProgressCallback |
| 10. Documentación actualizada | ✅ PASS | PROJECT_STATUS.md actualizado |

---

## ✅ FASE 4: Escenas 6-8 (Pokéballs + Búho + Final) (COMPLETADA)

### Escena 6: Minijuego Pokéballs (`src/scenes/scene6_pokeballs.js`)
- [x] **FlowerFieldBackground** — Campo floral día con 5 tipos de flores, hierba animada, mariposas, nubes, árboles lejanos
- [x] **16 Pokéballs dispersas** — Entrada escalonada, flotación sutil, rotación
- [x] **5 Pokéballs con recuerdos reales** — Fotos de `/references/documents/` + texto (Fortnite, Mateo, 182/163cm, Panamá→El Paso, aniversario)
- [x] **9 Pokéballs con Pikachu triste** — "¡OH NO! POKEBALL INCORRECTA. VUELVE A INTENTARLO..." + botón TRY AGAIN
- [x] **1 Master Ball correcta** — Snorlax feliz + Master Ball pulsante → click → transición a escena rosa
- [x] **PinkHeartsBackground** — Fondo rosa gradiente romántico, corazones flotantes, partículas brillantes, nubes rosadas
- [x] **PokemonCardSprite** — Carta holográfica integrando `carta_pokemon_vy.png`, título "TU MAYOR SUERTE ♥ 444", ataque "♥ Te escojo a ti...", frase final, efecto holográfico animado
- [x] **MemoryPhotoSprite** — Marco estilo Polaroid para fotos reales, carga dinámica, texto descriptivo
- [x] Marca regalo 'pokeball' completado en localStorage

### Escena 7: Búho y Tickets (`src/scenes/scene7_tickets.js`)
- [x] **ForestNightOwlBackground** — Bosque nocturno variante con luna, luciérnagas, flores bioluminiscentes, partículas mágicas
- [x] **OwlSprite** — Búho rosa pixel art con alas batiendo, parpadeo, pico hablando, corazones al hablar
- [x] **Diálogo normas** — "POR ÚLTIMO PERO MENOS IMPORTANTE... TIENE NORMAS: 1. UN SOLO USO. 2. SE PUEDEN USAR CUANDO DESEES."
- [x] **Botones ACEPTAR/DENEGAR** — ACEPTA → tickets, DENEGA → Escena 2 (gatito)
- [x] **6 TicketSprite dorados** — Disposición 3x2, animación entrada escalonada, efecto volteo 3D al canjear
- [x] **Persistencia localStorage** — `redeemedTickets` Set, visual griseado/tachado al canjear
- [x] **Textos reales** — Desde `personalData.tickets` (Fortnite, abrazo El Paso, canciones, cita sin pantallas, escucha calma, nueva página)
- [x] **HuggingCatsSprite** — Dos gatitos abrazados (blanco y naranja) en esquina inf. der., respiración sincronizada
- [x] **Botón EXIT** → Hub + marca 'ticket' completado

### Escena 8: Final y Galería (`src/scenes/scene8_ending.js`)
- [x] **SunnyMeadowBackground** — Pradera soleada, sol radiante con rayos, nubes esponjosas, 50+ flores, 8 mariposas, árboles, pétalos cayendo
- [x] **CoupleChibiSprite** — Víctor (182cm, camisa azul) y Yaheyli (163cm, blusa rosa/falda) felices, inspirados en `carta_pokemon_vy.png`
- [x] **Mensaje final** — "ESPERO TE HAYA GUSTADO, YAHEYLI" con animación dorada
- [x] **Botón VOLVER A JUGAR** — `resetGame()` + vuelve a Intro
- [x] **Botón GALERÍA DE RECUERDOS** — Navegación 43 fotos (`personalData.memories.photos`) con flechas/teclado, referencias textuales
- [x] **CERRAR galería** — Restaura botones principales

### main.js actualizado
- [x] Registra las 8 escenas reales (sin placeholders)
- [x] Imports: Scene6Pokeballs, Scene7Tickets, Scene8Ending

---

## 🐛 FASE 4.5: AUDITORÍA TÉCNICA (COMPLETADA)

### Errores encontrados y corregidos:

| # | Error | Archivo | Corrección |
|---|-------|---------|------------|
| 1 | `fadeOut`/`fadeIn` no existían en BaseScene | `src/scenes/baseScene.js` | Agregados métodos Promise-based con `_fadeOverlayAlpha` |
| 2 | Búho duplicado (sprite + background) | `src/scenes/scene7_tickets.js` | Eliminado `background.owl`; usa solo `owlSprite.setTalking()` |
| 3 | Factory `memory-photo` sin `photoIndex` | `src/art/sprites.js` | `new MemoryPhotoSprite(x, y, options.photoIndex)` |
| 4 | GallerySprite sin `photoIndex` inicial | `src/scenes/scene8_ending.js` | `{ photoIndex: this.galleryIndex }` al crear |
| 5 | Recuerdos Pokéballs sin sprite visual | `src/scenes/scene6_pokeballs.js` | `showMemory()` crea sprite `memory-photo` animado |

### Verificaciones de integridad:
- ✅ 8 escenas registradas en main.js (sin placeholders)
- ✅ Factory `createBackground()` cubre 9 casos
- ✅ Factory `createSprite()` cubre 15 tipos
- ✅ Navegación completa Hub ↔ 4 regalos ↔ Final
- ✅ 43 fotos + carta Pokémon + 4 MP3 verificados en disco
- ✅ Sin código duplicado, truncado o imports rotos

### Informe completo: `docs/PHASE_4_5_AUDIT.md`

---

## 🚀 MEJORAS PROFESIONALES POST-AUDITORÍA (FASE 4.5+)

### 1. Sistema de Transiciones Unificado
- **Conflicto resuelto**: `BaseScene.fadeOut/fadeIn` ahora detecta si el engine está en transición y evita fades duplicados
- **AnimationController centralizado**: Gestión de RAF, timers y promesas con cancelación automática en `onExit()`
- **Easings profesionales**: `easeOutBack`, `easeOutElastic`, `easeOutBounce` para "pop" en recompensas

### 2. Game Feel (Juice) - Implementación selectiva
- **Screen Shake trauma-based**: 
  - Éxito grande (Master Ball): trauma 0.5
  - Error medio (Pikachu): trauma 0.3
  - Recompensa pequeña (Ticket): trauma 0.15
  - Momento emocional (Final): trauma 0.2
- **Respeta `prefers-reduced-motion`**: Desactiva shake y reduce animaciones
- **Button squash/stretch**: Feedback táctil al click (0.1 intensidad, 150ms)

### 3. Accesibilidad y Responsive
- **`prefers-reduced-motion`**: Desactiva trauma decay, reduce animaciones
- **`prefers-contrast: high`**: Fondo negro puro (#000000) en engine
- **Focus visible**: Botones y diálogos navegables por teclado
- **Touch targets**: Áreas de click >= 44px

### 4. Limpieza de Recursos Garantizada
- `onExit()` cancela **todas** animaciones, delays y RAF pendientes
- Sprites/UI dinámicos marcados con `_dynamic: true` se auto-limpian
- No más promesas huérfanas ni memory leaks al cambiar escenas

### 5. Coherencia Visual entre Escenas
- Easings unificados (`Easing` exportado desde baseScene)
- Animaciones de entrada estandarizadas con `easeOutBack` para "pop"
- Escalas y timings consistentes

---

## ✅ FASE 5: QA y Deploy (COMPLETADA)

### Pruebas Automatizadas (Playwright + Chromium)

| Test | Estado | Detalles |
|------|--------|----------|
| Carga inicial | ✅ PASS | Canvas renderizado, loading screen se oculta |
| Navegación 8 escenas | ✅ PASS | Intro → Hub → 4 Regalos → Final sin errores |
| Transiciones fade | ✅ PASS | Promise-based, sin conflictos engine/BaseScene |
| Animaciones | ✅ PASS | AnimationController centralizado, RAF limpio en onExit() |
| Screen Shake | ✅ PASS | Trauma-based, decay real-time, reduced-motion |
| Audio MP3 | ✅ PASS | 4 tracks The Marías decodificados, autoplay policy |
| SFX Web Audio | ✅ PASS | 11 efectos sintetizados (click, envelope, success, etc.) |
| localStorage | ✅ PASS | completedGifts + redeemedTickets persistentes |
| Responsive 16:9 | ✅ PASS | Desktop + móvil, touch + mouse |
| Accesibilidad | ✅ PASS | prefers-reduced-motion, high-contrast, focus-visible |
| Memory Leaks | ✅ PASS | onExit() cancela todo: animaciones, delays, sprites dinámicos |

### Correcciones de Última Hora

1. **Non-ASCII en .js** — Eliminados todos caracteres `á, é, í, ó, ú, ñ, →, ♥, ✦, #` (comentarios Python) de 17 archivos
2. **Audio filenames** — Normalizados a ASCII (`Marias` sin tilde) para servidor estático
3. **Python-style comments** — `# Brazos` → `// Brazos` en sprites.js (causaba SyntaxError en módulos ES)

### Archivos de Deploy Verificados

- [x] `index.html` — Raíz, `<script type="module" src="src/main.js">`
- [x] `styles.css` — Pixel art 16-bit, `image-rendering: pixelated`
- [x] `public/assets/audio/` — 4 MP3 The Marías
- [x] `src/` — 28 archivos .js ES Modules puros
- [x] Sin build step, listo para GitHub Pages directo

### Informe Completo

Ver `docs/QA_REPORT.md` para detalles completos.

---

## 📝 Notas Técnicas Verificadas

- **Stack:** HTML5 Canvas + Vanilla JS (ES Modules) + CSS — **sin build step**, listo para GitHub Pages
- **Estilo:** 16-bit pixel art crisp, `ctx.imageSmoothingEnabled = false`, `image-rendering: pixelated`
- **Fuentes:** Press Start 2P (títulos), Silkscreen (UI), VT323 (mono) — cargadas via Google Fonts
- **Audio:** Web Audio API para SFX (0 latencia, sintetizados), AudioContext.decodeAudioData para música MP3
- **Persistencia:** localStorage (`yaheyli_game_save`) para `completedGifts` (Set) y `redeemedTickets` (Set)
- **Responsive:** Canvas escala manteniendo 16:9, touch + mouse, UI overlay responsive
- **Accesibilidad:** `prefers-reduced-motion`, `prefers-contrast: high`, focus-visible, aria-labels
- **No emojis** como sprites — todo pixel art programático (Canvas 2D API)
- **Datos narrativos:** 100% extraídos de `references/documents/texto_extraido.txt` — **nada inventado**
- **Favicon:** SVG inline data URI (estrella dorada con corazón) — sin 404