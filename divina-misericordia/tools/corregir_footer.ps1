$files = Get-ChildItem -Path "public" -Filter "*.html"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # Buscar y reemplazar el patrón específico
    $oldPattern = 'title="Adorar al SantÃ­simo">âœœ</a>'
    $newContent = 'title="Adorar al Santísimo">✝</a>'
    
    if ($content -match [regex]::Escape($oldPattern)) {
        $content = $content -replace $oldPattern, $newContent
        Set-Content $file.FullName $content -NoNewline -Encoding UTF8
        Write-Host "Corregido: $($file.Name)"
    }
}

Write-Host "¡Listo!"