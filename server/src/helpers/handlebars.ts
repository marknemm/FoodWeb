import handlebars = require('handlebars');
import helpers = require('handlebars-helpers');
import fs = require('fs-extra');
import path = require('path');
import { DateTimeHelper } from '../../../shared/src/helpers/date-time-helper';

const _dateTimeHelper = new DateTimeHelper();
const _handlebarsTemplates: Map<string, handlebars.TemplateDelegate> = _initHandlebars();

export function genHandlebarsTemplate(templateName: string, context: any): string {
  if (_handlebarsTemplates.has(templateName)) {
    return _handlebarsTemplates.get(templateName)(context);
  }

  throw new Error(`Handlebars template does not exist with name: ${templateName}`);
}

function _initHandlebars(): Map<string, handlebars.TemplateDelegate> {
  _registerHelpers();
  _registerPartials();
  return _precompileTemplates();
}

function _registerHelpers(): void {
  helpers.comparison({ handlebars });
  helpers.number({ handlebars });
  helpers.collection({ handlebars });
  const toLocalDateTimeStr: handlebars.HelperDelegate = _dateTimeHelper.toLocalDateTimeStr.bind(_dateTimeHelper);
  handlebars.registerHelper('toLocalDateTimeStr', toLocalDateTimeStr);
  const toLocalDateStr: handlebars.HelperDelegate = _dateTimeHelper.toLocalDateStr.bind(_dateTimeHelper);
  handlebars.registerHelper('toLocalDateStr', toLocalDateStr);
  const toLocalTimeStr: handlebars.HelperDelegate = _dateTimeHelper.toLocalTimeStr.bind(_dateTimeHelper);
  handlebars.registerHelper('toLocalTimeStr', toLocalTimeStr);
}

function _registerPartials(): void {
  const partialsDir: string = path.join(global['emailTemplatesDir'], 'partials');
  const fileNames: string[] = fs.readdirSync(partialsDir);

  fileNames.forEach((fileName: string) => {
    if (fileName.indexOf('.hbs') >= 0) {
      const filePath: string = path.join(partialsDir, fileName);
      const template: string = fs.readFileSync(filePath, 'utf8');
      const partialName: string = fileName.substr(0, fileName.length - 4);
      handlebars.registerPartial(partialName, template);
    }
  });
}

function _precompileTemplates(): Map<string, handlebars.TemplateDelegate> {
  const emailContainerPath: string = path.join(global['emailTemplatesDir'], 'email-container.hbs');
  const template: string = fs.readFileSync(emailContainerPath, 'utf8');
  return new Map([
    ['email-container', handlebars.compile(template)]
  ]);
}
