import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Convert } from '~web/component-decorators';
import { ConfirmDialogService } from '~web/shared/services/confirm-dialog/confirm-dialog.service';

@Component({ template: '' })
export class EditSaveButtonBaseComponent<T = any> implements OnChanges {

  @Input() cancelText = 'Cancel';
  @Input() control: AbstractControl;
  @Convert()
  @Input() disableSave: boolean = false;
  @Convert()
  @Input() editable: boolean = false;
  @Input() editText = 'Edit';
  @Convert()
  @Input() noCancelEdit: boolean = false;
  @Input() saveText = 'Save';
  @Convert()
  @Input() useButtonText: boolean = false;

  /**
   * Emits the edit state whenever a change is made to it.
   */
  @Output() edit = new EventEmitter<boolean>();
  /**
   * Emits a save success callback function whenever the save button has been selected.
   * Upon successful save by an external entity, the save callback should be invoked to update the edit state.
   */
  @Output() save = new EventEmitter<() => void>();

  protected _lastSaveValue: T;

  constructor(
    protected _confirmDialogService: ConfirmDialogService
  ) {}

  /**
   * Whether or not the save button is disabled.
   */
  get saveDisabled(): boolean {
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
      : this.save.emit(() => this._handleSaveSuccess());
  }

  /**
   * Saves the current value of the contained form control (if it is valid and dirty).
   */
  protected _saveValueFormControl(): void {
    // Return immediately without saving if form control is invalid.
    this.control.markAsTouched();
    if (this.control.invalid) { return; }

    // Only emit a save event if changes have been made. Otherwise, simply consider save success.
    (this.control.dirty)
      ? this.save.emit(() => this._handleSaveSuccess())
      : this._handleSaveSuccess();
  }

  protected _handleSaveSuccess(): void {
    if (this.control) {
      this._lastSaveValue = this.control.value;
    }
    this.setEditingNoConfirm(false);
  }

  /**
   * Sets and emits the new editable state.
   * Displays a confirm dialog when changing editable state from true to false.
   * @param editable The editable state to set.
   */
  setEditing(editable: boolean): void {
    const confirm$: Observable<boolean> = (this.editable && !editable)
      ? this._getCancelEditConfirmObs()
      : of(true);

    // Wait for user to confirm cancel of edit if the associated form is dirty.
    confirm$.subscribe((confirm: boolean) => {
      if (confirm) {
        this.setEditingNoConfirm(editable);
      }
    });
  }

  /**
   * Sets and emits the new editable state.
   * Does not display a confirm dialog when changing editable state from true to false.
   * @param editable The editable state to set.
   */
  setEditingNoConfirm(editable: boolean): void {
    this.editable = editable;
    if (this.control) {
      this._resetAbstractControl();
    }
    this.edit.emit(editable);
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
