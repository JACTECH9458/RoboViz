import subprocess
import sys

# Função para instalar pacotes com pip
def install(package):
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', package])

# Lista de pacotes que precisamos verificar e instalar
packages = ['fastapi', 'uvicorn', 'httpx', 'statbotics']

# Verificar e instalar dependências
missing_packages = []

for package in packages:
    try:
        __import__(package)
    except ImportError:
        print(f"{package} não está instalado. Adicionando à lista de instalação.")
        missing_packages.append(package)

# Instalar todos os pacotes ausentes de uma vez
if missing_packages:
    print("Instalando pacotes ausentes...")
    for package in missing_packages:
        install(package)

print("Todas as dependências estão instaladas.")
