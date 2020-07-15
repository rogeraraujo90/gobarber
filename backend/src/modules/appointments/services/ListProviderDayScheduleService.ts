import { injectable, inject } from 'tsyringe';
import ICacheProvider from '@shared/providers/cache/ICacheProvider';
import { classToClass } from 'class-transformer';
import IAppointmentRepository from '../repositories/IAppointmentRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
  providerId: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
export default class ListProviderDayScheduleService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentRepository,

    @inject('CacheProvider')
    private cache: ICacheProvider
  ) {}

  public async execute({
    providerId,
    day,
    month,
    year,
  }: IRequest): Promise<Appointment[]> {
    const cacheKey = `appointments-in-day:${providerId}:${year}-${month}-${day}`;
    const cachedData = await this.cache.get<Appointment[]>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const appointments = await this.appointmentsRepository.findAllByProviderAndDay(
      {
        providerId,
        day,
        month,
        year,
      }
    );

    this.cache.save(cacheKey, classToClass(appointments));

    return appointments;
  }
}
