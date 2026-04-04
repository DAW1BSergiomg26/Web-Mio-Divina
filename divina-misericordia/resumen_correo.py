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

Mensaje: Crucifix clickable en todas las páginas + navegación en altar
Rama: main
Rama de recuperación: El-Altar-Divino
URL GitHub: https://github.com/DAW1BSergiomg26/Web-Mio-Divina

────────────────────────────────────────────────────────────────--
🎯 CAMBIOS REALIZADOS
────────────────────────────────────────────────────────────────--

1. 🔧 CRUCIFIX CLICKABLE EN TODAS LAS PÁGINAS (52 archivos)
   
   ANTES:
   - El crucifijo en el footer era un elemento <div> no clickable
   - Mostraba "+" como contenido
   - No tenía ningún enlace

   DESPUÉS:
   - Ahora es un elemento <a> clickable que enlaza a el-altar.html
   - Muestra el símbolo ✝ (cruz)
   - Tiene atributo title="Adorar al Santísimo"
   - Animación de heartbeat (pulso cardiaco)
   - Efecto hover con escala 1.15 y brillo intensificado

   Archivos actualizados (52):
   - consagracion.html, contacto.html, coronilla.html, cruz-del-perdon.html
   - devociones-marianas.html, divino-nino-jesus.html, enlaces.html
   - espacio-jovenes.html, galeria.html, hora-de-la-misericordia.html
   - introduccion.html, la-santina.html, lecturas-recomendadas.html
   - los-rayos.html, lugares-de-culto.html, maria-auxiliadora.html
   - maria.html, medalla-milagrosa.html, misterios-de-gloria.html
   - misterios-dolorosos.html, misterios-gozosos.html, misterios-luminosos.html
   - musica-sacra.html, noticias.html, novena.html, obras-de-misericordia.html
   - oracion-del-estudiante.html, oracion-eucharistia.html
   - oracion-san-antonio.html, oracion-san-miguel.html
   - oracion-san-pancracio.html, oracion-santa-cruz.html, oraciones.html
   - otras-devociones.html, quienes-somos.html, san-benito.html
   - san-cayetano.html, san-francisco.html, san-jose-dormido.html
   - san-jose.html, san-judas-tadeo.html, san-sanson.html
   - santa-faustina.html, santa-francisca-romana.html, santo-rosario.html
   - ss-benedicto-xvi.html, ss-francisco.html, ss-juan-pablo-ii.html
   - ss-leon-xiv.html, via-crucis.html, virgen-caacupe.html, virgen-lujan.html

2. 🧭 BOTONES DE NAVEGACIÓN EN el-altar.html
   
   ANTES:
   - La página del Altar 3D no tenía navegación
   - No había forma de volver a otras páginas

   DESPUÉS:
   - Botón "Inicio" → ./index.html
   - Botón "Volver" → ./hora-de-la-misericordia.html
   - Botón "Siguiente" → ./musica-sacra.html

3. ✨ MEJORAS EN index.html
   
   - Crucifijo más grande (4.5rem vs 3.5rem)
   - Animación heartbeat a 1.2s
   - Efecto hover con scale(1.15) y brillo intensificado
   - Ya era clickable (enlazaba a el-altar.html)

4. 💾 RAMA DE RECUPERACIÓN CREADA
   
   - Nueva rama: "El-Altar-Divino"
   - Guarda el estado actual de la web
   - Para recuperar: git checkout El-Altar-Divino
   - URL: https://github.com/DAW1BSergiomg26/Web-Mio-Divina/tree/El-Altar-Divino

────────────────────────────────────────────────────────────────--
🌐 ENLACES IMPORTANTES
────────────────────────────────────────────────────────────────--

Web: http://localhost:3001
Altar 3D: http://localhost:3001/el-altar.html
GitHub principal: https://github.com/DAW1BSergiomg26/Web-Mio-Divina/tree/main
Rama recuperación: https://github.com/DAW1BSergiomg26/Web-Mio-Divina/tree/El-Altar-Divino

────────────────────────────────────────────────────────────────--
📝 NOTAS
────────────────────────────────────────────────────────────────--

- El servidor ahora corre en puerto 3001 (no 3002)
- Se eliminó el archivo santuario-divino.html (ya no necesario)
- Los cambios han sido probados y funcionan correctamente
- Para revertir cambios: git checkout El-Altar-Divino

═════════════════════════════════════════════════════════════════
        ASOCIACIÓN APÓSTOLES DE LA DIVINA MISERICORDIA
═════════════════════════════════════════════════════════════════
"""

msg = MIMEMultipart()
msg["From"] = REMITENTE
msg["To"] = DESTINATARIO
msg["Subject"] = f"Cambios web Divina Misericordia - {ahora}"
msg.attach(MIMEText(contenido, "plain", "utf-8"))

server = smtplib.SMTP("smtp.gmail.com", 587)
server.starttls()
server.login(REMITENTE, PASSWORD)
server.sendmail(REMITENTE, DESTINATARIO, msg.as_string())
server.quit()
print("Correo enviado!")
