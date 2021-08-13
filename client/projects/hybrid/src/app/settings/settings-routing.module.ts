import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGaurdService } from '~web/session/services/auth-gaurd/auth-gaurd.service';
import { SettingsPortalComponent } from './components/settings-portal/settings-portal.component';

const routes: Routes = [
  { path: '', component: SettingsPortalComponent },
  // { path: 'my', component: AccountDetailsComponent, canActivate: [AuthGaurdService] },
  // { path: 'details', component: AccountDetailsComponent },
  // { path: 'details/:id', component: AccountDetailsComponent },
  // { path: 'list', component: AccountsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
