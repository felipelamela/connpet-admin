# 🏗️ Arquitetura Modular - ConnPet Admin

## 📋 Visão Geral

O ConnPet Admin foi reestruturado em uma arquitetura modular com 3 painéis independentes:

- **🛒 PetShop** - Gerenciamento de produtos, vendas e estoque
- **🏥 Clínica Veterinária** - Atendimentos, prontuários e exames
- **✨ Grooming** - Serviços de banho e tosa

Cada módulo possui:
- ✅ Navbar específico
- ✅ Rotas isoladas
- ✅ Layout próprio
- ✅ Componentes reaproveitáveis

---

## 📁 Estrutura de Pastas

```
src/app/(authenticated)/
├── select-module/              # Seleção de módulo (sem navbar)
│   └── page.tsx
│
├── (petshop)/                 # Grupo de rotas: PetShop
│   ├── layout.tsx            # Layout com NavbarPetShop
│   └── petshop/
│       ├── dashboard/
│       ├── agendamentos/
│       ├── produtos/
│       ├── pets/
│       ├── tutores/
│       ├── servicos/
│       ├── pagamento/
│       ├── funcionarios/
│       ├── perfil/
│       └── configuracoes/
│
├── (clinica)/                # Grupo de rotas: Clínica
│   ├── layout.tsx           # Layout com NavbarClinica
│   └── clinica/
│       └── [mesmas rotas]
│
└── (grooming)/              # Grupo de rotas: Grooming
    ├── layout.tsx          # Layout com NavbarGrooming
    └── grooming/
        └── [mesmas rotas]

src/components/
├── navbars/                # Navbars específicos
│   ├── NavbarPetShop.tsx
│   ├── NavbarClinica.tsx
│   └── NavbarGrooming.tsx
│
└── shared/                 # Componentes reutilizáveis
    └── DashboardContent.tsx
```

---

## 🎯 Como Funciona

### 1. **Login → Seleção de Módulo**
```
Usuário faz login
  ↓
Redireciona para /select-module
  ↓
Usuário escolhe: PetShop | Clínica | Grooming
  ↓
Redireciona para: /petshop/dashboard | /clinica/dashboard | /grooming/dashboard
```

### 2. **Grupos de Rota do Next.js**

Os parênteses `(nome)` criam grupos de rota que **não afetam a URL**:

```
Arquivo: app/(authenticated)/(petshop)/petshop/dashboard/page.tsx
URL: /petshop/dashboard

Arquivo: app/(authenticated)/(clinica)/clinica/dashboard/page.tsx
URL: /clinica/dashboard
```

**Vantagem:** Cada grupo pode ter seu próprio `layout.tsx` com navbar específico!

---

## 🎨 Navbars Específicos

Cada módulo tem um navbar personalizado com:

### **NavbarPetShop** (Azul)
- Cor: `text-blue-600`
- Ícone: `Store`
- Rotas: `/petshop/*`

### **NavbarClinica** (Verde)
- Cor: `text-green-600`
- Ícone: `Building2`
- Rotas: `/clinica/*`

### **NavbarGrooming** (Roxo)
- Cor: `text-purple-600`
- Ícone: `Sparkles`
- Rotas: `/grooming/*`

**Recursos comuns:**
- Navegação entre telas do módulo
- Troca de módulo (dropdown)
- Menu de usuário (perfil, configurações, logout)
- Mobile responsive (sidebar)

---

## 🔄 Alternância Entre Módulos

O usuário pode alternar entre módulos de 2 formas:

### 1. **Dropdown "Alterar Módulo"**
```
Navbar → Botão "Alterar Módulo" → Escolhe outro módulo
  ↓
Redireciona para o dashboard do módulo escolhido
```

### 2. **Voltar à Seleção**
```
Navbar → Alterar Módulo → "Voltar à seleção"
  ↓
Retorna para /select-module
```

---

## 🧩 Componentes Reutilizáveis

### **DashboardContent**
Componente genérico de dashboard que aceita props:

```typescript
<DashboardContent 
  moduleName="PetShop" 
  moduleColor="text-blue-600" 
/>
```

**Uso:**
- `(petshop)/petshop/dashboard/page.tsx`
- `(clinica)/clinica/dashboard/page.tsx`
- `(grooming)/grooming/dashboard/page.tsx`

---

## 🛠️ Como Adicionar Novas Telas

### **Exemplo: Adicionar tela de Relatórios no PetShop**

1. Criar o arquivo:
```bash
src/app/(authenticated)/(petshop)/petshop/relatorios/page.tsx
```

2. Implementar:
```typescript
export default function RelatoriosPage() {
  return <div>Relatórios do PetShop</div>;
}
```

3. Adicionar ao navbar (opcional):
```typescript
// src/components/navbars/NavbarPetShop.tsx
const navigation = [
  // ... rotas existentes
  { name: "Relatórios", href: "/petshop/relatorios", icon: FileText },
];
```

4. URL disponível: `/petshop/relatorios`

---

## 🔐 Permissões (Futuro)

### **Controle de Acesso por Módulo**

No futuro, o sistema pode restringir acesso por módulo:

```typescript
// AuthContext.tsx
interface User {
  id: string;
  name: string;
  email: string;
  modules: ['petshop', 'clinica', 'grooming']; // ← Módulos permitidos
}

// select-module/page.tsx
const modules = allModules.filter(module => 
  user.modules.includes(module.id)
);
```

**Implementar:**
1. Backend retorna `modules` no JWT
2. Frontend filtra módulos disponíveis
3. Redireciona direto se tiver apenas 1 módulo

---

## 📦 Vantagens da Arquitetura

| Aspecto | Benefício |
|---------|-----------|
| **Modularidade** | Cada módulo é independente |
| **Manutenibilidade** | Fácil adicionar/remover módulos |
| **Escalabilidade** | Pode crescer sem conflitos |
| **Reuso de Código** | Componentes compartilhados |
| **UX** | Navegação clara e intuitiva |
| **Performance** | Code splitting automático (Next.js) |

---

## 🚀 Próximos Passos

### **Implementar Telas Faltantes**

Para cada módulo, criar:
- [ ] `/agendamentos` - Lista e criação de agendamentos
- [ ] `/produtos/lista` - Listagem de produtos
- [ ] `/pets/lista` - Listagem de pets
- [ ] `/tutores/lista` - Listagem de tutores
- [ ] `/servicos/lista` - Listagem de serviços
- [ ] `/pagamento` - Gestão de pagamentos
- [ ] `/funcionarios` - Gerenciamento de equipe
- [ ] `/perfil` - Perfil do estabelecimento
- [ ] `/configuracoes` - Configurações do módulo

### **Reaproveitar Componentes Existentes**

As telas atuais em:
- `app/produtos/lista/page.tsx`
- `app/pets/lista/page.tsx`
- `app/tutores/lista/page.tsx`

Podem ser movidas/copiadas para cada módulo!

---

## 📝 Notas Técnicas

### **Route Groups (Grupos de Rota)**

- Criados com `(nome)` nos nomes de pasta
- Não afetam a URL
- Permitem layouts diferentes
- Ideal para organização lógica

### **Layouts Aninhados**

```
app/(authenticated)/layout.tsx          ← Verifica autenticação
  └── (petshop)/layout.tsx             ← Adiciona NavbarPetShop
      └── petshop/dashboard/page.tsx   ← Renderiza conteúdo
```

### **Code Splitting Automático**

Next.js automaticamente divide o código por rota:
- `/petshop/*` carrega apenas código do PetShop
- `/clinica/*` carrega apenas código da Clínica
- Performance otimizada! 🚀

---

## 🎨 Cores dos Módulos

| Módulo | Cor Principal | Classe Tailwind |
|--------|---------------|-----------------|
| PetShop | Azul | `text-blue-600 bg-blue-600` |
| Clínica | Verde | `text-green-600 bg-green-600` |
| Grooming | Roxo | `text-purple-600 bg-purple-600` |

---

## 📚 Referências

- [Next.js Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
- [Next.js Layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

---

**Arquitetura criada em:** $(date)  
**Versão:** 1.0.0

