import { injectable, inject } from 'tsyringe';

import User from '@modules/user/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IHashProvider from '@shared/providers/hash/IHashProvider';
import IUserRepository from '../repositories/IUserRepository';

interface IRequest {
  userId: string;
  name: string;
  email: string;
  oldPassword?: string;
  password?: string;
}

@injectable()
export default class UpdateProfileService {
  private userRepository: IUserRepository;

  private hashProvider: IHashProvider;

  constructor(
    @inject('UserRepository') userRepository: IUserRepository,
    @inject('HashProvider') hashProvider: IHashProvider
  ) {
    this.userRepository = userRepository;
    this.hashProvider = hashProvider;
  }

  public async execute({
    userId,
    name,
    email,
    oldPassword,
    password,
  }: IRequest): Promise<User> {
    const user = await this.userRepository.findById(userId);
    const userWithEmail = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User not found.');
    }

    if (userWithEmail && userWithEmail.id !== userId) {
      throw new AppError('This email is already used.');
    }

    user.name = name;
    user.email = email;

    if (password) {
      if (
        oldPassword &&
        (await this.hashProvider.compareHash(oldPassword, user.password))
      ) {
        user.password = await this.hashProvider.createHash(password);
      } else {
        throw new AppError(
          'The oldPassword is required in order to update the password.'
        );
      }
    }

    await this.userRepository.save(user);

    return user;
  }
}
