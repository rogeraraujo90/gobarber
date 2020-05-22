import { startOfHour } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentRepository from '../repositories/IAppointmentRepository';

interface IRequest {
  providerId: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  private appointmentsRepository: IAppointmentRepository;

  constructor(
    @inject('AppoitmentRepository')
    appointmentsRepository: IAppointmentRepository
  ) {
    this.appointmentsRepository = appointmentsRepository;
  }

  public async execute({ providerId, date }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);
    const appointInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate
    );

    if (appointInSameDate) {
      throw new AppError('Appointment is already booked.');
    }

    const appointment = await this.appointmentsRepository.create({
      providerId,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
