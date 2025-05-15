import { IUserRepository } from '../repositories/index.js';
import { User } from '../entities/index.js';
import { ApplicationError, ErrorTypes } from '../shared/errors.js';
import { AppContainer } from '../config/container.js';

export interface CreateUserOutput {
  user_id: number;
}

export class CreateUserUseCase {
  private userRepository: IUserRepository;

  constructor(params: AppContainer) {
    this.userRepository = params.userRepository;
  }

  public async execute(user: User): Promise<CreateUserOutput> {
    if (!this.nameIsValid(user.name)) {
      throw new ApplicationError('Invalid name', ErrorTypes.ExpectedError);
    }

    user.id = await this.userRepository.createAndGetId(user);

    return { user_id: user.id };
  }

  private nameIsValid(name: string) {
    const parts = name.trim().split(/\s+/);

    return parts.length >= 2 && parts.every((p) => p.length >= 3);
  }
}
