import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { FormBaseComponent, FormHelperService, formProvider, TFormControl } from '~web/forms';

@Component({
  selector: 'foodweb-requirements-checklist',
  templateUrl: './requirements-checklist.component.html',
  styleUrls: ['./requirements-checklist.component.scss'],
  providers: formProvider(RequirementsChecklistComponent)
})
export class RequirementsChecklistComponent extends FormBaseComponent<boolean> implements OnChanges, OnDestroy {

  @Input() checklistMembers: string[] = [];
  @Input() checkAll = 'Check all items';

  checklistForm = new FormGroup({});

  constructor(
    formHelperService: FormHelperService
  ) {
    super(() => new TFormControl<boolean>(false), formHelperService);
  }

  get ngErrorClass(): any {
    return { error: this.formControl.touched && this.checklistForm.invalid };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.checklistMembers) {
      this.checklistForm = new FormGroup({});
      for (let i = 0; i < this.checklistMembers.length; i++) {
        this.checklistForm.addControl(`check${i}`, new FormControl(false, Validators.requiredTrue));
      }
    }
    super.ngOnChanges(changes);
  }

  writeValue(value: boolean): void {
    this.toggleSelectAll(value);
    super.writeValue(value);
  }

  registerOnChange(cbFunction: (allChecked: boolean) => void): void {
    this.checklistForm.statusChanges.pipe(
      takeUntil(this._destroy$)
    ).subscribe(() => cbFunction(this.checklistForm.valid));
  }

  toggleSelectAll(selectAll: boolean): void {
    for (const controlName in this.checklistForm.controls) {
      if (this.checklistForm.controls.hasOwnProperty(controlName)) {
        this.checklistForm.get(controlName).setValue(selectAll);
      }
    }
  }
}
