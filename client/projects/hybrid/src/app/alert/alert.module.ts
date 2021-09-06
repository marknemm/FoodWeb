import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AlertService } from '~hybrid/alert/services/alert/alert.service';
import { AlertService as WebAlertService } from '~web/alert/services/alert/alert.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [],
  providers: [
    { provide: WebAlertService, useClass: AlertService }
  ]
})
export class AlertModule {

  static forRoot(): ModuleWithProviders<AlertModule> {
    return {
      ngModule: AlertModule,
      providers: [
        // In base web code, anywhere where AlertService is provided, provide Hybrid AlertService instead.
        { provide: WebAlertService, useExisting: AlertService },
      ]
    }
  }
}
