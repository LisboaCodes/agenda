@echo off
echo ============================================
echo   CONTROLE - Iniciando Servidores
echo ============================================
echo.

echo Iniciando Backend na porta 3000...
start cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Iniciando Frontend na porta 5173...
start cmd /k "cd frontend && npm run dev"

echo.
echo ============================================
echo   Servidores Iniciados!
echo ============================================
echo.
echo Backend: http://localhost:4000
echo Frontend: http://localhost:3001
echo.
echo Pressione qualquer tecla para fechar esta janela...
pause > nul
