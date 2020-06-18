import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindAppointmentByProviderAndYearMonthDTO from '../dtos/IFindAppointmentByProviderAndYearMonthDTO';
import IFindAllAppointmentsByProviderAndDayDTO from '../dtos/IFindAllAppointmentsByProviderAndDayDTO';

export default interface IAppointmentRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  find(): Promise<Appointment[]>;
  findByProviderAndYearMonth(
    data: IFindAppointmentByProviderAndYearMonthDTO
  ): Promise<Appointment[]>;
  findByDate(date: Date): Promise<Appointment | undefined>;
  findAllByProviderAndDay(
    data: IFindAllAppointmentsByProviderAndDayDTO
  ): Promise<Appointment[]>;
}
