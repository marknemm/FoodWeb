import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AdminDonationForm } from '~admin/admin-donation/forms/admin-donation.form';
import { ConfirmDialogService } from '~web/shared/services/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'foodweb-admin-donation-form',
  templateUrl: './admin-donation-form.component.html',
  styleUrls: ['./admin-donation-form.component.scss'],
})
export class AdminDonationFormComponent implements OnInit {

  readonly minDate = new Date('1/1/2018');

  @Input() cancelButtonTxt = 'Cancel';
  @Input() formGroup: AdminDonationForm;
  @Input() showCancelButton = false;
  @Input() submitButtonTxt = 'Submit';

  @Output() submitDonation = new EventEmitter<AdminDonationForm>();
  @Output() cancel = new EventEmitter<void>();

  constructor(
    private _confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit() {}

  onSubmit(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.submitDonation.emit(this.formGroup);
    }
  }

  onCancel(): void {
    const confirm$: Observable<boolean> = (this.formGroup.dirty)
      ? this._confirmDialogService.displayConfirmDialog(
          'Are you sure you wish to discard your changes?',
          'Confirm Cancel Donation Edit',
          'Yes',
          'No'
        )
      : of(true);
    confirm$.subscribe((cancelEdit: boolean) =>
      (cancelEdit) ? this.cancel.emit() : undefined
    );
  }

}
