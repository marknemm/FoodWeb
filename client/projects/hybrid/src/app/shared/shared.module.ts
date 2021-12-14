import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { KeyValueStoreService as WebKeyValueStoreService } from '~web/shared/services/key-value-store/key-value-store.service';
import { PageProgressService as WebPageProgressService } from '~web/shared/services/page-progress/page-progress.service';
import { SharedModule as WebSharedModule } from '~web/shared/shared.module';
import { HeaderComponent } from './child-components/header/header.component';
import { RequirementsChecklistComponent } from './child-components/requirements-checklist/requirements-checklist.component';
import { FocusNextDirective } from './directives/focus-next/focus-next.directive';
import { IonMaskDirective } from './directives/ion-mask/ion-mask.directive';
import { KeyValueStoreService } from './services/key-value-store/key-value-store.service';
import { PageProgressService } from './services/page-progress/page-progress.service';

@NgModule({
  declarations: [
    FocusNextDirective,
    HeaderComponent,
    IonMaskDirective,
    RequirementsChecklistComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    WebSharedModule,
  ],
  exports: [
    // Works as if we are extending the base Web SharedModule.
    WebSharedModule,
    FocusNextDirective,
    HeaderComponent,
    IonMaskDirective,
    RequirementsChecklistComponent,
  ]
})
export class SharedModule {

  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        // In base web code, anywhere where KeyValueStoreService is provided, provide Hybrid KeyValueStoreService instead.
        { provide: WebKeyValueStoreService, useExisting: KeyValueStoreService },
        { provide: WebPageProgressService, useExisting: PageProgressService },
      ]
    }
  }
}
