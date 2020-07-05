export interface AppData {
  deviceUuid: string;
  devicePlatform?: string;
  deviceModel?: string;
  deviceVersion?: string;
  deviceManufacturer?: string;
  deviceSerial?: string;
  deviceIsVirtual?: boolean;
  pushRegistrationId?: string;
  accountId?: number;
}
