# 📦 SECUREACCESS HUB (NODE.JS)

O SecureAccess Hub é um sistema robusto de gerenciamento de acesso construído com Node.js, projetado para demonstrar segurança de nível empresarial, escalabilidade e padrões arquiteturais modernos. Ele apresenta uma API backend segura, controle de acesso baseado em função (RBAC) via Keycloak e um frontend React responsivo.

Este projeto demonstra uma implementação completa de autenticação moderna, separando Identity Provider (Keycloak) de Resource Server (API), seguindo as melhores práticas de mercado.

---

## 🚀 Tecnologias

### Backend
- **Runtime**: Node.js
- **Framework**: Express (com TypeScript)
- **Banco de Dados**: PostgreSQL (TypeORM)
- **Cache**: Redis (IOredis)
- **Autenticação**: JWT, Keycloak (jwks-rsa)
- **Validação**: class-validator, class-transformer
- **Segurança**: Helmet, CORS, Rate Limiting
- **Observabilidade**: Winston (Logs JSON + Correlation ID)

### Frontend
- **Framework**: React (Vite + TypeScript)
- **Auth**: Keycloak-js
- **HTTP Client**: Axios (com interceptors)
- **Roteamento**: React Router DOM

### Infraestrutura & DevOps
- **Containerização**: Docker, Docker Compose
- **CI/CD**: GitHub Actions (Pipeline de Build, Lint e Docker)
- **Qualidade**: ESLint, Prettier

---

## ✨ Funcionalidades

- **Autenticação & Autorização**: Fluxo OAuth2/OIDC com Keycloak.
- **RBAC (Role-Based Access Control)**: Permissões granulares (ADMIN, USER, AUDITOR).
- **Arquitetura Limpa**: Separação em Controllers, Services, Repositories e DTOs.
- **Performance**:
    - Cache de listagens e usuários com Redis.
    - Paginação de resultados.
    - Índices no banco de dados.
- **Segurança**: Rate limiting por IP, sanitização de entrada, validação de tokens RS256.
- **Frontend Seguro**: Rotas protegidas, renovação automática de token.

---

## 🛠️ Como Rodar o Projeto

### Pré-requisitos
- Docker e Docker Compose instalados.
- Node.js v20+ (apenas se quiser rodar fora do Docker).

### 1. Clonar e Configurar
```bash
git clone https://github.com/szlucasss/SECUREACCESS-HUB-NODE.git
cd SECUREACCESS-HUB-NODE
```

Crie o arquivo `.env` na raiz (baseado no exemplo abaixo):
```env
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=secureaccess_db
KEYCLOAK_URL=
KEYCLOAK_REALM=
REDIS_HOST=
REDIS_PORT=
```

### 2. Subir a Infraestrutura
```bash
docker compose up -d
```
*Isso iniciará: PostgreSQL, Redis e Keycloak.*

### 3. Configurar o Keycloak
Siga o guia detalhado em [`KEYCLOAK_SETUP.md`](./KEYCLOAK_SETUP.md) para criar o Realm, Clients e Usuários.

### 4. Rodar o Backend
```bash
# Instalar dependências
npm install

# Rodar migrations (criar tabelas)
npm run migration:run

# Iniciar servidor
npm run start:dev
```
*Acesse a API em: http://localhost:3000*

### 5. Rodar o Frontend
```bash
cd frontend
npm install
npm run dev
```
*Acesse o App em: http://localhost:5173*

---

## 🧪 Testes de Carga e Segurança
- **Health Check**: `GET /health` (verifica Banco e Redis).
- **Rate Limit**: Tente fazer > 100 requisições em 15 min e veja o bloqueio.
- **Auth**: Tente acessar `/secure/admin` sem a role ADMIN.

---

## 📄 Licença
Este projeto está licenciado sob a Licença MIT.
