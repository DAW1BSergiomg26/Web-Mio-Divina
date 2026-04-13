import os
from bs4 import BeautifulSoup

def fix_seo_issues(public_dir="public"):
    print("🛠 Iniciando corrección automática de SEO...")
    
    for root, _, files in os.walk(public_dir):
        for file in files:
            if file.endswith(".html"):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                    soup = BeautifulSoup(f, 'html.parser')
                
                changed = False
                
                # 1. Asegurar Título
                if not soup.title:
                    title = soup.new_tag('title')
                    title.string = file.replace('.html', '').replace('-', ' ').title() + " | Divina Misericordia"
                    if soup.head:
                        soup.head.insert(0, title)
                        changed = True
                
                # 2. Asegurar Meta Descripción
                if not soup.find('meta', attrs={'name': 'description'}):
                    meta = soup.new_tag('meta', attrs={'name': 'description', 'content': f"Portal oficial sobre {file.replace('.html', '').replace('-', ' ')}. Divina Misericordia, Jesús en vos confío."})
                    if soup.head:
                        soup.head.append(meta)
                        changed = True
                
                # 3. Asegurar H1
                if not soup.find('h1'):
                    h1 = soup.new_tag('h1')
                    h1.string = file.replace('.html', '').replace('-', ' ').title()
                    if soup.body:
                        soup.body.insert(0, h1)
                        changed = True
                
                if changed:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(str(soup))
                    print(f"✅ SEO optimizado: {path}")

if __name__ == "__main__":
    fix_seo_issues()
    print("✅ Todas las páginas han sido corregidas con estructura SEO básica.")
