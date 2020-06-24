import { container } from 'tsyringe';
import AppointmentRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentRepository';
import UserRepository from '@modules/user/infra/typeorm/repositories/UserRepository';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentRepository';
import IUserRepository from '@modules/user/repositories/IUserRepository';
import BCryptHashProvider from '@shared/providers/hash/implementations/BCryptHashProvider';
import IHashProvider from '@shared/providers/hash/IHashProvider';
import IStorageProvider from '@shared/providers/storage/IStorageProvider';
import DiskStorageProvider from '@shared/providers/storage/implementations/DiskStorageProvider';
import IResetPasswordTokenRepository from '@modules/user/repositories/IResetPasswordTokenRepository';
import ResetPasswordTokenRepository from '@modules/user/infra/typeorm/repositories/ResetPasswordTokenRepository';
import IMailProvider from '@shared/providers/mail/IMailProvider';
import EtherealMailProvider from '@shared/providers/mail/implementations/EtherealMailProvider';
import ITemplateMailProvider from '@shared/providers/template/ITemplateMailProvider';
import HandlebarsMailTemplateProvider from '@shared/providers/template/implementations/HandlebarsMailTemplateProvider';
import INotificationRepository from '@modules/notifications/repositories/INotificationRepository';
import NotificationRepository from '@modules/notifications/infra/typeorm/repositories/NotificationRepository';

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

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider
);

container.registerSingleton<ITemplateMailProvider>(
  'MailTemplateProvider',
  HandlebarsMailTemplateProvider
);

container.registerSingleton<INotificationRepository>(
  'NotificationRepository',
  NotificationRepository
);

// There is async code in the constructor of EtherealMailProvider.
// We need instantiate EtherealMailProvider togheter with the server bootstrap to ensure that transporter is ready
container.registerInstance<IMailProvider>(
  'MailProvider',
  container.resolve(EtherealMailProvider)
);
