import { FormArray, FormControl, FormGroup } from '@angular/forms';

export interface Editable {
  editing: boolean;
  formGroup?: FormGroup;
  formArray?: FormArray;
  formControl?: FormControl;
}
