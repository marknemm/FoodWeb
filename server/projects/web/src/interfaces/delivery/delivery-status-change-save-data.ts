import { DonationStatus } from '~shared';

export interface DonationStatusChangeSaveData {
  id: number;
  donationStatus: DonationStatus;
  claim: {
    id: number;
    delivery: DeliveryStatusChangeSaveData;
  };
}

export interface DeliveryStatusChangeSaveData {
  id: number;
  pickupWindowStart?: Date;
  pickupWindowEnd?: Date;
  dropOffWindowStart?: Date;
  dropOffWindowEnd?: Date;
  startTime?: Date;
  pickupTime?: Date;
  dropOffTime?: Date;
}
