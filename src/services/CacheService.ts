import { redis } from '../config/redis';

export class CacheService {
  /**
   * Recupera um valor do cache.
   * @param key Chave do cache
   */
  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Salva um valor no cache.
   * @param key Chave do cache
   * @param value Valor a ser salvo
   * @param ttl Tempo de vida em segundos (padrão: 1 hora)
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await redis.set(key, JSON.stringify(value), 'EX', ttl);
  }

  /**
   * Remove um valor do cache.
   * @param key Chave do cache
   */
  async del(key: string): Promise<void> {
    await redis.del(key);
  }

  /**
   * Remove chaves que correspondem a um padrão.
   * Útil para invalidar cache de listas (ex: "users:*").
   * @param pattern Padrão de chaves (ex: "users:*")
   */
  async delByPattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(keys);
    }
  }
}
