import { injectable, inject } from 'tsyringe';
import User from '@modules/user/infra/typeorm/entities/User';
import IUserRepository from '@modules/user/repositories/IUserRepository';
import ICacheProvider from '@shared/providers/cache/ICacheProvider';
import { classToClass } from 'class-transformer';

@injectable()
export default class ListProvidersService {
  private userRepository: IUserRepository;

  private cache: ICacheProvider;

  constructor(
    @inject('UserRepository') userRepository: IUserRepository,
    @inject('CacheProvider') cache: ICacheProvider
  ) {
    this.userRepository = userRepository;
    this.cache = cache;
  }

  public async execute(userIds: string[]): Promise<User[]> {
    const cacheKey = `list-providers:${userIds[0]}`;
    let providers = await this.cache.get<User[]>(cacheKey);

    if (!providers) {
      providers = await this.userRepository.find({ exceptUsersIds: userIds });
      this.cache.save(cacheKey, classToClass(providers));
    }

    return providers;
  }
}
