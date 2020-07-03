import { container } from 'tsyringe';
import HandlebarsMailTemplateProvider from '../implementations/HandlebarsMailTemplateProvider';
import ITemplateMailProvider from '../ITemplateMailProvider';

const providers = {
  handlebars: HandlebarsMailTemplateProvider,
};

container.registerSingleton<ITemplateMailProvider>(
  'MailTemplateProvider',
  providers.handlebars
);
