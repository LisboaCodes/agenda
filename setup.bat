@echo off
echo ============================================
echo   CONTROLE - Setup Automatico
echo ============================================
echo.

echo [1/5] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado. Instale em https://nodejs.org
    pause
    exit /b 1
)
echo Node.js instalado ✓
echo.

echo [2/5] Instalando dependencias do Backend...
cd backend
if not exist node_modules (
    call npm install
    if %errorlevel% neq 0 (
        echo ERRO ao instalar dependencias do backend
        pause
        exit /b 1
    )
)
echo Backend instalado ✓
echo.

echo [3/5] Configurando arquivo .env do Backend...
if not exist .env (
    copy .env.example .env
    echo AVISO: Configure o arquivo backend\.env com suas credenciais
    echo Press qualquer tecla para abrir o arquivo...
    pause
    notepad .env
)
echo.

echo [4/5] Instalando dependencias do Frontend...
cd ..\frontend
if not exist node_modules (
    call npm install
    if %errorlevel% neq 0 (
        echo ERRO ao instalar dependencias do frontend
        pause
        exit /b 1
    )
)
echo Frontend instalado ✓
echo.

echo [5/5] Configurando arquivo .env do Frontend...
if not exist .env (
    copy .env.example .env
)
cd ..
echo.

echo ============================================
echo   Setup Concluido!
echo ============================================
echo.
echo Proximos passos:
echo 1. Configure o DATABASE_URL no arquivo backend\.env
echo 2. Execute: cd backend ^&^& npx prisma migrate dev
echo 3. Inicie o backend: cd backend ^&^& npm run dev
echo 4. Em outro terminal, inicie o frontend: cd frontend ^&^& npm run dev
echo.
echo Leia INSTALACAO.md para mais detalhes
echo.
pause
