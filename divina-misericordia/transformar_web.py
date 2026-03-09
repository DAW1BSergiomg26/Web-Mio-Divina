#!/usr/bin/env python3
# ═══════════════════════════════════════════════════════════════════════
#  TRANSFORMADOR MAESTRO — DIVINA MISERICORDIA
#  Lee TODOS los .html existentes y los reconstruye con el diseño del
#  index.html: mismo fondo, header, footer, tipografía, animaciones.
#
#  Cómo ejecutar desde WSL:
#    python3 transformar_web.py
#  O directamente en Windows (Python instalado):
#    python transformar_web.py
# ═══════════════════════════════════════════════════════════════════════

import os, re, sys, shutil
from datetime import datetime
from html.parser import HTMLParser

# ── RUTAS ───────────────────────────────────────────────────────────────
# Ruta WSL (Linux/Ubuntu)
PUBLIC_WSL     = "/mnt/c/Users/astur/Desktop/Web Mio Divina/divina-misericordia/public"
# Ruta Windows nativa (si se ejecuta con Python de Windows)
PUBLIC_WIN     = r"C:\Users\astur\Desktop\Web Mio Divina\divina-misericordia\public"

PUBLIC_DIR = PUBLIC_WSL if os.path.exists(PUBLIC_WSL) else PUBLIC_WIN
BACKUP_DIR = os.path.join(PUBLIC_DIR, "backups",
                          f"backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}")

# ── ARCHIVOS QUE NO SE TOCAN ────────────────────────────────────────────
SKIP_FILES = {"index.html", "robots.txt", "sitemap.xml", "prompt.txt",
              "Mio", "Web", "*.html.bak", "DIVINA_CONTROL_PANEL.sh"}

# ── PALETA Y DATOS DE CADA PÁGINA ──────────────────────────────────────
PAGE_DATA = {
    "coronilla.html":            ("📿", "Coronilla",           "Oración revelada por Jesús",          "La oración más poderosa de la Divina Misericordia."),
    "novena.html":               ("🕯️", "Novena",              "9 Días de Gracia",                     "Nueve días de oración íntima con el Señor Jesucristo."),
    "oraciones.html":            ("🙏", "Oraciones",           "Tesoro de Plegarias",                  "Oraciones y jaculatorias para cada momento del día."),
    "santa-faustina.html":       ("✨", "Santa Faustina",      "Secretaria de la Misericordia",        "La humilde polaca que recibió el mensaje para el mundo."),
    "introduccion.html":         ("📖", "Introducción",        "Bienvenida al Portal",                 "El mensaje de esperanza más grande de la humanidad."),
    "via-crucis.html":           ("✝",  "Vía Crucis",          "Camino de la Cruz",                    "Recorre el camino del amor de Jesús hasta el Calvario."),
    "obras-de-misericordia.html":("❤️", "Obras de Misericordia","Misericordia en Acción",              "Catorce obras corporales y espirituales para vivir la fe."),
    "hora-de-la-misericordia.html":("⏰","Hora de la Misericordia","Las 3 de la Tarde",               "A las tres de la tarde murió Jesús por nosotros."),
    "lecturas-recomendadas.html":("📚", "Lecturas",            "Biblioteca Sagrada",                   "Textos del Diario de Santa Faustina y documentos pontificios."),
    "maria.html":                ("💙", "La Virgen María",     "Madre de la Misericordia",             "Ella es el primer fruto perfecto de la Divina Misericordia."),
    "consagracion.html":         ("⚜️", "Consagración",       "Entrega Total",                        "Entrégate completamente a la Divina Misericordia de Jesús."),
    "los-rayos.html":            ("🔴", "Los Rayos",           "Rojo y Blanco",                        "El significado de los dos rayos que brotan del Corazón de Jesús."),
    "espacio-jovenes.html":      ("🌟", "Espacio Jóvenes",     "Fe Joven",                             "La misericordia es para ti, ahora, en la mejor época de tu vida."),
    "galeria.html":              ("🖼️", "Galería",             "Imágenes Sagradas",                   "La belleza al servicio de la contemplación de Dios."),
    "testimonios.html":          ("❤️", "Testimonios",         "Vidas Transformadas",                  "La misericordia no es teoría: es una experiencia que cambia vidas."),
    "quienes-somos.html":        ("🎯", "Quiénes Somos",       "Nuestra Misión",                       "Un portal nacido del amor a Dios para llevar su mensaje al mundo."),
    "contacto.html":             ("✉️", "Contacto",            "Escríbenos",                          "Estamos aquí para escucharte y orar contigo."),
    "lugares-de-culto.html":     ("⛪", "Lugares de Culto",    "Santuarios del Mundo",                 "Rincones del planeta donde la misericordia se hace tangible."),
    "noticias.html":             ("🗓️", "Noticias",            "Actualidad de la Fe",                 "Lo que la misericordia de Dios sigue obrando en el mundo hoy."),
    "enlaces.html":              ("🌐", "Enlaces",             "Recursos Externos",                    "Las mejores fuentes en internet sobre la Divina Misericordia."),
    "ss-juan-pablo-ii.html":     ("🕊️", "San Juan Pablo II",  "Papa de la Misericordia",              "El pontífice que canonizó a Santa Faustina y proclamó la Fiesta."),
    "ss-benedicto-xvi.html":     ("✝",  "Benedicto XVI",       "Pontífice Teólogo",                   "El Papa teólogo que continuó el legado de la misericordia."),
    "ss-francisco.html":         ("🌿", "Papa Francisco",      "El Papa de los Pobres",                "La misericordia como eje central de su pontificado."),
    "ss-leon-xiv.html":          ("⚜️", "Papa León XIV",      "Pontífice",                            "Continuador del mensaje de la Divina Misericordia en el siglo XXI."),
    "santa-faustina.html":       ("🌹", "Santa Faustina",      "Apóstol de la Misericordia",           "Su vida, misión y los mensajes que transformaron la espiritualidad."),
}

DEFAULT_DATA = ("✦", "Divina Misericordia", "Portal Sagrado", "Jesús, en Ti confío.")

# ═══════════════════════════════════════════════════════════════════════
#  CSS COMPLETO DEL SISTEMA DE DISEÑO
# ═══════════════════════════════════════════════════════════════════════
DESIGN_CSS = """
/* ═══════ VARIABLES ═══════ */
:root {
  --gold:        #c8960c;
  --gold-light:  #f0c040;
  --gold-pale:   #fdf3d0;
  --crimson:     #8b1a1a;
  --blue-deep:   #0a1628;
  --blue-mid:    #0d2348;
  --blue-royal:  #1a3a6e;
  --white-warm:  #faf7f0;
  --ray-red:     rgba(180,30,30,0.7);
  --ray-white:   rgba(255,245,220,0.8);
  --shadow-gold: 0 0 40px rgba(200,150,12,0.4);
  --shadow-deep: 0 20px 60px rgba(0,0,0,0.5);
}
/* ═══════ RESET ═══════ */
*, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
html { scroll-behavior:smooth; font-size:16px; }
body {
  font-family:'EB Garamond',Georgia,serif;
  background:var(--blue-deep);
  color:var(--white-warm);
  overflow-x:hidden;
  cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Crect x='11' y='0' width='2' height='24' fill='%23c8960c'/%3E%3Crect x='0' y='9' width='24' height='2' fill='%23c8960c'/%3E%3C/svg%3E") 12 12, crosshair;
}
/* ═══════ FONDO SAGRADO ═══════ */
.divine-bg {
  position:fixed; inset:0; z-index:0; overflow:hidden;
  background:radial-gradient(ellipse at 50% 20%,#1a3a6e 0%,#0d2348 40%,#0a1628 100%);
}
.ray {
  position:absolute; bottom:0; left:50%;
  transform-origin:bottom center;
  opacity:0;
  animation:rayPulse 8s ease-in-out infinite;
}
.ray-red   { width:3px; height:70vh; background:linear-gradient(to top,transparent,var(--ray-red));   filter:blur(2px); }
.ray-white { width:4px; height:65vh; background:linear-gradient(to top,transparent,var(--ray-white)); filter:blur(3px); }
@keyframes rayPulse {
  0%,100% { opacity:0; transform:translateX(-50%) scaleY(0.8); }
  50%     { opacity:1; transform:translateX(-50%) scaleY(1); }
}
.stars {
  position:absolute; inset:0;
  background-image:
    radial-gradient(1px 1px at 10% 15%,rgba(255,245,210,.9),transparent),
    radial-gradient(1px 1px at 25% 55%,rgba(255,245,210,.7),transparent),
    radial-gradient(2px 2px at 45% 10%,rgba(255,245,210,.8),transparent),
    radial-gradient(1px 1px at 65% 40%,rgba(255,245,210,.6),transparent),
    radial-gradient(1px 1px at 80% 70%,rgba(255,245,210,.5),transparent),
    radial-gradient(2px 2px at 92% 20%,rgba(255,245,210,.9),transparent),
    radial-gradient(1px 1px at 35% 80%,rgba(255,245,210,.6),transparent),
    radial-gradient(1px 1px at 58% 65%,rgba(255,245,210,.5),transparent),
    radial-gradient(1px 1px at 72% 30%,rgba(255,245,210,.7),transparent),
    radial-gradient(2px 2px at 18% 88%,rgba(255,245,210,.4),transparent);
  animation:twinkle 6s ease-in-out infinite alternate;
}
@keyframes twinkle { 0%{opacity:.5} 100%{opacity:1} }
/* ═══════ CONTENIDO ═══════ */
.content { position:relative; z-index:10; }
/* ═══════ BARRA SCROLL ═══════ */
.prayer-progress {
  height:2px; background:rgba(200,150,12,.2);
  position:fixed; top:0; left:0; z-index:200;
  transition:width .1s ease; pointer-events:none;
}
/* ═══════ HEADER ═══════ */
header {
  position:fixed; top:0; left:0; right:0; z-index:100;
  padding:1rem 3rem;
  display:flex; align-items:center; justify-content:space-between;
  background:linear-gradient(to bottom,rgba(10,22,40,.95),transparent);
  backdrop-filter:blur(10px);
  border-bottom:1px solid rgba(200,150,12,.2);
  transition:all .4s ease;
}
header.scrolled {
  background:rgba(10,22,40,.98);
  border-bottom-color:rgba(200,150,12,.5);
  box-shadow:0 4px 30px rgba(0,0,0,.4);
}
.logo {
  font-family:'Cinzel Decorative',serif;
  font-size:1.1rem; color:var(--gold-light);
  text-shadow:0 0 20px rgba(200,150,12,.5);
  letter-spacing:.05em; text-decoration:none;
  white-space:nowrap;
}
.logo span { color:var(--white-warm); font-weight:400; }
nav { display:flex; gap:.2rem; align-items:center; flex-wrap:wrap; }
nav a {
  font-family:'Cinzel',serif; font-size:.7rem;
  font-weight:500; letter-spacing:.08em; text-transform:uppercase;
  color:rgba(250,247,240,.7); text-decoration:none;
  padding:.45rem .75rem; border-radius:3px;
  transition:all .3s ease; border:1px solid transparent;
  white-space:nowrap;
}
nav a:hover, nav a.active {
  color:var(--gold-light);
  border-color:rgba(200,150,12,.35);
  background:rgba(200,150,12,.08);
  text-shadow:0 0 15px rgba(200,150,12,.4);
}
.nav-cta {
  background:linear-gradient(135deg,var(--gold),#a07010)!important;
  color:var(--blue-deep)!important;
  font-weight:700!important; border:none!important;
  padding:.45rem 1.1rem!important;
}
.nav-cta:hover {
  transform:translateY(-1px);
  box-shadow:0 4px 20px rgba(200,150,12,.5)!important;
}
.hamburger {
  display:none; flex-direction:column; gap:5px;
  cursor:pointer; padding:5px; background:none; border:none;
}
.hamburger span {
  display:block; width:25px; height:2px;
  background:var(--gold-light); border-radius:2px; transition:all .3s;
}
/* ═══════ HERO DE PÁGINA ═══════ */
.page-hero {
  min-height:42vh; display:flex; flex-direction:column;
  align-items:center; justify-content:center; text-align:center;
  padding:9rem 2rem 3.5rem; position:relative;
}
.page-hero-halo {
  position:absolute; top:50%; left:50%;
  transform:translate(-50%,-55%);
  width:420px; height:420px; border-radius:50%;
  background:radial-gradient(ellipse,rgba(200,150,12,.07) 0%,transparent 70%);
  animation:haloBreath 4s ease-in-out infinite;
  pointer-events:none;
}
@keyframes haloBreath {
  0%,100%{transform:translate(-50%,-55%) scale(1);opacity:.4}
  50%    {transform:translate(-50%,-55%) scale(1.12);opacity:1}
}
.page-badge {
  font-family:'Cinzel',serif; font-size:.68rem;
  letter-spacing:.3em; text-transform:uppercase;
  color:var(--gold); border:1px solid rgba(200,150,12,.4);
  padding:.35rem 1.3rem; border-radius:100px;
  margin-bottom:1.5rem; background:rgba(200,150,12,.05);
  animation:fadeInDown .8s ease .2s both;
}
.page-title {
  font-family:'Cinzel Decorative',serif;
  font-size:clamp(1.8rem,4.5vw,3.5rem);
  font-weight:900; line-height:1.15; margin-bottom:.8rem;
  background:linear-gradient(135deg,var(--white-warm) 0%,var(--gold-pale) 50%,var(--gold-light) 100%);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  filter:drop-shadow(0 0 25px rgba(200,150,12,.25));
  animation:fadeInDown .8s ease .4s both;
}
.page-subtitle {
  font-family:'EB Garamond',serif; font-style:italic;
  font-size:clamp(.95rem,1.6vw,1.2rem);
  color:rgba(253,243,208,.8); max-width:580px; line-height:1.9;
  animation:fadeInDown .8s ease .6s both;
}
/* ═══════ SEPARADOR ═══════ */
.divine-separator {
  display:flex; align-items:center; justify-content:center;
  gap:1.5rem; padding:1.8rem 0; opacity:.65;
}
.divine-separator::before,.divine-separator::after {
  content:''; flex:1; max-width:220px; height:1px;
  background:linear-gradient(to right,transparent,var(--gold),transparent);
}
.divine-separator .cross {
  font-size:1.3rem; color:var(--gold);
  filter:drop-shadow(0 0 8px rgba(200,150,12,.5));
}
/* ═══════ CONTENIDO PRINCIPAL ═══════ */
.page-content { max-width:920px; margin:0 auto; padding:2.5rem 2rem 5rem; }
/* ═══════ BLOQUES DE SECCIÓN ═══════ */
.section-block { margin-bottom:3rem; }
.section-label {
  font-family:'Cinzel',serif; font-size:.67rem;
  letter-spacing:.35em; text-transform:uppercase;
  color:var(--gold); margin-bottom:.6rem; display:block;
}
.section-title-lg {
  font-family:'Cinzel Decorative',serif;
  font-size:clamp(1.2rem,2.3vw,1.8rem);
  color:var(--white-warm); margin-bottom:1.1rem; font-weight:700;
}
.section-text { font-size:1.05rem; line-height:1.95; color:rgba(250,247,240,.82); }
.section-text p        { margin-bottom:1rem; }
.section-text strong   { color:var(--gold-light); font-weight:500; }
.section-text em       { color:rgba(253,243,208,.9); }
.section-text a        { color:var(--gold); text-decoration:none; border-bottom:1px solid rgba(200,150,12,.3); transition:all .2s; }
.section-text a:hover  { color:var(--gold-light); border-bottom-color:var(--gold); }
/* ═══════ CITA / QUOTE ═══════ */
.quote-block {
  background:linear-gradient(145deg,rgba(26,58,110,.35),rgba(10,22,40,.55));
  border:1px solid rgba(200,150,12,.2); border-left:3px solid var(--gold);
  border-radius:0 4px 4px 0; padding:2rem 2.5rem; margin:2rem 0; position:relative;
}
.quote-block::before {
  content:'"'; font-family:'Cinzel Decorative',serif; font-size:5rem;
  color:rgba(200,150,12,.12); position:absolute; top:-.6rem; left:.8rem; line-height:1;
}
.quote-text   { font-family:'EB Garamond',serif; font-style:italic; font-size:1.1rem; line-height:1.9; color:var(--white-warm); }
.quote-source { font-family:'Cinzel',serif; font-size:.7rem; letter-spacing:.15em; color:var(--gold); margin-top:.8rem; text-transform:uppercase; display:block; }
/* ═══════ CARDS INTERNAS ═══════ */
.inner-cards { display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:1.2rem; margin:2rem 0; }
.inner-card {
  background:linear-gradient(145deg,rgba(26,58,110,.35),rgba(10,22,40,.55));
  border:1px solid rgba(200,150,12,.15); border-radius:4px; padding:1.8rem 1.6rem;
  transition:all .3s ease;
}
.inner-card:hover {
  border-color:rgba(200,150,12,.4); transform:translateY(-4px);
  box-shadow:0 15px 40px rgba(0,0,0,.3);
}
.inner-card-icon  { font-size:2rem; margin-bottom:.9rem; display:block; }
.inner-card-title { font-family:'Cinzel',serif; font-size:.92rem; color:var(--gold-light); margin-bottom:.5rem; font-weight:600; }
.inner-card-text  { font-size:.9rem; line-height:1.7; color:rgba(250,247,240,.65); }
/* ═══════ LISTA DE PASOS ═══════ */
.step-list { list-style:none; padding:0; margin:1.5rem 0; }
.step-list li {
  display:flex; gap:1.2rem; align-items:flex-start;
  padding:1.1rem 0; border-bottom:1px solid rgba(200,150,12,.1);
}
.step-list li:last-child { border-bottom:none; }
.step-num { font-family:'Cinzel Decorative',serif; font-size:1.3rem; color:var(--gold); min-width:2rem; line-height:1.2; flex-shrink:0; }
.step-content h4 { font-family:'Cinzel',serif; font-size:.9rem; color:var(--gold-light); margin-bottom:.35rem; }
.step-content p  { font-size:.9rem; line-height:1.7; color:rgba(250,247,240,.7); }
/* ═══════ CAJA DE ORACIÓN ═══════ */
.prayer-box {
  background:linear-gradient(145deg,rgba(26,58,110,.3),rgba(10,22,40,.5));
  border:1px solid rgba(200,150,12,.25); border-radius:6px;
  padding:3rem 2.5rem; margin:2rem 0; text-align:center; position:relative;
}
.prayer-box::before,.prayer-box::after { content:'✦'; position:absolute; color:var(--gold); opacity:.4; font-size:.9rem; }
.prayer-box::before { top:1rem; left:1.5rem; }
.prayer-box::after  { bottom:1rem; right:1.5rem; }
.prayer-label  { font-family:'Cinzel',serif; font-size:.63rem; letter-spacing:.35em; color:var(--gold); text-transform:uppercase; margin-bottom:1.2rem; display:block; }
.prayer-text   { font-family:'EB Garamond',serif; font-style:italic; font-size:1.1rem; line-height:2; color:var(--white-warm); }
.prayer-strong { font-style:normal; color:var(--gold-light); font-weight:500; }
/* ═══════ LISTA ELEGANTE ═══════ */
.elegant-list { list-style:none; padding:0; }
.elegant-list li {
  padding:.85rem 0; border-bottom:1px solid rgba(200,150,12,.1);
  display:flex; align-items:flex-start; gap:1rem;
  font-size:1rem; line-height:1.7; color:rgba(250,247,240,.8);
}
.elegant-list li::before { content:'✦'; color:var(--gold); font-size:.65rem; margin-top:.35rem; flex-shrink:0; }
/* ═══════ BOTONES ═══════ */
.btn-primary {
  display:inline-block; font-family:'Cinzel',serif; font-size:.78rem;
  letter-spacing:.1em; text-transform:uppercase; font-weight:600;
  color:var(--blue-deep);
  background:linear-gradient(135deg,var(--gold-light),var(--gold));
  border:none; padding:.85rem 2rem; border-radius:3px; text-decoration:none;
  cursor:pointer; transition:all .3s ease;
  box-shadow:0 4px 20px rgba(200,150,12,.4);
}
.btn-primary:hover { transform:translateY(-3px); box-shadow:0 8px 35px rgba(200,150,12,.6); }
.btn-outline {
  display:inline-block; font-family:'Cinzel',serif; font-size:.78rem;
  letter-spacing:.1em; text-transform:uppercase; font-weight:500;
  color:var(--gold-light); background:transparent;
  border:1px solid rgba(200,150,12,.5); padding:.85rem 2rem;
  border-radius:3px; text-decoration:none; cursor:pointer; transition:all .3s ease;
}
.btn-outline:hover { background:rgba(200,150,12,.1); border-color:var(--gold); transform:translateY(-3px); }
.btn-group { display:flex; gap:1rem; flex-wrap:wrap; margin-top:2rem; }
/* ═══════ CONTENIDO LEGADO (heredado de versiones anteriores) ═══════ */
.legacy-content {
  font-size:1.02rem; line-height:1.95; color:rgba(250,247,240,.82);
}
.legacy-content h1,.legacy-content h2 {
  font-family:'Cinzel Decorative',serif;
  color:var(--gold-light); margin:2rem 0 1rem;
  font-size:clamp(1.2rem,2vw,1.7rem);
}
.legacy-content h3 {
  font-family:'Cinzel',serif; color:var(--gold);
  margin:1.5rem 0 .8rem; font-size:1rem; letter-spacing:.05em;
}
.legacy-content p       { margin-bottom:1rem; }
.legacy-content a       { color:var(--gold); text-decoration:none; border-bottom:1px solid rgba(200,150,12,.3); }
.legacy-content a:hover { color:var(--gold-light); }
.legacy-content ul,.legacy-content ol { margin:1rem 0 1rem 1.5rem; }
.legacy-content li      { margin-bottom:.5rem; line-height:1.7; }
.legacy-content blockquote {
  border-left:3px solid var(--gold); padding:1rem 1.5rem; margin:1.5rem 0;
  background:rgba(26,58,110,.2); font-style:italic; color:rgba(250,247,240,.85);
  border-radius:0 4px 4px 0;
}
.legacy-content table {
  width:100%; border-collapse:collapse; margin:1.5rem 0;
  font-size:.92rem;
}
.legacy-content th {
  font-family:'Cinzel',serif; font-size:.72rem; letter-spacing:.1em;
  text-transform:uppercase; color:var(--gold);
  padding:.7rem 1rem; border-bottom:1px solid rgba(200,150,12,.3);
  text-align:left;
}
.legacy-content td {
  padding:.7rem 1rem; border-bottom:1px solid rgba(200,150,12,.08);
  color:rgba(250,247,240,.75);
}
.legacy-content img {
  max-width:100%; border-radius:4px;
  border:1px solid rgba(200,150,12,.2);
  box-shadow:0 8px 30px rgba(0,0,0,.3);
}
.legacy-content strong { color:var(--gold-light); font-weight:500; }
.legacy-content em     { color:rgba(253,243,208,.9); }
/* ═══════ FOOTER ═══════ */
footer {
  background:rgba(5,10,20,.92); border-top:1px solid rgba(200,150,12,.2);
  padding:4rem 2rem 2rem; text-align:center;
}
.footer-cross {
  font-size:2.5rem; color:var(--gold);
  filter:drop-shadow(0 0 15px rgba(200,150,12,.4));
  margin-bottom:1.2rem; display:block;
  animation:goldPulse 4s ease-in-out infinite;
}
@keyframes goldPulse {
  0%,100%{ filter:drop-shadow(0 0 10px rgba(200,150,12,.4)) }
  50%    { filter:drop-shadow(0 0 25px rgba(200,150,12,.9)) }
}
.footer-motto { font-family:'Cinzel Decorative',serif; font-size:1.05rem; color:var(--gold-light); margin-bottom:.5rem; }
.footer-links { display:flex; flex-wrap:wrap; justify-content:center; gap:.4rem 1.3rem; margin:1.6rem 0; }
.footer-links a {
  font-family:'Cinzel',serif; font-size:.65rem; letter-spacing:.08em;
  color:rgba(250,247,240,.4); text-decoration:none; text-transform:uppercase;
  transition:color .3s;
}
.footer-links a:hover { color:var(--gold); }
.footer-bottom { font-size:.76rem; color:rgba(250,247,240,.22); margin-top:1.4rem; padding-top:1.4rem; border-top:1px solid rgba(200,150,12,.07); font-style:italic; }
/* ═══════ ANIMACIONES ═══════ */
@keyframes fadeInDown { from{opacity:0;transform:translateY(-25px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeInUp   { from{opacity:0;transform:translateY(25px)}  to{opacity:1;transform:translateY(0)} }
.reveal { opacity:0; transform:translateY(25px); transition:opacity .8s ease,transform .8s ease; }
.reveal.visible { opacity:1; transform:translateY(0); }
/* ═══════ RESPONSIVE ═══════ */
@media(max-width:900px){
  header { padding:1rem 1.5rem; }
  nav { display:none; }
  nav.open {
    display:flex; flex-direction:column; gap:.2rem;
    position:fixed; top:70px; inset-inline:0;
    background:rgba(10,22,40,.98); padding:1.5rem;
    border-bottom:1px solid rgba(200,150,12,.3); z-index:99;
  }
  .hamburger { display:flex; }
  .page-hero-halo { width:280px; height:280px; }
}
@media(max-width:600px){
  .prayer-box { padding:2rem 1.2rem; }
  .inner-cards { grid-template-columns:1fr; }
  .page-content { padding:2rem 1.2rem 4rem; }
  header { padding:.9rem 1rem; }
  .logo { font-size:.9rem; }
  nav a { font-size:.65rem; padding:.4rem .6rem; }
}
"""

# ═══════════════════════════════════════════════════════════════════════
#  HTML BASE COMPARTIDO
# ═══════════════════════════════════════════════════════════════════════

FONT_LINK = (
    '<link rel="preconnect" href="https://fonts.googleapis.com" />'
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />'
    '<link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative'
    ':wght@400;700;900&family=Cinzel:wght@400;500;600&family=EB+Garamond'
    ':ital,wght@0,400;0,500;1,400;1,500&display=swap" rel="stylesheet" />'
)

BG_HTML = """  <div class="divine-bg" aria-hidden="true">
    <div class="stars"></div>
    <div class="ray ray-red"   style="animation-delay:0s;transform:translateX(-50%) rotate(-20deg)"></div>
    <div class="ray ray-white" style="animation-delay:.6s;transform:translateX(-50%) rotate(-10deg)"></div>
    <div class="ray ray-red"   style="animation-delay:1.2s;transform:translateX(-50%) rotate(0deg)"></div>
    <div class="ray ray-white" style="animation-delay:1.8s;transform:translateX(-50%) rotate(10deg)"></div>
    <div class="ray ray-red"   style="animation-delay:2.4s;transform:translateX(-50%) rotate(20deg)"></div>
    <div class="ray ray-white" style="animation-delay:3s;transform:translateX(-50%) rotate(30deg)"></div>
    <div class="ray ray-red"   style="animation-delay:3.6s;transform:translateX(-50%) rotate(-30deg)"></div>
  </div>"""

def make_nav(active_file=""):
    items = [
        ("coronilla.html", "Coronilla"),
        ("novena.html", "Novena"),
        ("oraciones.html", "Oraciones"),
        ("lecturas-recomendadas.html", "Lecturas"),
        ("santa-faustina.html", "Sta. Faustina"),
        ("galeria.html", "Galería"),
    ]
    links = ""
    for href, label in items:
        cls = ' class="active"' if href == active_file else ""
        links += f'        <a href="{href}"{cls}>{label}</a>\n'
    return f"""  <header id="mainHeader">
    <a href="index.html" class="logo">Divina<span> Misericordia</span></a>
    <nav id="mainNav">
{links}        <a href="hora-de-la-misericordia.html" class="nav-cta">Hora de la Misericordia</a>
    </nav>
    <button class="hamburger" id="hamburger" aria-label="Menú" onclick="toggleMenu()">
      <span></span><span></span><span></span>
    </button>
  </header>"""

FOOTER_HTML = """  <footer>
    <span class="footer-cross">✝</span>
    <p class="footer-motto">Jesús, en Ti confío</p>
    <p style="font-size:.8rem;color:rgba(250,247,240,.32);margin-top:.4rem;font-style:italic;">
      "La misericordia de Dios es mayor que cualquier pecado del mundo"
    </p>
    <div class="footer-links">
      <a href="index.html">Inicio</a>
      <a href="introduccion.html">Introducción</a>
      <a href="coronilla.html">Coronilla</a>
      <a href="novena.html">Novena</a>
      <a href="oraciones.html">Oraciones</a>
      <a href="via-crucis.html">Vía Crucis</a>
      <a href="lecturas-recomendadas.html">Lecturas</a>
      <a href="obras-de-misericordia.html">Obras</a>
      <a href="santa-faustina.html">Santa Faustina</a>
      <a href="testimonios.html">Testimonios</a>
      <a href="galeria.html">Galería</a>
      <a href="lugares-de-culto.html">Lugares</a>
      <a href="espacio-jovenes.html">Jóvenes</a>
      <a href="contacto.html">Contacto</a>
      <a href="quienes-somos.html">Quiénes somos</a>
      <a href="maria.html">Virgen María</a>
      <a href="consagracion.html">Consagración</a>
      <a href="los-rayos.html">Los Rayos</a>
      <a href="noticias.html">Noticias</a>
      <a href="enlaces.html">Enlaces</a>
      <a href="ss-juan-pablo-ii.html">San JP II</a>
      <a href="ss-francisco.html">Francisco</a>
    </div>
    <p class="footer-bottom">
      © 2026 — Portal de la Divina Misericordia<br>
      Hecho con fe y código, para la gloria de Dios
    </p>
  </footer>"""

SHARED_JS = """
  <script>
    // ─ Barra de progreso ─
    const _sb = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
      if(!_sb) return;
      const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      _sb.style.width = pct + '%';
      _sb.style.background = `linear-gradient(to right,#c8960c,#f0c040 ${pct}%,transparent)`;
    });
    // ─ Header sticky ─
    const _hdr = document.getElementById('mainHeader');
    window.addEventListener('scroll', () => {
      if(_hdr) _hdr.classList.toggle('scrolled', window.scrollY > 80);
    });
    // ─ Scroll reveal ─
    const _revs = document.querySelectorAll('.reveal');
    if(_revs.length) {
      const _obs = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
          if(e.isIntersecting){ setTimeout(()=>e.target.classList.add('visible'), i*80); _obs.unobserve(e.target); }
        });
      }, { threshold:0.08, rootMargin:'0px 0px -40px 0px' });
      _revs.forEach(el => _obs.observe(el));
    }
    // ─ Menú hamburger ─
    function toggleMenu() {
      const n = document.getElementById('mainNav');
      if(n) n.classList.toggle('open');
    }
    document.querySelectorAll('#mainNav a').forEach(a => {
      a.addEventListener('click', () => {
        const n = document.getElementById('mainNav');
        if(n) n.classList.remove('open');
      });
    });
    // ─ Partículas doradas al click ─
    document.addEventListener('click', (e) => {
      for(let i = 0; i < 6; i++) {
        const s = document.createElement('div');
        s.style.cssText = `position:fixed;pointer-events:none;z-index:9999;`+
          `left:${e.clientX}px;top:${e.clientY}px;width:4px;height:4px;`+
          `border-radius:50%;background:#f0c040;box-shadow:0 0 6px #f0c040;`;
        document.body.appendChild(s);
        const angle=(i/6)*Math.PI*2, dist=28+Math.random()*28;
        s.animate([
          {transform:'translate(-50%,-50%) scale(1)',opacity:1},
          {transform:`translate(calc(-50% + ${Math.cos(angle)*dist}px),`+
            `calc(-50% + ${Math.sin(angle)*dist}px)) scale(0)`,opacity:0}
        ],{duration:580,easing:'ease-out',fill:'forwards'});
        setTimeout(()=>s.remove(),620);
      }
    });
  </script>"""

# ═══════════════════════════════════════════════════════════════════════
#  EXTRACTOR DE CONTENIDO HTML
# ═══════════════════════════════════════════════════════════════════════

class ContentExtractor(HTMLParser):
    """Extrae el contenido útil del body, eliminando header/nav/footer viejos."""
    def __init__(self):
        super().__init__()
        self.in_body      = False
        self.skip_tags    = {'script','style','head','html'}
        self.skip_stack   = []
        self.skip_ids     = {'mainHeader','mainNav','footer','divine-bg'}
        self.skip_classes = {'divine-bg','nav','header','footer','prayer-progress'}
        self.content      = []
        self.depth        = 0
        self.skip_depth   = None

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        tag_id  = attr_dict.get('id','')
        classes = attr_dict.get('class','').split()

        if tag == 'body':
            self.in_body = True
            return

        if not self.in_body:
            return

        # Saltar tags de diseño viejo
        should_skip = (
            tag in self.skip_tags or
            tag_id in self.skip_ids or
            any(c in self.skip_classes for c in classes) or
            (tag == 'header') or
            (tag == 'footer') or
            (tag == 'nav' and tag_id == 'mainNav')
        )

        if should_skip and self.skip_depth is None:
            self.skip_depth = self.depth
        
        self.depth += 1

        if self.skip_depth is not None:
            return

        # Reconstruir atributos
        attrs_str = ""
        for name, val in attrs:
            if val is None:
                attrs_str += f" {name}"
            else:
                attrs_str += f' {name}="{val}"'

        void_tags = {'area','base','br','col','embed','hr','img','input',
                     'link','meta','param','source','track','wbr'}
        if tag in void_tags:
            self.content.append(f"<{tag}{attrs_str}>")
        else:
            self.content.append(f"<{tag}{attrs_str}>")

    def handle_endtag(self, tag):
        if not self.in_body:
            return
        if tag == 'body':
            self.in_body = False
            return

        self.depth -= 1

        if self.skip_depth is not None and self.depth <= self.skip_depth:
            self.skip_depth = None
            return

        if self.skip_depth is not None:
            return

        void_tags = {'area','base','br','col','embed','hr','img','input',
                     'link','meta','param','source','track','wbr'}
        if tag not in void_tags:
            self.content.append(f"</{tag}>")

    def handle_data(self, data):
        if self.in_body and self.skip_depth is None:
            self.content.append(data)

    def handle_entityref(self, name):
        if self.in_body and self.skip_depth is None:
            self.content.append(f"&{name};")

    def handle_charref(self, name):
        if self.in_body and self.skip_depth is None:
            self.content.append(f"&#{name};")

    def get_content(self):
        return ''.join(self.content).strip()


def extract_title(html):
    """Extrae el <title> del HTML."""
    m = re.search(r'<title[^>]*>(.*?)</title>', html, re.IGNORECASE | re.DOTALL)
    if m:
        t = re.sub(r'[—\-–|]\s*(Divina Misericordia|Portal.*)?$', '', m.group(1), flags=re.IGNORECASE).strip()
        return t or m.group(1).strip()
    return ""

def extract_description(html):
    """Extrae el meta description."""
    m = re.search(r'<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']*)["\']', html, re.IGNORECASE)
    if not m:
        m = re.search(r'<meta[^>]*content=["\']([^"\']*)["\'][^>]*name=["\']description["\']', html, re.IGNORECASE)
    return m.group(1).strip() if m else ""


def is_empty_content(text):
    """¿El contenido heredado está vacío o es basura?"""
    clean = re.sub(r'<[^>]+>', '', text)
    clean = re.sub(r'\s+', ' ', clean).strip()
    return len(clean) < 30


# ═══════════════════════════════════════════════════════════════════════
#  CONSTRUCTOR DE PÁGINA COMPLETA
# ═══════════════════════════════════════════════════════════════════════

def build_transformed_page(filename, old_html):
    icon, short_title, badge, subtitle = PAGE_DATA.get(filename, DEFAULT_DATA)

    # Extraer metadatos del original
    orig_title = extract_title(old_html)
    orig_desc  = extract_description(old_html)
    final_title = orig_title or short_title
    final_desc  = orig_desc  or subtitle

    # Extraer contenido del body
    extractor = ContentExtractor()
    try:
        extractor.feed(old_html)
        body_content = extractor.get_content()
    except Exception:
        body_content = ""

    # Si el contenido es casi vacío, usar placeholder informativo
    if is_empty_content(body_content):
        body_content = f"""
    <div class="page-content">
      <div class="section-block reveal">
        <div class="section-text">
          <p>Esta sección está en preparación. Pronto encontrarás aquí contenido completo
          sobre <strong>{final_title}</strong>.</p>
        </div>
      </div>
      <div class="btn-group reveal">
        <a href="index.html" class="btn-outline">← Volver al Inicio</a>
      </div>
    </div>"""
    else:
        # Envolver contenido heredado en wrapper con estilo
        body_content = f'\n    <div class="page-content">\n      <div class="legacy-content reveal">\n        {body_content}\n      </div>\n    </div>'

    # Reloj especial para hora-de-la-misericordia.html
    extra_script = ""
    if filename == "hora-de-la-misericordia.html":
        extra_script = """
  <script>
    function _updateHora(){
      const n=new Date();
      const el=document.getElementById('_hora_live');
      if(!el)return;
      el.textContent=String(n.getHours()).padStart(2,'0')+':'+
                     String(n.getMinutes()).padStart(2,'0')+':'+
                     String(n.getSeconds()).padStart(2,'0');
      if(n.getHours()===15&&n.getMinutes()===0){
        el.style.color='#f0c040';
        el.style.filter='drop-shadow(0 0 40px rgba(200,150,12,.9))';
      }
    }
    setInterval(_updateHora,1000); _updateHora();
  </script>"""

    return f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{final_title} — Divina Misericordia</title>
  <meta name="description" content="{final_desc}" />
  {FONT_LINK}
  <style>{DESIGN_CSS}</style>
</head>
<body>
  <!-- ─ Barra progreso scroll ─ -->
  <div class="prayer-progress" id="scrollProgress"></div>

  <!-- ─ Fondo sagrado animado ─ -->
{BG_HTML}

  <!-- ─ Contenido ─ -->
  <div class="content">

{make_nav(filename)}

    <!-- ─ Hero de página ─ -->
    <section class="page-hero">
      <div class="page-hero-halo" aria-hidden="true"></div>
      <div class="page-badge">✦ {badge} ✦</div>
      <h1 class="page-title">{final_title}</h1>
      <p class="page-subtitle">{subtitle}</p>
    </section>

    <div style="max-width:700px;margin:0 auto;padding:0 2rem;">
      <div class="divine-separator reveal"><span class="cross">✦</span></div>
    </div>

{body_content}

{FOOTER_HTML}

  </div><!-- /content -->
{SHARED_JS}{extra_script}
</body>
</html>"""


# ═══════════════════════════════════════════════════════════════════════
#  PROCESO PRINCIPAL
# ═══════════════════════════════════════════════════════════════════════

def main():
    print()
    print("═" * 65)
    print("  ✨ TRANSFORMADOR MAESTRO — DIVINA MISERICORDIA")
    print(f"  📁 Carpeta: {PUBLIC_DIR}")
    print("═" * 65)

    if not os.path.isdir(PUBLIC_DIR):
        print(f"\n  ❌  ERROR: No se encuentra la carpeta:")
        print(f"      {PUBLIC_DIR}")
        print("\n  💡 Asegúrate de ejecutar este script desde WSL.")
        sys.exit(1)

    # Listar HTMLs (excepto index.html y archivos a saltar)
    all_files = [
        f for f in os.listdir(PUBLIC_DIR)
        if f.endswith('.html') and f not in SKIP_FILES
    ]
    all_files.sort()

    if not all_files:
        print("  ⚠️  No se encontraron archivos HTML para transformar.")
        sys.exit(0)

    print(f"\n  📋 Archivos encontrados: {len(all_files)}")
    print()

    # Crear backup
    os.makedirs(BACKUP_DIR, exist_ok=True)
    print(f"  💾 Backup en: {BACKUP_DIR}")
    print()

    ok = 0
    errors = []

    for filename in all_files:
        src = os.path.join(PUBLIC_DIR, filename)
        bak = os.path.join(BACKUP_DIR, filename)

        try:
            # Leer original
            with open(src, 'r', encoding='utf-8', errors='replace') as f:
                old_html = f.read()

            # Backup
            shutil.copy2(src, bak)

            # Transformar
            new_html = build_transformed_page(filename, old_html)

            # Guardar
            with open(src, 'w', encoding='utf-8') as f:
                f.write(new_html)

            size_kb = len(new_html) / 1024
            print(f"  ✅  {filename:<42} ({size_kb:.1f} KB)")
            ok += 1

        except Exception as e:
            print(f"  ❌  {filename:<42} ERROR: {e}")
            errors.append((filename, str(e)))

    print()
    print("═" * 65)
    print(f"  ✨ Transformadas: {ok} páginas")
    if errors:
        print(f"  ⚠️  Con errores:  {len(errors)}")
        for fn, err in errors:
            print(f"      • {fn}: {err}")
    print(f"  💾 Backups en:   backups/")
    print()
    print("  🌐 Abre index.html en tu navegador para ver el resultado.")
    print("═" * 65)
    print()


if __name__ == "__main__":
    main()
