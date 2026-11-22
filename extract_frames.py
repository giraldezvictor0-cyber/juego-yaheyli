import cv2
import os

# Configuración
video_path = r"references\video\original.mp4"
output_dir = r"references\screenshots"
interval_seconds = 1.5

# Crear directorio de salida si no existe
os.makedirs(output_dir, exist_ok=True)

# Abrir el video
cap = cv2.VideoCapture(video_path)
if not cap.isOpened():
    print(f"Error: No se pudo abrir el video {video_path}")
    exit(1)

# Obtener información del video
fps = cap.get(cv2.CAP_PROP_FPS)
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
duration = total_frames / fps if fps > 0 else 0

print(f"Video info: FPS={fps:.2f}, Total frames={total_frames}, Duration={duration:.2f}s")

# Calcular intervalo en frames
frame_interval = int(fps * interval_seconds)
if frame_interval <= 0:
    frame_interval = 1

print(f"Extrayendo un frame cada {interval_seconds}s ({frame_interval} frames)")

frame_count = 0
saved_count = 0

while True:
    ret, frame = cap.read()
    if not ret:
        break

    if frame_count % frame_interval == 0:
        timestamp = frame_count / fps
        minutes = int(timestamp // 60)
        seconds = int(timestamp % 60)
        millis = int((timestamp - int(timestamp)) * 1000)
        filename = f"frame_{minutes:02d}_{seconds:02d}_{millis:03d}.png"
        filepath = os.path.join(output_dir, filename)
        cv2.imwrite(filepath, frame)
        saved_count += 1
        print(f"Guardado: {filename} (t={timestamp:.2f}s)")

    frame_count += 1

cap.release()
print(f"\nCompletado: {saved_count} frames extraídos de {frame_count} frames totales.")