/* eslint-disable no-console */
import { injectable, inject } from 'tsyringe';
import mailConfig from '@config/mail';
import IMailProvider from '@shared/providers/mail/IMailProvider';
import nodemailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';
import ITemplateMailProvider from '@shared/providers/template/ITemplateMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

@injectable()
class SESMailProvider implements IMailProvider {
  private transporter: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: ITemplateMailProvider
  ) {
    this.initializeTransporter();
  }

  private async initializeTransporter(): Promise<void> {
    this.transporter = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
        region: 'sa-east-1',
      }),
    });
  }

  public async sendMail({
    from,
    to,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const { name, email } = mailConfig.default.from;

    const message = {
      from: {
        name: from?.name || name,
        address: from?.email || email,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    };

    console.log(message);

    await this.transporter.sendMail(message);
  }
}

export default SESMailProvider;
