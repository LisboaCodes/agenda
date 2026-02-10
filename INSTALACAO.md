# Guia de Instalação - CONTROLE

## Pré-requisitos

- Node.js (v18 ou superior)
- PostgreSQL (v14 ou superior)
- npm ou yarn

## Passo 1: Configurar o Banco de Dados

### Opção A: PostgreSQL Local

1. Instale o PostgreSQL:
   - Windows: https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. Crie o banco de dados:
```bash
psql -U postgres
CREATE DATABASE controle;
\q
```

### Opção B: Usar Supabase (Recomendado)

1. Acesse https://supabase.com e crie uma conta
2. Crie um novo projeto
3. Copie a connection string fornecida

### Opção C: Usar Neon

1. Acesse https://neon.tech e crie uma conta
2. Crie um novo projeto
3. Copie a connection string fornecida

## Passo 2: Configurar o Backend

1. Navegue até a pasta do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Copie o arquivo de exemplo de variáveis de ambiente:
```bash
copy .env.example .env
```

4. Edite o arquivo `.env` com suas configurações:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/controle
JWT_SECRET=sua-chave-secreta-jwt-aqui
JWT_REFRESH_SECRET=sua-chave-refresh-aqui
ENCRYPTION_KEY=sua-chave-de-32-caracteres-aqui
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
```

5. Execute as migrações do banco de dados:
```bash
npx prisma generate
npx prisma migrate dev
```

6. Inicie o servidor:
```bash
npm run dev
```

O backend estará rodando em `http://localhost:3000`

## Passo 3: Configurar o Frontend

1. Abra um novo terminal e navegue até a pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Copie o arquivo de exemplo de variáveis de ambiente:
```bash
copy .env.example .env
```

4. Edite o arquivo `.env`:
```env
VITE_API_URL=http://localhost:3000
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend estará rodando em `http://localhost:3001`

## Passo 4: Testar a Aplicação

1. Acesse `http://localhost:3001` no navegador
2. Clique em "Criar conta"
3. Preencha os dados e crie sua conta
4. Faça login e explore as funcionalidades!

## Estrutura de Pastas

```
CONTROLE/
├── backend/
│   ├── src/
│   │   ├── config/          # Configurações (DB, S3, Evolution API)
│   │   ├── controllers/     # Lógica de negócio
│   │   ├── middleware/      # Autenticação, upload, erros
│   │   ├── routes/          # Definição de rotas
│   │   ├── services/        # Serviços auxiliares
│   │   ├── app.ts           # Setup do Express
│   │   └── server.ts        # Entry point
│   ├── prisma/
│   │   └── schema.prisma    # Schema do banco de dados
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/      # Componentes React
    │   ├── contexts/        # Context API (Auth)
    │   ├── pages/           # Páginas da aplicação
    │   ├── services/        # API service (axios)
    │   ├── styles/          # CSS global
    │   ├── types/           # TypeScript types
    │   ├── App.tsx          # Componente principal
    │   └── main.tsx         # Entry point
    ├── package.json
    └── .env
```

## Funcionalidades Implementadas

✅ **Autenticação**
- Registro de usuários
- Login com JWT
- Refresh token automático
- Proteção de rotas

✅ **Dashboard**
- Visão geral de todas as informações
- Estatísticas em tempo real
- Cards informativos

✅ **Anotações**
- Criar, editar e excluir anotações
- Fixar anotações importantes
- Categorias e tags
- Busca por conteúdo

✅ **Clientes**
- Cadastro completo de clientes
- Informações de contato
- Histórico de interações

✅ **Estrutura Completa**
- Sistema modular e escalável
- API REST completa
- Interface responsiva
- Segurança robusta

## Próximos Passos

### Funcionalidades a Implementar:

1. **Memórias** - Galeria de fotos e vídeos com timeline
2. **Arquivos** - Upload e gerenciamento de documentos
3. **Senhas** - Gerenciador de senhas criptografadas
4. **Serviços** - Controle de serviços contratados
5. **Financeiro** - Gestão completa de entradas/saídas
6. **Lembretes** - Sistema de notificações
7. **WhatsApp** - Integração com Evolution API

### Deploy:

1. **Backend**: Railway ou Render
2. **Frontend**: Netlify
3. **Database**: Supabase ou Neon

## Comandos Úteis

### Backend
```bash
npm run dev          # Inicia em modo desenvolvimento
npm run build        # Compila TypeScript
npm start            # Inicia em produção
npx prisma studio    # Abre interface visual do banco
```

### Frontend
```bash
npm run dev          # Inicia em modo desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
```

## Solução de Problemas

### Erro de conexão com o banco de dados
- Verifique se o PostgreSQL está rodando
- Confirme a connection string no `.env`
- Execute `npx prisma generate` novamente

### Erro de CORS
- Verifique se o `FRONTEND_URL` está correto no backend `.env`
- Certifique-se de que ambos os servidores estão rodando

### Erro de autenticação
- Limpe o localStorage do navegador
- Verifique se o `JWT_SECRET` está configurado
- Tente fazer logout e login novamente

## Suporte

Para dúvidas ou problemas:
1. Verifique a documentação
2. Consulte os logs do console
3. Revise as configurações do `.env`

## Licença

MIT
