import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupComponent, SignupVerificationComponent } from '~web/signup';

const routes: Routes = [
  { path: '', component: SignupComponent },
  { path: 'verification', component: SignupVerificationComponent },
  { path: ':accountType', component: SignupComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignupRoutingModule {}
