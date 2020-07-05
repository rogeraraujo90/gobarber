import { injectable, inject } from 'tsyringe';
import User from '@modules/user/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/providers/cache/ICacheProvider';
import IUserRepository from '../repositories/IUserRepository';
import IHashProvider from '../../../shared/providers/hash/IHashProvider';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
export default class CreateUserService {
  private userRepository: IUserRepository;

  private hashProvieder: IHashProvider;

  private cacheProvider: ICacheProvider;

  constructor(
    @inject('UserRepository') userRepository: IUserRepository,
    @inject('HashProvider') hashProvider: IHashProvider,
    @inject('CacheProvider') cacheProvider: ICacheProvider
  ) {
    this.userRepository = userRepository;
    this.hashProvieder = hashProvider;
    this.cacheProvider = cacheProvider;
  }

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const userAlreadyExists = await this.userRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new AppError('Email already exists.');
    }

    const crypedPassord = await this.hashProvieder.createHash(password);

    const user = await this.userRepository.create({
      name,
      email,
      password: crypedPassord,
    });

    this.cacheProvider.removePrefix('list-providers');

    return user;
  }
}
