import path from 'path';
import fs from 'fs';
import { injectable, inject } from 'tsyringe';

import User from '@modules/user/infra/typeorm/entities/User';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';

interface IRequest {
  userId: string;
  avatarFileName: string;
}

@injectable()
export default class UpdateUserAvatarService {
  private userRepository: IUserRepository;

  constructor(@inject('UserRepository') userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  public async execute({ userId, avatarFileName }: IRequest): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError('Just authenticated users can change avatar', 401);
    }

    if (user.avatar) {
      const currentAvatarName = user.avatar;
      const currentAvatarPath = path.join(
        uploadConfig.uploadsPath,
        currentAvatarName
      );

      const avatarFileExists = await fs.promises
        .stat(currentAvatarPath)
        .catch(() => false);

      if (avatarFileExists) {
        await fs.promises.unlink(currentAvatarPath);
      }
    }

    user.avatar = avatarFileName;

    await this.userRepository.save(user);

    return user;
  }
}
