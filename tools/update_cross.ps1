$htmlFiles = Get-ChildItem -Path "public" -Filter "*.html" -Recurse
$count = 0

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    if ($content -cmatch '<(div|span)\s+class="cross-glow">\+</(div|span)>') {
        $newContent = $content -creplace '<(div|span)\s+class="cross-glow">\+</(div|span)>', '<a href="el-altar.html" class="cross-glow" title="Adorar al Santísimo">✝</a>'
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
        Write-Host "Updated: $($file.Name)" -ForegroundColor Green
        $count++
    }
}

Write-Host "`nTotal files updated: $count" -ForegroundColor Cyan
