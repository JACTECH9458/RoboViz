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
