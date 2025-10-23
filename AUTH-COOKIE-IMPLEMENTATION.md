# 🔐 Implementação de Autenticação com Cookies HttpOnly

## ✅ O Que Foi Implementado (Frontend)

### 1. **API Service Refatorado** (`src/services/api.ts`)
- ✅ Migrado de `fetch` para `axios`
- ✅ `withCredentials: true` - Envia cookies automaticamente
- ✅ Interceptor de erros com redirecionamento automático (401 → /login)
- ✅ Métodos completos: login, logout, get, post, put, patch, delete, uploadFile

### 2. **Layout Autenticado Atualizado** (`src/app/(authenticated)/layout.tsx`)
- ✅ Removido `localStorage.getItem("authToken")`
- ✅ Implementado verificação via endpoint `/auth/verify`
- ✅ Cookie HttpOnly enviado automaticamente
- ✅ Loading state melhorado
- ✅ Tratamento de erros com toast

---

## ⚠️ O Que Precisa Ser Implementado (Backend)

### 1. **Instalar Plugin de Cookies do Fastify**

```bash
cd connpet-server
npm install @fastify/cookie
```

### 2. **Configurar Cookies no `main.ts`**

```typescript
// src/main.ts
import fastifyCookie from '@fastify/cookie';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: false,
      trustProxy: true,
      bodyLimit: 1048576,
    }),
  );

  // Registrar plugin de cookies
  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET || 'connpet-cookie-secret-key',
  });

  // CORS com credentials
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:3001'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true, // 🔥 IMPORTANTE: Permitir cookies
    maxAge: 3600,
  });

  // ... resto do código
}
```

### 3. **Atualizar `auth.controller.ts`**

```typescript
// src/auth/auth.controller.ts
import { Controller, Post, Body, Res, Get, UseGuards } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login.auth.dto';
import { Public } from '../commom/decorators/public.decorator';
import { JwtAuthGuard } from '../commom/guardians/jwt-auth.guardian';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(
    @Body() loginAuthDto: LoginAuthDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    const authResponse = await this.authService.login(loginAuthDto);
    
    // Definir cookie HttpOnly + Secure + SameSite
    reply.setCookie('access_token', authResponse.access_token, {
      httpOnly: true,        // Não acessível via JavaScript (XSS protection)
      secure: process.env.NODE_ENV === 'production', // HTTPS em produção
      sameSite: 'lax',       // Proteção contra CSRF
      maxAge: authResponse.expires_in * 1000, // Converte para milissegundos
      path: '/',             // Disponível em todo o site
      domain: process.env.COOKIE_DOMAIN, // Ex: .yourdomain.com
    });

    // Retorna apenas os dados do usuário (sem o token)
    return {
      user: authResponse.user,
      expires_in: authResponse.expires_in,
    };
  }

  @Public()
  @Post('logout')
  async logout(@Res({ passthrough: true }) reply: FastifyReply) {
    // Limpar o cookie
    reply.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return { message: 'Logout realizado com sucesso' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify')
  async verify() {
    // Se chegou aqui, o guard validou o token
    return { authenticated: true };
  }
}
```

### 4. **Atualizar `jwt-auth.guardian.ts`**

```typescript
// src/commom/guardians/jwt-auth.guardian.ts
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Verificar se a rota é pública
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<FastifyRequest>();
    
    // Extrair token do cookie em vez do header
    const token = request.cookies?.access_token;
    
    if (token) {
      // Adicionar ao header para o Passport processar
      request.headers.authorization = `Bearer ${token}`;
    }
    
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Token inválido ou expirado');
    }
    return user;
  }
}
```

### 5. **Adicionar Variáveis de Ambiente**

```env
# .env
COOKIE_SECRET=gere-uma-chave-secreta-aqui-64-caracteres
COOKIE_DOMAIN=localhost
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

---

## 🔄 Fluxo de Autenticação

### Login
```
1. Frontend: api.login({ email, password })
2. Backend: Valida credenciais
3. Backend: Gera JWT
4. Backend: Define cookie HttpOnly com JWT
5. Backend: Retorna apenas dados do usuário
6. Frontend: Armazena dados do usuário no state/context
```

### Requisições Protegidas
```
1. Frontend: api.get('/pets')
2. Browser: Envia cookie automaticamente
3. Backend: JwtAuthGuard extrai token do cookie
4. Backend: Valida token
5. Backend: Processa requisição
6. Frontend: Recebe resposta
```

### Verificação de Autenticação
```
1. Frontend: Layout chama api.get('/auth/verify')
2. Browser: Envia cookie automaticamente
3. Backend: JwtAuthGuard valida token
4. Backend: Retorna { authenticated: true }
5. Frontend: Renderiza conteúdo protegido
```

### Logout
```
1. Frontend: api.logout()
2. Backend: Limpa cookie
3. Backend: Retorna confirmação
4. Frontend: Redireciona para /login
```

---

## 🧪 Atualizações Necessárias nos Testes

### 1. **Atualizar `auth.controller.spec.ts`**

Adicionar testes para:
- ✅ Verificar se cookie é definido no login
- ✅ Verificar se cookie é limpo no logout
- ✅ Testar endpoint `/auth/verify`

### 2. **Mock do FastifyReply**

```typescript
const mockReply = {
  setCookie: jest.fn(),
  clearCookie: jest.fn(),
};
```

---

## 🎯 Vantagens da Implementação

| Aspecto | localStorage | Cookie HttpOnly |
|---------|--------------|-----------------|
| **XSS Protection** | ❌ Vulnerável | ✅ Protegido |
| **CSRF Protection** | ✅ Imune | ✅ Com SameSite |
| **Auto-enviado** | ❌ Manual | ✅ Automático |
| **Acesso JS** | ✅ Acessível | ❌ Não acessível |
| **HTTPS Only** | ❌ Não | ✅ Com Secure flag |
| **Expiração** | ❌ Manual | ✅ Automática |

---

## 🔒 Configurações de Segurança

### Flags do Cookie

```typescript
{
  httpOnly: true,        // JavaScript não pode acessar
  secure: true,          // Apenas HTTPS (produção)
  sameSite: 'lax',       // Proteção contra CSRF
  maxAge: 86400000,      // Expira em 24h
  path: '/',             // Disponível em todo site
  domain: '.domain.com', // Compartilhar entre subdomínios
}
```

### SameSite Options

- **`strict`**: Cookie nunca enviado em requisições cross-site (mais seguro, pode quebrar alguns fluxos)
- **`lax`**: Cookie enviado em navegação top-level (recomendado, equilíbrio segurança/UX)
- **`none`**: Cookie sempre enviado (requer `secure: true`)

---

## ⚠️ Importantes Considerações

### 1. **CORS**
- Deve estar configurado com `credentials: true`
- `origin` deve ser específico (não usar `*`)
- Frontend e backend devem estar no mesmo domínio/subdomínio (ou configurar CORS corretamente)

### 2. **HTTPS em Produção**
- Cookie `secure: true` só funciona em HTTPS
- Desenvolvimento (HTTP): usar `secure: false`

### 3. **Domain e Path**
- Configure `domain` para compartilhar cookies entre subdomínios
- `path: '/'` torna cookie disponível em todas as rotas

### 4. **Refresh Token**
- Considere implementar refresh token em cookie separado
- Refresh token com maior tempo de expiração

---

## 📝 Checklist de Implementação

### Frontend (✅ Completo)
- [x] Instalar axios
- [x] Refatorar api.ts com axios
- [x] Configurar withCredentials: true
- [x] Atualizar layout autenticado
- [x] Remover localStorage
- [x] Implementar verificação via /auth/verify

### Backend (⚠️ Pendente)
- [ ] Instalar @fastify/cookie
- [ ] Configurar plugin no main.ts
- [ ] Atualizar CORS com credentials: true
- [ ] Modificar auth.controller.ts para usar cookies
- [ ] Atualizar JwtAuthGuard para ler cookies
- [ ] Criar endpoint /auth/verify
- [ ] Adicionar variáveis de ambiente
- [ ] Atualizar testes
- [ ] Testar fluxo completo

---

## 🚀 Comandos Rápidos

### Backend
```bash
cd connpet-server
npm install @fastify/cookie
npm test -- src/auth
```

### Frontend
```bash
cd connpet-admin
npm run dev
# Testar login, navegação e logout
```

---

**Pronto para implementação!** 🎉

Quando o backend estiver implementado, o sistema estará **100% seguro** com cookies HttpOnly! 🔒

