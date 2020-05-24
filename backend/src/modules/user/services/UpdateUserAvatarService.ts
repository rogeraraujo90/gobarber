import { injectable, inject } from 'tsyringe';

import User from '@modules/user/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/providers/IStorageProvider';
import IUserRepository from '../repositories/IUserRepository';

interface IRequest {
  userId: string;
  avatarFileName: string;
}

@injectable()
export default class UpdateUserAvatarService {
  private userRepository: IUserRepository;

  private storageProvider: IStorageProvider;

  constructor(
    @inject('UserRepository') userRepository: IUserRepository,
    @inject('StorageProvider') storageProvider: IStorageProvider
  ) {
    this.userRepository = userRepository;
    this.storageProvider = storageProvider;
  }

  public async execute({ userId, avatarFileName }: IRequest): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError('Just authenticated users can change avatar', 401);
    }

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    user.avatar = await this.storageProvider.saveFile(avatarFileName);

    await this.userRepository.save(user);

    return user;
  }
}
