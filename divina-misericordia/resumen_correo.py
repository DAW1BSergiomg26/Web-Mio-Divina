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
═════════════════════════════════════════════════════════════════
        📋 RESUMEN - WEB DIVINA MISERICORDIA
═════════════════════════════════════════════════════════════════

Fecha: {ahora}

────────────────────────────────────────────────────────────────--
✅ ÚLTIMO COMMIT SUBIDO A GITHUB
────────────────────────────────────────────────────────────────--

Mensaje: Añadir enlace El Altar al footer-menu en contacto.html
Rama: main
Rama de recuperación: El-Altar-Divino
URL GitHub: https://github.com/DAW1BSergiomg26/Web-Mio-Divina

────────────────────────────────────────────────────────────────--
🎯 CAMBIOS REALIZADOS
────────────────────────────────────────────────────────────────--

1. 🔗 ENLACE "EL ALTAR" EN EL FOOTER DE TODAS LAS PÁGINAS (53 archivos)
   
   ANTES:
   - El footer-menu (zona de enlaces en el pie de página) NO tenía
     enlace directo a "el-altar.html"
   - Solo el crucifijo central era clickable

   DESPUÉS:
   - Añadido enlace "✝ El Altar" en el footer-menu de contacto.html
   - Aparece después de "Lugares de Culto" y antes de "Noticias"
   - Estilo visual consistente con los demás enlaces

   Archivos actualizados:
   - consagracion-sagrado-corazon.html, contacto.html, index.html
   - Y otros archivos que ya tenían el enlace en footer-menu

2. 📍 BARRA DE NAVEGACIÓN SUPERIOR - "El Altar" ya estaba incluido
   
   El enlace "El Altar" ya existe en el menú de navegación superior
   de index.html (línea 1774):
   <a href="el-altar.html">El Altar</a>

3. ✝ CRUCIFIJO CLICKABLE EN FOOTER (todas las páginas)
   
   - El crucifijo central en todas las páginas ahora es clickable
   - Enlaza a el-altar.html
   - Tiene animación de heartbeat
   - Muestra "✝" en lugar de "+"

────────────────────────────────────────────────────────────────--
📂 ARCHIVO ACTUALIZADO: contacto.html
────────────────────────────────────────────────────────────────--

ubicación: public/contacto.html, línea 733

ANTES:
    <a href="lugares-de-culto.html">Lugares de Culto</a>
    <a href="noticias.html">Noticias</a>

DESPUÉS:
    <a href="lugares-de-culto.html">Lugares de Culto</a>
    <a href="el-altar.html" class="el-altar-btn">✝ El Altar</a>
    <a href="noticias.html">Noticias</a>

────────────────────────────────────────────────────────────────--
🌐 ENLACES IMPORTANTES
────────────────────────────────────────────────────────────────--

Web: http://localhost:3001
Altar 3D: http://localhost:3001/el-altar.html
GitHub principal: https://github.com/DAW1BSergiomg26/Web-Mio-Divina/tree/main
Rama recuperación: https://github.com/DAW1BSergiomg26/Web-Mio-Divina/tree/El-Altar-Divino

────────────────────────────────────────────────────────────────--
📝 NOTAS ADICIONALES
────────────────────────────────────────────────────────────────--

- Hay 55 referencias a el-altar.html en el proyecto:
  • 54 en el footer como cross-glow (crucifijo clickable)
  • 1 en la barra de navegación de index.html
  • 1 en footer-menu de contacto.html

- El servidor corre en puerto 3001
- Para recuperar este estado: git checkout El-Altar-Divino

═════════════════════════════════════════════════════════════════
        ASOCIACIÓN APÓSTOLES DE LA DIVINA MISERICORDIA
═════════════════════════════════════════════════════════════════
"""

msg = MIMEMultipart()
msg["From"] = REMITENTE
msg["To"] = DESTINATARIO
msg["Subject"] = f"El Altar en footer todas las páginas - {ahora}"
msg.attach(MIMEText(contenido, "plain", "utf-8"))

server = smtplib.SMTP("smtp.gmail.com", 587)
server.starttls()
server.login(REMITENTE, PASSWORD)
server.sendmail(REMITENTE, DESTINATARIO, msg.as_string())
server.quit()
print("Correo enviado!")
