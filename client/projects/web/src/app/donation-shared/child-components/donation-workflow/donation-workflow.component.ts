import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Account, Donation, DonationHelper, DonationStatus } from '~shared';
import { Convert } from '~web/component-decorators';
import { DonationAction } from '~web/donation-shared/services/donation-actions/donation-actions.service';

@Component({
  selector: 'foodweb-donation-workflow',
  templateUrl: './donation-workflow.component.html',
  styleUrls: ['./donation-workflow.component.scss'],
})
export class DonationWorkflowComponent implements OnChanges {

  readonly DonationStatus = DonationStatus;
  readonly workflowSteps: DonationWorkflowStep[] = [
    {
      class: 'unmatched', status: DonationStatus.Unmatched, title: 'Donation Unmatched',
      description: 'The donation has not yet been matched with a receiving chairty.',
      donorDescription: 'Your donation has not yet been matched with a receiving charity.'
    },
    {
      class: 'matched', status: DonationStatus.Matched, title: 'Donation Matched',
      description: 'The donation has been matched with a receiving charity, and is awaiting a volunteer to schedule its delivery.',
      donorDescription: 'Your donation has been matched with a receiving chairty, and is awaiting to be scheduled for delivery.',
      receiverDescription: 'You have been matched with this donation, and it is awaiting to be scheduled for delivery.'
    },
    {
      class: 'scheduled', status: DonationStatus.Scheduled, title: 'Delivery Scheduled',
      description: 'The donation has been scheduled for delivery by a volunteer, and is awaiting the start of the delivery.',
      donorDescription: 'Your donation has been scheduled for delivery, and is awaiting the start of the delivery.',
      receiverDescription: 'Your matched donation has been scheduled for delivery, and is awaiting the start of the delivery.',
      volunteerDescription: 'You have scheduled this delivery, and may start the delivery near the beginning of the pickup window.'
    },
    {
      class: 'started', status: DonationStatus.Started, title: 'Delivery Started',
      description: 'The donation has been started by a volunteer, who is on route to pickup the donation from its donor.',
      donorDescription: 'A volunteer is on route to pickup your donation.',
      receiverDescription: 'A volunteer is on route to pickup your matched donation from its donor.',
      volunteerDescription: 'You have started the delivery, and are on route to pickup the donation from its donor.'
    },
    {
      class: 'picked-up', status: DonationStatus.PickedUp, title: 'Delivery Picked Up',
      description: 'The donation has been picked up by a volunteer. It is on route to be dropped off at its receiving charity.',
      donorDescription: 'A volunteer has picked up your donation and is on route to drop it off at its receiving charity.',
      receiverDescription: 'A volunteer has picked up your matched donation and is on route to drop it off at your location.',
      volunteerDescription: 'You have picked up the donation, and are on route to drop it off at its receiver.'
    },
    {
      class: 'complete', status: DonationStatus.Complete, title: 'Delivery Complete',
      description: 'The donation has been dropped off at its receiving charity. Its delivery is complete.',
      donorDescription: 'The delivery of your donation is complete.',
      receiverDescription: 'The delivery of your matched donation is complete.',
      volunteerDescription: 'You have completed the delivery.'
    }
  ];

  @Input() donation: Donation;
  @Input() donationUpdateForm: FormGroup;
  @Input() myAccount: Account;
  @Convert()
  @Input() showAllStatuses: boolean = false;

  @Output() action = new EventEmitter<DonationAction>();

  private _toggleShowAllStatusesTxt = 'Show all statuses';

  constructor(
    private _donationHelper: DonationHelper
  ) {}

  get toggleShowAllStatusesTxt(): string {
    return this._toggleShowAllStatusesTxt;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.showAllStatuses) {
      this._updateToggleShowAllStatusesTxt();
    }
  }

  /**
   * Updates the text for the toggle show all statuses button based off of the showAllStatuses state.
   */
  private _updateToggleShowAllStatusesTxt(): void {
    this._toggleShowAllStatusesTxt = (this.showAllStatuses)
      ? 'Hide inactive statuses'
      : 'Show all statuses';
  }

  /**
   * Determines whether or not a given donation workflow step is active.
   * @param workflowStep The workflow step to check.
   * @return true if it is active, false if not.
   */
  isWorkflowStepActive(workflowStep: DonationWorkflowStep): boolean {
    return (workflowStep.status === this.donation.donationStatus);
  }

  /**
   * Gets the potentially personalized description to display for a given workflow step.
   * @param workflowStep The workflow step for which to get the description.
   * @return The description for the workflow step.
   */
  getStepDescription(workflowStep: DonationWorkflowStep): string {
    let description: string = workflowStep.description;
    if (this._donationHelper.isDonationDonor(this.donation, this.myAccount)) {
      if (workflowStep.donorDescription) {
        description = workflowStep.donorDescription;
      }
    } else if (this._donationHelper.isDonationReceiver(this.donation, this.myAccount)) {
      if (workflowStep.receiverDescription) {
        description = workflowStep.receiverDescription;
      }
    } else if (this._donationHelper.isDonationVolunteer(this.donation, this.myAccount)) {
      if (workflowStep.volunteerDescription) {
        description = workflowStep.volunteerDescription;
      }
    }
    return description;
  }

  /**
   * Toggles the visibility of all (inactive) statuses.
   */
  toggleShowAllStatuses(): void {
    this.showAllStatuses = !this.showAllStatuses;
    this._updateToggleShowAllStatusesTxt();
  }

}

interface DonationWorkflowStep {
  class: string;
  description: string;
  donorDescription?: string;
  receiverDescription?: string;
  volunteerDescription?: string;
  status: DonationStatus;
  title: string;
}
