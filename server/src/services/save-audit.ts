import { getConnection, EntityManager } from 'typeorm';
import { AuditEntity } from '../entity/audit.entity';
import { AccountEntity } from '../entity/account.entity';
import { Audit, AuditEventType } from '../../../shared/src/interfaces/audit/audit';
import { Donation } from '../../../shared/src/interfaces/donation/donation';
export { Audit, AuditEventType };

export function saveAudit<T>(
  eventType: AuditEventType,
  accounts: AccountEntity[] | AccountEntity,
  newData: T,
  oldData?: T,
  recaptchaScore?: number
): Promise<AuditEntity<T>> {
  accounts = (accounts instanceof Array) ? accounts :  [accounts];
  return _saveAudit({
    id: undefined,
    timestamp: undefined,
    eventType,
    accounts,
    data: { old: oldData, new: newData },
    recaptchaScore
  }).catch(_handleErr.bind(this)); // Log and swallow any Audit errors so that related requests still succeed.
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
