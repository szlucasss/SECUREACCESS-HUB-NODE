import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/User';
import { AppError } from '../utils/AppError';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async create(data: Partial<User>): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email!);
    if (existingUser) {
      throw new AppError('Usuario ja existe', 409);
    }
    return await this.userRepository.create(data);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return (await this.userRepository.update(id, data))!;
  }

  async delete(id: string): Promise<void> {
    const success = await this.userRepository.delete(id);
    if (!success) {
      throw new AppError('User not found', 404);
    }
  }
}

