import { Injectable } from '@angular/core';
import { ContactInfo } from '../../../../../shared/src/interfaces/account/account';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() {}

  genHref(contactInfo: ContactInfo): string {
    return `https://maps.google.com/?q=${contactInfo.streetAddress}, ${contactInfo.stateProvince}, ${contactInfo.city}, ${contactInfo.postalCode}`;
  }
}
