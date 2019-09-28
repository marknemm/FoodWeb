import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from '../signup/components/signup/signup.component';
import { AppShellComponent } from '../app-shell/domain-components/app-shell/app-shell.component';
import { HomeComponent } from '../components/home/home.component';
import { MobileBootGuardService } from './services/mobile-boot-guard/mobile-boot-guard.service';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'mobile/home' },
  {
    path: '',
    component: AppShellComponent,
    children: [
      { path: 'home', component: HomeComponent, canActivate: [MobileBootGuardService] }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MobileRoutingModule {}
