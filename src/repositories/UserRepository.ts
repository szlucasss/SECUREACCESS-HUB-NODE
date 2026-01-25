import { User } from '../entities/User';
import { BaseRepository } from './BaseRepository';

/**
 * Repositório específico para a entidade User.
 * Herda todos os métodos CRUD do BaseRepository e adiciona métodos específicos.
 */
export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User);
  }

  /**
   * Busca um usuário pelo email.
   * @param email Email do usuário
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOneBy({ email });
  }

  /**
   * Busca um usuário pelo ID do Keycloak (sub).
   * Útil para sincronizar dados no login.
   * @param keycloakId ID do usuário no Keycloak
   */
  async findByKeycloakId(keycloakId: string): Promise<User | null> {
    return await this.repository.findOneBy({ keycloakId });
  }
}

