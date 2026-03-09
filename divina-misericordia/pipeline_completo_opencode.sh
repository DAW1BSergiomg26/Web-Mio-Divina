#!/bin/bash

echo "======================================="
echo "PIPELINE SEO + FRONTEND OPEN CODE"
echo "Proyecto: Divina Misericordia"
echo "======================================="

echo ""
echo "FASE 1 — AUDITORÍA FRONTEND"
opencode run "$(cat prompts/prompt01_auditoria.txt)"
read -p "Presiona ENTER para continuar..."

echo ""
echo "FASE 2 — LIMPIEZA CSS"
opencode run "$(cat prompts/prompt02_css.txt)"
read -p "Presiona ENTER para continuar..."

echo ""
echo "FASE 3 — CORRECCIÓN HTML"
opencode run "$(cat prompts/prompt03_html.txt)"
read -p "Presiona ENTER para continuar..."

echo ""
echo "FASE 4 — ACCESIBILIDAD"
opencode run "$(cat prompts/prompt04_accesibilidad.txt)"
read -p "Presiona ENTER para continuar..."

echo ""
echo "FASE 5 — ANIMACIONES Y RENDIMIENTO"
opencode run "$(cat prompts/prompt05_animaciones.txt)"
read -p "Revisa la web en http://localhost:3001 y presiona ENTER..."

echo ""
echo "FASE 6 — SUPER AUDITOR FRONTEND"
opencode run "$(cat prompts/prompt06_super_auditor.txt)"
read -p "Presiona ENTER para continuar..."

echo ""
echo "FASE 7 — METADATOS SEO"
opencode run "$(cat prompts/prompt07_seo_metadatos.txt)"
read -p "Presiona ENTER para continuar..."

echo ""
echo "FASE 8 — GENERAR SITEMAP"
opencode run "$(cat prompts/prompt08_sitemap.txt)"
read -p "Presiona ENTER para continuar..."

echo ""
echo "FASE 9 — AUDITORÍA SEO TÉCNICA"
opencode run "$(cat prompts/prompt09_seo_tecnico.txt)"
read -p "Presiona ENTER para continuar..."

echo ""
echo "FASE 10 — ROBOTS.TXT"
opencode run "$(cat prompts/prompt10_robots.txt)"
read -p "Presiona ENTER para continuar..."

echo ""
echo "FASE 11 — SCHEMA ORG"
opencode run "$(cat prompts/prompt11_schema.txt)"
read -p "Presiona ENTER para continuar..."

echo ""
echo "FASE 12 — CORE WEB VITALS"
opencode run "$(cat prompts/prompt12_core_web_vitals.txt)"
read -p "Presiona ENTER para continuar..."

echo ""
echo "FASE 13 — ENLACES INTERNOS"
opencode run "$(cat prompts/prompt13_enlaces_internos.txt)"
read -p "Presiona ENTER para continuar..."

echo ""
echo "FASE 14 — AUDITORÍA SEO COMPLETA"
opencode run "$(cat prompts/prompt14_auditoria_seo.txt)"
read -p "Presiona ENTER para continuar..."

echo ""
echo "FASE 15 — ESTRUCTURA SEO"
opencode run "$(cat prompts/prompt15_estructura_seo.txt)"
read -p "Presiona ENTER para continuar..."

echo ""
echo "FASE 16 — KEYWORDS"
opencode run "$(cat prompts/prompt16_keywords.txt)"
read -p "Presiona ENTER para continuar..."

echo ""
echo "FASE 17 — BLOG SEO"
opencode run "$(cat prompts/prompt17_blog_seo.txt)"
read -p "Presiona ENTER para continuar..."

echo ""
echo "FASE 18 — CONTENIDO CATÓLICO"
opencode run "$(cat prompts/prompt18_contenido_catolico.txt)"
read -p "Presiona ENTER para continuar..."

echo ""
echo "FASE 19 — ORACIONES SEO"
opencode run "$(cat prompts/prompt19_oraciones_seo.txt)"
read -p "Presiona ENTER para continuar..."

echo ""
echo "FASE 20 — INFORME FINAL"
opencode run "$(cat prompts/prompt20_informe_final.txt)"
read -p "Presiona ENTER para continuar..."

echo ""
echo "FASE 21 — ARQUITECTO DIVINA MISERICORDIA"
opencode run "$(cat prompts/prompt21_arquitecto_divina.txt)"

echo ""
echo "======================================="
echo "PIPELINE COMPLETADO"
echo "Revisa los resultados en tu proyecto."
echo "======================================="
