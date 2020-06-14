import IParseTemplateMailDTO from '@shared/providers/template/dtos/IParseTemplateMailDTO';

interface IMailContact {
  name: string;
  email: string;
}

export default interface ISendMailDTO {
  from?: IMailContact;
  to: IMailContact;
  subject: string;
  templateData: IParseTemplateMailDTO;
}
