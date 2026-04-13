$files = @(
    "public\virgen-caacupe.html",
    "public\via-crucis.html",
    "public\ss-leon-xiv.html",
    "public\ss-juan-pablo-ii.html",
    "public\ss-francisco.html",
    "public\ss-benedicto-xvi.html",
    "public\santo-rosario.html",
    "public\santa-francisca-romana.html",
    "public\santa-faustina.html",
    "public\san-sanson.html",
    "public\san-jose.html",
    "public\san-judas-tadeo.html",
    "public\san-jose-dormido.html",
    "public\san-cayetano.html",
    "public\san-francisco.html",
    "public\san-benito.html",
    "public\quienes-somos.html",
    "public\otras-devociones.html",
    "public\oraciones.html",
    "public\oracion-san-pancracio.html",
    "public\oracion-santa-cruz.html",
    "public\oracion-san-miguel.html",
    "public\oracion-san-antonio.html",
    "public\oracion-eucharistia.html",
    "public\oracion-del-estudiante.html",
    "public\obras-de-misericordia.html",
    "public\novena.html",
    "public\noticias.html",
    "public\musica-sacra.html",
    "public\misterios-luminosos.html",
    "public\misterios-gozosos.html",
    "public\misterios-dolorosos.html",
    "public\misterios-de-gloria.html",
    "public\medalla-milagrosa.html",
    "public\maria.html",
    "public\maria-auxiliadora.html",
    "public\lugares-de-culto.html",
    "public\los-rayos.html",
    "public\lecturas-recomendadas.html",
    "public\la-santina.html",
    "public\introduccion.html",
    "public\hora-de-la-misericordia.html",
    "public\galeria.html",
    "public\espacio-jovenes.html",
    "public\enlaces.html",
    "public\divino-nino-jesus.html",
    "public\devociones-marianas.html",
    "public\cruz-del-perdon.html",
    "public\coronilla.html",
    "public\contacto.html",
    "public\consagracion.html"
)

foreach ($file in $files) {
    $content = Get-Content $file -Raw -Encoding UTF8
    $content = $content -replace 'title="Adorar al SantÃ­simo">âœœ', 'title="Adorar al Santísimo">✝'
    $content = $content -replace 'title="Adorar al SantÃ­simo">[^<]*</a>', 'title="Adorar al Santísimo">✝</a>'
    Set-Content $file $content -NoNewline -Encoding UTF8
    Write-Host "Corregido: $file"
}

Write-Host "¡Todos los archivos corregidos!"