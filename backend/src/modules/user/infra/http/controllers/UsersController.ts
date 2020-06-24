import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateUserService from '@modules/user/services/CreateUserService';

class UsersController {
  public async create(
    { body }: Request,
    response: Response
  ): Promise<Response> {
    const { name, email, password } = body;
    const createUserService = container.resolve(CreateUserService);

    const user = await createUserService.execute({ name, email, password });

    return response.json(classToClass(user));
  }
}

export default UsersController;
