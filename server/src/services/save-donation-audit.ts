import { Donation } from '../../../shared/src/interfaces/donation/donation';
import { DonationCreateRequest } from '../../../shared/src/interfaces/donation/donation-create-request';
import { DonationDeleteRequest } from '../../../shared/src/interfaces/donation/donation-delete-request';
import { DonationUpdateRequest } from '../../../shared/src/interfaces/donation/donation-update-request';
import { AccountEntity } from '../entity/account.entity';
import { DonationClaimRequest } from '../interfaces/donation-claim/donation-claim-request';
import { DonationUnclaimRequest } from '../interfaces/donation-claim/donation-unclaim-request';
import { UpdateDiff } from '../interfaces/update-diff';
import { AuditEventType, getAuditAccounts, saveAudit, saveUpdateAudit } from './save-audit';

export function saveDonationCreateAudit(createReq: DonationCreateRequest, donation: Donation): Promise<Donation> {
  const auditAccounts: AccountEntity[] = getAuditAccounts(donation);
  return saveAudit(AuditEventType.Donate, auditAccounts, donation, createReq.recaptchaScore);
}

export function saveDonationClaimAudit(claimReq: DonationClaimRequest, claimedDonation: Donation): Promise<Donation> {
  const auditAccounts: AccountEntity[] = getAuditAccounts(claimedDonation);
  return saveAudit(AuditEventType.ClaimDonation, auditAccounts, claimedDonation, claimReq.recaptchaScore);
}

export function saveDonationUpdateAudit(
  updateReq: DonationUpdateRequest,
  donationDiff: UpdateDiff<Donation>
): Promise<UpdateDiff<Donation>> {
  const auditAccounts: AccountEntity[] = getAuditAccounts(donationDiff.old);
  return saveUpdateAudit(AuditEventType.UpdateDonation, auditAccounts, donationDiff, updateReq.recaptchaScore);
}

export function saveDonationDeleteAudit(deleteReq: DonationDeleteRequest, deletedDonation: Donation): Promise<Donation> {
  const auditAccounts: AccountEntity[] = getAuditAccounts(deletedDonation);
  return saveAudit(AuditEventType.RemoveDonation, auditAccounts, deletedDonation, deleteReq.recaptchaScore);
}

export function saveDonationUnclaimAudit(
  unclaimReq: DonationUnclaimRequest,
  unclaimDonationDiff: UpdateDiff<Donation>
): Promise<UpdateDiff<Donation>> {
  const auditAccounts: AccountEntity[] = getAuditAccounts(unclaimDonationDiff.old);
  return saveUpdateAudit(AuditEventType.UnclaimDonation, auditAccounts, unclaimDonationDiff, unclaimReq.recaptchaScore);
}
