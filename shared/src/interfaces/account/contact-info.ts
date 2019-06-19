export interface GeographyLocation {
  type: string;
  coordinates: [number, number];
}

export interface ContactInfo {
  id?: number;
  email: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  location?: GeographyLocation;
  timezone?: string;
}
