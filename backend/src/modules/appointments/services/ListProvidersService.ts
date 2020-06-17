import { injectable, inject } from 'tsyringe';
import User from '@modules/user/infra/typeorm/entities/User';
import IUserRepository from '@modules/user/repositories/IUserRepository';

@injectable()
export default class ListProvidersService {
  private userRepository: IUserRepository;

  constructor(@inject('UserRepository') userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  public async execute(userIds: string[]): Promise<User[]> {
    return this.userRepository.find({ exceptUsersIds: userIds });
  }
}
