import { Repository, getRepository, Raw } from 'typeorm';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAppointmentByProviderAndYearMonthDTO from '@modules/appointments/dtos/IFindAppointmentByProviderAndYearMonthDTO';
import IFindAllAppointmentsByProviderAndDayDTO from '@modules/appointments/dtos/IFindAllAppointmentsByProviderAndDayDTO';

class AppointmentRepository implements IAppointmentRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async find(): Promise<Appointment[]> {
    return this.ormRepository.find();
  }

  public async create({
    providerId,
    customerId,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      providerId,
      customerId,
      date,
    });

    await this.ormRepository.save(appointment);

    return appointment;
  }

  public async findByDate(
    date: Date,
    providerId: string
  ): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date, providerId },
    });

    return findAppointment;
  }

  public async findByProviderAndYearMonth({
    providerId,
    year,
    month,
  }: IFindAppointmentByProviderAndYearMonthDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');

    return this.ormRepository.find({
      where: {
        providerId,
        date: Raw(
          dateField =>
            `to_char(${dateField}, 'MM-YYYY') = '${parsedMonth}-${year}'`
        ),
      },
    });
  }

  public async findAllByProviderAndDay({
    providerId,
    day,
    month,
    year,
  }: IFindAllAppointmentsByProviderAndDayDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');
    const parsedDay = String(day).padStart(2, '0');

    return this.ormRepository.find({
      where: {
        providerId,
        date: Raw(
          dateField =>
            `to_char(${dateField}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`
        ),
      },
      relations: ['customer'],
    });
  }
}

export default AppointmentRepository;
