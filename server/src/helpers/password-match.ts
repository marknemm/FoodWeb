import { getRepository } from 'typeorm';
import { compare } from 'bcrypt';
import { PasswordEntity } from '../entity/password.entity';
import { Account } from '../shared';

export async function checkPasswordMatch(account: Account, password: string): Promise<boolean> {
  return (await getPasswordId(account, password)) != null;
}

export async function getPasswordId(account: Account, password: string): Promise<number> {
  const passwordEntity: PasswordEntity = await getRepository(PasswordEntity)
    .findOne({
      account: { id: account.id }
    });
  const passwordMatch: boolean = await compare(password, passwordEntity.passwordHash);
  return (passwordMatch ? passwordEntity.id : null);
}
