# 🎯 CONTROLE - Agenda Pessoal Completa

> Sistema completo de gestão pessoal e profissional com interface web e integração WhatsApp.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

---

## 🚀 Início Rápido

**Primeira vez?** Leia o [COMECE-AQUI.md](COMECE-AQUI.md) para instruções detalhadas!

```bash
# 1. Instalar dependências
setup.bat

# 2. Configurar .env (veja COMECE-AQUI.md)
notepad backend\.env

# 3. Executar migrations
cd backend && npx prisma migrate dev

# 4. Iniciar servidores
start-dev.bat

# 5. Acessar
http://localhost:3001
```

---

## Funcionalidades

- 📝 **Anotações**: Sistema de notas com tags, categorias e cores
- 🎞️ **Memórias**: Timeline de memórias com galeria de fotos
- 📁 **Arquivos**: Upload e gerenciamento de documentos, imagens e vídeos
- 🔐 **Senhas**: Gerenciador de senhas com criptografia AES-256
- 👥 **Clientes**: Gestão de clientes e contatos
- 💰 **Financeiro**: Controle de pagamentos, transações e relatórios
- 🔔 **Lembretes**: Sistema de notificações e lembretes recorrentes
- 📱 **WhatsApp**: Integração via Evolution API para acesso remoto

## Stack Tecnológica

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- AWS S3 / Cloudinary

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- Zustand (State Management)
- React Query

## Estrutura do Projeto

```
CONTROLE/
├── backend/          # API REST
├── frontend/         # Interface React
└── README.md
```

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| **[🎯 COMECE-AQUI.md](COMECE-AQUI.md)** | **Guia de início rápido (LEIA PRIMEIRO!)** |
| [📦 INSTALACAO.md](INSTALACAO.md) | Guia detalhado de instalação |
| [🔌 API.md](API.md) | Documentação completa da API REST |
| [💻 COMANDOS.md](COMANDOS.md) | Comandos úteis para desenvolvimento |
| [📊 IMPLEMENTADO.md](IMPLEMENTADO.md) | Status da implementação |
| [🏗️ ESTRUTURA.md](ESTRUTURA.md) | Estrutura completa do projeto |

---

## ✨ Status de Implementação

### ✅ Completamente Funcional
- 🔐 **Autenticação** - JWT com refresh token
- 📊 **Dashboard** - Estatísticas em tempo real
- 📝 **Anotações** - CRUD completo com categorias e tags
- 👥 **Clientes** - Gestão completa de clientes

### 🔄 Backend Pronto, UI Básica
- 🎞️ **Memórias** - Timeline com galeria de fotos
- 📁 **Arquivos** - Upload e gerenciamento
- 🔒 **Senhas** - Gerenciador criptografado AES-256
- 💼 **Serviços** - Controle de contratos e custos
- 💰 **Financeiro** - Transações e relatórios
- 🔔 **Lembretes** - Sistema de notificações

### 🎯 Integrações
- 📱 **WhatsApp** - Evolution API (comandos configurados)
- ☁️ **AWS S3** - Upload de arquivos
- 🗄️ **PostgreSQL** - Banco de dados

---

## 🏗️ Arquitetura

```
┌─────────────┐      HTTP/REST      ┌──────────────┐
│   React     │ ←─────────────────→ │   Node.js    │
│  Frontend   │    JWT Auth         │   Express    │
└─────────────┘                      └──────┬───────┘
                                           │
                                     ┌─────▼──────┐
                                     │ PostgreSQL │
                                     └────────────┘
```

### Tecnologias

**Backend:**
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- JWT + Bcrypt + AES-256
- AWS S3, Evolution API

**Frontend:**
- React 18 + TypeScript + Vite
- TailwindCSS + React Router
- React Query + Axios

---

## Deploy

- **Backend**: Railway ou Render
- **Frontend**: Netlify
- **Database**: Supabase ou Neon (PostgreSQL)

## 📱 Comandos WhatsApp (Evolution API)

```
/nota [título] | [conteúdo]          - Criar anotação rápida
/listar notas                         - Ver últimas 5 anotações
/saldo                                - Resumo financeiro
/pagamentos pendentes                 - Listar pagamentos
/lembretes hoje                       - Lembretes do dia
/registrar entrada [valor] [desc]     - Registrar entrada
/registrar saída [valor] [desc]       - Registrar saída
/ajuda                                - Lista de comandos
```

---

## 🎯 Endpoints da API

**60+ endpoints implementados!** Veja documentação completa em [API.md](API.md)

### Principais Rotas
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/notes` - Listar anotações
- `GET /api/clients` - Listar clientes
- `GET /api/transactions/summary` - Resumo financeiro
- `POST /api/files/upload` - Upload de arquivo
- `POST /api/whatsapp/webhook` - Webhook WhatsApp

---

## 🚀 Scripts Úteis

| Script | Descrição |
|--------|-----------|
| `setup.bat` | Instala todas as dependências |
| `start-dev.bat` | Inicia backend + frontend |
| `cd backend && npx prisma studio` | Interface visual do banco |
| `cd backend && npm run build` | Build do backend |
| `cd frontend && npm run build` | Build do frontend |

---

## 📊 Estatísticas do Projeto

- **75+ arquivos** criados
- **~8,000 linhas** de código
- **11 tabelas** no banco de dados
- **60+ endpoints** REST
- **11 páginas** no frontend
- **15+ componentes** React
- **100% TypeScript**

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Veja como:

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Add: nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

---

## 📄 Licença

MIT License - Veja [LICENSE](LICENSE) para detalhes.

---

## 🙏 Agradecimentos

Criado com ❤️ usando:
- [Node.js](https://nodejs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/)
- [TailwindCSS](https://tailwindcss.com/)

---

## 📞 Suporte

- 📖 [Documentação Completa](COMECE-AQUI.md)
- 🐛 [Reportar Bugs](https://github.com/seu-usuario/controle/issues)
- 💡 [Solicitar Features](https://github.com/seu-usuario/controle/issues)

---

**⭐ Se este projeto foi útil, considere dar uma estrela!**
