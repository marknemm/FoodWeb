/**
 * Mobile device data pertaining to each user's unique phone/tablet.
 */
export interface MobileDevice {
  uuid: string;
  accountId?: number;
  isVirtual?: boolean;
  manufacturer?: string;
  model?: string;
  name?: string;
  operatingSystem?: string;
  osVersion?: string;
  platform?: string;
  pushRegistrationId?: string;
}
