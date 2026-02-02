import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '../config/logger';

declare global {
  namespace Express {
    interface Request {
      correlationId: string;
    }
  }
}

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const correlationId = req.headers['x-correlation-id'] as string || uuidv4();
  req.correlationId = correlationId;
  res.setHeader('X-Correlation-ID', correlationId);

  const start = Date.now();

  // Log da requisição
  Logger.http(`Incoming Request: ${req.method} ${req.url}`, {
    correlationId,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Log da resposta (quando terminar)
  res.on('finish', () => {
    const duration = Date.now() - start;
    Logger.http(`Response Sent: ${res.statusCode} (${duration}ms)`, {
      correlationId,
      statusCode: res.statusCode,
      duration,
    });
  });

  next();
};
