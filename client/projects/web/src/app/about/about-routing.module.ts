import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { PrivacyStatementComponent as PrivacyStatementComponent } from './components/privacy-statement/privacy-statement.component';

const routes: Routes = [
  { path: 'privacy-statement', component: PrivacyStatementComponent },
  { path: '', component: AboutComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutRoutingModule {}
