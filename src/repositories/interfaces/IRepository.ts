import { DeepPartial } from 'typeorm';

/**
 * Interface genérica para repositórios.
 * Define os métodos padrão que todo repositório deve implementar.
 * T representa a entidade (ex: User, Product).
 */
export interface IRepository<T> {
  create(data: DeepPartial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  update(id: string, data: DeepPartial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

