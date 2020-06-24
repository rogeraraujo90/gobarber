import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateSessionService from '@modules/user/services/CreateSessionService';
import { classToClass } from 'class-transformer';

class SessionsController {
  public async create(
    { body }: Request,
    response: Response
  ): Promise<Response> {
    const { email, password } = body;
    const createSessionService = container.resolve(CreateSessionService);

    const { token, user } = await createSessionService.execute({
      email,
      password,
    });

    return response.json({ token, user: classToClass(user) });
  }
}

export default SessionsController;
