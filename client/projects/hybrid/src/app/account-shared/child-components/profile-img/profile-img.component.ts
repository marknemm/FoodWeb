import { Component } from '@angular/core';
import { ProfileImgComponent as WebProfileImgComponent } from '~web/account-shared/child-components/profile-img/profile-img.component';
import { FormFieldService } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-profile-img',
  templateUrl: './profile-img.component.html',
  styleUrls: ['./profile-img.component.scss'],
  providers: [FormFieldService]
})
export class ProfileImgComponent extends WebProfileImgComponent {}
