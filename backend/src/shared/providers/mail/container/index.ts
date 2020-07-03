import { container } from 'tsyringe';
import mailConfig from '@config/mail';
import IMailProvider from '../IMailProvider';
import EtherealMailProvider from '../implementations/EtherealMailProvider';
import SESMailProvider from '../implementations/SESMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(SESMailProvider),
};

// There is async code in the constructor of EtherealMailProvider.
// We need instantiate EtherealMailProvider togheter with the server bootstrap to ensure that transporter is ready
container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver]
);
