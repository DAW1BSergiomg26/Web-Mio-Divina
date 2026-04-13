import os
import shutil
from PIL import Image

# Rutas
img_dir = "public/assets/img"
backup_dir = "backups/img_original_backup"
html_dirs = ["public", "public/comunidad", "public/devociones", "public/devociones/marianas", "public/devociones/rosario", "public/devociones/santos", "public/estudios", "public/liturgia", "public/oraciones", "public/papas"]

def backup_images():
    if os.path.exists(img_dir):
        if os.path.exists(backup_dir): shutil.rmtree(backup_dir)
        shutil.copytree(img_dir, backup_dir)
        print(f"✅ Backup de imágenes creado en: {backup_dir}")

def update_html_references(old_ext, new_ext):
    for root_dir in html_dirs:
        if not os.path.exists(root_dir): continue
        for file in os.listdir(root_dir):
            if file.endswith(".html"):
                path = os.path.join(root_dir, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Reemplazo simple de extensiones en rutas de imagen
                new_content = content.replace(f"{old_ext}\"", f"{new_ext}\"").replace(f"{old_ext}'", f"{new_ext}'")
                
                if new_content != content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"🔗 Referencias actualizadas en: {file}")

def optimize_and_convert():
    for root, dirs, files in os.walk(img_dir):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in ['.jpg', '.jpeg', '.png']:
                old_path = os.path.join(root, file)
                name = os.path.splitext(file)[0]
                new_path = os.path.join(root, f"{name}.webp")
                
                try:
                    with Image.open(old_path) as img:
                        # Convertir a RGB si es necesario (para evitar errores con PNG transparentes a JPG/WebP)
                        if img.mode in ("RGBA", "P") and ext != ".png":
                            img = img.convert("RGB")
                        
                        img.save(new_path, "WEBP", quality=80, optimize=True)
                        print(f"✨ Optimizado: {file} -> {name}.webp")
                        
                        # Si la conversión fue exitosa, actualizamos HTML
                        update_html_references(file, f"{name}.webp")
                        
                        # Opcional: Eliminar original para ahorrar espacio en public (ya tenemos backup)
                        os.remove(old_path)
                except Exception as e:
                    print(f"❌ Error optimizando {file}: {e}")

if __name__ == "__main__":
    backup_images()
    optimize_and_convert()
    print("✅ Proceso de optimización de imágenes completado.")
