import { getConnection, EntityManager } from 'typeorm';
import { AuditEntity } from '../entity/audit.entity';
import { AccountEntity } from '../entity/account.entity';
import { Audit, AuditEventType } from '../shared';
import { Donation } from '../shared';
import { UpdateDiff } from '../interfaces/update-diff';
export { Audit, AuditEventType };

export async function saveAudit<T>(
  eventType: AuditEventType,
  accounts: AccountEntity[] | AccountEntity,
  newData: T,
  recaptchaScore?: number
): Promise<T> {
  accounts = (accounts instanceof Array) ? accounts :  [accounts];
  await _saveAudit({
    id: undefined,
    timestamp: undefined,
    eventType,
    accounts,
    data: { new: newData },
    recaptchaScore
  }).catch(_handleErr.bind(this)); // Log and swallow any Audit errors so that related requests still succeed.
  return newData;
}

export async function saveUpdateAudit<T>(
  eventType: AuditEventType,
  accounts: AccountEntity[] | AccountEntity,
  updateDiff: UpdateDiff<T>,
  recaptchaScore?: number
): Promise<UpdateDiff<T>> {
  accounts = (accounts instanceof Array) ? accounts :  [accounts];
  await _saveAudit({
    id: undefined,
    timestamp: undefined,
    eventType,
    accounts,
    data: updateDiff,
    recaptchaScore
  }).catch(_handleErr.bind(this)); // Log and swallow any Audit errors so that related requests still succeed.
  return updateDiff;
}

function _saveAudit<T>(audit: AuditEntity<T>): Promise<AuditEntity<T>> {
  return getConnection().transaction((manager: EntityManager) =>
    manager.getRepository(AuditEntity).save(audit)
  );
}

function _handleErr<T>(err: Error): AuditEntity<T> {
  console.error(err);
  return null;
}

export function getAuditAccounts(donation: Donation): AccountEntity[] {
  const auditAccounts: AccountEntity[] = [<AccountEntity>donation.donorAccount];
  if (donation.receiverAccount) {
    auditAccounts.push(<AccountEntity>donation.receiverAccount);
    if (donation.delivery) {
      auditAccounts.push(<AccountEntity>donation.delivery.volunteerAccount);
    }
  }
  return auditAccounts;
}
