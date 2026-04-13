$archivos = Get-ChildItem "public\*.html"
foreach ($archivo in $archivos) {
    $contenido = [System.IO.File]::ReadAllText($archivo.FullName)
    $contenido = $contenido.Replace('title="Adorar al SantÃ­simo">âœœ</a>', 'title="Adorar al Santísimo">✝</a>')
    [System.IO.File]::WriteAllText($archivo.FullName, $contenido)
    Write-Host "Corregido: $($archivo.Name)"
}
Write-Host "Listo!"