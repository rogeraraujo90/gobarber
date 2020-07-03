import { container } from 'tsyringe';
import AppointmentRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentRepository';
import UserRepository from '@modules/user/infra/typeorm/repositories/UserRepository';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentRepository';
import IUserRepository from '@modules/user/repositories/IUserRepository';
import BCryptHashProvider from '@shared/providers/hash/implementations/BCryptHashProvider';
import IHashProvider from '@shared/providers/hash/IHashProvider';
import IResetPasswordTokenRepository from '@modules/user/repositories/IResetPasswordTokenRepository';
import ResetPasswordTokenRepository from '@modules/user/infra/typeorm/repositories/ResetPasswordTokenRepository';
import INotificationRepository from '@modules/notifications/repositories/INotificationRepository';
import NotificationRepository from '@modules/notifications/infra/typeorm/repositories/NotificationRepository';

import '../providers/template/container';
import '../providers/mail/container';
import '../providers/storage/container';

container.registerSingleton<IAppointmentRepository>(
  'AppointmentsRepository',
  AppointmentRepository
);

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);

container.registerSingleton<IResetPasswordTokenRepository>(
  'ResetPasswordTokenRepository',
  ResetPasswordTokenRepository
);

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);

container.registerSingleton<INotificationRepository>(
  'NotificationRepository',
  NotificationRepository
);
