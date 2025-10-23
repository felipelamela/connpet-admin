# 📚 Guia de Uso da API - ConnPet Admin

## 🔧 Configuração

A API já está configurada com **Axios** e suporte a **cookies HttpOnly**. 

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🎯 Exemplos de Uso

### 1. **Login**

```typescript
import api from '@/services/api';

// Em um componente ou server action
async function handleLogin(email: string, password: string) {
  try {
    const data = await api.login(email, password);
    console.log('Usuário logado:', data.user);
    // O token JWT é armazenado automaticamente em um cookie HttpOnly
    // Você não precisa fazer nada manualmente!
  } catch (error) {
    console.error('Erro no login:', error);
  }
}
```

### 2. **Logout**

```typescript
import api from '@/services/api';

async function handleLogout() {
  try {
    await api.logout();
    // O cookie é limpo automaticamente
    // Redirecionar para página de login
    window.location.href = '/login';
  } catch (error) {
    console.error('Erro no logout:', error);
  }
}
```

### 3. **Requisições GET**

```typescript
import api from '@/services/api';

// Listar todos os pets
async function getPets() {
  try {
    const pets = await api.get('/pets');
    return pets;
  } catch (error) {
    console.error('Erro ao buscar pets:', error);
  }
}

// Buscar pet por ID
async function getPetById(id: string) {
  try {
    const pet = await api.get(`/pets/${id}`);
    return pet;
  } catch (error) {
    console.error('Erro ao buscar pet:', error);
  }
}

// GET com query parameters
async function searchPets(name: string, page: number = 1) {
  try {
    const result = await api.get('/pets', {
      name,
      page,
      limit: 10
    });
    return result;
  } catch (error) {
    console.error('Erro ao buscar pets:', error);
  }
}
```

### 4. **Requisições POST**

```typescript
import api from '@/services/api';

// Criar novo pet
async function createPet(petData: any) {
  try {
    const newPet = await api.post('/pets', petData);
    console.log('Pet criado:', newPet);
    return newPet;
  } catch (error) {
    console.error('Erro ao criar pet:', error);
  }
}

// Criar agendamento
async function createAppointment(appointmentData: any) {
  try {
    const appointment = await api.post('/appointments', appointmentData);
    return appointment;
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
  }
}
```

### 5. **Requisições PUT**

```typescript
import api from '@/services/api';

// Atualizar pet
async function updatePet(id: string, petData: any) {
  try {
    const updatedPet = await api.put(`/pets/${id}`, petData);
    console.log('Pet atualizado:', updatedPet);
    return updatedPet;
  } catch (error) {
    console.error('Erro ao atualizar pet:', error);
  }
}
```

### 6. **Requisições PATCH**

```typescript
import api from '@/services/api';

// Atualizar parcialmente
async function updatePetStatus(id: string, status: string) {
  try {
    const updatedPet = await api.patch(`/pets/${id}`, { status });
    return updatedPet;
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
  }
}
```

### 7. **Requisições DELETE**

```typescript
import api from '@/services/api';

// Deletar pet
async function deletePet(id: string) {
  try {
    await api.delete(`/pets/${id}`);
    console.log('Pet deletado com sucesso');
  } catch (error) {
    console.error('Erro ao deletar pet:', error);
  }
}
```

### 8. **Upload de Arquivo**

```typescript
import api from '@/services/api';

// Upload de imagem do pet
async function uploadPetPhoto(petId: string, file: File) {
  try {
    const result = await api.uploadFile(`/pets/${petId}/photo`, file);
    console.log('Foto enviada:', result);
    return result;
  } catch (error) {
    console.error('Erro ao enviar foto:', error);
  }
}

// Upload com nome de campo customizado
async function uploadDocument(file: File) {
  try {
    const result = await api.uploadFile('/documents', file, 'document');
    return result;
  } catch (error) {
    console.error('Erro ao enviar documento:', error);
  }
}
```

---

## 🎨 Exemplo em Componente React

```typescript
'use client';

import { useState } from 'react';
import api from '@/services/api';

export default function PetsPage() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadPets() {
    setLoading(true);
    try {
      const data = await api.get('/pets');
      setPets(data);
    } catch (error) {
      console.error('Erro ao carregar pets:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/pets/${id}`);
      // Recarregar lista
      await loadPets();
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  }

  // ... resto do componente
}
```

---

## 🔐 Autenticação Automática

### Como Funciona

1. **Login**: Quando você faz login, o backend define um cookie **HttpOnly + Secure + SameSite**
2. **Requisições**: Todas as requisições enviam automaticamente o cookie (graças ao `withCredentials: true`)
3. **Sem localStorage**: O token nunca é exposto ao JavaScript (mais seguro contra XSS)
4. **Logout**: Quando você faz logout, o cookie é limpo automaticamente

### Redirecionamento Automático

Se o token expirar (status 401), o usuário é redirecionado automaticamente para `/login`:

```typescript
// Já configurado no interceptor do axios
if (error.response?.status === 401) {
  window.location.href = '/login';
}
```

---

## 🛠️ Uso Avançado

### Obter Instância do Axios

Se precisar de configurações avançadas:

```typescript
import api from '@/services/api';

const axiosInstance = api.getAxiosInstance();

// Adicionar interceptor customizado
axiosInstance.interceptors.request.use((config) => {
  console.log('Requisição:', config.url);
  return config;
});
```

### TypeScript

Usar tipagem customizada:

```typescript
interface Pet {
  id: string;
  name: string;
  species: string;
}

// Com tipagem
const pets = await api.get<Pet[]>('/pets');
// pets é do tipo Pet[]
```

---

## ⚠️ Importante

1. **CORS**: O backend deve estar configurado com `credentials: true`
2. **Cookies**: Funcionam apenas com HTTPS em produção
3. **SameSite**: Protege contra CSRF automaticamente
4. **HttpOnly**: Protege contra XSS

---

## 🎯 Vantagens dessa Implementação

✅ **Segurança**: Cookies HttpOnly protegem contra XSS  
✅ **Automático**: Token enviado automaticamente em cada requisição  
✅ **Tratamento de Erros**: Centralizado e consistente  
✅ **TypeScript**: Suporte completo a tipos  
✅ **Interceptors**: Fácil adicionar lógica customizada  
✅ **Upload**: Suporte nativo a upload de arquivos  

---

**Feito com ❤️ para o ConnPet**

