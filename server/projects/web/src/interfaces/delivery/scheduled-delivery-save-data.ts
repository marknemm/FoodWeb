import { AccountEntity, MapRouteEntity } from '~entity';
import { DonationStatus } from '~shared';

export interface ScheduledDonationSaveData {
  id: number;
  donationStatus: DonationStatus;
  claim: {
    id: number;
    delivery: ScheduledDeliverySaveData;
  };
}

export interface ScheduledDeliverySaveData {
  id?: number;
  volunteerAccount: AccountEntity;
  routeToDonor: MapRouteEntity;
  pickupWindowStart: Date;
  pickupWindowEnd: Date;
  dropOffWindowStart: Date;
  dropOffWindowEnd: Date;
}
