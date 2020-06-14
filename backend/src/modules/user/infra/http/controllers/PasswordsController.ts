import { Request, Response } from 'express';
import { container } from 'tsyringe';
import SendRecoveryMailService from '@modules/user/services/SendRecoveryMailService';
import ResetPasswordService from '@modules/user/services/ResetPasswordService';

class SessionsController {
  public async forgot(
    { body }: Request,
    response: Response
  ): Promise<Response> {
    const { email } = body;
    const sendRecoveryMailService = container.resolve(SendRecoveryMailService);

    await sendRecoveryMailService.execute({ email });
    return response.status(204).json();
  }

  public async reset({ body }: Request, response: Response): Promise<Response> {
    const { password, token } = body;
    const resetPassowrdService = container.resolve(ResetPasswordService);

    await resetPassowrdService.execute({ password, token });
    return response.status(204).json();
  }
}

export default SessionsController;
