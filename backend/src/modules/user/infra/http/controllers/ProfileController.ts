import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateProfileService from '@modules/user/services/UpdateProfileService';
import ShowProfileService from '@modules/user/services/ShowProfileService';

class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const showProfileService = container.resolve(ShowProfileService);

    const user = await showProfileService.execute(userId);
    delete user.password;

    return response.json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { name, email, oldPassword, password } = request.body;
    const userId = request.user.id;

    const updateProfileService = container.resolve(UpdateProfileService);

    const user = await updateProfileService.execute({
      userId,
      name,
      email,
      oldPassword,
      password,
    });

    delete user.password;

    return response.json(user);
  }
}

export default ProfileController;
