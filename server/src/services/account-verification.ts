import { EntityManager, getManager, getRepository, Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { sendAccountVerificationEmail } from './account-verification-message';
import { AccountEntity } from '../entity/account.entity';
import { UnverifiedAccountEntity } from '../entity/unverified-account.entity';
import { FoodWebError } from '../helpers/food-web-error';
import { saveAudit } from './save-audit';
import { AccountVerificationRequest } from '../../../shared/src/interfaces/account/account-verification-request';

export async function createUnverifiedAccount(account: AccountEntity, manager: EntityManager = getManager()): Promise<void> {
  const unverifiedAccount: UnverifiedAccountEntity = _genUnverifiedAccountEntity(account);
  await manager.getRepository(UnverifiedAccountEntity).save(unverifiedAccount);
  await sendAccountVerificationEmail(account, unverifiedAccount.verificationToken);
}

export async function resendVerificationEmail(myAccount: AccountEntity): Promise<void> {
  const repo: Repository<UnverifiedAccountEntity> = getRepository(UnverifiedAccountEntity);
  const unverifiedAccount: UnverifiedAccountEntity = await repo.findOne({ where: { account: myAccount } });
  if (!unverifiedAccount) {
    throw new FoodWebError('Account already verified or account verification period expired.');
  }
  unverifiedAccount.verificationToken = _genVerificationToken();
  await repo.save(unverifiedAccount); // Simply overwrite existing entry.
  await sendAccountVerificationEmail(myAccount, unverifiedAccount.verificationToken) 
}

export async function verifyAccount(account: AccountEntity, verificationReq: AccountVerificationRequest): Promise<AccountEntity> {
  const verificationToken: string = verificationReq.verificationToken;
  const repo: Repository<UnverifiedAccountEntity> = getRepository(UnverifiedAccountEntity);
  const unverifiedAccount: UnverifiedAccountEntity = await repo.findOne({
    where: (account) ? { account, verificationToken } : { verificationToken }
  });

  if (!unverifiedAccount) {
    throw new FoodWebError('Signup verification was unsuccessful. Either the account does not exist or it has already been verified.');
  }

  repo.delete(unverifiedAccount);

  if (account && account.id === unverifiedAccount.account.id) {
    account.verified = true;
  }
  saveAudit('Verify Account', account, account, undefined, verificationReq.recaptchaScore);
  return account;
}

function _genUnverifiedAccountEntity(account: AccountEntity): UnverifiedAccountEntity {
  const verificationToken: string = _genVerificationToken();
  const unverifiedAccountEntity = new UnverifiedAccountEntity();
  unverifiedAccountEntity.verificationToken = verificationToken;
  unverifiedAccountEntity.account = account;
  return unverifiedAccountEntity;
}

function _genVerificationToken(): string {
  return randomBytes(10).toString('hex'); // Gen 20 char token.
}