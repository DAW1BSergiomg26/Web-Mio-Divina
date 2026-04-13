import os
from bs4 import BeautifulSoup

def audit_seo(public_dir="public"):
    report = []
    
    for root, _, files in os.walk(public_dir):
        for file in files:
            if file.endswith(".html") and file != "pwa-init.html":
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                    soup = BeautifulSoup(f, 'html.parser')
                
                # Análisis
                title = soup.title.string if soup.title else None
                desc = soup.find('meta', attrs={'name': 'description'})
                desc_content = desc['content'] if desc and 'content' in desc.attrs else None
                h1s = soup.find_all('h1')
                
                issues = []
                if not title: issues.append("Falta <title>")
                if not desc_content: issues.append("Falta <meta description>")
                if len(h1s) == 0: issues.append("Falta <h1>")
                elif len(h1s) > 1: issues.append(f"Múltiples <h1> ({len(h1s)})")
                
                if issues:
                    report.append(f"Archivo: {path}")
                    for issue in issues:
                        report.append(f"  - {issue}")
    
    # Escribir reporte
    os.makedirs("reports", exist_ok=True)
    with open("reports/seo_audit.txt", "w", encoding="utf-8") as r:
        r.write("\n".join(report))
    print("✅ Auditoría SEO completada. Reporte en: reports/seo_audit.txt")

if __name__ == "__main__":
    audit_seo()
