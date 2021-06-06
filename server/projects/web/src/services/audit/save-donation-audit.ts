import { AccountEntity, DonationEntity } from '~entity';
import { DonationClaimRequest, DonationDeleteRequest, DonationSaveRequest, DonationUnclaimRequest } from '~shared';
import { UpdateDiff } from '~web/helpers/misc/update-diff';
import { AuditEventType, getAuditAccounts, saveAudit, saveUpdateAudit } from './save-audit';

export function saveDonationCreateAudit(createReq: DonationSaveRequest, donation: DonationEntity): Promise<DonationEntity> {
  const auditAccounts: AccountEntity[] = getAuditAccounts(donation);
  return saveAudit(AuditEventType.Donate, auditAccounts, donation);
}

export function saveDonationClaimAudit(claimReq: DonationClaimRequest, claimedDonation: DonationEntity): Promise<DonationEntity> {
  const auditAccounts: AccountEntity[] = getAuditAccounts(claimedDonation);
  return saveAudit(AuditEventType.ClaimDonation, auditAccounts, claimedDonation);
}

export function saveDonationUpdateAudit(
  updateReq: DonationSaveRequest,
  donationDiff: UpdateDiff<DonationEntity>
): Promise<UpdateDiff<DonationEntity>> {
  const auditAccounts: AccountEntity[] = getAuditAccounts(donationDiff.old);
  return saveUpdateAudit(AuditEventType.UpdateDonation, auditAccounts, donationDiff);
}

export function saveDonationDeleteAudit(deleteReq: DonationDeleteRequest, deletedDonation: DonationEntity): Promise<DonationEntity> {
  const auditAccounts: AccountEntity[] = getAuditAccounts(deletedDonation);
  return saveAudit(AuditEventType.RemoveDonation, auditAccounts, deletedDonation);
}

export function saveDonationUnclaimAudit(
  unclaimReq: DonationUnclaimRequest,
  unclaimDonationDiff: UpdateDiff<DonationEntity>
): Promise<UpdateDiff<DonationEntity>> {
  const auditAccounts: AccountEntity[] = getAuditAccounts(unclaimDonationDiff.old);
  return saveUpdateAudit(AuditEventType.UnclaimDonation, auditAccounts, unclaimDonationDiff);
}
