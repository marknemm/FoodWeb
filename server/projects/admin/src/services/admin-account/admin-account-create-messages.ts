import { NewAccountData } from '~admin/services/admin-account/admin-save-account';
import { AccountEntity } from '~entity';
import { AdminAccountCreateOptions } from '~shared';
import { getMailClient, MailClient, MailTransporter } from '~web/helpers/messaging/email';
import { sendAccountVerificationEmail } from '~web/services/account/account-verification-message';

/**
 * Sends account creation messages for newly created accounts.
 * @param accountCreateOpts The account creation options.
 * @param newAccountData The new account data (account & verfication data).
 * @param password The password that was set for the new account.
 * @return A promise that resolves to the new account once the message(s) have been sent.
 */
export async function adminSendAccountCreateMessages(
  accountCreateOpts: AdminAccountCreateOptions,
  newAccountData: NewAccountData,
  password: string
): Promise<AccountEntity> {
  if (accountCreateOpts.autoGenPassword) {
    await adminSendAutoGenPasswordEmail(accountCreateOpts.autoVerify, newAccountData, password);
  } else if (!accountCreateOpts.autoVerify) {
    await sendAccountVerificationEmail(newAccountData.account, newAccountData.unverifiedAccount);
  }
  return newAccountData.account;
}

/**
 * Sends an email to the person associated with a newly created account requesting that they reset their auto generated password.
 * Also may include an account verification link if the account was not auto-verified.
 * @param autoVerify Whether or not the new account has been auto verified (meaning no email verification needed).
 * @param newAccountData The new account data (account & verification data).
 * @param password The password that was set for the new account.
 * @return A promise that resolves once the message(s) have been sent.
 */
async function adminSendAutoGenPasswordEmail(autoVerify: boolean, newAccountData: NewAccountData, password: string): Promise<void> {
  const mailClient: MailClient = await getMailClient();
  const verificationToken: string = (autoVerify ? undefined : newAccountData.unverifiedAccount.verificationToken);
  const emailSubject: string = (autoVerify ? 'Please Reset Your FoodWeb Password' : 'Verify New FoodWeb Account');

  return mailClient.sendEmail(
    MailTransporter.NOREPLY,
    newAccountData.account,
    emailSubject,
    'account-creation-auto-gen-password',
    { autoVerify, password, verificationToken },
    true
  ).catch(console.error);
}
