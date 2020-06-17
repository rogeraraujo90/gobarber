import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindAppointmentByProviderAndYearMonthDTO from '../dtos/IFindAppointmentByProviderAndYearMonthDTO';

export default interface IAppointmentRepository {
  find(): Promise<Appointment[]>;
  findByProviderAndYearMonth(
    data: IFindAppointmentByProviderAndYearMonthDTO
  ): Promise<Appointment[]>;
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
}
