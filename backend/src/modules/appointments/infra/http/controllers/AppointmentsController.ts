import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppointmentRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentRepository';

class AppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const appointmentsRepository = new AppointmentRepository();
    const appointments = await appointmentsRepository.find();

    return response.json(appointments);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { id: customerId } = request.user;
    const { providerId, date } = request.body;

    const createAppointmentService = container.resolve(
      CreateAppointmentService
    );

    const appointment = await createAppointmentService.execute({
      providerId,
      customerId,
      date,
    });

    return response.json(appointment);
  }
}

export default AppointmentsController;
