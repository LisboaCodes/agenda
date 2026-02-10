# 🚀 Deploy no Netlify - CONTROLE

Guia completo para fazer deploy do frontend no Netlify.

---

## 📋 Pré-requisitos

- ✅ Código no GitHub: https://github.com/LisboaCodes/agenda
- ✅ Conta no Netlify: https://www.netlify.com
- ✅ Backend já deployado (Railway ou Render)

---

## 🎯 Passo a Passo

### 1️⃣ Acesse o Netlify

1. Entre em https://app.netlify.com
2. Faça login com GitHub
3. Clique em **"Add new site"** → **"Import an existing project"**

### 2️⃣ Conecte o GitHub

1. Escolha **"GitHub"**
2. Autorize o Netlify a acessar seus repositórios
3. Selecione o repositório: **LisboaCodes/agenda**

### 3️⃣ Configure o Build

**Build settings:**
```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/dist
```

**Environment variables:**
```
VITE_API_URL=https://seu-backend-url.railway.app
```

> ⚠️ Substitua pela URL real do seu backend!

### 4️⃣ Deploy!

1. Clique em **"Deploy site"**
2. Aguarde o build finalizar (~2-3 minutos)
3. Seu site estará disponível em: `https://random-name.netlify.app`

### 5️⃣ Configure um domínio personalizado (Opcional)

1. Vá em **"Site settings"** → **"Domain management"**
2. Clique em **"Add custom domain"**
3. Configure seu domínio ou use o subdomínio gratuito do Netlify

---

## ⚙️ Configurações Importantes

### Variáveis de Ambiente

No painel do Netlify, adicione:

```env
VITE_API_URL=https://seu-backend.railway.app
```

### Redirects para SPA

Crie o arquivo `frontend/public/_redirects`:
```
/*    /index.html   200
```

Isso garante que o React Router funcione corretamente.

### Build Settings

Se precisar ajustar, vá em **"Site settings"** → **"Build & deploy"**:

```yaml
Build command: npm run build
Publish directory: frontend/dist
```

---

## 🔄 Deploy Automático

Agora, sempre que você fizer push para o GitHub:

```bash
git add .
git commit -m "Update"
git push
```

O Netlify automaticamente:
1. Detecta as mudanças
2. Faz o build
3. Faz deploy da nova versão

---

## 🐛 Solução de Problemas

### Build falha

**Erro:** `Command failed with exit code 1`

**Solução:**
1. Verifique se o `package.json` está correto
2. Teste o build localmente: `cd frontend && npm run build`
3. Veja os logs detalhados no Netlify

### Erro de API (CORS)

**Erro:** `CORS policy: No 'Access-Control-Allow-Origin'`

**Solução:**
No backend, configure o CORS para permitir a URL do Netlify:

```typescript
// backend/src/app.ts
const corsOptions = {
  origin: [
    'http://localhost:3001',
    'https://seu-site.netlify.app',
    'https://seu-dominio.com'
  ],
  credentials: true,
};
```

### Rotas 404

**Erro:** Página recarrega e dá 404

**Solução:**
Crie `frontend/public/_redirects`:
```
/*    /index.html   200
```

---

## 📊 Monitoramento

### Analytics

No Netlify, ative:
- **Analytics** para ver tráfego
- **Forms** se tiver formulários
- **Functions** se usar serverless

### Logs

Veja logs em tempo real:
1. **"Deploys"** → Clique no último deploy
2. **"Deploy log"** para ver o build completo

---

## 🎨 Customizações

### Preview de Pull Requests

O Netlify cria previews automáticos de PRs!

Configure em:
**"Site settings"** → **"Build & deploy"** → **"Deploy contexts"**

### Notificações

Configure notificações de deploy:
- Slack
- Email
- Webhooks

---

## 💡 Dicas Pro

1. **Branch Deploys:** Deploy automático de branches
2. **Split Testing:** Teste A/B de versões
3. **Password Protection:** Proteja o site durante desenvolvimento
4. **Custom Headers:** Configure headers de segurança
5. **Edge Functions:** Serverless functions no Netlify

---

## 🔗 Links Úteis

- **Dashboard:** https://app.netlify.com
- **Documentação:** https://docs.netlify.com
- **Status:** https://www.netlifystatus.com
- **Community:** https://answers.netlify.com

---

## ✅ Checklist de Deploy

- [ ] Código no GitHub
- [ ] Backend deployado
- [ ] Variável `VITE_API_URL` configurada
- [ ] Build testado localmente
- [ ] Arquivo `_redirects` criado
- [ ] CORS configurado no backend
- [ ] Site deployado no Netlify
- [ ] Domínio configurado (opcional)
- [ ] SSL habilitado (automático)
- [ ] Testado em produção

---

**Seu site estará online em minutos! 🚀**
