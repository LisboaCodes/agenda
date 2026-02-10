# ⚠️ Porta do Frontend Alterada

A porta do frontend foi alterada de **5173** para **3001** devido a conflito de porta.

## 🔧 O que foi alterado:

- ✅ `frontend/vite.config.ts` - Porta 3001
- ✅ `backend/.env.example` - FRONTEND_URL atualizada
- ✅ `start-dev.bat` - Script atualizado
- ✅ Toda a documentação atualizada

## 🚀 Como usar:

```bash
# Inicie os servidores normalmente
start-dev.bat

# O frontend estará disponível em:
http://localhost:3001
```

## ⚙️ Se quiser usar outra porta:

Edite o arquivo `frontend/vite.config.ts`:

```typescript
server: {
  port: 3001, // Mude para a porta desejada
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

Depois, atualize também:
- `backend/.env` - FRONTEND_URL
- `backend/.env.example` - FRONTEND_URL

## 📝 Portas utilizadas:

- **Backend:** `http://localhost:3000`
- **Frontend:** `http://localhost:3001`
- **Prisma Studio:** `http://localhost:5555` (quando executado)

---

**Data da alteração:** 2024-02-09
