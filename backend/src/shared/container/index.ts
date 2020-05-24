import { container } from 'tsyringe';
import AppointmentRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentRepository';
import UserRepository from '@modules/user/infra/typeorm/repositories/UserRepository';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentRepository';
import IUserRepository from '@modules/user/repositories/IUserRepository';
import BCryptHashProvider from '@modules/user/infra/bcrypt/BCryptHashProvider';
import IHashProvider from '@modules/user/providers/IHashProvider';
import IStorageProvider from '@shared/providers/IStorageProvider';
import DiskStorageProvider from '@shared/infra/storage/DiskStorageProvider';

container.registerSingleton<IAppointmentRepository>(
  'AppoitmentRepository',
  AppointmentRepository
);

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);
container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider
);
