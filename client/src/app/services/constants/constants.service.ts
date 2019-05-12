import { Injectable } from '@angular/core';
import { Constants } from '../../../../../shared/src/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService extends Constants {

  ACCOUNT_TYPE_ICONS = {
    Donor: 'card_giftcard',
    Receiver: 'shopping_basket',
    Driver: 'time_to_leave',
    Admin: 'vpn_key'
  };
}
