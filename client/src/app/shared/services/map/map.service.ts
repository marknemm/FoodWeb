import { Injectable } from '@angular/core';
import { ContactInfo } from '../../../../../../shared/src/interfaces/account/account';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() {}

  genLocationHref(addressInfo: ContactInfo | string): string {
    return (typeof addressInfo === 'string')
      ? `https://maps.google.com/?q=${addressInfo}`
      : `https://maps.google.com/?q=${addressInfo.streetAddress}, ${addressInfo.stateProvince}, ${addressInfo.city}, ${addressInfo.postalCode}`;
  }

  genDirectionHref(addressInfo: ContactInfo | string): string {
    return (typeof addressInfo === 'string')
      ? `https://www.google.com/maps?saddr=My+Location&daddr=${addressInfo}`
      : `https://www.google.com/maps?saddr=My+Location&daddr=${addressInfo.streetAddress}, ${addressInfo.stateProvince}, ${addressInfo.city}, ${addressInfo.postalCode}`;
  }
}
