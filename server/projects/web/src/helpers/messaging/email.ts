import { Transporter } from 'nodemailer';
import { Account, AccountType } from '~shared';
import { getReachableUrl } from '~web/helpers/misc/url';
import { genHandlebarsTemplate } from './handlebars';
import nodemailer = require('nodemailer');
import mailgunTransport = require('nodemailer-mailgun-transport');
import Mail = require('nodemailer/lib/mailer');
import { env } from '../globals/env';

/**
 * A mail client that is used to send emails.
 */
export class MailClient {

  /**
   * The singleton instance of this mail client.
   */
  private static _instance: MailClient;

  /**
   * A registry of transporter agents that are used to send email via specified FoodWeb email accounts.
   */
  private transporters: { [transporterKey: string]: nodemailer.Transporter } = {};

  /**
   * Private constructor to enforce singleton instance.
   */
  private constructor() {}

  /**
   * Generates/gets a singleton instance of the MailClient.
   * @return A promise that resolves to the MailClient.
   */
  static async getInstance(): Promise<MailClient> {
    if (!MailClient._instance) {
      MailClient._instance = new MailClient();
      await MailClient._instance._initTransporters();
    }
    return MailClient._instance;
  }

  /**
   * Initializes the email transporter agents.
   */
  private async _initTransporters(): Promise<void> {
    for (const transporterKey of [MailTransporter.NOREPLY, MailTransporter.SUPPORT]) {
      const port: number = (env[`${transporterKey}_PORT`] ?? 1025);
      const smtpHosts: string[] = [env[`${transporterKey}_SERVER`], 'localhost', 'fake-smtp-server'];

      // Can use mailgun or fallback to traditional SMTP mail client for development.
      this.transporters[transporterKey] = (env.MAILGUN_API_KEY)
        ? nodemailer.createTransport(
            mailgunTransport({
              auth: {
                api_key: env.MAILGUN_API_KEY,
                domain: env.MAILGUN_DOMAIN
              }
            })
          )
        : nodemailer.createTransport({
            host: await getReachableUrl(smtpHosts, port),
            port,
            pool: true,
            secure: env[`${transporterKey}_SECURE`],
            auth: {
              user: env[`${transporterKey}_USERNAME`],
              pass: env[`${transporterKey}_PASSWORD`]
            },
            tls: {
              rejectUnauthorized: env[`${transporterKey}_TLS_REJECT_UNAUTHORIZED`]
            }
          });

      // Verify the connection of the new email transporter.
      await this.transporters[transporterKey].verify();
    }
  }

  /**
   * Broadcasts an email message to a given set of accounts. Automatically personalizes the header of each
   * email to the owner of each account.
   * @param transporter The mail transporter to use (determines the from address).
   * @param recipients The recipients to broadcast the email to.
   * @param subjects The subject(s) of the emails to broadcast. Can be a uniform subject, or a list of personalized subjects.
   * @param template The handlebars (hbs) template to use for the body of the email.
   * @param context The optional context containing variables that may be injected into the handlebars template.
   * @param forceSend Set to true if the email should be sent to accounts even if they have disabled email messages. Defaults to false.
   * @return A promise that emits when the operation has completed.
   */
  broadcastEmail(
    transporter: MailTransporter,
    recipients: Recipient[],
    subjects: string | string[],
    template: string,
    context?: any,
    forceSend = false
  ): Promise<void[]> {
    // If offline, then return immediately.
    const sendPromises: Promise<void>[] = [];
    for (let i = 0; i < recipients.length; i++) {
      sendPromises.push(
        this.sendEmail(
          transporter,
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
   * @param transporter The mail transporter to use (determines the from address).
   * @param accounts The account to send the email to.
   * @param subjects The subject of the email.
   * @param template The handlebars (hbs) template to use for the body of the email.
   * @param context The optional context containing variables that may be injected into the handlebars template.
   * @param forceSend Set to true if the email should be sent to an account even if it has disabled email messages. Defaults to false.
   * @return A promise that emits when the operation has completed.
   */
  sendEmail(
    transporterKey: MailTransporter,
    recipient: Recipient,
    subject: string,
    template: string,
    context?: any,
    forceSend = false
  ): Promise<void> {
    // If offline, or the target account has disabled email notifications, then return immediately.
    if (!this._shouldSendEmail(forceSend, recipient)) {
      return Promise.resolve();
    }
    context = this._fillMissingContext(context, recipient, template);

    return new Promise<void>((resolve: () => void, reject: (error: Error) => void) => {
      const transporter: Transporter = this.transporters[transporterKey];
      const mailOpts: Mail.Options = {
        from: env[`${transporterKey}_EMAIL`],
        to: this._extractRecipientTo(recipient),
        subject,
        html: genHandlebarsTemplate('email-container', context)
      };

      transporter.sendMail(
        mailOpts,
        (err: any) => {
          if (err) {
            console.error(err);
            reject(new Error(`Failed to send template ${template} to ${mailOpts.to}`));
          } else {
            resolve();
          }
        }
      );

      this._sendAdminEmails(transporter, mailOpts);
    });
  }

  /**
   * Determines whether or not an email should be sent to a given account.
   * @param forceSend If set to true, then sends the email even if the account has emails disabled.
   * @param recipient The recipient that the email is to be sent to.
   * @return true if the email should be sent, false if not.
   */
  private _shouldSendEmail(forceSend: boolean, recipient: Recipient): boolean {
    const account = <Account>recipient;
    return (forceSend || !account.contactInfo || account.contactInfo.enableEmail);
  }

  /**
   * Fills in the missing (hbs) template context variables that are universally used in all email templates.
   * @param context The context that shall be filled.
   * @param recipient The recipient that the email is to be sent to.
   * @param template The (hbs) template that is to be used for the email body.
   * @return The filled (hbs) template context (copy of input context).
   */
  private _fillMissingContext(context: any, recipient: Recipient, template: string): any {
    context = (context ? Object.assign({}, context) : {});
    context = this._fillMissingAccountContext(context, <Account>recipient);
    context = this._fillMissingSimpleRecipientContext(context, <SimpleRecipient>recipient);
    context.emailContent = template;
    context.env = (context.env ? context.env : env);
    context.year = (context.year ? context.year : new Date().getFullYear());
    return context;
  }

  /**
   * Fills in missing (hbs) template context account variables that are universally used in all email templates.
   * @param context The context that shall be filled (INTERNALLY MODIFIED).
   * @param account The account that the email is to be sent to. If null, then no filling occurs.
   * @return The filled (hbs) template context.
   */
  private _fillMissingAccountContext(context: any, account: Account): any {
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
  private _fillMissingSimpleRecipientContext(context: any, recipient: SimpleRecipient): any {
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
  private _extractRecipientTo(recipient: Recipient): string {
    if (recipient) {
      return ((<Account>recipient).contactInfo)
        ? (<Account>recipient).contactInfo.email
        : (<SimpleRecipient>recipient).email;
    }
    return '';
  }

  /**
   * Sends an email to all configured admin recipients.
   * @param transporter The mail transporter that will be used to send the admin emails.
   * @param mailOpts The mail options that were used to send the standard email to its target.
   */
  private _sendAdminEmails(transporter: Transporter, mailOpts: Mail.Options): void {
    const adminRecipients: string[] = this._getAdminRecipients(<string>mailOpts.to);
    adminRecipients.forEach((adminRecipient: string) => {
      const adminMailOpts = Object.assign({}, mailOpts);
      adminMailOpts.to = adminRecipient;
      transporter.sendMail(adminMailOpts, (err: any) => (err) ? console.error(err) : undefined);
    });
  }

  /**
   * Gets all recipients for an email. Adds all configured (via env) admin email recipients to each outgoing email.
   * @param to The (main) recipient of the email.
   * @return The list of recipients of the email.
   */
  private _getAdminRecipients(to: string): string[] {
    return (env.ADMIN_EMAILS)
      ? env.ADMIN_EMAILS.filter((email: string) => email !== to)
      : [];
  }

}

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

/**
 * Generates/gets a singleton instance of the MailClient.
 * @return A promise that resolves to the MailClient.
 */
export async function getMailClient(): Promise<MailClient> {
  return MailClient.getInstance();
}
