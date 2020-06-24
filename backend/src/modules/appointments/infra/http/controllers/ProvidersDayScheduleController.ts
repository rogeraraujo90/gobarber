import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderDayScheduleService from '@modules/appointments/services/ListProviderDayScheduleService';

class ProvidersDayScheduleController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listProviderDayScheduleService = container.resolve(
      ListProviderDayScheduleService
    );

    const providerId = request.user.id;
    const { day, month, year } = request.query;

    const schedule = await listProviderDayScheduleService.execute({
      day: Number(day),
      month: Number(month),
      year: Number(year),
      providerId,
    });

    return response.json(schedule);
  }
}

export default ProvidersDayScheduleController;
