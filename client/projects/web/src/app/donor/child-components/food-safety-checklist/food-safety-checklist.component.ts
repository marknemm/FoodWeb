import { Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'food-web-food-safety-checklist',
  templateUrl: './food-safety-checklist.component.html',
  styleUrls: ['./food-safety-checklist.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FoodSafetyChecklistComponent), multi: true }
  ]
})
export class FoodSafetyChecklistComponent implements OnInit, OnDestroy, ControlValueAccessor {

  readonly checklistEntries = [
    'Food Storage Area is Clean and Orderly',
    'Proper personal hygiene observed while prepping food',
    'Perishable food has been kept at appropriate temperatures',
    'No bulging or leaking cans or packaging',
    'No mold or rot on bread or produce',
    'Food does not appear to be going bad',
    // Add checklist item here, and it will automatically be taken care of by FormGroup validity status.
  ];

  safetyChecklistForm: FormGroup;

  private _destroy$ = new Subject();

  constructor() {}

  ngOnInit() {
    this.safetyChecklistForm = new FormGroup({});
    for (let i = 0; i < this.checklistEntries.length; i++) {
      this.safetyChecklistForm.addControl(`check${i}`, new FormControl(false, Validators.requiredTrue));
    }
  }

  ngOnDestroy() {
    this._destroy$.next();
  }

  writeValue(value: boolean): void {
    Object.keys(this.safetyChecklistForm.controls).forEach((controlKey: string) => {
      this.safetyChecklistForm.get(controlKey).setValue(value ? true : false);
    });
  }

  registerOnChange(cbFunction: (allChecked: boolean) => void): void {
    this.safetyChecklistForm.statusChanges.pipe(
      takeUntil(this._destroy$)
    ).subscribe(() => cbFunction(this.safetyChecklistForm.valid));
  }

  toggleSelectAll(selectAll: boolean): void {
    Object.keys(this.safetyChecklistForm.controls).forEach((controlName: string) =>
      this.safetyChecklistForm.get(controlName).setValue(selectAll)
    );
  }

  registerOnTouched(_: any): void {}
}
