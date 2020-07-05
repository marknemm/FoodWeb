import { AccountEntity, MapRouteEntity } from '~entity';
import { DonationStatus } from '~shared';

export interface ClaimedDonationSaveData {
  id: number;
  donationStatus: DonationStatus;
  claim: DonationClaimSaveData;
}

export interface DonationClaimSaveData {
  id?: number;
  receiverAccount: AccountEntity;
  routeToReceiver: MapRouteEntity;
  dropOffWindowStart: Date;
  dropOffWindowEnd: Date;
}
