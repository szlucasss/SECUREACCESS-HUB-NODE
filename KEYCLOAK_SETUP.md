# 🔐 Configuração do Keycloak (Identity Provider)

Este documento detalha o setup do Keycloak utilizado no projeto **SecureAccess Hub**, explicando cada configuração realizada e o motivo por trás dela.

---

## 1. Criação do Realm (`security-realm`)
**O que é:** Um Realm é um espaço isolado no Keycloak que gerencia um conjunto de usuários, credenciais, roles e grupos.
**Motivo:** Não utilizamos o realm `master` para aplicações. Criar um realm dedicado (`security-realm`) isola nossa aplicação, permitindo que o `master` seja usado apenas para administração do servidor Keycloak.

---

## 2. Definição de Roles (Papéis)
Criamos as seguintes roles globais no Realm para controle de acesso (RBAC):

- **ADMIN**: Acesso total ao sistema.
- **USER**: Acesso padrão às funcionalidades básicas.
- **AUDITOR**: Acesso apenas de leitura para relatórios e logs.

**Motivo:** As roles permitem que o backend decida **o que** o usuário pode fazer (Autorização) sem precisar saber quem ele é, apenas verificando o "crachá" que ele carrega.

---

## 3. Configuração dos Clients

### 3.1. Client Backend (`backend-node`)
- **Tipo:** Confidential (Confidencial).
- **Service Accounts:** Habilitado.
- **Motivo:** Este client representa nossa API Node.js. Ele é "confidencial" porque roda no servidor e pode guardar segredos (Client Secret) com segurança. Ele usa "Service Accounts" para, se necessário, realizar tarefas em background sem um usuário logado.

### 3.2. Client Frontend (`frontend-react`)
- **Tipo:** Public (Público).
- **Redirect URIs:** `http://localhost:5173/*` (Vite) e `http://localhost:3000/*`.
- **Web Origins:** `+` (Permite CORS para as origens acima).
- **Motivo:** Aplicações Single Page (SPA) como React rodam no navegador do usuário e não conseguem esconder segredos. Por isso, usamos o tipo "Public" com fluxo PKCE (padrão do Keycloak moderno) para login seguro.

---

## 4. Configurações de Token (JWT)

### 4.1. Audience (`aud`)
Configuramos um **Client Scope** chamado `backend-audience` e o vinculamos ao client `frontend-react`.
- **O que faz:** Adiciona o campo `aud: "backend-node"` no token gerado pelo frontend.
- **Motivo:** Segurança. Isso garante que o token foi emitido especificamente para ser consumido pela nossa API. Se o usuário tentar usar esse token em outro sistema, ele será rejeitado.

### 4.2. Mapper de Roles
Editamos o mapper de roles para que elas apareçam no JSON do token dentro de uma chave simplificada (ex: `roles` ou `realm_access.roles`).
- **Motivo:** Facilita a leitura e validação do token pelo middleware do Node.js, evitando que tenhamos que navegar por estruturas JSON muito complexas para achar uma simples role.

---

## 5. Como Testar (Simulação de Login)
Para verificar se tudo está funcionando sem precisar do frontend, podemos simular um login via terminal:

**PowerShell:**
```powershell
$params = @{
    client_id = "frontend-react"
    username = "teste"
    password = "123"
    grant_type = "password"
}
Invoke-RestMethod -Uri "http://localhost:8080/realms/security-realm/protocol/openid-connect/token" -Method Post -Body $params
```

**Curl (Bash):**
```bash
curl -X POST http://localhost:8080/realms/security-realm/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=frontend-react" \
  -d "username=teste" \
  -d "password=123" \
  -d "grant_type=password"
```


