/* eslint-disable no-console */
import { injectable, inject } from 'tsyringe';
import IMailProvider from '@shared/providers/mail/IMailProvider';
import nodemailer, { Transporter } from 'nodemailer';
import ITemplateMailProvider from '@shared/providers/template/ITemplateMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

@injectable()
class EtherealMailProvider implements IMailProvider {
  private transporter: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: ITemplateMailProvider
  ) {
    this.initializeTransporter();
  }

  private async initializeTransporter(): Promise<void> {
    const account = await nodemailer.createTestAccount();

    this.transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });
  }

  public async sendMail({
    from,
    to,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const message = {
      from: {
        name: from?.name || 'Equipe GoBarber',
        address: from?.email || 'equipegobarber@gobarber.com',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    };

    const info = await this.transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
}

export default EtherealMailProvider;
