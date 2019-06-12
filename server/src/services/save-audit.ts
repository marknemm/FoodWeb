import { getConnection, EntityManager } from 'typeorm';
import { AuditEntity } from '../entity/audit.entity';
import { Audit, AuditEventType } from '../../../shared/src/interfaces/audit/audit';

export function saveCreationAudit<T>(eventType: AuditEventType, data: T, recaptchaScore?: number): Promise<AuditEntity<T>> {
  return _saveAudit({ eventType, data: { new: data } });
}

export function saveUpdateAudit<T>(eventType: AuditEventType, oldData: T, newData: T, recaptchaScore?: number): Promise<AuditEntity<T>> {
  return _saveAudit({ eventType, data: { old: oldData, new: newData } })
}

function _saveAudit<T>(audit: Audit<T>): Promise<AuditEntity<T>> {
  return getConnection().transaction((manager: EntityManager) =>
    manager.getRepository(AuditEntity).save(audit)
  );
}
