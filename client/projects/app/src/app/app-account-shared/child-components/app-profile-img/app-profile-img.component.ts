import { Component } from '@angular/core';
import { FormBaseComponent, formProvider } from '~web/data-structure/form-base-component';

@Component({
  selector: 'foodweb-app-profile-img',
  templateUrl: './app-profile-img.component.html',
  styleUrls: ['./app-profile-img.component.scss'],
  providers: formProvider(AppProfileImgComponent)
})
export class AppProfileImgComponent extends FormBaseComponent<string> {}
