import { getRepository } from 'typeorm';
import { compare } from 'bcrypt';
import { PasswordEntity } from '../entity/password.entity';
import { Account } from '../../../shared/src/interfaces/account';

export async function checkPasswordMatch(account: Account, password: string): Promise<boolean> {
  return (await getPasswordId(account, password)) !== -1;
}

export async function getPasswordId(account: Account, password: string): Promise<number> {
  const passwordWrapper: PasswordEntity = await getRepository(PasswordEntity)
    .findOne({
      account: { id: account.id }
    });
  const passwordMatch: boolean = await compare(password, passwordWrapper.passwordHash);
  return (passwordMatch ? passwordWrapper.id : null);
}
