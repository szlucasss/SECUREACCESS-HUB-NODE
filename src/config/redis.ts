import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
});

redisClient.on('connect', () => {
  console.log('⚡️ [redis]: Conectado ao Redis com sucesso!');
});

redisClient.on('error', (err) => {
  console.error('❌ [redis]: Erro na conexão:', err);
});

export const redis = redisClient;
