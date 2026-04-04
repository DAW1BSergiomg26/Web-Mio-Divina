$htmlFiles = Get-ChildItem -Path "public" -Filter "*.html" -Recurse
$countNav = 0
$countFooter = 0

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $newContent = $content
    $modified = $false
    
    # Fix broken insertions (remove malformed ones)
    if ($newContent -match '`n\s*<a href="el-altar\.html"') {
        $newContent = $newContent -replace '`n\s*<a href="el-altar\.html"[^>]*>âœ¢ El Altar</a>', ''
        $modified = $true
    }
    if ($newContent -match '`n\s*<a href="el-altar\.html"') {
        $newContent = $newContent -replace '`n\s*<a href="el-altar\.html"[^>]*>✝ El Altar</a>', ''
        $modified = $true
    }
    
    # Add to navigation (after musica-sacra link)
    if ($newContent -notmatch 'href="el-altar\.html"[^>]*>.*El Altar</a>' -or $newContent -match '>El Altar</a>[^<]*<a href="noticias') {
        if ($newContent -match 'href="musica-sacra\.html"[^>]*>(Música Divina|Música Sacra)</a>') {
            $newContent = $newContent -replace '(href="musica-sacra\.html"[^>]*>(?:Música Divina|Música Sacra)</a>)', '$1' + "`n" + '    <a href="el-altar.html" class="el-altar-btn">✝ El Altar</a>'
            $modified = $true
            $countNav++
        }
    }
    
    # Add to footer-menu (after lugares-de-culto or noticias)
    if ($newContent -match '<div class="footer-menu-links">') {
        if ($newContent -notmatch 'href="el-altar\.html"[^>]*>✝ El Altar</a>') {
            # Try to add after lugares-de-culto or noticias or first link
            if ($newContent -match 'href="lugares-de-culto\.html"[^>]*>([^<]+)</a>') {
                $newContent = $newContent -replace '(href="lugares-de-culto\.html"[^>]*>([^<]+)</a>)', '$1' + "`n" + '    <a href="el-altar.html" class="el-altar-btn">✝ El Altar</a>'
                $modified = $true
                $countFooter++
            }
            elseif ($newContent -match 'href="noticias\.html"[^>]*>([^<]+)</a>') {
                $newContent = $newContent -replace '(href="noticias\.html"[^>]*>([^<]+)</a>)', '$1' + "`n" + '    <a href="el-altar.html" class="el-altar-btn">✝ El Altar</a>'
                $modified = $true
                $countFooter++
            }
        }
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
        Write-Host "Updated: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`nNav links added: $countNav" -ForegroundColor Cyan
Write-Host "Footer links added: $countFooter" -ForegroundColor Cyan
