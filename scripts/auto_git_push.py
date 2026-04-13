
import os
import subprocess

def auto_push():
    # 1. Añadir cambios
    os.system("git add .")
    
    # 2. Commit automático
    commit_message = "Auto-commit: Actualización de cambios"
    os.system(f'git commit -m "{commit_message}"')
    
    # 3. Subir a GitHub
    os.system("git push origin main")
    print("Cambios subidos a GitHub. Netlify detectará el cambio y se desplegará automáticamente.")

if __name__ == "__main__":
    auto_push()
