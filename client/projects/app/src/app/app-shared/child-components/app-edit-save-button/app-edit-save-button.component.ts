import { Component } from '@angular/core';
import { EditSaveButtonBaseComponent } from '~web/shared/child-components/edit-save-button/edit-save-button.base.component';

@Component({
  selector: 'foodweb-app-edit-save-button',
  templateUrl: './app-edit-save-button.component.html',
  styleUrls: ['./app-edit-save-button.component.scss']
})
export class AppEditSaveButtonComponent extends EditSaveButtonBaseComponent {}
