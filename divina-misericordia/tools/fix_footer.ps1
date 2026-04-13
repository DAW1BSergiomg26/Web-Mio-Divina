Get-ChildItem -Path "public" -Filter "*.html" | ForEach-Object {
    $content = Get-Content $_.FullName -Encoding UTF8 -Raw
    # Reemplazar los caracteres incorrectos por los correctos
    $fixed = $content -replace 'title="Adorar al SantÃ­simo">âœœ', 'title="Adorar al Santísimo">✝'
    [System.IO.File]::WriteAllText($_.FullName, $fixed, [System.Text.Encoding]::UTF8)
    Write-Host "Corregido: $($_.Name)"
}
Write-Host "¡Completado!"