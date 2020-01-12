import { AccountEntity } from '../../entity/account.entity';
import { UpdateDiff } from '../../interfaces/update-diff';
import { DonationClaimRequest, DonationCreateRequest, DonationDeleteRequest, DonationUnclaimRequest, DonationUpdateRequest } from '../../shared';
import { AuditEventType, getAuditAccounts, saveAudit, saveUpdateAudit } from './save-audit';
import { DonationEntity } from '../../entity/donation.entity';

export function saveDonationCreateAudit(createReq: DonationCreateRequest, donation: DonationEntity): Promise<DonationEntity> {
  const auditAccounts: AccountEntity[] = getAuditAccounts(donation);
  return saveAudit(AuditEventType.Donate, auditAccounts, donation, createReq.recaptchaScore);
}

export function saveDonationClaimAudit(claimReq: DonationClaimRequest, claimedDonation: DonationEntity): Promise<DonationEntity> {
  const auditAccounts: AccountEntity[] = getAuditAccounts(claimedDonation);
  return saveAudit(AuditEventType.ClaimDonation, auditAccounts, claimedDonation, claimReq.recaptchaScore);
}

export function saveDonationUpdateAudit(
  updateReq: DonationUpdateRequest,
  donationDiff: UpdateDiff<DonationEntity>
): Promise<UpdateDiff<DonationEntity>> {
  const auditAccounts: AccountEntity[] = getAuditAccounts(donationDiff.old);
  return saveUpdateAudit(AuditEventType.UpdateDonation, auditAccounts, donationDiff, updateReq.recaptchaScore);
}

export function saveDonationDeleteAudit(deleteReq: DonationDeleteRequest, deletedDonation: DonationEntity): Promise<DonationEntity> {
  const auditAccounts: AccountEntity[] = getAuditAccounts(deletedDonation);
  return saveAudit(AuditEventType.RemoveDonation, auditAccounts, deletedDonation, deleteReq.recaptchaScore);
}

export function saveDonationUnclaimAudit(
  unclaimReq: DonationUnclaimRequest,
  unclaimDonationDiff: UpdateDiff<DonationEntity>
): Promise<UpdateDiff<DonationEntity>> {
  const auditAccounts: AccountEntity[] = getAuditAccounts(unclaimDonationDiff.old);
  return saveUpdateAudit(AuditEventType.UnclaimDonation, auditAccounts, unclaimDonationDiff, unclaimReq.recaptchaScore);
}
