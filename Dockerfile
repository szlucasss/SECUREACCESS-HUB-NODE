# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copia arquivos de dependência
COPY package*.json ./

# Instala todas as dependências (incluindo devDependencies para o build)
RUN npm install --legacy-peer-deps

# Copia o código fonte
COPY . .

# Compila o TypeScript para JavaScript (pasta dist)
RUN npm run build

# Etapa 2: Produção
FROM node:20-alpine

WORKDIR /app

# Copia apenas o package.json para instalar dependências de produção
COPY package*.json ./

# Instala APENAS dependências de produção (mais leve e seguro)
RUN npm install --only=production --legacy-peer-deps

# Copia os arquivos compilados da etapa de build
COPY --from=builder /app/dist ./dist

# Copia arquivos necessários (ex: .env se não for injetado, migrations)
# COPY .env .env (Em produção real, usamos variáveis de ambiente do sistema/container)

# Expõe a porta da API
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "dist/index.js"]
