import ITemplateMailProvider from '@shared/providers/template/ITemplateMailProvider';
import IParseTemplateMailDTO from '@shared/providers/template/dtos/IParseTemplateMailDTO';

class FakeTemplateMailProvider implements ITemplateMailProvider {
  public async parse({ template }: IParseTemplateMailDTO): Promise<string> {
    return template;
  }
}

export default FakeTemplateMailProvider;
