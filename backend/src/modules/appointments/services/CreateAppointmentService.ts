import { startOfHour, isBefore, getHours, format, ca } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import INotificationRepository from '@modules/notifications/repositories/INotificationRepository';
import ICacheProvider from '@shared/providers/cache/ICacheProvider';
import IAppointmentRepository from '../repositories/IAppointmentRepository';

interface IRequest {
  providerId: string;
  customerId: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  private appointmentsRepository: IAppointmentRepository;

  private notificationsRepository: INotificationRepository;

  private cache: ICacheProvider;

  constructor(
    @inject('AppointmentsRepository')
    appointmentsRepository: IAppointmentRepository,

    @inject('NotificationRepository')
    notificationsRepository: INotificationRepository,

    @inject('CacheProvider')
    cache: ICacheProvider
  ) {
    this.appointmentsRepository = appointmentsRepository;
    this.notificationsRepository = notificationsRepository;
    this.cache = cache;
  }

  public async execute({
    providerId,
    customerId,
    date,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);
    const appointInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate
    );

    if (providerId === customerId) {
      throw new AppError('The provider can not be equal to customer');
    }

    const appointmentHour = getHours(appointmentDate);

    if (appointmentHour < 8 || appointmentHour > 17) {
      throw new AppError('You can book appointments between 8am or 17pm only');
    }

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError('Create an appointment in a past day is not allowed');
    }

    if (appointInSameDate) {
      throw new AppError('Appointment is already booked.');
    }

    const appointment = await this.appointmentsRepository.create({
      providerId,
      customerId,
      date: appointmentDate,
    });

    const formattedDateToNotification = format(
      appointmentDate,
      "dd/MM/yyyy 'às' HH:mm'h'"
    );

    await this.notificationsRepository.create({
      recipientId: providerId,
      content: `Novo agendamento marcado para ${formattedDateToNotification}`,
    });

    const formattedDateToCache = format(appointmentDate, 'yyyy-M-d');

    this.cache.remove(
      `appointments-in-day:${providerId}:${formattedDateToCache}`
    );

    return appointment;
  }
}

export default CreateAppointmentService;
