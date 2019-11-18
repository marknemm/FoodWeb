import { Injectable } from '@angular/core';
import { Constants } from '~shared';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService extends Constants {

  ACCOUNT_TYPE_ICONS = {
    Donor: 'card_giftcard',
    Receiver: 'shopping_basket',
    Volunteer: 'time_to_leave',
    Admin: 'vpn_key'
  };
}
