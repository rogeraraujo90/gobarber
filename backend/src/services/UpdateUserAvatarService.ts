import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import User from '../models/User';
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

interface Request {
  userId: string;
  avatarFileName: string;
}

export default class UpdateUserAvatarService {
  public async execute({ userId, avatarFileName }: Request): Promise<User> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne(userId);

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

    userRepository.save(user);

    return user;
  }
}
