import 'dotenv';
import { Account, Donation, AccountType } from '~shared';
import { genHandlebarsTemplate } from './handlebars';
import nodemailer = require('nodemailer');
import mailgunTransport = require('nodemailer-mailgun-transport');

/**
 * The email transporter keys (determines the from address / accounts used to send emails).
 */
export enum MailTransporter {
  NOREPLY = 'NOREPLY',
  SUPPORT = 'SUPPORT'
}

export type Recipient = Account | SimpleRecipient;

export interface SimpleRecipient {
  name: string;
  email: string;
}

const offlineMode: boolean = (process.env.OFFLINE_MODE === 'true');
const noreplyTransporter: nodemailer.Transporter = _initEmailTransporter(MailTransporter.NOREPLY);
const supportTransporter: nodemailer.Transporter = _initEmailTransporter(MailTransporter.SUPPORT);

/**
 * Broadcasts an email message to a given set of accounts. Automatically personalizes the header of each
 * email to the owner of each account.
 * @param mailTransporter The mail transporter to use (determines the from address).
 * @param recipients The recipients to broadcast the email to.
 * @param subjects The subject(s) of the emails to broadcast. Can be a uniform subject, or a list of personalized subjects.
 * @param template The handlebars (hbs) template to use for the body of the email.
 * @param context The optional context containing variables that may be injected into the handlebars template.
 * @param forceSend Set to true if the email should be sent to accounts even if they have disabled email messages. Defaults to false.
 * @return A promise that emits when the operation has completed.
 */
export function broadcastEmail(
  mailTransporter: MailTransporter,
  recipients: Recipient[],
  subjects: string | string[],
  template: string,
  context?: any,
  forceSend = false
): Promise<void[]> {
  // If offline, then return immediately.
  if (offlineMode) { return Promise.resolve([]); }
  const sendPromises: Promise<void>[] = [];
  for (let i = 0; i < recipients.length; i++) {
    sendPromises.push(
      sendEmail(
        mailTransporter,
        recipients[i],
        (subjects instanceof Array) ? subjects[i] : subjects,
        template,
        JSON.parse(JSON.stringify(context)), // Make copy of context since it is modified for each account.
        forceSend
      )
    );
  }
  return Promise.all(sendPromises);
}

/**
 * Sends an email message to a given account..
 * @param mailTransporter The mail transporter to use (determines the from address).
 * @param accounts The account to send the email to.
 * @param subjects The subject of the email.
 * @param template The handlebars (hbs) template to use for the body of the email.
 * @param context The optional context containing variables that may be injected into the handlebars template.
 * @param forceSend Set to true if the email should be sent to an account even if it has disabled email messages. Defaults to false.
 * @return A promise that emits when the operation has completed.
 */
export function sendEmail(
  mailTransporter: MailTransporter,
  recipient: Recipient,
  subject: string,
  template: string,
  context?: any,
  forceSend = false
): Promise<void> {
  // If offline, or the target account has disabled email notifications, then return immediately.
  if (!_shouldSendEmail(offlineMode, forceSend, recipient)) {
    return Promise.resolve();
  }
  context = _fillMissingContext(context, recipient, template);

  return new Promise<void>((resolve: () => void, reject: (error: Error) => void) => {
    const transporter: nodemailer.Transporter = _getTransporter(mailTransporter);
    const from: string = process.env[`${mailTransporter}_EMAIL`];
    const to: string = _extractRecipientTo(recipient);
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

/**
 * Generates an email subject for a given donation.
 * @param donation The donation for which to generate the email subject.
 * @return The generated email subject.
 */
export function genDonationEmailSubject(donation: Donation): string {
  return `Donation: ${donation.description} (${donation.id})`;
}

/**
 * Determines whether or not an email should be sent to a given account.
 * @param offlineMode If the server is in offline (development) mode.
 * @param forceSend If set to true, then sends the email even if the account has emails disabled.
 * @param recipient The recipient that the email is to be sent to.
 * @return true if the email should be sent, false if not.
 */
function _shouldSendEmail(offlineMode: boolean, forceSend: boolean, recipient: Recipient): boolean {
  const account = <Account>recipient;
  return (!offlineMode && (forceSend || !account.contactInfo || account.contactInfo.enableEmail));
}

/**
 * Fills in the missing (hbs) template context variables that are universally used in all email templates.
 * @param context The context that shall be filled.
 * @param recipient The recipient that the email is to be sent to.
 * @param template The (hbs) template that is to be used for the email body.
 * @return The filled (hbs) template context (copy of input context).
 */
function _fillMissingContext(context: any, recipient: Recipient, template: string): any {
  context = (context ? Object.assign({}, context) : {});
  context = _fillMissingAccountContext(context, <Account>recipient);
  context = _fillMissingSimpleRecipientContext(context, <SimpleRecipient>recipient);
  context.emailContent = template;
  context.env = (context.env ? context.env : process.env);
  context.year = (context.year ? context.year : new Date().getFullYear());
  return context;
}

/**
 * Fills in missing (hbs) template context account variables that are universally used in all email templates.
 * @param context The context that shall be filled (INTERNALLY MODIFIED).
 * @param account The account that the email is to be sent to. If null, then no filling occurs.
 * @return The filled (hbs) template context.
 */
function _fillMissingAccountContext(context: any, account: Account): any {
  account = (context?.account) ? context.account : account;
  if (account?.accountType) {
    context.account = account;
    context.isDonor = (account.accountType === AccountType.Donor);
    context.isReceiver = (account.accountType === AccountType.Receiver);
    context.isVolunteer = (account.accountType === AccountType.Volunteer);
    context.recipientName = (account.accountType === AccountType.Volunteer)
      ? `${account.volunteer.firstName} ${account.volunteer.lastName}`
      : `${account.organization.name}`;
    context.timezone = (account.contactInfo.timezone);
  }
  return context;
}

/**
 * Fills in missing (hbs) template context simple recipient variables that are universally used in all email templates.
 * @param context The context that shall be filled (INTERNALLY MODIFIED).
 * @param recipient The simple recipient that the email is to be sent to. If null, then no filling occurs.
 * @return The filled (hbs) template context.
 */
function _fillMissingSimpleRecipientContext(context: any, recipient: SimpleRecipient): any {
  if (recipient?.name) {
    context.recipientName = recipient.name;
  }
  return context;
}

/**
 * Extracts the 'to' email from a given recipient object.
 * @param recipient The recipient object from which to extract the 'to' email.
 * @return The extracted 'to' email.
 */
function _extractRecipientTo(recipient: Recipient): string {
  if (recipient) {
    return ((<Account>recipient).contactInfo)
      ? (<Account>recipient).contactInfo.email
      : (<SimpleRecipient>recipient).email;
  }
  return '';
}

/**
 * Gets a specified email transporter (determines the address the email will be from).
 * @param mailTransporter The key of the email transporter to retrieve.
 * @return The retrieved email transporter.
 */
function _getTransporter(mailTransporter: MailTransporter): nodemailer.Transporter {
  switch (mailTransporter) {
    case MailTransporter.NOREPLY: return noreplyTransporter;
    case MailTransporter.SUPPORT: return supportTransporter;
  }
}

/**
 * Gets all recipients for an email. Adds all configured (via env) admin email recipients to each outgoing email.
 * @param to The (main) recipient of the email.
 * @return The list of recipients of the email.
 */
function _getAllRecipients(to: string): string[] {
  let recipients: string[] = [to];
  if (process.env.ADMIN_EMAILS) {
    const adminEmails: string[] = process.env.ADMIN_EMAILS.trim().split(',').filter((email: string) => email !== to);
    recipients = recipients.concat(adminEmails);
  }
  return recipients;
}

/**
 * Initializes a given email transporter (determines the address the email is from).
 * @param mailTransporter The key of the email transporter to initialize.
 * @return The intialized email transporter.
 */
function _initEmailTransporter(mailTransporter: MailTransporter): nodemailer.Transporter {
  if (offlineMode) { return null; }
  const transporter = _createTransporter(mailTransporter);
  _verifyTransporterConnection(transporter);
  return transporter;
}

/**
 * Creates an email transporter using a given email transporter key (lookup for env settings).
 * @param mailTransporter The key of the email transporter that is to be created.
 * @return The created email transporter.
 */
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

/**
 * Verifies the connection of a given email transporter.
 * @param transporter The transporter whose connection we are to verify.
 * @throws An error if the transporter connection is determined to be invalid during verification.
 */
function _verifyTransporterConnection(transporter: nodemailer.Transporter): void {
  transporter.verify((error: any) => {  
    if (error) { throw new Error(error.message ? error.message : error); }
  });
}
