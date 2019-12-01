import { compare } from 'bcrypt';
import { getRepository } from 'typeorm';
import { PasswordEntity } from '../entity/password.entity';
import { Account } from '../shared';

/**
 * Checks if a given password matches the current password that is on-record for a given account.
 * @param account The account that the password is associated with.
 * @param password The password to check.
 * @return A promise that resolves to true if the password matches, false if not.
 */
export async function checkPasswordMatch(account: Account, password: string): Promise<boolean> {
  return (await getPasswordId(account, password)) != null;
}

/**
 * Gets the ID of the password entry associated with a given account.
 * @param account The account that the password is associated with.
 * @param password The password to match.
 * @return A promise that resolves to the ID of the password entry.
 * Resolves to null if the given password hash does not match the password entry's password hash.
 */
export async function getPasswordId(account: Account, password: string): Promise<number> {
  const passwordEntity: PasswordEntity = await getRepository(PasswordEntity)
    .findOne({
      account: { id: account.id }
    });
  const passwordMatch: boolean = await compare(password, passwordEntity.passwordHash);
  return (passwordMatch ? passwordEntity.id : null);
}
