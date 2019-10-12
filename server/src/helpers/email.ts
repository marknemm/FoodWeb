import 'dotenv';
import nodemailer = require('nodemailer');
import mailgunTransport = require('nodemailer-mailgun-transport');
import { genHandlebarsTemplate } from './handlebars';
import { Account } from '../../../shared/src/interfaces/account/account';

export enum MailTransporter {
  NOREPLY = 'NOREPLY',
  SUPPORT = 'SUPPORT'
}

const offlineMode: boolean = (process.env.OFFLINE_MODE === 'true');
const noreplyTransporter: nodemailer.Transporter = _initEmailTransporter(MailTransporter.NOREPLY);
const supportTransporter: nodemailer.Transporter = _initEmailTransporter(MailTransporter.SUPPORT);

export function broadcastEmail(
  mailTransporter: MailTransporter,
  accounts: Account[],
  subjects: string | string[],
  template: string,
  context?: any
): Promise<void[]> {
  if (offlineMode) { return; }
  const sendPromises: Promise<void>[] = [];
  for (let i = 0; i < accounts.length; i++) {
    sendPromises.push(
      sendEmail(
        mailTransporter,
        accounts[i],
        (subjects instanceof Array) ? subjects[i] : subjects,
        template,
        JSON.parse(JSON.stringify(context)) // Make copy of context since it is modified for each account.
      )
    );
  }
  return Promise.all(sendPromises);
}

export function sendEmail(
  mailTransporter: MailTransporter,
  account: Account,
  subject: string,
  template: string,
  context?: any
): Promise<void> {
  if (offlineMode) { return; }
  context = _fillMissingContext(context, account, template);

  return new Promise<void>((resolve: () => void, reject: (error: Error) => void) => {
    const transporter: nodemailer.Transporter = _getTransporter(mailTransporter);
    const from: string = process.env[`${mailTransporter}_EMAIL`];
    const to: string = account.contactInfo.email;
    // Can define extra 'Admin' email recipients in .env to get all messages.
    const recipients: string[] = _getAllRecipients(to);

    recipients.forEach((recipient: string) => {
      const html: string = genHandlebarsTemplate('email-container', context);
      transporter.sendMail(
        { from, to: recipient, subject, html },
        (err: any) => {
          if (err) {
            console.error(err);
            if (recipient === to) {
              reject(new Error(`Failed to send template ${template} to ${to}`));
            }
          } else if (recipient === to) {
            resolve();
          }
        }
      );
    });
  });
}

function _fillMissingContext(context: any, account: Account, template: string): any {
  context = (context ? Object.assign({}, context) : {});
  context.env = (context.env ? context.env : process.env);
  context.year = (context.year ? context.year : new Date().getFullYear());
  context.account = (context.account ? context.account : account);
  context.emailContent = template;
  context.isVolunteer = (account.accountType === 'Volunteer');
  context.isDonor = (account.accountType === 'Donor');
  context.isReceiver = (account.accountType === 'Receiver');
  context.isAdmin = (account.accountType === 'Admin');
  context.timezone = (context.account.contactInfo.timezone);
  return context;
}

function _getTransporter(mailTransporter: MailTransporter): nodemailer.Transporter {
  switch (mailTransporter) {
    case MailTransporter.NOREPLY: return noreplyTransporter;
    case MailTransporter.SUPPORT: return supportTransporter;
  }
}

function _getAllRecipients(to: string): string[] {
  let recipients: string[] = [to];
  if (process.env.ADMIN_EMAILS) {
    const adminEmails: string[] = process.env.ADMIN_EMAILS.trim().split(',').filter((email: string) => email !== to);
    recipients = recipients.concat(adminEmails);
  }
  return recipients;
}

function _initEmailTransporter(mailTransporter: MailTransporter): nodemailer.Transporter {
  if (offlineMode) { return null; }
  const transporter = _createTransporter(mailTransporter);
  _verifyTransporterConnection(transporter);
  return transporter;
}

function _createTransporter(mailTransporter: MailTransporter): nodemailer.Transporter {
  // Can use mailgun or fallback to traditional SMTP mail client for development.
  return (process.env.MAILGUN_API_KEY)
    ? nodemailer.createTransport(
        mailgunTransport({
          auth: {
            api_key: process.env.MAILGUN_API_KEY,
            domain: process.env.MAILGUN_DOMAIN
          }
        })
      )
    : nodemailer.createTransport({
        host: process.env[`${mailTransporter}_SERVER`],
        port: parseInt(process.env[`${mailTransporter}_PORT`], 10),
        pool: true,
        secure: (process.env[`${mailTransporter}_SECURE`] === 'true'),
        auth: {
          user: process.env[`${mailTransporter}_USERNAME`],
          pass: process.env[`${mailTransporter}_PASSWORD`]
        }
      });
}

function _verifyTransporterConnection(transporter: nodemailer.Transporter): void {
  transporter.verify((error: any) => {  
    if (error) { throw new Error(error.message ? error.message : error); }
  });
}
