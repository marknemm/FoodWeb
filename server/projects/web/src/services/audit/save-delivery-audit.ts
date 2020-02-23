import { AccountEntity } from 'database/src/entity/account.entity';
import { DonationEntity } from 'database/src/entity/donation.entity';
import { UpdateDiff } from '~web/interfaces/update-diff';
import { DeliveryScheduleRequest, DeliveryStateChangeRequest, DonationStatus } from '~shared';
import { AuditEventType, getAuditAccounts, saveAudit, saveUpdateAudit } from './save-audit';

export function saveDeliveryScheduleAudit(scheduleReq: DeliveryScheduleRequest, scheduledDelivery: DonationEntity): Promise<DonationEntity> {
  const auditAccounts: AccountEntity[] = getAuditAccounts(scheduledDelivery);
  return saveAudit(AuditEventType.ScheduleDelivery, auditAccounts, scheduledDelivery, scheduleReq.recaptchaScore);
}

export function saveDeliveryAdvanceAudit(stateChangeReq: DeliveryStateChangeRequest, advancedDonation: DonationEntity): Promise<DonationEntity> {
  const auditAccounts: AccountEntity[] = getAuditAccounts(advancedDonation);
  return saveAudit(AuditEventType.DeliveryStateAdvance, auditAccounts, advancedDonation, stateChangeReq.recaptchaScore);
}

export function saveDeliveryUndoAudit(
  stateChangeReq: DeliveryStateChangeRequest,
  undoDiff: UpdateDiff<DonationEntity>
): Promise<UpdateDiff<DonationEntity>> {
  const auditAccounts: AccountEntity[] = getAuditAccounts(undoDiff.old);
  const eventType: AuditEventType = (undoDiff.new.donationStatus !== DonationStatus.Matched)
    ? AuditEventType.DeliveryStateUndo
    : AuditEventType.CancelDelivery;
  return saveUpdateAudit(eventType, auditAccounts, undoDiff, stateChangeReq.recaptchaScore);
}
