import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateUserAvatarService from '@modules/user/services/UpdateUserAvatarService';

class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const avatarFileName = request.file.filename;
    const updateUserAvatarService = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAvatarService.execute({
      userId: request.user.id,
      avatarFileName,
    });

    delete user.password;

    return response.json(user);
  }
}

export default UserAvatarController;
