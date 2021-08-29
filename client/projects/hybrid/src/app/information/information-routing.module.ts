import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { MessageUsComponent } from './components/message-us/message-us.component';

const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'message-us', component: MessageUsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformationRoutingModule {}