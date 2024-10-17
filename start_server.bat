@echo off
echo Iniciando o gerenciamento de dependências...

REM Chama o script Python para gerenciar as dependências
python manage_dependencies.py

REM Verifica se o servidor foi iniciado
IF ERRORLEVEL 1 (
    echo Falha ao iniciar o servidor. Verifique as dependências.
    pause
    exit /b
)

REM Navegar para o diretório onde o proxy.py está localizado
cd /d "%~dp0resources\app"

REM Iniciar o servidor FastAPI
echo Iniciando o servidor FastAPI...
start "" python -m uvicorn proxy:app --host 127.0.0.1 --port 8000
