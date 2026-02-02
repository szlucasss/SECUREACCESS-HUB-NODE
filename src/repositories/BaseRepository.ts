import { Repository, EntityTarget, ObjectLiteral, DeepPartial } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { IRepository } from './interfaces/IRepository';
import { PaginatedResult, PaginationOptions } from '../utils/Pagination';

/**
 * Classe base abstrata que implementa os métodos genéricos do repositório.
 * Serve para evitar repetição de código CRUD em cada repositório específico.
 */
export class BaseRepository<T extends ObjectLiteral> implements IRepository<T> {
  protected readonly repository: Repository<T>;

  constructor(entity: EntityTarget<T>) {
    this.repository = AppDataSource.getRepository(entity);
  }

  /**
   * Cria e salva uma nova entidade no banco.
   * @param data Dados parciais da entidade
   */
  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  /**
   * Busca uma entidade pelo ID.
   * @param id ID da entidade
   */
  async findById(id: string): Promise<T | null> {
    // @ts-ignore: TypeORM typings can be tricky with generic findOneBy
    return await this.repository.findOneBy({ id });
  }

  /**
   * Retorna todas as entidades da tabela, com suporte opcional a paginação.
   */
  async findAll(options?: PaginationOptions): Promise<PaginatedResult<T> | T[]> {
    if (options) {
      const { page, limit } = options;
      const skip = (page - 1) * limit;

      const [data, total] = await this.repository.findAndCount({
        skip,
        take: limit,
        order: { createdAt: 'DESC' } as any, // Otimização: Ordena por data de criação (mais recentes primeiro)
        // select: [] // TODO: Adicionar campos específicos se necessário para reduzir payload
      });

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }

    return await this.repository.find({
      order: { createdAt: 'DESC' } as any,
    });
  }

  /**
   * Atualiza uma entidade existente.
   * @param id ID da entidade
   * @param data Dados a serem atualizados
   */
  async update(id: string, data: DeepPartial<T>): Promise<T | null> {
    await this.repository.update(id, data as any);
    return this.findById(id);
  }

  /**
   * Remove uma entidade pelo ID.
   * @param id ID da entidade
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }
}

