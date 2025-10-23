# ⚡ Início Rápido - ConnPet Admin v2.0

## 🚀 Iniciar o Sistema

### **1. Backend (Terminal 1):**
```bash
cd connpet-server

# Certifique-se que o .env existe com:
# JWT_SECRET=connpet-jwt-secret-change-in-production
# JWT_EXPIRES_IN=24h

npm run start:dev
```

### **2. Frontend (Terminal 2):**
```bash
cd connpet-admin
npm run dev
```

### **3. Acessar:**
```
http://localhost:3001
```

---

## 🔑 Login

```
Email: admin@connpet.com
Senha: 123456
```

---

## 🗺️ Mapa de Navegação

```
Login
  ↓
Seleção de Módulo (3 cards)
  ├─→ 🛒 PetShop → /petshop/dashboard
  ├─→ 🏥 Clínica → /clinica/dashboard
  └─→ ✨ Grooming → /grooming/dashboard

Dentro do Módulo (Sidebar Lateral)
  ├─ Dashboard
  ├─ Agendamentos
  ├─ Produtos ⮟
  │  ├─ Lista
  │  └─ Cadastrar
  ├─ Pets ⮟
  │  ├─ Lista
  │  ├─ Cadastrar
  │  └─ Editar
  ├─ Tutores ⮟
  │  ├─ Lista
  │  └─ Cadastrar
  ├─ Serviços ⮟
  │  ├─ Lista
  │  └─ Cadastrar
  ├─ Pagamentos
  ├─ Funcionários
  └─ Configurações
```

---

## ⌨️ Atalhos Úteis

### **Trocar de Módulo:**
```
Sidebar → "Alterar Módulo" → Escolher módulo
```

### **Voltar à Seleção:**
```
Sidebar → "Alterar Módulo" → "Voltar à seleção"
```

### **Logout:**
```
Sidebar → Menu do Usuário → "Sair"
```

---

## 🎨 Cores dos Módulos

```
🛒 PetShop   → Azul   (text-blue-600)
🏥 Clínica   → Verde  (text-green-600)
✨ Grooming  → Roxo   (text-purple-600)
```

---

## 📱 URLs Importantes

### **Públicas:**
```
/login              - Login
/recuperar-senha    - Recuperação de senha
```

### **Autenticadas:**
```
/select-module                  - Seleção de módulo

/petshop/dashboard             - Dashboard PetShop
/petshop/produtos/lista        - Produtos (exemplo)

/clinica/dashboard             - Dashboard Clínica
/clinica/pets/lista           - Pets (exemplo)

/grooming/dashboard            - Dashboard Grooming
```

### **Erros:**
```
/rota-invalida                 - 404 Global (redireciona)
/petshop/rota-invalida        - 404 Autenticado (opções)
```

---

## 🐛 Troubleshooting Rápido

### **Problema: Loop infinito**
```bash
# Solução:
1. Ctrl+C (parar dev server)
2. rm -rf .next (limpar cache)
3. npm run dev
4. F5 (hard refresh no navegador)
```

### **Problema: Token inválido**
```bash
# Backend:
Verifique se o .env tem JWT_SECRET definido

# Frontend:
DevTools → Application → Cookies → Delete All
Faça login novamente
```

### **Problema: 404 em rotas de módulo**
```bash
# Causa: Página ainda não implementada
# Exemplo: /petshop/agendamentos não existe ainda

# Ver telas disponíveis:
ls src/app/(authenticated)/(petshop)/petshop/
```

### **Problema: Sidebar não aparece**
```bash
# Verifique se está acessando a rota correta:
✅ /petshop/dashboard     (tem sidebar)
❌ /select-module         (SEM sidebar - correto)
❌ /dashboard             (404 - rota antiga)
```

---

## 📊 Status das Telas

### **✅ Implementadas:**
- Dashboard (3 módulos)
- Seleção de módulo
- Login
- Recuperar senha
- 404 (global e autenticado)

### **⏳ Pendentes (em _archived para referência):**
- Agendamentos
- Produtos (lista, cadastro, edição)
- Pets (lista, cadastro, edição)
- Tutores (lista, cadastro)
- Serviços (lista, cadastro)
- Pagamentos
- Funcionários
- Perfil
- Configurações

**Como migrar:** Copie de `_archived/` e ajuste as rotas!

---

## ⚡ Comandos Essenciais

```bash
# Iniciar dev
npm run dev

# Build para produção
npm run build

# Rodar produção
npm run start

# Limpar cache
rm -rf .next

# Adicionar componente UI
npx shadcn@latest add [componente]

# Ver estrutura
tree src/app -L 4
```

---

## 📚 Documentação Completa

| Arquivo | Conteúdo |
|---------|----------|
| `INICIO-RAPIDO.md` | ⭐ Este arquivo (guia rápido) |
| `ARQUITETURA-MODULAR.md` | Explicação técnica detalhada |
| `TESTE-MODULAR.md` | Guia completo de testes |
| `ESTRUTURA-LIMPA.md` | Organização de pastas |
| `SISTEMA-404.md` | Sistema de páginas não encontradas |
| `RESUMO-IMPLEMENTACAO.md` | Resumo de tudo implementado |

---

## 🎯 Começar a Desenvolver

### **Adicionar nova tela no PetShop:**
```bash
# 1. Criar o arquivo
mkdir -p src/app/(authenticated)/(petshop)/petshop/nova-tela
touch src/app/(authenticated)/(petshop)/petshop/nova-tela/page.tsx

# 2. Implementar
export default function NovaTela() {
  return <div>Minha Nova Tela</div>;
}

# 3. Acessar
http://localhost:3001/petshop/nova-tela
```

### **Adicionar item na sidebar:**
```typescript
// src/components/sidebars/ModuleSidebar.tsx
// Linha ~70 (dentro de menuItems):
{
  title: "Minha Nova Tela",
  icon: Star,
  href: `/${modulePrefix}/nova-tela`,
}
```

---

## ✅ Checklist Inicial

- [ ] Backend rodando (porta 5000)
- [ ] Frontend rodando (porta 3001)
- [ ] .env configurado no backend
- [ ] Consegue fazer login
- [ ] Vê a tela de seleção de módulos
- [ ] Consegue acessar os 3 módulos
- [ ] Sidebar aparece corretamente
- [ ] Consegue trocar de módulo
- [ ] Consegue fazer logout

---

## 🎉 Pronto!

Você agora tem uma **arquitetura modular completa** pronta para escalar!

**Próximo passo:** Implementar as telas de cada módulo conforme necessário.

---

**Versão:** 2.0.0  
**Data:** $(date)  
**Status:** 🚀 PRONTO PARA USO

