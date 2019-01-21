import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';

interface EditSection {
  controls: AbstractControl[];
  origVals: any[];
}

@Injectable()
export class SectionEditService {

  private readonly _editSections: { [sectionName: string]: EditSection } = {};

  constructor(
    private _confirmDialogService: ConfirmDialogService
  ) {}

  editing(sectionName: string): boolean {
    return !!this._editSections[sectionName];
  }

  toggleEdit(sectionName: string, controls: AbstractControl[]): void {
    if (this._editSections[sectionName]) {
      this.cancelEdit(sectionName);
    } else {
      this.startEdit(sectionName, controls);
    }
  }

  startEdit(sectionName: string, controls: AbstractControl[]): void {
    this._editSections[sectionName] = {
      controls,
      origVals: controls.map((control: AbstractControl) => control.value)
    };
  }

  stopEdit(sectionName: string): void {
    delete this._editSections[sectionName];
  }

  cancelEdit(sectionName: string): void {
    this._getCancelEditConfirmObs(sectionName).subscribe((confirm: boolean) => {
      if (confirm) {
        this._resetControls(sectionName);
        this.stopEdit(sectionName);
      }
    });
  }

  private _getCancelEditConfirmObs(sectionName: string): Observable<boolean> {
    const controls: AbstractControl[] = this._editSections[sectionName].controls;
    const dirty: boolean = controls.reduce((dirtyAcc: boolean, control: AbstractControl) => (dirtyAcc || control.dirty), false);
    return (dirty) ?
      this._confirmDialogService.displayConfirmDialog(
        'Are you sure you wish to cancel your changes? You will lose all unsaved changes.',
        'Confirm Cancel',
        [{ text: 'Yes', value: true, cdkFocusPrimary: true }, { text: 'No', value: false, color: 'warn' }]
      ) :
      of(true);
  }

  private _resetControls(sectionName: string): void {
    this._editSections[sectionName].controls.forEach((control: AbstractControl, idx: number) => {
      const resetValue: any = this._editSections[sectionName].origVals[idx];
      control.reset(resetValue);
    });
  }

  shouldSaveSection(sectionName: string): boolean {
    const [pristine, valid]: [boolean, boolean] = this._getSectionPristineValid(sectionName);
    if (pristine) {
      this.stopEdit(sectionName);
    }
    return (valid && !pristine);
  }

  private _getSectionPristineValid(sectionName: string): [boolean, boolean] {
    return this._editSections[sectionName].controls.reduce(
      (pristineValid: [boolean, boolean], control: AbstractControl) => {
        return ([pristineValid[0] && control.pristine, pristineValid[1] && control.valid] as [boolean, boolean]);
      },
      ([true, true] as [boolean, boolean])
    );
  }
}
