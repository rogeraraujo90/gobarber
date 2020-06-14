import IParseTemplateMailDTO from './dtos/IParseTemplateMailDTO';

export default interface ITemplateMailProvider {
  parse(data: IParseTemplateMailDTO): Promise<string>;
}
