import { container } from 'tsyringe';
import AppointmentRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentRepository';
import UserRepository from '@modules/user/infra/typeorm/repositories/UserRepository';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentRepository';
import IUserRepository from '@modules/user/repositories/IUserRepository';

container.registerSingleton<IAppointmentRepository>(
  'AppoitmentRepository',
  AppointmentRepository
);

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);
