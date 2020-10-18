import { Component } from '@angular/core';
import { EditSaveButtonBaseComponent } from './edit-save-button.base.component';

@Component({
  selector: 'foodweb-edit-save-button',
  templateUrl: './edit-save-button.component.html',
  styleUrls: ['./edit-save-button.component.scss']
})
export class EditSaveButtonComponent<T = any> extends EditSaveButtonBaseComponent<T> {}
