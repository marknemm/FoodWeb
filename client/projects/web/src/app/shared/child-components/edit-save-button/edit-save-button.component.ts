import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ConfirmDialogService } from '~web/shared/confirm-dialog/confirm-dialog.service';
import { Editable } from '~web/shared/editable';

@Component({
  selector: 'food-web-edit-save-button',
  templateUrl: './edit-save-button.component.html',
  styleUrls: ['./edit-save-button.component.scss']
})
export class EditSaveButtonComponent<T = any> implements OnChanges {

  @Input() control: AbstractControl;
  @Input() disableSave = false;
  @Input() editable: Editable;
  @Input() editing = false;
  @Input() noCancelEdit = false;
  @Input() useButtonText = false;

  /**
   * A callback function that will be called whenever the associated data should be saved.
   */
  @Input() saveCb: SaveCb<T> = () => of(false);

  /**
   * Emits the edit state whenever a change is made to it.
   */
  @Output() edit = new EventEmitter<boolean>();
  /**
   * Emits whenever the save button has been selected.
   */
  @Output() save = new EventEmitter();

  private _lastSaveValue: T;

  constructor(
    private _confirmDialogService: ConfirmDialogService
  ) {}

  /**
   * Whether or not the save button is disabled.
   */
  get isSaveDisabled(): boolean {
    return (this.control && this.control.invalid) || this.disableSave;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.control || this.editable) {
      this._handleAbstractControlUpdate();
    }
    if (changes.editing) {
      this._updateEditingProps(this.editing);
    }
  }

  /**
   * Handles the update of the abstract control associated with the save-edit buttons.
   */
  private _handleAbstractControlUpdate(): void {
    this.control = (this.editable)
      ? this.control = this._deriveFormControlFromEditable()
      : this.control;
    this._lastSaveValue = (this.control ? this.control.value : null);
  }

  /**
   * Attempts to derive the abstract form control (group, array, or simple control)
   * used for editing from the input Editable value.
   * @return The derived abstract form control if one exists. Otherwise, null.
   */
  private _deriveFormControlFromEditable(): AbstractControl {
    if (this.editable) {
      if (this.editable.formGroup) {
        return this.editable.formGroup;
      }
      if (this.editable.formArray) {
        return this.editable.formArray;
      }
      if (this.editable.formControl) {
        return this.editable.formControl;
      }
    }
    return null;
  }

  /**
   * Updates the editing properties in this component and an input Editable object if it exists.
   * @param editing The editing state to set.
   */
  private _updateEditingProps(editing: boolean): void {
    this.editing = editing;
    if (this.editable) {
      this.editable.editing = editing;
    }
  }

  /**
   * Emits a save event if the associated form is valid and dirty.
   * If the form is valid and not dirty, then it sets the editing state to false.
   */
  saveValue(): void {
    (this.control)
      ? this._saveValueFormControl()
      : this._saveNoFormControl();
  }

  /**
   * Saves the current value of the contained form control (if it is valid and dirty).
   */
  private _saveValueFormControl(): void {
    // Return immediately without saving if form control is invalid.
    if (this.control.invalid) { return; }
    if (this.control.dirty) {
      this.save.emit();
      this.saveCb(this.control.value).subscribe((success: boolean) => {
        if (success) {
          this._lastSaveValue = this.control.value;
          this.setEditing(false, true);
        }
      });
    } else {
      // Simply set editing to false if there have been no updates.
      this.setEditing(false);
    }
  }

  /**
   * Simply invokes the save callback without a defined value when no form control is set.
   */
  private _saveNoFormControl(): void {
    this.save.emit();
    this.saveCb(undefined).subscribe((success: boolean) => {
      if (success) {
        this.setEditing(false, true);
      }
    });
  }

  /**
   * Sets and emits the new editing state.
   * @param editing The editing state to set.
   * @param force If set to true, then forces the setting of the edit state.
   * This means that the user will not be asked to confirm the change. Default is false.
   */
  setEditing(editing: boolean, force = false): void {
    const confirm$: Observable<boolean> = (this.editing && !editing && !force)
      ? this._getCancelEditConfirmObs()
      : of(true);
    // Wait for user to confirm cancel of edit if the associated form is dirty.
    confirm$.subscribe((confirm: boolean) => {
      if (confirm) {
        this._updateEditingProps(editing);
        if (this.editable && !editing) {
          this._resetAbstractControl();
        }
        this.edit.emit(editing);
      }
    })
  }

  /**
   * Generates a cancel edit confirmation observable.
   * @return The generated confirmation observable. If there is a set form control that is dirty, then the user is prompted
   * via dialog to confirm edit cancellation. Otherwise, simply returns an observable that immediately emits true.
   */
  private _getCancelEditConfirmObs(): Observable<boolean> {
    return (this.control && this.control.dirty) ?
      this._confirmDialogService.displayConfirmDialog(
        'Are you sure you wish to cancel your changes? You will lose all unsaved changes.',
        'Confirm Cancel',
        [{ text: 'Yes', value: true, cdkFocusPrimary: true }, { text: 'No', value: false, color: 'warn' }]
      ) :
      of(true);
  }

  /**
   * Resets the state of the contained control to that which was last saved.
   */
  private _resetAbstractControl(): void {
    if (this.control) {
      this.control.patchValue(this._lastSaveValue);
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
