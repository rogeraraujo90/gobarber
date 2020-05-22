import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateSessionService from '@modules/user/services/CreateSessionService';

class SessionsController {
  public async create(
    { body }: Request,
    response: Response
  ): Promise<Response> {
    const { email, password } = body;
    const createSessionService = container.resolve(CreateSessionService);

    const sessionData = await createSessionService.execute({ email, password });

    return response.json(sessionData);
  }
}

export default SessionsController;
