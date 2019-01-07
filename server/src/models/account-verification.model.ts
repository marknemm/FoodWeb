import { EntityManager, getManager, getRepository, Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { AccountEntity } from '../entity/account.entity';
import { MailTransporter, sendEmail } from '../helpers/email';
import { FoodWebError } from '../helpers/food-web-error';
import { UnverifiedAccountEntity } from '../entity/unverified-account.entity';

export async function saveUnverifiedAccount(account: AccountEntity, manager: EntityManager = getManager()): Promise<void> {
  const unverifiedAccountEntity: UnverifiedAccountEntity = _genUnverifiedAccountEntity(account);
  await manager.getRepository(UnverifiedAccountEntity).save(unverifiedAccountEntity);
  _sendAccountVerificationEmail(account, unverifiedAccountEntity.verificationToken);
}

export async function verifyAccount(account: AccountEntity, verificationToken: string): Promise<AccountEntity> {
  const repo: Repository<UnverifiedAccountEntity> = getRepository(UnverifiedAccountEntity);
  const unverifiedAccount: UnverifiedAccountEntity = await repo.findOne({
    where: { account, verificationToken }
  });

  if (!unverifiedAccount) {
    throw new FoodWebError('Signup verification was unsuccessful. Either the account does not exist or it has already been verified.');
  }
  
  repo.delete(unverifiedAccount);
  account.verified = true;
  return account;
}

function _genUnverifiedAccountEntity(account: AccountEntity): UnverifiedAccountEntity {
  const verificationToken: string = randomBytes(10).toString('hex'); // Gen 20 char token.
  const unverifiedAccountEntity = new UnverifiedAccountEntity();
  unverifiedAccountEntity.verificationToken = verificationToken;
  unverifiedAccountEntity.account = account;
  return unverifiedAccountEntity;
}

async function _sendAccountVerificationEmail(account: AccountEntity, verificationToken: string): Promise<void> {
  return sendEmail(
    MailTransporter.NOREPLY,
    account.contactInfo.email,
    'Verify New FoodWeb Account',
    'account-verification',
    account,
    { verificationToken }
  );
}
