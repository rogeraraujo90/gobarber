import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';
import IAppointmentRepository from '../repositories/IAppointmentRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
  providerId: string;
  day: number;
  month: number;
  year: number;
}

type Response = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
export default class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentRepository
  ) {}

  public async execute({
    providerId,
    day,
    month,
    year,
  }: IRequest): Promise<Response> {
    const appointments = await this.appointmentsRepository.findAllByProviderAndDay(
      {
        providerId,
        day,
        month,
        year,
      }
    );

    interface IAppointmentsByHourHash {
      [hour: number]: Appointment;
    }

    const appointmentsByDayHash: IAppointmentsByHourHash = {};
    const numberOfWorkHours = 10;
    const startHour = 8;

    appointments.forEach(appointment => {
      appointmentsByDayHash[getHours(appointment.date)] = appointment;
    });

    const currentDate = new Date(Date.now());

    const availability = Array.from(
      { length: numberOfWorkHours },
      (_, index) => {
        const hour = index + startHour;
        const compareDate = new Date(year, month - 1, day, hour);

        return {
          hour,
          available:
            !appointmentsByDayHash[hour] && isAfter(compareDate, currentDate),
        };
      }
    );

    return availability;
  }
}
