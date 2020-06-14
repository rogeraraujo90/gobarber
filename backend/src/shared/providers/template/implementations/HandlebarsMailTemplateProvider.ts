import handlebars from 'handlebars';
import ITemplateMailProvider from '@shared/providers/template/ITemplateMailProvider';
import IParseTemplateMailDTO from '@shared/providers/template/dtos/IParseTemplateMailDTO';

class HandlebarsMailTemplateProvider implements ITemplateMailProvider {
  public async parse({
    template,
    variables,
  }: IParseTemplateMailDTO): Promise<string> {
    const parseTemplate = handlebars.compile(template);

    return parseTemplate(variables);
  }
}

export default HandlebarsMailTemplateProvider;
