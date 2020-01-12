import handlebars = require('handlebars');
import helpers = require('handlebars-helpers');
import fs = require('fs-extra');
import path = require('path');
import { DateTimeHelper } from '../../shared';

const _dateTimeHelper = new DateTimeHelper();
const _handlebarsTemplates: Map<string, handlebars.TemplateDelegate> = _initHandlebars();

/**
 * Generates the HTML template of a given handlebars (hbs) template.
 * @param templateName The name of the handlebars (hbs) template to generate.
 * @param context The context (accessible variables) used within the generated hbs template.
 * @return The retreived and processed handlebars template; a string containing HTML with injected context variables.
 */
export function genHandlebarsTemplate(templateName: string, context: any): string {
  if (_handlebarsTemplates.has(templateName)) {
    return _handlebarsTemplates.get(templateName)(context);
  }

  throw new Error(`Handlebars template does not exist with name: ${templateName}`);
}

/**
 * Initializes handlebars templates (main & partials) and helpers.
 * @return A map of handlebars template names to associated templates.
 */
function _initHandlebars(): Map<string, handlebars.TemplateDelegate> {
  _registerHelpers();
  _registerPartials();
  return _precompileTemplates();
}

/**
 * Registers handlebars helpers, which add operators/functions to hbs templates.
 */
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

/**
 * Registers all handlebars template partials from within the email template partials directory '/server/templates/email/partials'.
 * These can be injected into the main email template as the email body.
 */
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

/**
 * Precompiles the main handlebars templates (only the top level email container as of now).
 * @return A map of the names of precompiled templates to precompiled form.
 */
function _precompileTemplates(): Map<string, handlebars.TemplateDelegate> {
  const emailContainerPath: string = path.join(global['emailTemplatesDir'], 'email-container.hbs');
  const template: string = fs.readFileSync(emailContainerPath, 'utf8');
  return new Map([
    ['email-container', handlebars.compile(template)]
  ]);
}
