import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ConfirmDialogService } from '~web/shared/services/confirm-dialog/confirm-dialog.service';

@Component({ template: '' })
export class EditSaveButtonBaseComponent<T = any> implements OnChanges {

  @Input() cancelText = 'Cancel';
  @Input() control: AbstractControl;
  @Input() disableSave = false;
  @Input() editable = false;
  @Input() editText = 'Edit';
  @Input() noCancelEdit = false;
  @Input() saveText = 'Save';
  @Input() useButtonText = false;

  /**
   * A callback function that will be called whenever the associated data should be saved.
   */
  @Input() saveCb: SaveCb<T> = null;

  /**
   * Emits the edit state whenever a change is made to it.
   */
  @Output() edit = new EventEmitter<boolean>();
  /**
   * Emits whenever the save button has been selected.
   */
  @Output() save = new EventEmitter();

  protected _lastSaveValue: T;

  constructor(
    protected _confirmDialogService: ConfirmDialogService
  ) {}

  /**
   * Whether or not the save button is disabled.
   */
  get isSaveDisabled(): boolean {
    return (this.control && this.control.invalid) || this.disableSave;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.control) {
      this._lastSaveValue = (this.control ? this.control.value : null);
    }
  }

  /**
   * Emits a save event if the associated form is valid and dirty.
   * If the form is valid and not dirty, then it sets the editable state to false.
   */
  saveValue(): void {
    (this.control)
      ? this._saveValueFormControl()
      : this._saveNoFormControl();
  }

  /**
   * Saves the current value of the contained form control (if it is valid and dirty).
   */
  protected _saveValueFormControl(): void {
    // Return immediately without saving if form control is invalid.
    if (this.control.invalid) { return; }
    if (this.control.dirty) {
      this.save.emit();
      if (this.saveCb) {
        this.saveCb(this.control.value).subscribe((success: boolean) => {
          if (success) {
            this._lastSaveValue = this.control.value;
            this.setEditing(false, true);
          }
        });
      }
    } else {
      // Simply set editable to false if there have been no updates.
      this.setEditing(false);
    }
  }

  /**
   * Simply invokes the save callback without a defined value when no form control is set.
   */
  protected _saveNoFormControl(): void {
    this.save.emit();
    if (this.saveCb) {
      this.saveCb(undefined).subscribe((success: boolean) => {
        if (success) {
          this.setEditing(false, true);
        }
      });
    }
  }

  /**
   * Sets and emits the new editable state.
   * @param editable The editable state to set.
   * @param force If set to true, then forces the setting of the edit state.
   * This means that the user will not be asked to confirm the change. Default is false.
   */
  setEditing(editable: boolean, force = false): void {
    const confirm$: Observable<boolean> = (this.editable && !editable && !force)
      ? this._getCancelEditConfirmObs()
      : of(true);
    // Wait for user to confirm cancel of edit if the associated form is dirty.
    confirm$.subscribe((confirm: boolean) => {
      if (confirm) {
        this.editable = editable;
        if (this.control && this.saveCb) {
          this._resetAbstractControl();
        }
        this.edit.emit(editable);
      }
    });
  }

  /**
   * Generates a cancel edit confirmation observable.
   * @return The generated confirmation observable. If there is a set form control that is dirty, then the user is prompted
   * via dialog to confirm edit cancellation. Otherwise, simply returns an observable that immediately emits true.
   */
  protected _getCancelEditConfirmObs(): Observable<boolean> {
    return (this.control && this.control.dirty) ?
      this._confirmDialogService.displayConfirmDialog(
        'Are you sure you wish to cancel your changes? You will lose all unsaved changes.',
        'Confirm Cancel',
        'Yes',
        'No'
      ) :
      of(true);
  }

  /**
   * Resets the state of the contained control to that which was last saved.
   */
  protected _resetAbstractControl(): void {
    if (this.control) {
      this.control.setValue(this._lastSaveValue);
      this.control.markAsUntouched();
      this.control.markAsPristine();
    }
  }
}

/**
 * A save callback function.
 * @param value The value to be saved.
 * @return An observable that should emit true once the value has been successfully saved.
 * It is expected to emit false or an error if the save fails.
 */
export type SaveCb<T = any> = (value: T) => Observable<boolean>;
