import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppointmentRepository from '../repositories/AppointmentRepository';
import Appointment from '../models/Appointment';
import AppError from '../errors/AppError';

interface Request {
  providerId: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ providerId, date }: Request): Promise<Appointment> {
    const appointmentDate = startOfHour(date);
    const appointmentsRepository = getCustomRepository(AppointmentRepository);

    const appointInSameDate = await appointmentsRepository.findByDate(
      appointmentDate
    );

    if (appointInSameDate) {
      throw new AppError('Appointment is already booked.');
    }

    const appointment = appointmentsRepository.create({
      providerId,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
