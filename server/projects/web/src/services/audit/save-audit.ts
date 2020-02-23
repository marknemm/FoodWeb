import { EntityManager, getConnection } from 'typeorm';
import { AccountEntity } from 'database/src/entity/account.entity';
import { AuditEntity } from 'database/src/entity/audit.entity';
import { UpdateDiff } from '~web/interfaces/update-diff';
import { AuditEventType, Donation } from '~shared';
export { AuditEntity, AuditEventType };

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
  if (donation.claim) {
    auditAccounts.push(<AccountEntity>donation.claim.receiverAccount);
    if (donation.claim.delivery) {
      auditAccounts.push(<AccountEntity>donation.claim.delivery.volunteerAccount);
    }
  }
  return auditAccounts;
}
