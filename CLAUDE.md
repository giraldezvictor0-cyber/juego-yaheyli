# MASTER PROMPT — PROYECTO YAHEYLI
## Experiencia interactiva 2D de pixel art inspirada en el video de referencia

Actúa como un estudio profesional de desarrollo de videojuegos independientes (dirección creativa, ingeniería de software, pixel art 16-bit, animación 2D, narrativa interactiva, sonido, UX/UI y QA).

Tu misión es desarrollar una experiencia web interactiva, jugable, visualmente elaborada y personalizada para Yaheyli, tomando como referencia principal los archivos en `/references`. El resultado debe sentirse como un videojuego indie real (estilo Stardew Valley y Pokémon GBA), nunca como una plantilla web genérica.

---

# 1. ARCHIVOS DE REFERENCIA Y EXTRACCIÓN SEGURA

Estructura en `/references` (no modifiques los originales):
- `/references/video/original.mp4`: Video de referencia principal (~69.6s).
- `/references/documents/`: PDFs de historia e instrucciones y fotos reales (`foto_0001.png` a `foto_0043.png`).
- `/references/photos/carta_pokemon_vy.png`: Ilustración pixel art oficial de Víctor y Yaheyli juntos.
- `/references/audio/`: 4 canciones MP3 de The Marías (`No One Noticed (Extended Spanish).mp3`, `The Marias - Lejos De Ti.mp3`, `The Marias - Nobody New.mp3`, `The Marias - Sienna (Visualizer).mp3`).

## Regla de extracción (Ahorro de cuota)
- **NO leas archivos `.mp4` ni `.pdf` binarios directamente en el chat.**
- Usa **Python** (`opencv-python` o `ffmpeg` para el video, y `pymupdf`/`fitz` para PDFs) para:
  1. Extraer fotogramas cada 1.5 segundos de `original.mp4` hacia `/references/screenshots/`.
  2. Extraer todo el texto de los PDFs a `/references/documents/texto_extraido.txt`.
- Documenta la cronología verificada en `/docs/VIDEO_REFERENCE_ANALYSIS.md` sin inventar detalles.

---

# 2. RECONSTRUCCIÓN FIEL DEL VIDEO (8 ESCENAS BASE)

1. **ESCENA 1 — PORTADA / INTRODUCCIÓN (00:00–00:04):**
   - Paisaje pixel art al atardecer/noche con montañas, lago con reflejos, flores, luciérnagas y pétalos cayendo.
   - Título pixel art «Nuestra historia todavía tiene páginas por escribir», subtítulo «¿Quieres ver tu regalo?» y botones «EMPEZAR» y «DENEGAR».
2. **ESCENA 2 — SI PULSA "DENEGAR" (00:04–00:10):**
   - Escenario nocturno con columnas de templo y luna llena, un gatito blanco y naranja pixel art llorando tiernamente con el diálogo «VA PORFI, INTÉNTALO...» y el botón «ESTÁ BIÉN...».
3. **ESCENA 3 — SELECCIÓN DE REGALOS / HUB (00:11–00:25):**
   - Claro del bosque nocturno con flores brillantes y 4 objetos animados con etiqueta, sonido y brillo:
     1. **REGALO 1:** Sobre lacrado con sello de corazón.
     2. **REGALO 2:** Disco CD arcoíris girando.
     3. **REGALO 3:** Poké Ball roja y blanca.
     4. **REGALO 4:** Boleto / Ticket verde (`TICKET FOR ONE`).
   - Marca cada regalo completado con una estrella dorada; al explorar los 4 desbloquea la Escena Final.
4. **ESCENA 4 — REGALO 1: SOBRE Y CARTA (00:13–00:18):**
   - Primero muestra el sobre gigante en el prado con la chibi de Yaheyli (cabello negro largo, blusa leopardo/rosada) y el aviso «PULSA LA CARTA».
   - Al tocarlo, abre un pergamino sobre un cielo de nubes al atardecer con botón rojo «EXIT» y escribe progresivamente la carta sincera de Víctor para Yaheyli extraída de `texto_extraido.txt`.
5. **ESCENA 5 — REGALO 2: DISCO Y CANCIONES (00:22–00:24):**
   - Escenario junto a un lago dorado al atardecer con muelle y título «CANCIONES QUE ME RECUERDAN A TI».
   - Tarjetas musicales retro interactivas con portadas, frases reales y controles para nuestras canciones:
     - **«Ebrio de Amor (En Vivo)» — Alta Consigna**
     - **«No One Noticed (Extended Spanish)» — The Marías** (y el resto de la playlist de The Marías).
6. **ESCENA 6 — REGALO 3: MINIJUEGO DE POKÉBALLS Y CARTA COLECCIONABLE (00:26–00:44):**
   - Campo floral con múltiples Pokéballs variadas y el mensaje «Una de estas pokeballs contiene tu regalo. ¡Descubre cuál!».
   - Algunas Pokéballs muestran recuerdos reales de `/references/documents/` (fotos juntos, Fortnite, Mateo, 182 cm y 163 cm), otras muestran a Pikachu triste («¡OH NO! POKEBALL INCORRECTA. VUELVE A INTENTARLO...» con botón «TRY AGAIN»), y al encontrar la correcta aparece Snorlax feliz junto a una Master Ball («¡FELICIDADES! HAS ENCONTRADO LA BOLA CORRECTA. ¡PULSA EN ELLA!»).
   - Al pulsar la Master Ball, revela una escena rosada con corazones y una **Carta Coleccionable estilo Pokémon holográfica** («TU MAYOR SUERTE ♥ 444») integrando directamente la ilustración real `/references/photos/carta_pokemon_vy.png`, el ataque «♥ Te escojo a ti...» y «Nuestra historia todavía tiene páginas por escribir».
7. **ESCENA 7 — REGALO 4: BÚHO GUÍA Y TICKETS CANJEABLES (00:50–01:00):**
   - Primero aparece un búho rosado pixel art en el bosque nocturno con diálogo: «POR ÚLTIMO PERO MENOS IMPORTANTE... TIENE NORMAS: 1. UN SOLO USO. 2. SE PUEDEN USAR CUANDO DESEES.» y botones «ACEPTAR» y «DENEGAR» (si pulsa Denegar, va al gatito).
   - Al aceptar, despliega 6 Tickets dorados canjeables personalizados («Vale por jugar Fortnite juntos», «Vale por ese abrazo pendiente en El Paso», «Vale por escuchar nuestras canciones», «Vale por una cita sin pantallas», «Vale por escucharte siempre con calma», «Vale por escribir una nueva página») guardados en `localStorage`, con dos gatitos abrazados en la esquina y botón «EXIT».
8. **ESCENA 8 — DESENLACE Y GALERÍA DE RECUERDOS (01:02–01:09):**
   - Escenario pixel art verde y soleado con flores, árboles y los personajes chibi de Víctor y Yaheyli (inspirados en `carta_pokemon_vy.png`) con el mensaje «ESPERO TE HAYA GUSTADO, YAHEYLI» y botones «VOLVER A JUGAR» y «GALERÍA DE RECUERDOS».

---

# 3. DIRECCIÓN ARTÍSTICA, AUDIO Y PERSONALIZACIÓN

- **Pixel Art 16-bit crisp:** Usa `ctx.imageSmoothingEnabled = false` y `image-rendering: pixelated;`. Fuentes retro (`Press Start 2P`, `Silkscreen`, `VT323`). Prohibido usar emojis como sustitutos de sprites o botones HTML sin estilo retro.
- **Banda sonora de The Marías:** Copia los 4 MP3 de `/references/audio/` a `/public/assets/audio/`. Usa `No One Noticed (Extended Spanish).mp3` como tema principal en bucle suave al tocar la pantalla, permite cambiar entre las 4 pistas de The Marías desde un mini-reproductor pixel art y añade SFX retro sintetizados con Web Audio API (clics, sobres, Pokéballs, error y victoria).
- **Reglas narrativas:** Víctor (182 cm) y Yaheyli (163 cm), historia entre Panamá y El Paso (Texas), Fortnite y Mateo. Sincero, cálido y sin presionar emocionalmente. **NO inventes** fechas ni conversaciones.

---

# 4. ARQUITECTURA Y FASES SECUENCIALES

- **Stack:** HTML5 Canvas + JavaScript Vanilla modular (ES Modules) + CSS dentro de `/src` y `index.html` en la raíz (listo para funcionar directo en **GitHub Pages** sin compilación).
- Trabaja de forma **secuencial, una fase por turno**, actualizando `/docs/PROJECT_STATUS.md` al terminar cada una:
  - **FASE 0 y 1:** Extracción con Python de fotogramas de `original.mp4` y texto de PDFs; crear `/docs/VIDEO_REFERENCE_ANALYSIS.md`.
  - **FASE 2:** Crear `index.html`, `styles.css`, reproductor de audio de The Marías (`audioManager.js`), fondos pixel art y Escenas 1, 2 y 3.
  - **FASE 3:** Crear `sprites.js` y Escenas 4 y 5 (Carta con chibi y Canciones).
  - **FASE 4:** Crear Escenas 6, 7 y 8 (Pokéballs con fotos reales, Carta Pokémon con `carta_pokemon_vy.png`, Búho con 6 tickets y Final).
  - **FASE 5:** Pruebas en móvil y escritorio, generar `/docs/QA_REPORT.md` y preparar para GitHub Pages.

# 5. PRIMERA INSTRUCCIÓN
Ejecuta ahora únicamente la **FASE 0 y FASE 1** y detente al terminar para revisar el análisis antes de programar.
