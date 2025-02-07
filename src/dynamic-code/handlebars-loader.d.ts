declare module "*.hbr" {
  import { TemplateDelegate } from "handlebars";
  const template: TemplateDelegate;
  export default template;
}
