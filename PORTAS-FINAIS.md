# 🔌 Configuração Final de Portas

Devido a conflitos de portas, a configuração final é:

## 📍 Portas Configuradas:

| Serviço | Porta | URL |
|---------|-------|-----|
| **Backend API** | 4000 | http://localhost:4000 |
| **Frontend** | 3001 | http://localhost:3001 |
| **Prisma Studio** | 5555 | http://localhost:5555 |

## ⚠️ Portas que estavam ocupadas:

- ❌ 3000 - Ocupada por "Multi Ads Platform API"
- ❌ 5173 - Porta padrão Vite (ocupada)
- ❌ 5174 - Tentativa 1 (ocupada)

## ✅ Solução Final:

- Backend movido para porta **4000**
- Frontend configurado na porta **3001**

## 🚀 Como Iniciar:

1. **Configure o .env do backend:**
```bash
notepad backend\.env
```

Adicione:
```env
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/controle
JWT_SECRET=seu-secret-aqui
ENCRYPTION_KEY=chave-32-caracteres-aqui
FRONTEND_URL=http://localhost:3001
```

2. **Instale as dependências:**
```bash
cd backend
npm install
cd ..\frontend
npm install
cd ..
```

3. **Execute as migrations:**
```bash
cd backend
npx prisma generate
npx prisma migrate dev
cd ..
```

4. **Inicie os servidores:**
```bash
start-dev.bat
```

5. **Acesse:**
- Frontend: http://localhost:3001
- Backend API: http://localhost:4000
- Health check: http://localhost:4000/health

## 🔧 Verificar se as portas estão livres:

```bash
# Verificar porta 4000
netstat -ano | findstr :4000

# Verificar porta 3001
netstat -ano | findstr :3001

# Se não retornar nada = porta livre!
```

---

**Data:** 2024-02-09
**Status:** ✅ Pronto para uso
