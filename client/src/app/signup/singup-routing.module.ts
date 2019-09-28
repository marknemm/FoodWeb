import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { SignupVerificationComponent } from './components/signup-verification/signup-verification.component';

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
