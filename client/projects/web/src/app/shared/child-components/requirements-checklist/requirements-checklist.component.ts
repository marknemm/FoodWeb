import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormFieldService } from '~web/forms';

@Component({
  selector: 'foodweb-requirements-checklist',
  templateUrl: './requirements-checklist.component.html',
  styleUrls: ['./requirements-checklist.component.scss'],
  providers: [FormFieldService]
})
export class RequirementsChecklistComponent implements OnChanges {

  @Input() checklistMembers: string[] = [];
  @Input() checkAll: string | false = 'Check all items';
  @Input() get value(): boolean        { return this._formFieldService.valueOut() }
           set value(checked: boolean) { this._formFieldService.valueIn(checked); }

  constructor(
    private _formFieldService: FormFieldService<{ [key: string]: boolean }, FormGroup<{ [key: string]: FormControl<boolean> }>, boolean>
  ) {
    this._formFieldService.registerControl(new FormGroup<{ [key: string]: FormControl<boolean> }>({}), {
      valueInConverter: (valueIn: boolean) => {
        const value: { [key: string]: boolean } = this._formFieldService.value;
        for (const key in value) {
          value[key] = valueIn;
        }
        return value;
      },
      valueOutConverter: (value: { [key: string]: boolean }) => {
        let valueOut = true;
        for (const key in value) {
          valueOut = (valueOut && value[key]);
        }
        return valueOut;
      }
    });
  }

  get checklistForm(): FormGroup<{ [key: string]: FormControl<boolean> }> {
    return this._formFieldService.control;
  }

  get ngErrorClass(): { error: boolean } {
    return { error: this._formFieldService.externalControl.touched && this.checklistForm.invalid };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.checklistMembers) {
      for (const controlName in this.checklistForm.controls) {
        this.checklistForm.removeControl(controlName);
      }
      for (let i = 0; i < this.checklistMembers.length; i++) {
        this.checklistForm.addControl(`check${i}`, new FormControl<boolean>(false, Validators.requiredTrue));
      }
    }
  }

  toggleSelectAll(selectAll: boolean): void {
    const value = {};
    for (const controlName in this.checklistForm.controls) {
      value[controlName] = selectAll;
    }
    this.checklistForm.setValue(value);
  }

}
