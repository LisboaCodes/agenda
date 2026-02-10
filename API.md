# API Documentation - CONTROLE

Base URL: `http://localhost:3000/api`

## Autenticação

Todos os endpoints protegidos requerem o header:
```
Authorization: Bearer {accessToken}
```

### POST /auth/register
Registrar novo usuário

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "phone": "11999999999"
}
```

**Response:** 201
```json
{
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "11999999999",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "accessToken": "jwt-token",
  "refreshToken": "jwt-refresh-token"
}
```

### POST /auth/login
Fazer login

**Body:**
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Response:** 200
```json
{
  "user": { /* user object */ },
  "accessToken": "jwt-token",
  "refreshToken": "jwt-refresh-token"
}
```

### POST /auth/refresh
Renovar access token

**Body:**
```json
{
  "refreshToken": "jwt-refresh-token"
}
```

### GET /auth/me
Obter dados do usuário logado (requer autenticação)

---

## Anotações (Notes)

### GET /notes
Listar todas as anotações

**Query params:**
- `category` - Filtrar por categoria
- `tag` - Filtrar por tag
- `search` - Buscar no título ou conteúdo
- `isPinned` - Filtrar fixadas (true/false)

### GET /notes/:id
Buscar anotação específica

### POST /notes
Criar nova anotação

**Body:**
```json
{
  "title": "Minha nota",
  "content": "Conteúdo da nota",
  "category": "trabalho",
  "tags": ["importante", "urgente"],
  "color": "#FF5733"
}
```

### PUT /notes/:id
Atualizar anotação

### DELETE /notes/:id
Excluir anotação

### PATCH /notes/:id/pin
Fixar/desfixar anotação

---

## Memórias (Memories)

### GET /memories
Listar memórias

**Query params:**
- `year` - Filtrar por ano
- `month` - Filtrar por mês
- `search` - Buscar em título, descrição ou localização

### GET /memories/:id
Buscar memória (inclui arquivos associados)

### POST /memories
Criar memória

**Body:**
```json
{
  "title": "Viagem para a praia",
  "description": "Férias incríveis",
  "memoryDate": "2024-01-15",
  "location": "Florianópolis, SC"
}
```

### PUT /memories/:id
Atualizar memória

### DELETE /memories/:id
Excluir memória (e arquivos associados)

---

## Arquivos (Files)

### GET /files
Listar arquivos

**Query params:**
- `referenceType` - Tipo de referência (note, memory, client, service)
- `referenceId` - ID da referência
- `fileType` - Tipo de arquivo (image, video, document, audio)

### GET /files/:id
Buscar arquivo específico

### POST /files/upload
Upload de arquivo (multipart/form-data)

**Form data:**
- `file` - Arquivo
- `referenceType` - Tipo de referência (opcional)
- `referenceId` - ID da referência (opcional)

### DELETE /files/:id
Excluir arquivo

---

## Senhas (Passwords)

### GET /passwords
Listar senhas (sem mostrar a senha)

**Query params:**
- `category` - Filtrar por categoria
- `search` - Buscar em nome do serviço, username ou email

### GET /passwords/:id
Buscar senha específica (retorna senha descriptografada)

### GET /passwords/generate
Gerar senha aleatória

**Query params:**
- `length` - Tamanho da senha (padrão: 16)

### POST /passwords
Criar senha

**Body:**
```json
{
  "serviceName": "GitHub",
  "username": "joaosilva",
  "email": "joao@email.com",
  "password": "senha-forte-123",
  "url": "https://github.com",
  "notes": "Conta principal",
  "category": "trabalho"
}
```

### PUT /passwords/:id
Atualizar senha

### DELETE /passwords/:id
Excluir senha

---

## Serviços (Services)

### GET /services
Listar serviços

### GET /services/:id
Buscar serviço (inclui pagamentos)

### POST /services
Criar serviço

**Body:**
```json
{
  "serviceName": "Netflix",
  "description": "Streaming de vídeos",
  "provider": "Netflix Inc",
  "contractStart": "2024-01-01",
  "contractEnd": "2024-12-31",
  "monthlyCost": 45.90,
  "status": "active",
  "notes": "Plano Premium"
}
```

### PUT /services/:id
Atualizar serviço

### DELETE /services/:id
Excluir serviço

---

## Clientes (Clients)

### GET /clients
Listar clientes

**Query params:**
- `status` - Filtrar por status (active, inactive, prospect)
- `search` - Buscar em nome, email, telefone ou empresa

### GET /clients/:id
Buscar cliente (inclui últimos 10 pagamentos)

### POST /clients
Criar cliente

**Body:**
```json
{
  "name": "Maria Silva",
  "email": "maria@empresa.com",
  "phone": "11988888888",
  "company": "Empresa XYZ",
  "address": "Rua ABC, 123",
  "notes": "Cliente VIP",
  "status": "active"
}
```

### PUT /clients/:id
Atualizar cliente

### DELETE /clients/:id
Excluir cliente

---

## Pagamentos (Payments)

### GET /payments
Listar pagamentos

**Query params:**
- `status` - pending, paid, overdue, cancelled
- `paymentType` - received, paid
- `clientId` - Filtrar por cliente
- `serviceId` - Filtrar por serviço
- `startDate` - Data inicial
- `endDate` - Data final

### GET /payments/:id
Buscar pagamento

### POST /payments
Criar pagamento

**Body:**
```json
{
  "clientId": "uuid",
  "description": "Projeto Website",
  "amount": 5000.00,
  "paymentType": "received",
  "paymentMethod": "pix",
  "dueDate": "2024-02-15",
  "status": "pending"
}
```

### PUT /payments/:id
Atualizar pagamento

### PATCH /payments/:id/mark-paid
Marcar como pago

### DELETE /payments/:id
Excluir pagamento

---

## Transações (Transactions)

### GET /transactions
Listar transações

**Query params:**
- `transactionType` - income, expense
- `category` - Categoria
- `startDate` - Data inicial
- `endDate` - Data final
- `search` - Buscar em descrição

### GET /transactions/summary
Resumo financeiro

**Query params:**
- `startDate` - Data inicial (opcional)
- `endDate` - Data final (opcional)

**Response:**
```json
{
  "income": 10000.00,
  "expense": 5000.00,
  "balance": 5000.00,
  "byCategory": [
    {
      "category": "salário",
      "transactionType": "income",
      "_sum": { "amount": 8000.00 },
      "_count": 2
    }
  ]
}
```

### GET /transactions/:id
Buscar transação

### POST /transactions
Criar transação

**Body:**
```json
{
  "description": "Salário Mensal",
  "amount": 5000.00,
  "transactionType": "income",
  "category": "salário",
  "transactionDate": "2024-02-01",
  "paymentMethod": "bank_transfer"
}
```

### PUT /transactions/:id
Atualizar transação

### DELETE /transactions/:id
Excluir transação

---

## Lembretes (Reminders)

### GET /reminders
Listar lembretes

**Query params:**
- `priority` - low, medium, high, urgent
- `isCompleted` - true/false
- `startDate` - Data inicial
- `endDate` - Data final

### GET /reminders/upcoming
Lembretes do dia atual

### GET /reminders/:id
Buscar lembrete

### POST /reminders
Criar lembrete

**Body:**
```json
{
  "title": "Reunião com cliente",
  "description": "Discutir novo projeto",
  "reminderDate": "2024-02-15T14:00:00Z",
  "isRecurring": false,
  "priority": "high"
}
```

### PUT /reminders/:id
Atualizar lembrete

### PATCH /reminders/:id/complete
Marcar como completo/incompleto

### DELETE /reminders/:id
Excluir lembrete

---

## WhatsApp Integration

### POST /whatsapp/webhook
Webhook da Evolution API (público)

### POST /whatsapp/send
Enviar mensagem

**Body:**
```json
{
  "phoneNumber": "5511999999999",
  "message": "Olá!"
}
```

### POST /whatsapp/connect
Conectar número ao sistema

**Body:**
```json
{
  "phoneNumber": "5511999999999"
}
```

### GET /whatsapp/status
Status da instância Evolution API

---

## Códigos de Erro

- `400` - Bad Request (dados inválidos)
- `401` - Unauthorized (não autenticado)
- `403` - Forbidden (token inválido)
- `404` - Not Found (recurso não encontrado)
- `409` - Conflict (recurso já existe)
- `500` - Internal Server Error

## Rate Limiting

- 100 requisições por IP a cada 15 minutos
- Endpoints públicos têm limites mais restritivos
