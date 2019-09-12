import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AbstractControl, FormGroupDirective } from '@angular/forms';
import { FormHelperService } from 'src/app/shared/services/form-helper/form-helper.service';

@Component({
  selector: 'food-web-edit-save-button',
  templateUrl: './edit-save-button.component.html',
  styleUrls: ['./edit-save-button.component.scss']
})
export class EditSaveButtonComponent implements OnInit {

  @Input() editing = false;
  @Input() controlName: string;
  @Input() control: AbstractControl;
  @Input() disableSave = false;
  @Input() useButtonText = false;

  @Output() edit = new EventEmitter<boolean>();
  @Output() save = new EventEmitter();

  constructor(
    private _formGroupDirective: FormGroupDirective,
    private _formHelperService: FormHelperService
  ) {}

  get isSaveDisabled(): boolean {
    return (!this.control || this.control.invalid || this.disableSave);
  }

  ngOnInit() {
    this.control = this._formHelperService.deriveAbstractControl(this.control, this.controlName, this._formGroupDirective);
  }
}
