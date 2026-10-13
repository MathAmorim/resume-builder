@echo off
title Resume Builder Server
cd /d "%~dp0"

echo ========================================================
echo   Resume Builder - Inicializador Automatico
echo ========================================================

:: Verifica se o Node.js esta instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
  echo [ERRO] Node.js nao foi encontrado no sistema.
  echo Por favor, instale o Node.js em: https://nodejs.org/
  echo.
  pause
  exit /b 1
)

:: Verifica se as dependencias estao instaladas
if not exist "node_modules\" (
  echo.
  echo   Dependencias nao encontradas!
  echo   Instalando pacotes pela primeira vez (npm install)...
  echo   Isso pode levar alguns minutos, por favor aguarde...
  echo.
  call npm install
  if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Falha ao instalar as dependencias.
    echo.
    pause
    exit /b 1
  )
  echo.
  echo   Dependencias instaladas com sucesso!
  echo.
)

echo ========================================================
echo   Iniciando o Servidor do Resume Builder...
echo   O navegador sera aberto em http://localhost:3000
echo   Para encerrar o servidor, feche esta janela.
echo ========================================================
echo.

start http://localhost:3000
npm run dev
