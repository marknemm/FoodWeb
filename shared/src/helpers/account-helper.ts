import { Account } from '../interfaces/account/account';
import { Validation } from '../constants/validation';
import { FoodWebError } from './food-web-error';
export { Account };

export class AccountHelper {

  isAdmin(account: Account): boolean {
    return (account && account.accountType === 'Admin');
  }

  isDonor(account: Account, ignoreAdmin = false): boolean {
    return (account && (account.accountType === 'Donor' || (!ignoreAdmin && this.isAdmin(account))));
  }

  isReceiver(account: Account, ignoreAdmin = false): boolean {
    return (account && (account.accountType === 'Receiver' || (!ignoreAdmin && this.isAdmin(account))));
  }

  isMyAccount(myAccount: Account, accountId: number, ignoreAdmin = false): boolean {
    return (myAccount && (myAccount.id === accountId || (!ignoreAdmin && this.isAdmin(myAccount))));
  }

  validateAccount(myAccount: Account, account: Account): void {
    if (!Validation.ACCOUNT_REGEX.test(account.accountType) && (account.accountType !== 'Admin' || (myAccount && myAccount.accountType === 'Admin'))) {
      throw new FoodWebError('Invalid account type');
    }
    if (!Validation.EMAIL_REGEX.test(account.contactInfo.email)) {
      throw new FoodWebError('Invalid email address');
    }
    if (!Validation.PHONE_REGEX.test(account.contactInfo.phoneNumber)) {
      throw new FoodWebError('Invalid phone number');
    }
    if (!Validation.POSTAL_CODE_REGEX.test(account.contactInfo.postalCode)) {
      throw new FoodWebError('Invalid zip/postal code');
    }
  }

  validatePassword(password: string): void {
    if (!Validation.PASSWORD_REGEX.test(password)) {
      throw new FoodWebError('Password must contain at least 6 characters');
    }
  }
}
