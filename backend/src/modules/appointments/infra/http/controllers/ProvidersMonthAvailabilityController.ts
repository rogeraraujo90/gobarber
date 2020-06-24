import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

class ProvidersMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listProviderMonthAvailabilityService = container.resolve(
      ListProviderMonthAvailabilityService
    );

    const providerId = request.params.provider_id;
    const { month, year } = request.query;

    const availability = await listProviderMonthAvailabilityService.execute({
      month: Number(month),
      year: Number(year),
      providerId,
    });

    return response.json(availability);
  }
}

export default ProvidersMonthAvailabilityController;
