import { z } from 'zod';
import { User } from '../entities/index.js
import { CreateUserUseCase } from '../usecases/create-user.js';
import { AppContainer } from '../config/container.js';

const createUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6)
});

export class CreateUserController {
  private createUserUseCase: CreateUserUseCase;

  constructor(params: AppContainer) {
    this.createUserUseCase = params.createUserUseCase;
  }

  public async execute(input: any) {
    console.log('Create user input', { input });

    const createUserInput = createUserSchema.parse(input);

    const user = new User();
    user.name = createUserInput.name;
    user.email = createUserInput.email;
    user.password = createUserInput.password;

    const output = await this.createUserUseCase.execute(user);

    console.log('User created', { output });

    return output;
  }
}
