# Comandos Úteis - CONTROLE

## Setup Inicial

### Instalação Automática (Windows)
```bash
# Execute o script de setup
setup.bat

# Ou manualmente:
cd backend && npm install
cd ../frontend && npm install
```

### Configurar Banco de Dados
```bash
cd backend

# Gerar cliente Prisma
npx prisma generate

# Criar e executar migrations
npx prisma migrate dev

# Abrir Prisma Studio (interface visual)
npx prisma studio
```

## Desenvolvimento

### Iniciar Ambos os Servidores (Windows)
```bash
# Script automático
start-dev.bat

# Ou manualmente em terminais separados:
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Backend

```bash
cd backend

# Desenvolvimento com hot reload
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm start

# Gerar migration
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations em produção
npx prisma migrate deploy

# Reset do banco (CUIDADO: apaga tudo!)
npx prisma migrate reset

# Seed do banco (se configurado)
npx prisma db seed

# Ver logs do Prisma
npx prisma studio
```

### Frontend

```bash
cd frontend

# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
```

## Banco de Dados

### PostgreSQL Local

```bash
# Iniciar PostgreSQL (Windows)
pg_ctl -D "C:\Program Files\PostgreSQL\14\data" start

# Parar PostgreSQL
pg_ctl -D "C:\Program Files\PostgreSQL\14\data" stop

# Conectar ao PostgreSQL
psql -U postgres

# Criar banco de dados
CREATE DATABASE controle;

# Listar bancos
\l

# Conectar a um banco
\c controle

# Listar tabelas
\dt

# Sair
\q
```

### Prisma

```bash
# Ver schema
cat prisma/schema.prisma

# Validar schema
npx prisma validate

# Format schema
npx prisma format

# Gerar SQL das migrations
npx prisma migrate diff

# Criar migration vazia
npx prisma migrate dev --create-only

# Ver status das migrations
npx prisma migrate status
```

## Git

```bash
# Inicializar repositório
git init

# Adicionar arquivos
git add .

# Commit
git commit -m "Initial commit: Complete CONTROLE implementation"

# Criar repositório no GitHub e conectar
git remote add origin https://github.com/seu-usuario/controle.git
git branch -M main
git push -u origin main

# Branches
git checkout -b feature/nova-funcionalidade
git checkout main
git merge feature/nova-funcionalidade

# Ver histórico
git log --oneline --graph

# Ver mudanças
git status
git diff
```

## Deploy

### Backend (Railway)

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Iniciar projeto
railway init

# Linkar projeto existente
railway link

# Deploy
railway up

# Ver logs
railway logs

# Abrir no browser
railway open

# Adicionar variáveis de ambiente
railway variables set DATABASE_URL=postgresql://...
railway variables set JWT_SECRET=...
railway variables set ENCRYPTION_KEY=...
```

### Frontend (Netlify)

```bash
# Instalar Netlify CLI
npm install -g netlify

# Login
netlify login

# Deploy
netlify

# Deploy em produção
netlify --prod

# Ver logs
netlify logs

# Ver deployments
netlify ls
```

### Frontend (Netlify)

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Inicializar
netlify init

# Deploy
netlify deploy

# Deploy em produção
netlify deploy --prod

# Ver logs
netlify logs

# Abrir no browser
netlify open
```

## Testes

### Backend (Jest - se configurado)

```bash
cd backend

# Rodar todos os testes
npm test

# Rodar com coverage
npm test -- --coverage

# Rodar em watch mode
npm test -- --watch

# Rodar teste específico
npm test -- auth.test.ts
```

### Frontend (Vitest - se configurado)

```bash
cd frontend

# Rodar testes
npm test

# Watch mode
npm test -- --watch

# UI mode
npm test -- --ui
```

## Manutenção

### Atualizar Dependências

```bash
# Backend
cd backend
npm outdated
npm update
npm audit fix

# Frontend
cd frontend
npm outdated
npm update
npm audit fix
```

### Limpar Cache

```bash
# Backend
cd backend
rm -rf node_modules
rm package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules
rm package-lock.json
npm install

# Prisma
npx prisma generate
```

### Backup do Banco

```bash
# PostgreSQL dump
pg_dump -U postgres controle > backup.sql

# Restaurar backup
psql -U postgres controle < backup.sql

# Backup com Prisma (exportar dados)
npx prisma db pull
```

## Produtividade

### Aliases Úteis (adicione ao .bashrc ou .zshrc)

```bash
# Backend
alias bdev="cd backend && npm run dev"
alias bbuild="cd backend && npm run build"
alias bprisma="cd backend && npx prisma studio"

# Frontend
alias fdev="cd frontend && npm run dev"
alias fbuild="cd frontend && npm run build"

# Prisma
alias pmigrate="npx prisma migrate dev"
alias pstudio="npx prisma studio"
alias pgenerate="npx prisma generate"

# Git
alias gs="git status"
alias ga="git add ."
alias gc="git commit -m"
alias gp="git push"
alias gl="git log --oneline --graph"
```

### VSCode Tasks (crie .vscode/tasks.json)

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Backend",
      "type": "npm",
      "script": "dev",
      "path": "backend/",
      "problemMatcher": []
    },
    {
      "label": "Start Frontend",
      "type": "npm",
      "script": "dev",
      "path": "frontend/",
      "problemMatcher": []
    },
    {
      "label": "Start Both",
      "dependsOn": ["Start Backend", "Start Frontend"],
      "problemMatcher": []
    }
  ]
}
```

## Troubleshooting

### Porta em uso

```bash
# Windows - Matar processo na porta 3000
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Limpar tudo e recomeçar

```bash
# Backend
cd backend
rm -rf node_modules dist
npm install
npx prisma generate
npx prisma migrate dev

# Frontend
cd frontend
rm -rf node_modules dist
npm install
```

### Erro de permissão (Linux/Mac)

```bash
# Dar permissão de execução
chmod +x script.sh

# Instalar com sudo se necessário
sudo npm install -g [package]
```

## Monitoramento

### Ver logs em tempo real

```bash
# Backend (desenvolvimento)
cd backend && npm run dev

# Backend (produção com PM2)
pm2 logs controle-backend

# Ver uso de memória/CPU
pm2 monit
```

### Health Check

```bash
# Verificar se backend está rodando
curl http://localhost:3000/health

# Verificar endpoints
curl http://localhost:3000/api/auth/me -H "Authorization: Bearer TOKEN"
```

## Documentação

### Gerar documentação da API (Swagger - se configurado)

```bash
cd backend
npm run docs

# Acessar em: http://localhost:3000/api-docs
```

### Gerar documentação do código (TypeDoc)

```bash
npm install -g typedoc

cd backend
typedoc --out docs src/

cd ../frontend
typedoc --out docs src/
```

## Segurança

### Gerar chaves secretas

```bash
# JWT Secret (use no .env)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Encryption Key (32 bytes)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Verificar vulnerabilidades

```bash
# Backend
cd backend
npm audit
npm audit fix

# Frontend
cd frontend
npm audit
npm audit fix
```

## Performance

### Analisar bundle do frontend

```bash
cd frontend
npm run build
npx vite-bundle-visualizer
```

### Profile do backend

```bash
# Com Node.js profiler
node --inspect src/server.ts

# Abrir em chrome://inspect
```

## Úteis

### Contar linhas de código

```bash
# Total
find . -name "*.ts" -o -name "*.tsx" | xargs wc -l

# Backend
find backend -name "*.ts" | xargs wc -l

# Frontend
find frontend -name "*.tsx" -o -name "*.ts" | xargs wc -l
```

### Buscar em arquivos

```bash
# Buscar texto
grep -r "texto" src/

# Buscar e substituir
find . -name "*.ts" -exec sed -i 's/oldtext/newtext/g' {} \;
```
