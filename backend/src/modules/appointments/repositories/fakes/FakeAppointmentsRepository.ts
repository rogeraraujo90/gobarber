import { uuid } from 'uuidv4';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAppointmentByProviderAndYearMonthDTO from '@modules/appointments/dtos/IFindAppointmentByProviderAndYearMonthDTO';
import { getMonth, getYear, getDate } from 'date-fns';
import IFindAllAppointmentsByProviderAndDayDTO from '@modules/appointments/dtos/IFindAllAppointmentsByProviderAndDayDTO';

class FakeAppointmentsRepository implements IAppointmentRepository {
  private appointments: Appointment[] = [];

  public async find(): Promise<Appointment[]> {
    return this.appointments;
  }

  public async create({
    providerId,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), providerId, date });
    this.appointments.push(appointment);

    return appointment;
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(
      appointment => appointment.date.toDateString === date.toDateString
    );

    return findAppointment;
  }

  public async findByProviderAndYearMonth({
    providerId,
    year,
    month,
  }: IFindAppointmentByProviderAndYearMonthDTO): Promise<Appointment[]> {
    return this.appointments.filter(
      appointment =>
        appointment.providerId === providerId &&
        getMonth(appointment.date) === month &&
        getYear(appointment.date) === year
    );
  }

  public async findAllByProviderAndDay({
    providerId,
    day,
    month,
    year,
  }: IFindAllAppointmentsByProviderAndDayDTO): Promise<Appointment[]> {
    return this.appointments.filter(appointment => {
      const { date } = appointment;

      return (
        appointment.providerId === providerId &&
        getMonth(date) === month &&
        getYear(date) === year &&
        getDate(date) === day
      );
    });
  }
}

export default FakeAppointmentsRepository;
