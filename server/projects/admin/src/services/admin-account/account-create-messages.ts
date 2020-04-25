import { NewAccountData } from "~admin/services/admin-account/admin-save-account";
import { AccountEntity } from "~entity";
import { AccountCreateOptions } from "~shared";
import { MailTransporter, sendEmail } from "~web/helpers/messaging/email";
import { sendAccountVerificationEmail } from "~web/services/account/account-verification-message";

export async function sendAccountCreateMessages(
  accountCreateOpts: AccountCreateOptions,
  newAccountData: NewAccountData,
  password: string
): Promise<AccountEntity> {
  if (accountCreateOpts.autoGenPassword) {
    await sendAutoGenPasswordEmail(accountCreateOpts.autoVerify, newAccountData, password);
  } else if (!accountCreateOpts.autoVerify) {
    await sendAccountVerificationEmail(newAccountData.account, newAccountData.unverifiedAccount);
  }
  return newAccountData.account;
}

async function sendAutoGenPasswordEmail(autoVerify: boolean, newAccountData: NewAccountData, password: string): Promise<void> {
  const verificationToken: string = (autoVerify ? undefined : newAccountData.unverifiedAccount.verificationToken);
  const emailSubject: string = (autoVerify ? 'Please Reset Your FoodWeb Password' : 'Verify New FoodWeb Account');

  return sendEmail(
    MailTransporter.NOREPLY,
    newAccountData.account,
    emailSubject,
    'account-creation-auto-gen-password',
    { autoVerify, password, verificationToken },
    true
  ).catch(console.error);
}
