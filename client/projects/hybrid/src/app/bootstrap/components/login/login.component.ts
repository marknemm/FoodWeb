import { Component, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { LoginComponent as WebLoginComponent } from '~web/session/components/login/login.component';

@Component({
  selector: 'foodweb-hybrid-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends WebLoginComponent {

  @ViewChild('password', { static: false }) password: IonInput;

}
