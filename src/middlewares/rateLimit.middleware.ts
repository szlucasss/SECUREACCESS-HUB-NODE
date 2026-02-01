import rateLimit from 'express-rate-limit';

/**
 * Middleware de Rate Limiting.
 * Limita o número de requisições que um IP pode fazer em um determinado período.
 */
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requisições por IP a cada 15 minutos
  standardHeaders: true, // Retorna info de limite nos headers `RateLimit-*`
  legacyHeaders: false, // Desabilita os headers `X-RateLimit-*`
  message: {
    status: 429,
    message: 'Muitas requisições criadas a partir deste IP, por favor tente novamente após 15 minutos.',
  },
});
