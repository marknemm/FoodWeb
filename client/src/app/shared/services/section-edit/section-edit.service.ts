import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';

interface EditSection {
  control: AbstractControl;
  origValue: any;
}

@Injectable()
export class SectionEditService<K> {

  private readonly _editSections = new Map<K, EditSection>();

  constructor(
    private _confirmDialogService: ConfirmDialogService
  ) {}

  editing(sectionKey: K): boolean {
    return !!this._editSections.get(sectionKey);
  }

  originalValue(sectionKey: K): any {
    return this._editSections.get(sectionKey).origValue;
  }

  toggleEdit(sectionKey: K, control: AbstractControl): void {
    (this._editSections.has(sectionKey))
      ? this.cancelEdit(sectionKey)
      : this.startEdit(sectionKey, control);
  }

  startEdit(sectionKey: K, control: AbstractControl): void {
    this._editSections.set(sectionKey, { control, origValue: control.value });
  }

  shouldSaveSection(sectionKey: K): boolean {
    const control: AbstractControl = this._editSections.get(sectionKey).control;
    return (!control.pristine && control.valid);
  }

  stopEdit(sectionKey: K): void {
    this._editSections.get(sectionKey).control.markAsPristine();
    this._editSections.get(sectionKey).control.markAsUntouched();
    this._editSections.delete(sectionKey);
  }

  cancelEdit(sectionKey: K): void {
    this._getCancelEditConfirmObs(sectionKey).subscribe(
      (confirm: boolean) => {
        if (confirm) {
          this._resetControls(sectionKey);
          this.stopEdit(sectionKey);
        }
      }
    );
  }

  private _getCancelEditConfirmObs(sectionKey: K): Observable<boolean> {
    const control: AbstractControl = this._editSections.get(sectionKey).control;
    return (control.dirty) ?
      this._confirmDialogService.displayConfirmDialog(
        'Are you sure you wish to cancel your changes? You will lose all unsaved changes.',
        'Confirm Cancel',
        [{ text: 'Yes', value: true, cdkFocusPrimary: true }, { text: 'No', value: false, color: 'warn' }]
      ) :
      of(true);
  }

  private _resetControls(sectionKey: K): void {
    const resetValue: any = this._editSections.get(sectionKey).origValue;
    this._editSections.get(sectionKey).control.reset(resetValue);
  }
}
