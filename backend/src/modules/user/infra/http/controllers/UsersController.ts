import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/user/services/CreateUserService';

class UsersController {
  public async create(
    { body }: Request,
    response: Response
  ): Promise<Response> {
    const { name, email, password } = body;
    const createUserService = container.resolve(CreateUserService);

    const user = await createUserService.execute({ name, email, password });
    delete user.password;

    return response.json(user);
  }
}

export default UsersController;
