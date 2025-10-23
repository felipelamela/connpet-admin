# 🎯 Arquitetura de Autenticação - Versão Final Simplificada

## 📋 Estrutura

```
┌─────────────────────────────────────────────────────────────────┐
│  AuthContext (contexts/AuthContext.tsx)                         │
│  ├─ useRef(hasCheckedAuth) → Garante 1 ÚNICA verificação       │
│  ├─ useEffect([]) → Executa checkAuth UMA vez ao montar        │
│  └─ Estado global: { user, isAuthenticated, isLoading }        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Páginas com useEffect (apenas 2!)                              │
│                                                                  │
│  1. `/` (page.tsx)                                              │
│     └─ useEffect → Redireciona para /login ou /dashboard       │
│                                                                  │
│  2. `/(authenticated)/layout.tsx`                               │
│     └─ useEffect → Protege TODAS as rotas autenticadas         │
│                                                                  │
│  3. `/login` (login/page.tsx)                                   │
│     └─ SEM useEffect → Apenas formulário simples               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Autenticação

### **1. App carrega (qualquer rota)**
```
1. AuthProvider monta
2. useRef verifica: hasCheckedAuth.current === false
3. Executa checkAuth() UMA vez
4. GET /auth/me (1 requisição)
5. Atualiza estado global
6. hasCheckedAuth.current = true (nunca mais executa)
```

### **2. Usuário acessa `/` (home)**
```
1. AuthContext já carregou (isLoading: false)
2. useEffect verifica estado:
   - isAuthenticated? → router.replace('/dashboard')
   - Não autenticado? → router.replace('/login')
3. Fim (1 redirecionamento)
```

### **3. Usuário em `/login`**
```
1. Renderiza formulário (SEM verificações)
2. Usuário preenche e clica "Entrar"
3. login(email, password) do AuthContext
4. POST /auth/login
5. Cookie definido pelo backend
6. AuthContext: router.push('/dashboard')
7. Fim (1 redirecionamento)
```

### **4. Usuário tenta acessar `/dashboard` (ou qualquer rota autenticada)**
```
1. (authenticated)/layout.tsx monta
2. useEffect verifica:
   - isLoading? → Mostra loading
   - isAuthenticated? → Renderiza conteúdo
   - Não autenticado? → router.replace('/login')
3. Fim
```

### **5. Usuário navega entre páginas autenticadas**
```
1. Layout autenticado já montado
2. useEffect não dispara (mesma instância)
3. Apenas troca o conteúdo
4. ZERO requisições, ZERO redirecionamentos
```

### **6. Usuário faz logout**
```
1. Clica em "Sair"
2. logout() do AuthContext
3. POST /auth/logout
4. Estado limpo
5. router.push('/login')
6. Fim
```

---

## 📊 Pontos de Verificação (onde useEffect existe)

| Arquivo | useEffect? | Função |
|---------|-----------|--------|
| `contexts/AuthContext.tsx` | ✅ **SIM** | Verifica auth UMA vez (useRef) |
| `app/page.tsx` | ✅ **SIM** | Redireciona root para login/dashboard |
| `app/(authenticated)/layout.tsx` | ✅ **SIM** | Protege TODAS rotas autenticadas |
| `app/login/page.tsx` | ❌ **NÃO** | Apenas formulário simples |
| `app/dashboard/page.tsx` | ❌ **NÃO** | Protegido pelo layout pai |
| Todas outras páginas | ❌ **NÃO** | Protegidas pelo layout pai |

---

## 🔒 Proteção em Camadas

```
Camada 1: AuthContext
  ├─ useRef → Garante 1 única verificação
  └─ Estado global compartilhado

Camada 2: Layout Autenticado
  ├─ useEffect → Verifica estado do AuthContext
  └─ Redireciona se não autenticado

Camada 3: Páginas Individuais
  └─ SEM verificação (confiam no layout pai)
```

---

## ✅ Garantias

### **1. Requisições**
- ✅ **1 requisição** ao carregar app (GET /auth/me)
- ✅ **0 requisições** ao navegar entre páginas
- ✅ **useRef** impede execuções múltiplas

### **2. Redirecionamentos**
- ✅ **1 redirecionamento** máximo por ação
- ✅ **router.replace()** evita histórico desnecessário
- ✅ **Sem loops** (apenas 2 useEffect de redirecionamento)

### **3. Performance**
- ✅ **Estado global** compartilhado
- ✅ **Sem re-renders** desnecessários
- ✅ **Navegação instantânea**

---

## 🧪 Console Esperado (Sucesso)

### **Ao carregar app sem autenticação:**
```
🔍 Verificando autenticação...
❌ Não autenticado: [erro 401]
📍 [Home] isLoading: false, isAuthenticated: false
🔄 [Home] Redirecionando para /login
```

### **Ao fazer login:**
```
[POST] /auth/login → 200 OK
✅ Cookie definido
[Redirecionamento para /dashboard]
📍 [AuthenticatedLayout] isLoading: false, isAuthenticated: true
```

### **Ao navegar entre páginas autenticadas:**
```
[Nenhum log - silêncio é ouro!]
```

### **Se AuthProvider re-montar (improvável):**
```
🔍 Verificando autenticação...
⚠️ checkAuth já foi executado, ignorando...
[Sem requisições, estado preservado]
```

---

## ❌ Sinais de Problema

### **Loop de redirecionamento:**
```
🔄 [Home] Redirecionando para /login
🔄 [AuthenticatedLayout] Redirecionando para /login
🔄 [Home] Redirecionando para /login
🔄 [AuthenticatedLayout] Redirecionando para /login
...
```
**Causa**: Algo está causando re-montagem contínua.
**Solução**: Verificar `app/layout.tsx` (root) se não está re-renderizando.

### **Múltiplas requisições:**
```
🔍 Verificando autenticação...
[GET] /auth/me
🔍 Verificando autenticação...
[GET] /auth/me
...
```
**Causa**: useRef não está funcionando ou AuthProvider montando múltiplas vezes.
**Solução**: Verificar se há múltiplos `<AuthProvider>` no código.

---

## 🎯 Vantagens desta Arquitetura

### **1. Simplicidade**
- ✅ Apenas 2 useEffect de redirecionamento (root e layout autenticado)
- ✅ Login sem lógica de verificação
- ✅ Páginas individuais confiando no layout pai

### **2. Performance**
- ✅ 1 requisição total
- ✅ useRef previne execuções múltiplas
- ✅ Estado global evita props drilling

### **3. Manutenibilidade**
- ✅ Fácil adicionar novas páginas (sem código de auth)
- ✅ Lógica centralizada no AuthContext
- ✅ Layout autenticado protege automaticamente

### **4. Escalabilidade**
- ✅ Suporta 1000+ páginas sem modificação
- ✅ Novo layout autenticado? Herda proteção automaticamente
- ✅ Fácil adicionar roles/permissões no futuro

---

## 📝 Checklist de Implementação

- [x] AuthContext com useRef
- [x] useEffect APENAS em:
  - [x] `contexts/AuthContext.tsx`
  - [x] `app/page.tsx`
  - [x] `app/(authenticated)/layout.tsx`
- [x] Login SEM useEffect
- [x] Páginas individuais SEM verificação
- [x] Logs detalhados para debug
- [x] router.replace() ao invés de router.push()
- [x] Estado global compartilhado

---

## 🚀 Próximos Passos (Opcional)

1. **Remover logs de produção**:
   ```typescript
   if (process.env.NODE_ENV === 'development') {
     console.log('🔍 Verificando autenticação...');
   }
   ```

2. **Adicionar refresh token**:
   - Auto-renovação antes de expirar
   - Interceptor no Axios

3. **Adicionar roles/permissions**:
   - Verificação no layout autenticado
   - Componentes condicionais baseados em role

4. **Cache otimista**:
   - SessionStorage como fallback
   - Reduz flash de loading

---

*Implementado em: 18 de outubro de 2025*  
*Versão: 2.0 - Simplificada*  
*Status: ✅ Pronto para produção*

