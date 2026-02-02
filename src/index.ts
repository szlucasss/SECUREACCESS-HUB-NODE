import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { authMiddleware } from './middlewares/auth.middleware';
import { checkRole } from './middlewares/role.middleware';
import { limiter } from './middlewares/rateLimit.middleware';
import { requestLogger } from './middlewares/logger.middleware';
import { AppDataSource } from './config/data-source';
import userRoutes from './routes/user.routes';
import 'reflect-metadata';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Inicializa a conexão com o banco de dados
AppDataSource.initialize()
  .then(() => {
    console.log('[banco de dados]: Conexão com o banco de dados estabelecida com sucesso!');
  })
  .catch((error) => console.log(error));

// Middlewares de Segurança e Parse
app.use(helmet()); // Adiciona headers de segurança HTTP (proteção contra XSS, clickjacking, etc)
app.use(cors()); // Permite que outros domínios (ex: frontend React) acessem esta API
app.use(limiter); // Aplica rate limiting em todas as rotas
app.use(requestLogger); // Logs estruturados com Correlation ID
app.use(express.json()); // Permite que a API entenda requisições com corpo em JSON
app.use(express.urlencoded({ extended: true })); // Permite entender dados de formulários (URL encoded)

// Rotas da API
app.use('/users', userRoutes);

import { redis } from './config/redis';

// Rota de Health Check Detalhado
app.get('/health', async (req: Request, res: Response) => {
  const healthcheck = {
    status: 'UP',
    timestamp: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
    uptime: process.uptime(),
    services: {
      database: 'UNKNOWN',
      redis: 'UNKNOWN',
    },
  };

  try {
    // Verifica Banco de Dados
    if (AppDataSource.isInitialized) {
      healthcheck.services.database = 'UP';
    } else {
      healthcheck.services.database = 'DOWN';
      healthcheck.status = 'DOWN';
    }

    // Verifica Redis
    if (redis.status === 'ready') {
      healthcheck.services.redis = 'UP';
    } else {
      healthcheck.services.redis = 'DOWN';
      healthcheck.status = 'DOWN';
    }

    const httpStatus = healthcheck.status === 'UP' ? 200 : 503;
    res.status(httpStatus).json(healthcheck);
  } catch (error) {
    healthcheck.status = 'DOWN';
    res.status(503).json(healthcheck);
  }
});

// Rota Raiz
app.get('/', (req: Request, res: Response) => {
  res.send('API do SecureAccess Hub está rodando!');
});

// Rota de autenticação
app.get('/auth/me', authMiddleware, (req: Request, res: Response) => {
  res.json({
    message: 'Você está autenticado!',
    user: req.user, // Retorna os dados do token decodificado
  });
});

app.get('/secure/admin', authMiddleware, checkRole(['ADMIN']), (req: Request, res: Response) => {
  res.json({
    message: 'Bem-vindo à área administrativa!',
    secretData: 'Dados sensíveis que apenas admins podem ver',
  });
});

// Inicialização do Servidor
app.listen(port, () => {
  console.log(`[servidor]: Servidor rodando em http://localhost:${port}`);
});
