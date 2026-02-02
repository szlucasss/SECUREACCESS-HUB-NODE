import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/User';
import { AppError } from '../utils/AppError';
import { PaginatedResult, PaginationOptions } from '../utils/Pagination';
import { CacheService } from './CacheService';

export class UserService {
  private userRepository: UserRepository;
  private cacheService: CacheService;

  constructor() {
    this.userRepository = new UserRepository();
    this.cacheService = new CacheService();
  }

  async create(data: Partial<User>): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email!);
    if (existingUser) {
      throw new AppError('Usuario ja existe', 409);
    }
    const user = await this.userRepository.create(data);
    await this.cacheService.delByPattern('users:*'); // Invalida cache de listas
    return user;
  }

  async findAll(options?: PaginationOptions): Promise<PaginatedResult<User> | User[]> {
    const cacheKey = `users:list:${options?.page || 1}:${options?.limit || 10}`;
    const cachedData = await this.cacheService.get<PaginatedResult<User> | User[]>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const result = await this.userRepository.findAll(options);
    await this.cacheService.set(cacheKey, result, 60 * 5); // Cache por 5 minutos
    return result;
  }

  async findById(id: string): Promise<User> {
    const cacheKey = `users:${id}`;
    const cachedUser = await this.cacheService.get<User>(cacheKey);

    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    await this.cacheService.set(cacheKey, user, 60 * 10); // Cache por 10 minutos
    return user;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    const updatedUser = (await this.userRepository.update(id, data))!;
    
    // Invalida caches
    await this.cacheService.del(`users:${id}`);
    await this.cacheService.delByPattern('users:list:*');
    
    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    const success = await this.userRepository.delete(id);
    if (!success) {
      throw new AppError('User not found', 404);
    }
    
    // Invalida caches
    await this.cacheService.del(`users:${id}`);
    await this.cacheService.delByPattern('users:list:*');
  }
}

