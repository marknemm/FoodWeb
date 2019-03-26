import 'dotenv';
import nodemailer = require('nodemailer');
import nodemailerHandlebars = require('nodemailer-express-handlebars');
import path = require('path');
import { Account } from '../../../shared/src/interfaces/account/account';

export enum MailTransporter {
  NOREPLY = 'NOREPLY',
  SUPPORT = 'SUPPORT'
}

const noreplyTransporter: any = _initEmailTransporter(MailTransporter.NOREPLY);
const supportTransporter: any = _initEmailTransporter(MailTransporter.SUPPORT);

export function sendEmail(mailTransporter: MailTransporter, to: string, subject: string, template: string, account: Account, context?: any): Promise<void> {
  context = _fillMissingContext(context, account, template);
  return new Promise<void>((resolve: () => void, reject: (error: Error) => void) => {
    const transporter: any = _getTransporter(mailTransporter);
    const from: string = process.env[`${mailTransporter}_EMAIL`];
    transporter.sendMail(
      { from, to, subject, template: 'email-container', context },
      (err: any) => {
        if (err) {
          console.error(err);
          reject(new Error(`Failed to send template ${template} to ${to}`));
        } else {
          resolve();
        }
      }
    );
  });
}

function _fillMissingContext(context: any, account: Account, template: string): any {
  context = (context ? context : {});
  context.env = (context.env ? context.env : process.env);
  context.year = (context.year ? context.year : new Date().getFullYear());
  context.account = (context.account ? context.account : account);
  context.emailContent = template;
  return context;
}

function _getTransporter(mailTransporter: MailTransporter): any {
  switch (mailTransporter) {
    case MailTransporter.NOREPLY: return noreplyTransporter;
    case MailTransporter.SUPPORT: return supportTransporter;
  }
}

function _initEmailTransporter(mailTransporter: MailTransporter): any {
  const transporter = _createTransporter(mailTransporter);
  _verifyTransporterConnection(transporter);
  _setupTransporterHandlebars(transporter);
  return transporter;
}

function _createTransporter(mailTransporter: MailTransporter): any {
  return nodemailer.createTransport({
    host: process.env[`${mailTransporter}_SERVER`],
    port: parseInt(process.env[`${mailTransporter}_PORT`], 10),
    secure: (process.env[`${mailTransporter}_SECURE`] === 'true'),
    auth: {
      user: [process.env[`${mailTransporter}_USERNAME`]],
      pass: [process.env[`${mailTransporter}_PASSWORD`]]
    }
  });
}

function _verifyTransporterConnection(transporter: any): void {
  transporter.verify((error: any) => {
    if (error) { throw new Error(error.message ? error.message : error); }
  });
}

function _setupTransporterHandlebars(transporter: any): void {
  transporter.use('compile', nodemailerHandlebars({
    viewEngine: {
      extname: '.hbs',
      partialsDir: path.join(global['serverDir'], 'templates', 'email', 'partials')
    },
    viewPath: path.join(global['serverDir'], 'templates', 'email'),
    extName: '.hbs'
  }));
}
