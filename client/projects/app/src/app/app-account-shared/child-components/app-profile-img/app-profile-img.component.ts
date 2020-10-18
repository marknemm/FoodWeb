import { Component, OnInit } from '@angular/core';
import { ProfileImgBaseComponent } from '~web/account-shared/child-components/profile-img/profile-img.base.component';
import { formProvider } from '~web/data-structure/form-base-component';

@Component({
  selector: 'foodweb-app-profile-img',
  templateUrl: './app-profile-img.component.html',
  styleUrls: ['./app-profile-img.component.scss'],
  providers: formProvider(AppProfileImgComponent)
})
export class AppProfileImgComponent extends ProfileImgBaseComponent implements OnInit {}
