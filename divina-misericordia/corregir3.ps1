$archivos = Get-ChildItem "public\*.html"
foreach ($archivo in $archivos) {
    $bytes = [System.IO.File]::ReadAllBytes($archivo.FullName)
    $contenido = [System.Text.Encoding]::UTF8.GetString($bytes)
    
    # Reemplazar la secuencia específica de bytes
    # âœœ = E2 9C 9D en UTF-8
    # Ã­simo = C3 AD 73 69 6D 6F
    $contenido = $contenido.Replace([char]0x00E2.ToString() + [char]0x009C.ToString() + [char]0x009D.ToString(), [char]0x2718.ToString())
    $contenido = $contenido.Replace("title=""Adorar al Sant", 'title="Adorar al Sant')
    $contenido = $contenido.Replace("simo"">âœœ</a>", "simo"">✝</a>")
    
    [System.IO.File]::WriteAllText($archivo.FullName, $contenido)
}
Write-Host "Listo"