interface ITemplateVariables {
  [key: string]: string | number;
}

export default interface IParseTemplateMailDTO {
  template: string;
  variables: ITemplateVariables;
}
