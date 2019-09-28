import { saveAudit, getAuditAccounts, AuditEventType, saveUpdateAudit } from "./save-audit";
import { UpdateDiff } from "../interfaces/update-diff";
import { AccountEntity } from "../entity/account.entity";
import { Donation, DonationStatus } from "../../../shared/src/interfaces/donation/donation";
import { DeliveryScheduleRequest } from "../../../shared/src/interfaces/delivery/delivery-schedule-request";
import { DeliveryStateChangeRequest } from "../interfaces/delivery/delivery-state-change-request";

export function saveDeliveryScheduleAudit(scheduleReq: DeliveryScheduleRequest, scheduledDelivery: Donation): Promise<Donation> {
  const auditAccounts: AccountEntity[] = getAuditAccounts(scheduledDelivery);
  return saveAudit(AuditEventType.ScheduleDelivery, auditAccounts, scheduledDelivery, scheduleReq.recaptchaScore);
}

export function saveDeliveryAdvanceAudit(stateChangeReq: DeliveryStateChangeRequest, advancedDonation: Donation): Promise<Donation> {
  const auditAccounts: AccountEntity[] = getAuditAccounts(advancedDonation);
  return saveAudit(AuditEventType.DeliveryStateAdvance, auditAccounts, advancedDonation, stateChangeReq.recaptchaScore);
}

export function saveDeliveryUndoAudit(
  stateChangeReq: DeliveryStateChangeRequest,
  undoDiff: UpdateDiff<Donation>
): Promise<UpdateDiff<Donation>> {
  const auditAccounts: AccountEntity[] = getAuditAccounts(undoDiff.old);
  const eventType: AuditEventType = (undoDiff.new.donationStatus !== DonationStatus.Matched)
    ? AuditEventType.DeliveryStateUndo
    : AuditEventType.CancelDelivery;
  return saveUpdateAudit(eventType, auditAccounts, undoDiff, stateChangeReq.recaptchaScore);
}
