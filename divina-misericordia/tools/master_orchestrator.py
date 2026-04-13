import os
import shutil
import re
import datetime
import subprocess
import zipfile

# --- CONFIGURACIÓN DE RUTAS ---
BASE_DIR = os.getcwd()
PUBLIC_DIR = os.path.join(BASE_DIR, "public")
BUILD_DIR = os.path.join(BASE_DIR, "build")
TOOLS_DIR = os.path.join(BASE_DIR, "tools")
BACKUP_TARGET = r"C:\Users\astur\Backups"  # Ruta solicitada
if not os.path.exists(BACKUP_TARGET):
    BACKUP_TARGET = os.path.join(BASE_DIR, "backups") # Fallback seguro

# --- FASE 1: AUDITORÍA ---
def phase_audit():
    print("🔍 [1/5] Iniciando Auditoría Nivel DIOS...")
    issues = []
    for root, dirs, files in os.walk(PUBLIC_DIR):
        for file in files:
            if file.endswith(".html"):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    if '<img' in content and 'alt=' not in content:
                        issues.append(f"Accesibilidad: {file} tiene imágenes sin 'alt'.")
                    if '<title></title>' in content:
                        issues.append(f"SEO: {file} tiene el título vacío.")
    
    report_path = os.path.join(BASE_DIR, "auditoria_master.txt")
    with open(report_path, "w", encoding="utf-8") as f:
        f.write("\n".join(issues) if issues else "✅ Proyecto Impecable.")
    print(f"📊 Reporte generado en: {report_path}")

# --- FASE 2: LIMPIEZA ---
def phase_cleanup():
    print("🧹 [2/5] Limpiando residuos y archivos temporales...")
    patterns = [r"temp_.*\.html", r"test\.js", r"commits_temp\.txt", r"\$LOG", r"reporte_errores\.txt"]
    count = 0
    for root, dirs, files in os.walk(BASE_DIR):
        if "node_modules" in root: continue
        for file in files:
            if any(re.match(p, file) for p in patterns):
                os.remove(os.path.join(root, file))
                count += 1
    print(f"✅ Eliminados {count} archivos innecesarios.")

# --- FASE 3: OPTIMIZACIÓN (Build Prep) ---
def minify_logic(content, ext):
    if ext == ".css":
        content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
        content = re.sub(r'\s+', ' ', content)
        content = re.sub(r'\s*([{:;}])\s*', r'\1', content)
    elif ext == ".js":
        content = re.sub(r'//.*', '', content)
        content = re.sub(r'\s+', ' ', content)
    return content.strip()

def phase_optimization():
    print("⚡ [3/5] Minificando recursos y optimizando assets...")
    if os.path.exists(BUILD_DIR): shutil.rmtree(BUILD_DIR)
    shutil.copytree(PUBLIC_DIR, BUILD_DIR)
    
    for root, dirs, files in os.walk(BUILD_DIR):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in [".css", ".js"]:
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(minify_logic(content, ext))
    print("✨ Recursos minificados en la carpeta /build.")

# --- FASE 4: GENERACIÓN DE BUILD ---
def phase_build():
    print("📦 [4/5] Consolidando Build Final de Producción...")
    # Aquí podríamos inyectar metadatos de versión o timestamps
    version_file = os.path.join(BUILD_DIR, "version.txt")
    with open(version_file, "w") as f:
        f.write(f"Build: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("🚀 Build listo para despliegue manual o automático.")

# --- FASE 5: BACKUP INTELIGENTE ---
def phase_backup():
    print("💾 [5/5] Ejecutando Backup Inteligente...")
    if not os.path.exists(BACKUP_TARGET): os.makedirs(BACKUP_TARGET)
    
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    zip_name = f"divina-misericordia_{timestamp}.zip"
    zip_path = os.path.join(BACKUP_TARGET, zip_name)
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(BASE_DIR):
            if any(x in root for x in ["build", "node_modules", "backups", ".git", ".ruff_cache"]):
                continue
            for file in files:
                zipf.write(os.path.join(root, file), 
                           os.path.relpath(os.path.join(root, file), BASE_DIR))
    
    # Mantener solo 5
    backups = sorted([os.path.join(BACKUP_TARGET, f) for f in os.listdir(BACKUP_TARGET) if f.endswith(".zip")],
                     key=os.path.getmtime, reverse=True)
    if len(backups) > 5:
        for b in backups[5:]:
            os.remove(b)
            print(f"🗑️ Eliminado backup antiguo: {os.path.basename(b)}")
    
    print(f"✅ Backup creado con éxito: {zip_name}")

# --- ORQUESTADOR DIOS ---
def run_dios_mode():
    print("\n" + "═"*50)
    print("🔱 INICIANDO AUTOMATIZACIÓN TOTAL: DIOS MODE")
    print("═"*50)
    start_time = datetime.datetime.now()
    
    try:
        phase_audit()
        phase_cleanup()
        phase_optimization()
        phase_build()
        phase_backup()
        
        end_time = datetime.datetime.now()
        duration = end_time - start_time
        print("\n" + "═"*50)
        print(f"🌟 ¡FLUJO COMPLETADO CON ÉXITO EN {duration.total_seconds():.2f}s!")
        print("ESTADO: LISTO PARA PRODUCCIÓN")
        print("═"*50 + "\n")
    except Exception as e:
        print(f"❌ ERROR CRÍTICO EN EL FLUJO: {e}")

if __name__ == "__main__":
    run_dios_mode()
