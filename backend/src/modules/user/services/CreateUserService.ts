import { injectable, inject } from 'tsyringe';
import User from '@modules/user/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
export default class CreateUserService {
  private userRepository: IUserRepository;

  constructor(@inject('UserRepository') userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const userAlreadyExists = await this.userRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new AppError('Email already exists.');
    }

    const user = await this.userRepository.create({ name, email, password });

    return user;
  }
}
