import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AppShellModule } from '../app-shell/app-shell.module';
import { MobileBootGuardService } from './services/mobile-boot-guard/mobile-boot-guard.service';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    SharedModule,
    AppShellModule
  ],
  exports: [LoginComponent],
  providers: [MobileBootGuardService]
})
export class MobileModule {}
