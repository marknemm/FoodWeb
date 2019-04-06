import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DonationService, Donation } from '../../services/donation/donation.service';
import { SessionService } from '../../services/session/session.service';
import { SectionEditService } from '../../services/section-edit/section-edit.service';
import { DonationFormComponent } from '../../child-components/donation-form/donation-form.component';
import { AccountHelper } from '../../../../../shared/src/helpers/account-helper';
import { DonationHelper } from '../../../../../shared/src/helpers/donation-helper';

@Component({
  selector: 'food-web-donation-details',
  templateUrl: './donation-details.component.html',
  styleUrls: ['./donation-details.component.scss'],
  providers: [SectionEditService]
})
export class DonationDetailsComponent implements OnInit, OnDestroy {

  @ViewChild(DonationFormComponent) donationFormComponent: DonationFormComponent;

  readonly donationForm = new FormGroup({});

  private _canEdit = false;
  private _myDonation = false;
  private _donationNotFound = false;
  private _originalDonation: Donation;
  private _destroy$ = new Subject();

  constructor(
    public sectionEditService: SectionEditService<FormGroup>,
    public accountHelper: AccountHelper,
    public donationHelper: DonationHelper,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _donationService: DonationService,
    private _sessionService: SessionService
  ) {}

  get canEdit(): boolean {
    return this._canEdit;
  }

  get editing(): boolean {
    return this.sectionEditService.editing(this.donationForm);
  }

  get myDonation(): boolean {
    return this._myDonation;
  }

  get originalDonation(): Donation {
    return this._originalDonation;
  }

  get donationNotFound(): boolean {
    return this._donationNotFound;
  }

  ngOnInit() {
    this._listenDonationChange();
  }

  ngOnDestroy() {
    this._destroy$.next();
  }

  saveDonation(): void {
    if (this.sectionEditService.shouldSaveSection(this.donationForm)) {
      const donationUpdate: Partial<Donation> = this.donationFormComponent.donationUpdate;
      this._donationService.updateDonation(this._originalDonation, donationUpdate).subscribe(
        (savedDonation: Donation) => {
          this._originalDonation = savedDonation;
          this.sectionEditService.stopEdit(this.donationForm);
        }
      );
    } else {
      this.sectionEditService.stopEdit(this.donationForm);
    }
  }

  deleteDonation(): void {
    this._donationService.deleteDonation(this._originalDonation).subscribe(() =>
      this._router.navigate(['/donations'])
    );
  }

  private _listenDonationChange(): void {
    this._donationService.listenDonationQueryChange(this._activatedRoute).pipe(
      takeUntil(this._destroy$)
    ).subscribe((donation: Donation) => {
      setTimeout(() => {
        this._donationNotFound = !donation;
        if (!this._donationNotFound) {
          this._originalDonation = donation;
          this._myDonation = this._sessionService.isMyAccount(donation.donorAccount.id);
          this._canEdit = !this.donationHelper.validateDonationEditPrivilege(donation, this._sessionService.account);
        }
      });
    });
  }

}
