import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeveloperPortalComponent } from '~admin/developer/developer-portal/developer-portal.component';

const routes: Routes = [
  { path: '', component: DeveloperPortalComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeveloperRoutingModule {}
