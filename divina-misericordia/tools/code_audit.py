import os
import re

def audit_code():
    issues = []
    base_dir = "public"
    
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            path = os.path.join(root, file)
            ext = os.path.splitext(file)[1].lower()
            
            with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                
                # Auditoría HTML
                if ext == ".html":
                    # Alt tags faltantes
                    if '<img' in content and 'alt=' not in content:
                        issues.append(f"⚠️ {file}: Imágenes sin atributo 'alt' (SEO/Accesibilidad).")
                    # Títulos vacíos
                    if '<title></title>' in content or '<title> </title>' in content:
                        issues.append(f"❌ {file}: Etiqueta <title> vacía.")
                    # Consolas olvidadas en script inline
                    if 'console.log(' in content:
                        issues.append(f"🔍 {file}: console.log() detectado en script inline.")
                
                # Auditoría CSS
                elif ext == ".css":
                    # Selectores ID abusivos
                    if content.count('#') > 50:
                        issues.append(f"⚠️ {file}: Demasiados selectores por ID (Baja especificidad).")
                    # Colores hardcoded repetidos (deberían ser variables)
                    if '#ffffff' in content.lower() and '--' not in content:
                        issues.append(f"💡 {file}: Considera usar variables CSS para colores repetidos.")
                
                # Auditoría JS
                elif ext == ".js":
                    if 'console.log(' in content:
                        issues.append(f"🔍 {file}: console.log() detectado en código JS.")
                    if 'var ' in content:
                        issues.append(f"⚠️ {file}: Uso de 'var'. Se recomienda 'let' o 'const'.")

    with open("reporte_errores.txt", "w", encoding="utf-8") as rep:
        rep.write("════════════════════════════════════════════════════════════════\n")
        rep.write("    🔍 REPORTE DE AUDITORÍA DE CÓDIGO - DIVINA MISERICORDIA\n")
        rep.write("════════════════════════════════════════════════════════════════\n\n")
        if not issues:
            rep.write("✅ No se detectaron errores críticos. ¡Código impecable!\n")
        else:
            rep.writelines([i + "\n" for i in issues])
            
    print(f"✅ Auditoría completada. Reporte generado: reporte_errores.txt")

if __name__ == "__main__":
    audit_code()
