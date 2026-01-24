# 📦 SECUREACCESS HUB (NODE.JS)

O SecureAccess Hub é um sistema robusto de gerenciamento de acesso construído com Node.js, projetado para demonstrar segurança de nível empresarial, escalabilidade e padrões arquiteturais modernos. Ele apresenta uma API backend segura, controle de acesso baseado em função (RBAC) via Keycloak e um frontend React responsivo.

## 🚀 Tecnologias

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL (via ORM)
- **Cache**: Redis
- **Autenticação**: Keycloak (OIDC/OAuth2)
- **Validação**: class-validator / zod
- **Testes**: Jest, Supertest

### Frontend
- **Framework**: React
- **Linguagem**: TypeScript
- **Gerenciamento de Estado**: React Query / Context API
- **Roteamento**: React Router
- **Cliente HTTP**: Axios

### Infraestrutura & DevOps
- **Containerização**: Docker, Docker Compose
- **CI/CD**: Azure DevOps
- **Segurança**: Helmet, CORS, Rate Limiting
- **Observabilidade**: Winston/Pino (Logs), Health Checks

## ✨ Funcionalidades

- **Autenticação e Autorização**: Fluxo de login seguro usando Keycloak com Controle de Acesso Baseado em Função (RBAC) (Admin, User, Auditor).
- **Arquitetura**: Princípios de Clean Architecture com Repository Pattern, Camada de Serviço e DTOs.
- **Segurança**: Implementa melhores práticas, incluindo sanitização de entrada, rate limiting e headers de segurança.
- **Performance**: Consultas de banco de dados otimizadas, paginação e estratégias de cache com Redis.
- **Confiabilidade**: Cobertura abrangente de testes unitários e de integração.
- **Observabilidade**: Logs estruturados e monitoramento da saúde do sistema.

## 🛠️ Como Iniciar

### Pré-requisitos
- Node.js (Última LTS)
- Docker & Docker Compose
- Git

### Instalação

1. **Clonar o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd SECUREACESS_HUB_NODE
   ```

2. **Configurar Infraestrutura**
   Inicie os serviços necessários (PostgreSQL, Redis, Keycloak) usando Docker Compose:
   ```bash
   docker compose up -d
   ```

3. **Instalar Dependências**
   ```bash
   npm install
   ```

4. **Configuração de Ambiente**
   Copie o arquivo de exemplo de ambiente e configure-o:
   ```bash
   cp .env.example .env
   ```

5. **Rodar a Aplicação**
   ```bash
   npm run dev
   ```

## 📄 Licença

Este projeto está licenciado sob a Licença MIT.
