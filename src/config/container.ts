import { createContainer, asClass, AwilixContainer } from 'awilix';
import { IUserRepository, UserRepository } from '../database/repositories/user-repository.js';

type AppContainer = {
  userRepository: IUserRepository;
};

const container: AwilixContainer<AppContainer> = createContainer<AppContainer>();

container.register({
  userRepository: asClass(UserRepository).singleton()
});

console.log('container created');

export { container };
