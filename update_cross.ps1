$files = Get-ChildItem "C:\Users\astur\Desktop\Web Mio Divina\divina-misericordia\public\*.html"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $newContent = $content -replace '<div class="cross-glow">\+</div>', '<a href="el-altar.html" class="cross-glow" title="Adorar al Santísimo">✝</a>'
    Set-Content $file.FullName -Value $newContent -NoNewline
}
Write-Host "Done updating" $files.Count "files"
