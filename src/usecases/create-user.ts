import { IUserRepository } from '../repositories/index.js';
import { User } from '../entities/index.js';
import { ExpectedError } from '../shared/errors.js';

export interface CreateUserOutput {
  user_id: number;
}

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  public async execute(user: User): Promise<CreateUserOutput> {
    if (!this.nameIsValid(user.name)) {
      throw new ExpectedError('Invalid name');
    }

    user.id = await this.userRepository.createAndGetId(user);

    return { user_id: user.id };
  }

  private nameIsValid(name: string) {
    const parts = name.trim().split(/\s+/);

    return parts.length >= 2 && parts.every((p) => p.length >= 3);
  }
}
