import os
import shutil
import re
import datetime
import subprocess

# Configuración
source_dir = "public"
build_dir = "build"
tools_dir = "tools"

def clean_project():
    print("🧹 Limpiando archivos temporales...")
    patterns = [r"temp_.*\.html", r"test\.js", r"commits_temp\.txt", r"\$LOG"]
    for root, dirs, files in os.walk("."):
        for file in files:
            if any(re.match(p, file) for p in patterns):
                os.remove(os.path.join(root, file))

def minify_css_js(content, ext):
    if ext == ".css":
        # Eliminar comentarios y espacios innecesarios
        content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
        content = re.sub(r'\s+', ' ', content)
        content = re.sub(r'\s*([{:;}])\s*', r'\1', content)
    elif ext == ".js":
        # Minificación JS básica (quitar comentarios de línea y espacios)
        content = re.sub(r'//.*', '', content)
        content = re.sub(r'\s+', ' ', content)
    return content.strip()

def prepare_production_build():
    print(f"⚙️ Preparando build de producción en: {build_dir}...")
    if os.path.exists(build_dir): shutil.rmtree(build_dir)
    shutil.copytree(source_dir, build_dir)
    
    for root, dirs, files in os.walk(build_dir):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in [".css", ".js"]:
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                minified = minify_css_js(content, ext)
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(minified)
    print("✨ Carpeta 'build/' optimizada y lista para despliegue.")

def create_final_backup():
    print("📦 Creando backup final de seguridad...")
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M")
    backup_name = f"backups/divina_misericordia_PROD_{timestamp}"
    shutil.make_archive(backup_name, 'zip', ".")
    print(f"✅ Backup creado: {backup_name}.zip")

def run_all():
    print("🚀 INICIANDO AUTOMATIZACIÓN TOTAL NIVEL DIOS")
    print("════════════════════════════════════════════")
    
    # 1. Limpieza
    clean_project()
    
    # 2. Optimización de Imágenes (usamos el script anterior)
    subprocess.run(["python", os.path.join(tools_dir, "optimize_images.py")])
    
    # 3. Auditoría
    subprocess.run(["python", os.path.join(tools_dir, "code_audit.py")])
    
    # 4. Generar Build de Producción
    prepare_production_build()
    
    # 5. Backup
    create_final_backup()
    
    print("════════════════════════════════════════════")
    print("🌟 ¡PROYECTO LISTO PARA EL MUNDO! (Jesús, confío en Ti)")

if __name__ == "__main__":
    run_all()
