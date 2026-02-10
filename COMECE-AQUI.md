# 🚀 Bem-vindo ao CONTROLE!

## Sua Agenda Pessoal Completa

O **CONTROLE** é um sistema completo de gestão pessoal e profissional que centraliza todas as suas informações em um único lugar.

---

## ⚡ Início Rápido (5 minutos)

### Passo 1: Instalar Dependências
```bash
# Windows: Execute o script automático
setup.bat

# Ou manualmente:
cd backend && npm install
cd ../frontend && npm install
```

### Passo 2: Configurar Banco de Dados

**Opção A - PostgreSQL Local:**
1. Instale o PostgreSQL
2. Crie o banco: `CREATE DATABASE controle;`
3. Configure a URL no `backend/.env`

**Opção B - Supabase (Recomendado):**
1. Acesse https://supabase.com
2. Crie um projeto gratuito
3. Copie a connection string
4. Cole no `backend/.env`

### Passo 3: Configurar Variáveis de Ambiente

Edite `backend/.env`:
```env
DATABASE_URL=sua-connection-string-aqui
JWT_SECRET=sua-chave-secreta-aqui
ENCRYPTION_KEY=chave-de-32-caracteres-aqui
```

### Passo 4: Executar Migrations
```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

### Passo 5: Iniciar!
```bash
# Execute o script automático
start-dev.bat

# Acesse: http://localhost:3001
```

---

## 📚 Documentação Completa

| Documento | Descrição |
|-----------|-----------|
| [INSTALACAO.md](INSTALACAO.md) | Guia detalhado de instalação |
| [API.md](API.md) | Documentação completa da API |
| [COMANDOS.md](COMANDOS.md) | Comandos úteis para desenvolvimento |
| [IMPLEMENTADO.md](IMPLEMENTADO.md) | Status de implementação |
| [ESTRUTURA.md](ESTRUTURA.md) | Estrutura completa do projeto |

---

## ✨ Funcionalidades Disponíveis

### ✅ Totalmente Implementado

#### 🔐 Autenticação
- Registro de usuários
- Login seguro com JWT
- Refresh token automático
- Proteção de rotas

#### 📊 Dashboard
- Visão geral de estatísticas
- Resumo financeiro em tempo real
- Cards informativos

#### 📝 Anotações
- Criar, editar e excluir
- Fixar importantes
- Categorias e tags
- Busca por conteúdo

#### 👥 Clientes
- Cadastro completo
- Informações de contato
- Histórico de interações

### 🔄 Estrutura Pronta (Precisa de UI)

- 🎞️ **Memórias** - Timeline de fotos e vídeos
- 📁 **Arquivos** - Upload e gerenciamento
- 🔒 **Senhas** - Gerenciador criptografado
- 💼 **Serviços** - Controle de contratos
- 💰 **Financeiro** - Gestão completa de finanças
- 🔔 **Lembretes** - Sistema de notificações

---

## 🎯 Próximos Passos

### Para Desenvolvedores

1. **Complete as páginas restantes**
   - Implemente UI para Memories, Files, Passwords, etc
   - Use as páginas de Notes e Clients como referência
   - API já está 100% funcional

2. **Adicione testes**
   ```bash
   # Backend
   npm install --save-dev jest @types/jest

   # Frontend
   npm install --save-dev vitest @testing-library/react
   ```

3. **Deploy**
   - Backend: Railway ou Render
   - Frontend: Netlify
   - Database: Supabase ou Neon

### Para Usuários

1. **Crie sua conta**
   - Acesse http://localhost:3001
   - Clique em "Criar conta"
   - Preencha seus dados

2. **Explore as funcionalidades**
   - Comece criando algumas anotações
   - Cadastre clientes
   - Veja o dashboard atualizar

3. **Configure WhatsApp** (opcional)
   - Configure Evolution API
   - Conecte seu número
   - Use comandos via WhatsApp

---

## 💡 Comandos WhatsApp

Quando configurado, você pode usar via WhatsApp:

```
/nota [título] | [conteúdo]     - Criar anotação
/listar notas                    - Ver últimas 5 notas
/saldo                           - Ver resumo financeiro
/pagamentos pendentes            - Listar pagamentos
/lembretes hoje                  - Ver lembretes do dia
/registrar entrada 1000 Salário  - Registrar entrada
/registrar saída 50 Almoço       - Registrar saída
/ajuda                           - Ver todos os comandos
```

---

## 🛠️ Tecnologias

### Backend
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- JWT + Bcrypt
- AWS S3 (uploads)
- Evolution API (WhatsApp)

### Frontend
- React 18 + TypeScript
- Vite
- TailwindCSS
- React Router
- React Query
- Axios

---

## 📖 Guias Rápidos

### Como criar uma nova página?

1. Crie o arquivo em `frontend/src/pages/MinhaPage.tsx`
2. Adicione a rota em `frontend/src/App.tsx`
3. Adicione no menu em `frontend/src/components/common/Sidebar.tsx`

### Como adicionar um novo endpoint?

1. Crie o controller em `backend/src/controllers/`
2. Crie as rotas em `backend/src/routes/`
3. Registre em `backend/src/app.ts`

### Como adicionar uma nova tabela?

1. Edite `backend/prisma/schema.prisma`
2. Execute `npx prisma migrate dev`
3. O TypeScript types são gerados automaticamente

---

## 🐛 Problemas Comuns

### Backend não inicia
```bash
# Verifique se o PostgreSQL está rodando
# Verifique o .env
# Execute: npx prisma generate
```

### Frontend não conecta
```bash
# Verifique se o backend está rodando na porta 3000
# Verifique o VITE_API_URL no frontend/.env
# Limpe o cache: rm -rf node_modules && npm install
```

### Erro de autenticação
```bash
# Limpe o localStorage do navegador
# Faça logout e login novamente
# Verifique o JWT_SECRET no backend/.env
```

---

## 📞 Suporte

- 📖 Leia a documentação em `API.md`
- 🔍 Consulte `COMANDOS.md` para comandos úteis
- 📊 Veja o status em `IMPLEMENTADO.md`
- 🏗️ Entenda a estrutura em `ESTRUTURA.md`

---

## 🎉 Pronto para Começar!

```bash
# 1. Instale tudo
setup.bat

# 2. Configure o .env
notepad backend\.env

# 3. Execute migrations
cd backend && npx prisma migrate dev

# 4. Inicie os servidores
start-dev.bat

# 5. Acesse
http://localhost:3001
```

---

## 🌟 Dicas de Produtividade

1. **Use o Prisma Studio** para visualizar dados
   ```bash
   cd backend && npx prisma studio
   ```

2. **Hot reload** está habilitado
   - Salve o arquivo e veja as mudanças instantâneas

3. **Atalhos do navegador**
   - Ctrl+Shift+I: DevTools
   - Ctrl+Shift+R: Hard reload

4. **Use os scripts**
   - `setup.bat` - Instala tudo
   - `start-dev.bat` - Inicia ambos os servidores

---

## 🚀 Deploy Rápido

### Backend (Railway)
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Frontend (Netlify)
```bash
npm install -g netlify
netlify login
netlify
```

---

## 📈 Roadmap

- [x] Setup inicial
- [x] Autenticação
- [x] Dashboard
- [x] Anotações (completo)
- [x] Clientes (completo)
- [ ] Memórias (UI)
- [ ] Arquivos (UI)
- [ ] Senhas (UI)
- [ ] Financeiro (UI)
- [ ] Lembretes (UI)
- [ ] WhatsApp (testes)
- [ ] Deploy
- [ ] PWA
- [ ] Mobile App

---

## 🙏 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Add nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

---

## 📝 Licença

MIT License - Sinta-se livre para usar este projeto!

---

## 🎊 Parabéns!

Você está pronto para usar o **CONTROLE**!

Se tiver dúvidas, consulte a documentação ou explore o código-fonte.

**Bom desenvolvimento!** 🚀

---

*Criado com ❤️ usando Node.js, React e TypeScript*
