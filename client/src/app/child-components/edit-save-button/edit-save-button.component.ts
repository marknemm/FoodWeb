import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { AbstractControl, FormGroupDirective } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'food-web-edit-save-button',
  templateUrl: './edit-save-button.component.html',
  styleUrls: ['./edit-save-button.component.scss']
})
export class EditSaveButtonComponent implements OnInit, OnDestroy {

  @Input() editing = false;
  @Input() formControlNames: string[] | string;
  @Input() formControls: AbstractControl[] | AbstractControl;
  @Input() disableSave = false;

  @Output() edit = new EventEmitter<boolean>();
  @Output() save = new EventEmitter();

  _disableSave = false;

  private _destroy$ = new Subject();

  constructor(
    private _formGroupDirective: FormGroupDirective
  ) {}

  ngOnInit() {
    this._ensureArrFormControls();
    this._getFormControlsFromNames();
    this._listenFormControlUpdates();
    this._updateDisableSave();
  }

  ngOnDestroy() {
    this._destroy$.next();
  }

  private _ensureArrFormControls(): void {
    if (typeof this.formControlNames === 'string') {
      this.formControlNames = [this.formControlNames];
    }
    if (this.formControls instanceof AbstractControl) {
      this.formControls = [this.formControls];
    }
  }

  private _getFormControlsFromNames(): void {
    if (this.formControlNames) {
      this.formControls = (this.formControls ? this.formControls : []);
      (this.formControlNames as string[]).forEach((formControlName: string) =>
        (this.formControls as AbstractControl[]).push(this._formGroupDirective.form.get(formControlName))
      );
    }
  }

  private _listenFormControlUpdates(): void {
    if (this.formControls) {
      (this.formControls as AbstractControl[]).forEach((control: AbstractControl) =>
        control.valueChanges.pipe(takeUntil(this._destroy$)).subscribe(
          this._updateDisableSave.bind(this)
        )
      );
    }
  }

  private _updateDisableSave(): void {
    this._disableSave = (this.formControls as AbstractControl[]).reduce(
      (invalid: boolean, control: AbstractControl) => (invalid || control.invalid),
      false
    );
  }
}
