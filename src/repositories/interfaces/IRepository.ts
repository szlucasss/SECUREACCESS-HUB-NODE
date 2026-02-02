import { DeepPartial } from 'typeorm';
import { PaginatedResult, PaginationOptions } from '../../utils/Pagination';

/**
 * Interface genérica para repositórios.
 * Define os métodos padrão que todo repositório deve implementar.
 * T representa a entidade (ex: User, Product).
 */
export interface IRepository<T> {
  create(data: DeepPartial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(options?: PaginationOptions): Promise<PaginatedResult<T> | T[]>;
  update(id: string, data: DeepPartial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

