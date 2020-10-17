import { Validators } from '@angular/forms';
import { Volunteer } from '~shared';
import { TFormGroup } from '~web/data-structure/t-form-group';

export class VolunteerForm extends TFormGroup<VolunteerFormT> {

  constructor(volunteer?: Partial<VolunteerFormT>) {
    super({
      id: undefined,
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      fullName: ['', [Validators.required, Validators.pattern(/^(\s*[^\s]+\s+[^\s]+\s*)+$/)]],
      signedAgreement: [false, Validators.required]
    });
    if (volunteer) {
      this.patchValue(volunteer);
    }
    this._maintainNameFieldSync();
  }

  get firstName(): string {
    return this.get('firstName').value;
  }

  get fullName(): string {
    return this.get('fullName').value;
  }

  get lastName(): string {
    return this.get('lastName').value;
  }

  private _maintainNameFieldSync(): void {
    // Initialize name fields in a synced state.
    (this.get('fullName').valid)
      ? this._deriveFirstLastName()
      : this._deriveFullName();
    this.get('firstName').valueChanges.subscribe(() => this._deriveFullName());
    this.get('lastName').valueChanges.subscribe(() => this._deriveFullName());
    this.get('fullName').valueChanges.subscribe(() => this._deriveFirstLastName());
  }

  private _deriveFullName(): void {
    const fullName = (this.firstName && this.lastName) // All or nothing.
      ? `${this.get('firstName').value} ${this.get('lastName').value}`
      : '';

    this.get('fullName').setValue(fullName, { emitEvent: false });
  }

  private _deriveFirstLastName(): void {
    if (this.get('fullName').valid) {
      const firstLastNameSplits: string[] = this.fullName.trim().split(/\s+/g);
      const lastNameStartIdx: number = Math.min(2, Math.floor(firstLastNameSplits.length / 2));
      this.get('firstName').setValue(firstLastNameSplits.slice(0, lastNameStartIdx).join(' '));
      this.get('lastName').setValue(firstLastNameSplits.slice(lastNameStartIdx).join(' '));
    } else {
      // If full name is changed an invalid, then clear out first/last name.
      this.get('firstName').setValue('', { emitEvent: false });
      this.get('lastName').setValue('', { emitEvent: false });
    }
  }
}

export interface VolunteerFormT extends Volunteer {
  fullName: string;
}
