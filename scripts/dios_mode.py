import os
import subprocess
import asyncio
from telegram import Bot
from datetime import datetime
import sys

# --- CONFIGURACIÓN ---
TELEGRAM_TOKEN = "8732249375:AAG5ffpAADbe0vjKXk7EOR5QM7BI7Te6ico" # Reemplaza con el token de tu bot de @BotFather
USER_ID = "5010116404"

async def send_telegram_message(message, is_error=False):
    """Envía mensaje directamente a Sergio Daniel vía Telegram"""
    if TELEGRAM_TOKEN == "TU_BOT_TOKEN_AQUI": return
    
    bot = Bot(token=TELEGRAM_TOKEN)
    icon = "❌" if is_error else "🚀"
    final_message = f"{icon} **DevOps Bot:**\n{message}"
    
    try:
        await bot.send_message(chat_id=USER_ID, text=final_message, parse_mode='Markdown')
    except Exception as e:
        print(f"Error enviando notificación a Telegram: {e}")

def run_step(command, description):
    print(f"⚙️ {description}...")
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        error_msg = f"Fallo en {description}: {result.stderr}"
        print(f"❌ {error_msg}")
        asyncio.run(send_telegram_message(error_msg, is_error=True))
        return False
    return True

def devops_flow():
    # 1. Optimización
    print("🚀 Iniciando optimización...")
    try:
        sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'tools'))
        import optimize_images
        optimize_images.optimize_and_convert()
        
        # 1.5 Auditoría SEO
        import audit_seo
        audit_seo.audit_seo()
        if os.path.exists("reports/seo_audit.txt") and os.path.getsize("reports/seo_audit.txt") > 0:
            with open("reports/seo_audit.txt", "r", encoding="utf-8") as f:
                seo_report = f.read()
            
            # Verificar si hay errores reales (no solo advertencias menores)
            if len(seo_report.strip()) > 0:
                asyncio.run(send_telegram_message(f"⚠️ Reporte SEO con advertencias detectadas, deteniendo despliegue:\n{seo_report[:500]}", is_error=True))
                print("🛑 Despliegue cancelado debido a errores SEO.")
                return
    except Exception as e:
        asyncio.run(send_telegram_message(f"Error en fase de optimización/SEO: {e}", is_error=True))
        return

    # 2. Git Status
    if not subprocess.getoutput("git status --porcelain"):
        print("✅ Todo al día.")
        return

    # 3. Flujo Git
    if run_step("git add .", "Añadiendo cambios"):
        fecha = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        if run_step(f'git commit -m "Auto-Deploy: {fecha}"', "Commit automático"):
            if run_step("git push origin main", "Push a GitHub"):
                # 4. Despliegue Netlify (Usando ruta absoluta y especificando directorio public)
                netlify_path = r"C:\Users\astur\AppData\Roaming\npm\netlify.cmd"
                if os.path.exists(netlify_path):
                    if run_step(f'"{netlify_path}" deploy --prod --dir=public', "Desplegando en Netlify"):
                        asyncio.run(send_telegram_message("✅ Web actualizada y desplegada con éxito en Netlify.\n\n🔥 ¡Gran trabajo, Sergio!"))
                    else:
                        asyncio.run(send_telegram_message("❌ Error en el despliegue de Netlify.", is_error=True))
                else:
                    asyncio.run(send_telegram_message("❌ No se encuentra el ejecutable de Netlify.", is_error=True))
            else:
                asyncio.run(send_telegram_message("❌ Error al hacer push a GitHub.", is_error=True))
        else:
            asyncio.run(send_telegram_message("❌ Error al crear commit.", is_error=True))

if __name__ == "__main__":
    devops_flow()
