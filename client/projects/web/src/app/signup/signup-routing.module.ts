import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupVerificationComponent } from '~web/signup/signup-verification/signup-verification.component';
import { SignupComponent } from '~web/signup/signup/signup.component';

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
