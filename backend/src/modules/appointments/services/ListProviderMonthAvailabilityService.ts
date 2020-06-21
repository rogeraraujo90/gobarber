import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate } from 'date-fns';
import IAppointmentRepository from '../repositories/IAppointmentRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
  providerId: string;
  month: number;
  year: number;
}

type Response = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
export default class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentRepository
  ) {}

  public async execute({
    providerId,
    month,
    year,
  }: IRequest): Promise<Response> {
    const appointments = await this.appointmentsRepository.findByProviderAndYearMonth(
      {
        providerId,
        month,
        year,
      }
    );

    interface IAppointmentsByDayHash {
      [day: number]: Appointment[];
    }

    const appointmentsByDayHash: IAppointmentsByDayHash = {};
    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    appointments.forEach(appointment => {
      const appointmentDay = getDate(appointment.date);

      if (appointmentsByDayHash[appointmentDay]) {
        appointmentsByDayHash[appointmentDay].push(appointment);
      } else {
        appointmentsByDayHash[appointmentDay] = [appointment];
      }
    });

    const availability = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => {
        const day = index + 1;

        if (appointmentsByDayHash[day]) {
          return {
            day,
            available: appointmentsByDayHash[day].length < 10,
          };
        }
        return {
          day: index + 1,
          available: true,
        };
      }
    );

    return availability;
  }
}
