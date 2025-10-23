# 🏗️ Estrutura de Pastas - ConnPet Admin

## 📂 Nova Estrutura Limpa

```
src/app/
├── _archived/                      # ❌ Rotas antigas (não usadas)
│   ├── produtos/, pets/, etc      # Código legado para referência
│   └── README.md                  # Explicação do conteúdo
│
├── (authenticated)/               # ✅ Rotas autenticadas (nova estrutura)
│   ├── layout.tsx                # Verifica autenticação (sem UI)
│   │
│   ├── select-module/            # Seleção de módulo (SEM sidebar)
│   │   └── page.tsx
│   │
│   ├── (petshop)/                # Grupo: PetShop
│   │   ├── layout.tsx           # Layout com sidebar azul
│   │   └── petshop/
│   │       ├── dashboard/
│   │       ├── agendamentos/
│   │       ├── produtos/
│   │       ├── pets/
│   │       ├── tutores/
│   │       ├── servicos/
│   │       ├── pagamento/
│   │       ├── funcionarios/
│   │       ├── perfil/
│   │       └── configuracoes/
│   │
│   ├── (clinica)/               # Grupo: Clínica
│   │   ├── layout.tsx          # Layout com sidebar verde
│   │   └── clinica/
│   │       └── [mesmas rotas do petshop]
│   │
│   └── (grooming)/              # Grupo: Grooming
│       ├── layout.tsx          # Layout com sidebar roxa
│       └── grooming/
│           └── [mesmas rotas do petshop]
│
├── login/                        # ✅ Login (público)
│   └── page.tsx
│
├── recuperar-senha/             # ✅ Recuperação de senha (público)
│   └── page.tsx
│
├── layout.tsx                   # Root layout (global)
├── page.tsx                     # Página inicial (redireciona)
├── globals.css                  # Estilos globais
└── favicon.ico                  # Ícone
```

---

## 🎯 Rotas Ativas

### **Públicas (Sem Autenticação):**
```
/login                → Página de login
/recuperar-senha      → Recuperação de senha
```

### **Autenticadas:**
```
/select-module        → Seleção de módulo (SEM sidebar)

/petshop/*            → Todas as rotas do PetShop (COM sidebar azul)
/clinica/*            → Todas as rotas da Clínica (COM sidebar verde)
/grooming/*           → Todas as rotas do Grooming (COM sidebar roxa)
```

---

## 📁 Estrutura de Componentes

```
src/components/
├── sidebars/
│   └── ModuleSidebar.tsx         # Sidebar reutilizável para módulos
│
├── navbars/                      # ⚠️ Antigos (podem ser removidos)
│   ├── NavbarPetShop.tsx
│   ├── NavbarClinica.tsx
│   └── NavbarGrooming.tsx
│
├── shared/                       # ✅ Componentes reutilizáveis
│   └── DashboardContent.tsx
│
├── ui/                           # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── dropdown-menu.tsx
│   └── etc...
│
├── navbar.tsx                    # ⚠️ Antigo (não usado)
└── sidebar.tsx                   # ⚠️ Antigo (não usado)
```

---

## 🔄 Fluxo de Navegação

### **1. Acesso Inicial:**
```
Usuário não autenticado:
  / → /login

Usuário autenticado:
  / → /select-module
```

### **2. Seleção de Módulo:**
```
/select-module
  ├─→ Click em "PetShop" → /petshop/dashboard
  ├─→ Click em "Clínica" → /clinica/dashboard
  └─→ Click em "Grooming" → /grooming/dashboard
```

### **3. Navegação Dentro do Módulo:**
```
/petshop/dashboard
  ├─→ Sidebar: Click em "Produtos" → Expande submenu
  ├─→ Sidebar: Click em "Lista de Produtos" → /petshop/produtos/lista
  ├─→ Sidebar: Click em "Alterar Módulo" → Dropdown
  └─→ Dropdown: Seleciona "Clínica" → /clinica/dashboard
```

---

## 📊 Comparação: Antes vs Agora

### **Antes (Desorganizado):**
```
app/
├── produtos/        → /produtos
├── pets/           → /pets
├── tutores/        → /tutores
├── dashboard/      → /dashboard
├── petshop1/       → /petshop1 (tentativa antiga)
└── etc... (18 pastas no nível raiz)
```
**Problema:** Rotas duplicadas, sem organização, difícil manutenção

### **Agora (Organizado):**
```
app/
├── _archived/              (código antigo para referência)
├── (authenticated)/        (nova estrutura modular)
│   ├── select-module/
│   ├── (petshop)/
│   ├── (clinica)/
│   └── (grooming)/
├── login/
├── recuperar-senha/
└── [arquivos raiz]
```
**Vantagem:** Modular, escalável, fácil manutenção

---

## ✅ Benefícios da Nova Estrutura

| Aspecto | Benefício |
|---------|-----------|
| **Clareza** | Estrutura de pastas intuitiva |
| **Modularidade** | Cada módulo é independente |
| **Reuso** | Componentes compartilhados (`ModuleSidebar`, `DashboardContent`) |
| **Escalabilidade** | Fácil adicionar novos módulos |
| **Manutenção** | Código organizado por contexto |
| **Performance** | Code splitting automático do Next.js |
| **URL Limpa** | `(grupos)` não aparecem na URL |

---

## 🚀 Próximos Passos

### **1. Implementar Telas Faltantes:**

Para cada módulo (petshop, clinica, grooming), criar:

```bash
# Produtos
petshop/produtos/
  ├── lista/page.tsx
  └── cadastrar/page.tsx

# Pets
petshop/pets/
  ├── lista/page.tsx
  ├── cadastrar/page.tsx
  └── editar/page.tsx

# Tutores
petshop/tutores/
  ├── lista/page.tsx
  └── cadastrar/page.tsx

# E assim por diante...
```

### **2. Reaproveitar Código Arquivado:**

```bash
# Copiar tela de produtos do arquivo
cp src/app/_archived/produtos/lista/page.tsx \
   src/app/(authenticated)/(petshop)/petshop/produtos/lista/page.tsx

# Ajustar rotas e imports no arquivo copiado
```

### **3. Limpar Componentes Antigos:**

Depois que tudo estiver migrado:
```bash
# Remover navbars antigos (não usados)
rm src/components/navbars/Navbar*.tsx
rm src/components/navbar.tsx
rm src/components/sidebar.tsx (antigo)
```

---

## 🧹 Manutenção

### **O que DELETAR (quando seguro):**
- ✅ `src/app/_archived/` (após 3-6 meses de produção)
- ✅ `src/components/navbars/` (navbars horizontais antigos)
- ✅ `src/components/navbar.tsx` (antigo)
- ✅ `src/components/sidebar.tsx` (antigo, não confundir com `sidebars/ModuleSidebar.tsx`)

### **O que MANTER:**
- ✅ `src/components/sidebars/ModuleSidebar.tsx` (em uso)
- ✅ `src/components/shared/` (componentes reutilizáveis)
- ✅ `src/app/(authenticated)/` (estrutura nova)

---

## 📝 Convenções

### **Nomes de Pasta:**
- `(nome)` - Grupo de rota (não afeta URL)
- `_nome` - Ignorado pelo Next.js (não é rota)
- `nome/` - Rota normal

### **Estrutura de Página:**
```
modulo/funcionalidade/acao/page.tsx

Exemplos:
petshop/produtos/lista/page.tsx    → /petshop/produtos/lista
clinica/pets/cadastrar/page.tsx    → /clinica/pets/cadastrar
grooming/agendamentos/page.tsx     → /grooming/agendamentos
```

---

## 📚 Documentação Relacionada

- `ARQUITETURA-MODULAR.md` - Arquitetura completa explicada
- `TESTE-MODULAR.md` - Guia de teste dos módulos
- `_archived/README.md` - Explicação do código arquivado

---

**Estrutura organizada em:** $(date)  
**Versão:** 2.0.0

