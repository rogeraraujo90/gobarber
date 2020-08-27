import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';
import { classToClass } from 'class-transformer';

class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listProvidersService = container.resolve(ListProvidersService);
    const providers = await listProvidersService.execute([request.user.id]);

    return response.json(classToClass(providers));
  }
}

export default ProvidersController;
