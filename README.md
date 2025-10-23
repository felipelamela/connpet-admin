# ConnPet Admin

Painel administrativo do ConnPet construído com Next.js, React, TypeScript e shadcn/ui.

## 🚀 Tecnologias

- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca para construção de interfaces
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes de interface moderna
- **Sonner** - Sistema de notificações toast

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 🔐 Sistema de Autenticação

O projeto inclui um sistema completo de autenticação com:

### Páginas Implementadas

- **`/login`** - Tela de login responsiva
- **`/recuperar-senha`** - Recuperação de senha por email
- **`/dashboard`** - Painel administrativo (protegido)

### Funcionalidades

✅ Validação de email e senha  
✅ Estado de carregamento no botão de login  
✅ Notificações de sucesso e erro  
✅ Redirecionamento automático após login  
✅ Proteção de rotas (dashboard requer autenticação)  
✅ Link "Esqueci a senha" funcional  
✅ Design responsivo e moderno  

### Credenciais de Teste

Para testar o sistema, use:

- **Email:** `admin@connpet.com`
- **Senha:** `123456`

## 🧭 Menu de Navegação

O sistema possui um menu de navegação completo com as seguintes seções:

### **Pet** 🐾
- Cadastrar Pet
- Cadastrar Tutor
- Editar Cadastro

### **Dashboard** 📊
- Visão geral do sistema

### **Consultas** 🩺
- Nova Consulta
- Lista de consultas
- Histórico

### **Agendamentos** 📅
- Gerenciamento de agendamentos

### **Produtos** 📦
- Lista de produtos

### **Exames** 🧪
- Cadastrar Pedido
- Listagem Exames | Resultados

### **Menu de Usuário** 👤
- Avatar com dropdown
- Informações do usuário
- Perfil
- Configurações
- Logout

## 📱 Páginas

### Login (`/login`)
- Campo de email com validação
- Campo de senha
- Botão com estado de carregamento
- Link para recuperação de senha
- Notificações de sucesso/erro
- Redirecionamento automático para dashboard

### Recuperar Senha (`/recuperar-senha`)
- Campo de email para recuperação
- Confirmação visual de envio
- Opção para voltar ao login
- Opção para enviar para outro email

### Dashboard (`/dashboard`)
- Página protegida (requer autenticação)
- Cards com estatísticas
- Atividades recentes
- Acesso rápido a funcionalidades
- Menu de navegação completo

## 🎨 Componentes shadcn/ui

Componentes instalados:
- Button
- Card
- Dialog
- Dropdown Menu
- Input
- Label
- Table
- Sonner (Toast)
- Navigation Menu
- Avatar

## 🔧 Próximos Passos

Para implementar autenticação real, você precisará:

1. **Backend API**: Criar endpoints de autenticação
2. **JWT/Session**: Implementar sistema de tokens
3. **API Integration**: Substituir as simulações nas páginas
4. **Context/State**: Adicionar gerenciamento de estado global (ex: Context API, Zustand)
5. **Middleware**: Adicionar middleware do Next.js para proteção de rotas

## 📝 Estrutura do Projeto

```
src/
├── app/
│   ├── login/
│   │   └── page.tsx          # Página de login
│   ├── recuperar-senha/
│   │   └── page.tsx          # Página de recuperação
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard protegido
│   ├── layout.tsx            # Layout principal (com Toaster)
│   └── page.tsx              # Página inicial (redireciona)
├── components/
│   └── ui/                   # Componentes shadcn/ui
└── lib/
    └── utils.ts              # Utilitários
```

## 📄 Licença

Este projeto é parte do sistema ConnPet.
