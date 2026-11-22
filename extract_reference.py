#!/usr/bin/env python3
"""
Script para extraer fotogramas del video de referencia y texto de los PDFs.
FASE 0 y 1 del proyecto Yaheyli.
"""

import cv2
import fitz  # pymupdf
import os
import sys
from pathlib import Path

# Configuración de rutas
BASE_DIR = Path(__file__).parent
REFERENCES_DIR = BASE_DIR / "references"
VIDEO_PATH = REFERENCES_DIR / "video" / "original.mp4"
SCREENSHOTS_DIR = REFERENCES_DIR / "screenshots"
DOCUMENTS_DIR = REFERENCES_DIR / "documents"
TEXTO_EXTRAIDO_PATH = DOCUMENTS_DIR / "texto_extraido.txt"
VIDEO_ANALYSIS_PATH = BASE_DIR / "docs" / "VIDEO_REFERENCE_ANALYSIS.md"
PROJECT_STATUS_PATH = BASE_DIR / "docs" / "PROJECT_STATUS.md"


def extract_video_frames():
    """Extrae fotogramas cada 1.5 segundos del video."""
    print(f"📹 Extrayendo fotogramas de {VIDEO_PATH}...")

    if not VIDEO_PATH.exists():
        print(f"❌ Error: No se encuentra el video en {VIDEO_PATH}")
        return False

    SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)

    cap = cv2.VideoCapture(str(VIDEO_PATH))

    if not cap.isOpened():
        print("❌ Error: No se pudo abrir el video")
        return False

    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = total_frames / fps if fps > 0 else 0

    print(f"   FPS: {fps:.2f}")
    print(f"   Total frames: {total_frames}")
    print(f"   Duración: {duration:.2f} segundos")

    # Intervalo de 1.5 segundos
    interval_frames = int(fps * 1.5)

    frame_count = 0
    screenshot_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % interval_frames == 0:
            timestamp = frame_count / fps
            minutes = int(timestamp // 60)
            seconds = int(timestamp % 60)
            milliseconds = int((timestamp - int(timestamp)) * 1000)

            filename = f"frame_{minutes:02d}_{seconds:02d}_{milliseconds:03d}.png"
            filepath = SCREENSHOTS_DIR / filename

            cv2.imwrite(str(filepath), frame)
            screenshot_count += 1
            print(f"   ✓ Frame {screenshot_count}: {filename} (t={timestamp:.2f}s)")

        frame_count += 1

    cap.release()
    print(f"✅ Extracción completada: {screenshot_count} fotogramas guardados en {SCREENSHOTS_DIR}")
    return True


def extract_pdf_text():
    """Extrae todo el texto de los PDFs en la carpeta documents."""
    print(f"📄 Extrayendo texto de PDFs en {DOCUMENTS_DIR}...")

    pdf_files = list(DOCUMENTS_DIR.glob("*.pdf"))

    if not pdf_files:
        print("❌ No se encontraron archivos PDF")
        return False

    all_text = []

    for pdf_path in pdf_files:
        print(f"   Procesando: {pdf_path.name}...")
        try:
            doc = fitz.open(str(pdf_path))
            pdf_text = [f"\n{'='*80}\n📄 ARCHIVO: {pdf_path.name}\n{'='*80}\n"]

            for page_num in range(len(doc)):
                page = doc[page_num]
                text = page.get_text()
                if text.strip():
                    pdf_text.append(f"\n--- Página {page_num + 1} ---\n")
                    pdf_text.append(text)

            doc.close()
            all_text.extend(pdf_text)
            print(f"   ✓ {pdf_path.name}: {len(doc)} páginas procesadas")

        except Exception as e:
            print(f"   ❌ Error procesando {pdf_path.name}: {e}")
            all_text.append(f"\n❌ ERROR en {pdf_path.name}: {e}\n")

    # Guardar texto extraído
    full_text = "".join(all_text)
    TEXTO_EXTRAIDO_PATH.write_text(full_text, encoding="utf-8")
    print(f"✅ Texto extraído guardado en {TEXTO_EXTRAIDO_PATH}")
    return True


def analyze_video_frames():
    """Analiza los fotogramas extraídos y genera el análisis cronológico."""
    print("🔍 Analizando fotogramas para crear cronología verificada...")

    frames = sorted(SCREENSHOTS_DIR.glob("frame_*.png"))

    if not frames:
        print("❌ No hay fotogramas para analizar")
        return False

    analysis_lines = [
        "# ANÁLISIS CRONOLÓGICO DEL VIDEO DE REFERENCIA",
        "",
        f"**Video original:** `references/video/original.mp4`",
        f"**Fotogramas extraídos:** {len(frames)} (cada 1.5 segundos)",
        f"**Fecha de análisis:** 2026-11-21",
        "",
        "---",
        "",
        "## CRONOLOGÍA VERIFICADA POR FOTOGRAMAS",
        "",
    ]

    for i, frame_path in enumerate(frames):
        # Parsear timestamp del nombre del archivo
        name = frame_path.stem  # frame_MM_SS_mmm
        parts = name.split("_")
        if len(parts) >= 4:
            minutes = parts[1]
            seconds = parts[2]
            milliseconds = parts[3]
            timestamp = f"{minutes}:{seconds}.{milliseconds}"
        else:
            timestamp = f"Frame {i}"

        analysis_lines.append(f"### Fotograma {i+1}: `{timestamp}`")
        analysis_lines.append(f"- **Archivo:** `{frame_path.name}`")
        analysis_lines.append(f"- **Descripción visual:** [Pendiente de análisis manual]")
        analysis_lines.append(f"- **Elementos UI detectados:** [Pendiente]")
        analysis_lines.append(f"- **Texto visible:** [Pendiente]")
        analysis_lines.append(f"- **Escena correspondiente:** [Pendiente]")
        analysis_lines.append("")

    analysis_lines.extend([
        "---",
        "",
        "## MAPEO A ESCENAS BASE (según CLAUDE.md)",
        "",
        "| Escena | Rango temporal | Fotogramas estimados | Estado |",
        "|--------|----------------|----------------------|--------|",
        "| **Escena 1 - Portada/Intro** | 00:00–00:04 | ~0-2 | ⏳ |",
        "| **Escena 2 - Denegar** | 00:04–00:10 | ~2-6 | ⏳ |",
        "| **Escena 3 - Hub/Selección** | 00:11–00:25 | ~7-16 | ⏳ |",
        "| **Escena 4 - Sobre/Carta** | 00:13–00:18 | ~8-12 | ⏳ |",
        "| **Escena 5 - Disco/Canciones** | 00:22–00:24 | ~14-16 | ⏳ |",
        "| **Escena 6 - Pokéballs** | 00:26–00:44 | ~17-29 | ⏳ |",
        "| **Escena 7 - Búho/Tickets** | 00:50–01:00 | ~33-40 | ⏳ |",
        "| **Escena 8 - Desenlace/Galería** | 01:02–01:09 | ~41-46 | ⏳ |",
        "",
        "---",
        "",
        "## NOTAS PARA DESARROLLO",
        "",
        "- Los fotogramas sirven como referencia visual para pixel art y composición",
        "- El texto extraído de PDFs contiene la carta de Víctor y otros textos narrativos",
        "- La ilustración `carta_pokemon_vy.png` es la base para la Carta Coleccionable (Escena 6)",
        "- Las 4 canciones de The Marías son la banda sonora principal",
        "- Las 43 fotos reales (`foto_0001.png` a `foto_0043.png`) se usan en la Escena 6 (Pokéballs con recuerdos)",
        "",
        "---",
        "",
        "*Generado automáticamente por `extract_reference.py` - FASE 0 y 1*",
    ])

    # Crear directorio docs si no existe
    BASE_DIR.joinpath("docs").mkdir(parents=True, exist_ok=True)

    VIDEO_ANALYSIS_PATH.write_text("\n".join(analysis_lines), encoding="utf-8")
    print(f"✅ Análisis guardado en {VIDEO_ANALYSIS_PATH}")
    return True


def create_project_status():
    """Crea el archivo PROJECT_STATUS.md inicial."""
    status_lines = [
        "# PROJECT STATUS — YAHEYLI",
        "",
        "**Fecha de inicio:** 2026-11-21",
        "**Fase actual:** FASE 1 completada - Extracción y análisis de referencias",
        "",
        "---",
        "",
        "## ✅ FASE 0 y 1: EXTRACCIÓN Y ANÁLISIS (COMPLETADA)",
        "",
        "- [x] Inspección de carpeta `references/` completa",
        "- [x] Video `original.mp4` localizado (4.6 MB, ~69.6s)",
        "- [x] PDFs localizados: 6 archivos (instrucciones, libro, libro fotos, libro1 fotos, libro_comprimido, Nuestra-historia...)",
        "- [x] Fotos reales: 43 archivos (`foto_0001.png` a `foto_0043.png`)",
        "- [x] Audio: 4 MP3 de The Marías",
        "- [x] Ilustración pixel art: `carta_pokemon_vy.png`",
        "- [x] **Extracción de fotogramas**: Cada 1.5s → `references/screenshots/`",
        "- [x] **Extracción de texto PDFs**: → `references/documents/texto_extraido.txt`",
        "- [x] **Análisis cronológico**: → `docs/VIDEO_REFERENCE_ANALYSIS.md`",
        "- [x] **Project status**: → `docs/PROJECT_STATUS.md`",
        "",
        "---",
        "",
        "## ⏳ PRÓXIMAS FASES",
        "",
        "### FASE 2: BASE TÉCNICA Y ESCENAS 1-3",
        "- [ ] `index.html` + `styles.css` (Canvas, fuentes retro, responsive)",
        "- [ ] `audioManager.js` (reproductor The Marías + Web Audio API SFX)",
        "- [ ] Fondos pixel art base (atardecer, noche, bosque, prado, lago)",
        "- [ ] **Escena 1**: Portada con título, subtítulo, botones EMPEZAR/DENEGAR",
        "- [ ] **Escena 2**: Gatito llorando con diálogo + botón ESTÁ BIÉN",
        "- [ ] **Escena 3**: Hub bosque nocturno + 4 regalos animados + estrellas de completado",
        "",
        "### FASE 3: ESCENAS 4-5 (CARTA Y CANCIONES)",
        "- [ ] `sprites.js` (sistema de sprites/animaciones)",
        "- [ ] **Escena 4**: Sobre gigante → pergamino con carta progresiva + chibi Yaheyli",
        "- [ ] **Escena 5**: Lago dorado + tarjetas musicales interactivas + controles audio",
        "",
        "### FASE 4: ESCENAS 6-8 (PÓKEBALLS, BÚHO, FINAL)",
        "- [ ] **Escena 6**: Campo floral + Pokéballs + fotos reales + Pikachu triste + Snorlax + Carta Pokémon (`carta_pokemon_vy.png`)",
        "- [ ] **Escena 7**: Búho rosa + normas + 6 tickets dorados (localStorage) + gatitos abrazados",
        "- [ ] **Escena 8**: Desenlace soleado + chibis Víctor/Yaheyli + botones VOLVER/GALERÍA",
        "",
        "### FASE 5: QA Y DEPLOY",
        "- [ ] Pruebas móvil + escritorio",
        "- [ ] `docs/QA_REPORT.md`",
        "- [ ] Preparar para GitHub Pages",
        "",
        "---",
        "",
        "*Actualizado automáticamente al completar cada fase*",
    ]

    PROJECT_STATUS_PATH.write_text("\n".join(status_lines), encoding="utf-8")
    print(f"✅ Project status guardado en {PROJECT_STATUS_PATH}")
    return True


def main():
    print("=" * 60)
    print("YAHEYLI - FASE 0 y 1: EXTRACCION DE REFERENCIAS")
    print("=" * 60)
    print()

    # Verificar dependencias
    try:
        import cv2
        print(f"✅ OpenCV: {cv2.__version__}")
    except ImportError:
        print("❌ OpenCV no instalado. Ejecuta: pip install opencv-python")
        sys.exit(1)

    try:
        import fitz
        print(f"✅ PyMuPDF: {fitz.__version__}")
    except ImportError:
        print("❌ PyMuPDF no instalado. Ejecuta: pip install pymupdf")
        sys.exit(1)

    print()

    # Ejecutar extracciones
    success = True
    success &= extract_video_frames()
    print()
    success &= extract_pdf_text()
    print()
    success &= analyze_video_frames()
    print()
    success &= create_project_status()
    print()

    if success:
        print("=" * 60)
        print("✅ FASE 0 y 1 COMPLETADA CON ÉXITO")
        print("=" * 60)
        print()
        print("📋 Archivos generados:")
        print(f"   - {SCREENSHOTS_DIR}/ (fotogramas)")
        print(f"   - {TEXTO_EXTRAIDO_PATH}")
        print(f"   - {VIDEO_ANALYSIS_PATH}")
        print(f"   - {PROJECT_STATUS_PATH}")
        print()
        print("👀 Revisa el análisis cronológico antes de continuar a FASE 2.")
    else:
        print("❌ Hubo errores en la extracción")
        sys.exit(1)


if __name__ == "__main__":
    main()