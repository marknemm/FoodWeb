import { getRepository } from 'typeorm';
import { compare } from 'bcrypt';
import { PasswordEntity } from '../entity/password.entity';
import { Account } from '../../../shared/src/interfaces/account';

export async function checkPasswordMatch(account: Account, password: string): Promise<boolean> {
  const passwordWrapper: PasswordEntity = await getRepository(PasswordEntity)
    .findOne({
      account: {
        id: account.id
      }
    });
  return compare(password, passwordWrapper.passwordHash);
}
