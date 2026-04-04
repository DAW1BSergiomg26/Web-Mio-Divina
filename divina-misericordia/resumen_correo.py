#!/usr/bin/env python3
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import datetime

REMITENTE = "menu2informatico@gmail.com"
DESTINATARIO = "menu2informatico@gmail.com"
PASSWORD = "orqu qkzr skzt gsye"

ahora = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")

contenido = f"""
══════════════════════════════════════════════════════════════════
        📋 RESUMEN - WEB DIVINA MISERICORDIA
══════════════════════════════════════════════════════════════════

Fecha: {ahora}

─────────────────────────────────────────────────────────────────
✅ ÚLTIMO COMMIT SUBIDO A GITHUB
─────────────────────────────────────────────────────────────────

fase2-total: refactor: integrate AAA systems into el-altar.html
Rama: https://github.com/DAW1BSergiomg26/Web-Mio-Divina/tree/fase2-total

─────────────────────────────────────────────────────────────────
🎯 INTEGRACIÓN AAA EN EL-ALTAR.HTML
─────────────────────────────────────────────────────────────────

Se han integrado todos los sistemas AAA a la sección existente 
"el-altar.html" (nuestra página del Altar 3D):

1. 🎵 SISTEMA DE MÚSICA
   - Web Audio API synthesis (sin archivos externos)
   - Notas de arpa heavenly en loop
   - Toggle con botón UI
   - Fade in/out suave

2. 🕯️ SISTEMA DE 4 VELAS MEJORADO
   - 4 velas independientes (Vela 1-4)
   - Botón "Todas" para toggle global
   - Cada vela tiene su propia llama + luz PointLight
   - Flicker realista con fases aleatorias

3. 📖 BIBLIA INTERACTIVA
   - 20 versículos poderosos en display flotante
   - Iluminación pulsante al mostrar versículo
   - Auto-ocultar después de 6 segundos

4. 🧪 DEBUG SYSTEM
   - Autodiagnóstico en tiempo real
   - Logs de scene, camera, renderer, luces
   - Botón "Reiniciar" para reload completo

5. ✝️ TEXTO DIVINO
   - "Este es Mi Hijo, escuchadle" siempre visible sobre la cruz

─────────────────────────────────────────────────────────────────
🎛️ UI PANEL ACTUALIZADO
─────────────────────────────────────────────────────────────────

Nuevo panel de control en el-altar.html:
- 🎵 Música (toggle música ambiental)
- 🕯️ Vela 1, 2, 3, 4 (toggle individual)
- 🔥 Todas (toggle todas las velas)
- 📖 Biblia (mostrar versículo aleatorio)
- 🔄 Reiniciar (reload de la página)

Barra inferior existente:
- 📿 Oración del Día
- ✨ Partículas
- 🌟 Bloom
- 🏛️ Santuario (reset camera)

─────────────────────────────────────────────────────────────────
🌐 ENLACES
─────────────────────────────────────────────────────────────────

Web: http://localhost:3002
Altar 3D: http://localhost:3002/el-altar.html
GitHub: https://github.com/DAW1BSergiomg26/Web-Mio-Divina
Rama: fase2-total

─────────────────────────────────────────────────────────────────
💻 COMANDOS
─────────────────────────────────────────────────────────────────

# Iniciar servidor
cd C:\\Users\\astur\\Desktop\\Web Mio Divina\\divina-misericordia
node index.js

# Servidor ejecuta en puerto 3002

══════════════════════════════════════════════════════════════════
        ASOCIACIÓN APÓSTOLES DE LA DIVINA MISERICORDIA
══════════════════════════════════════════════════════════════════
"""

msg = MIMEMultipart()
msg["From"] = REMITENTE
msg["To"] = DESTINATARIO
msg["Subject"] = f"Integración AAA en el-altar.html - {ahora}"
msg.attach(MIMEText(contenido, "plain", "utf-8"))

server = smtplib.SMTP("smtp.gmail.com", 587)
server.starttls()
server.login(REMITENTE, PASSWORD)
server.sendmail(REMITENTE, DESTINATARIO, msg.as_string())
server.quit()
print("Correo enviado!")
