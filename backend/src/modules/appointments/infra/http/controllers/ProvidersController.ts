import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';

class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listProvidersService = container.resolve(ListProvidersService);
    const providers = await listProvidersService.execute([request.user.id]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const parsedProviders = providers.map(({ password, ...rest }) => rest);

    return response.json(parsedProviders);
  }
}

export default ProvidersController;
