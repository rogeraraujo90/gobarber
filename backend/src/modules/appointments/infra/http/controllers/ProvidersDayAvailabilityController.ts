import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

class ProvidersDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listProviderDayAvailabilityService = container.resolve(
      ListProviderDayAvailabilityService
    );

    const providerId = request.params.provider_id;
    const { day, month, year } = request.query;

    const availability = await listProviderDayAvailabilityService.execute({
      day: Number(day),
      month: Number(month),
      year: Number(year),
      providerId,
    });

    return response.json(availability);
  }
}

export default ProvidersDayAvailabilityController;
