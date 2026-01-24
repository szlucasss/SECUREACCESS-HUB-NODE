import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Middlewares de Segurança e Parse
app.use(helmet()); // Adiciona headers de segurança HTTP (proteção contra XSS, clickjacking, etc)
app.use(cors()); // Permite que outros domínios (ex: seu frontend React) acessem esta API
app.use(express.json()); // Permite que a API entenda requisições com corpo em JSON
app.use(express.urlencoded({ extended: true })); // Permite entender dados de formulários (URL encoded)

// Rota de Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
    uptime: process.uptime(),
  });
});

// Rota Raiz
app.get('/', (req: Request, res: Response) => {
  res.send('API do SecureAccess Hub está rodando!');
});

// Inicialização do Servidor
app.listen(port, () => {
  console.log(`[servidor]: Servidor rodando em http://localhost:${port}`);
});
