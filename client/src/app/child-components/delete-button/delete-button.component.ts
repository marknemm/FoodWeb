import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfirmDialogService } from '../../services/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'food-web-delete-button',
  templateUrl: './delete-button.component.html',
  styleUrls: ['./delete-button.component.scss']
})
export class DeleteButtonComponent implements OnInit {

  @Input() useButtonText = false;
  @Input() confirmTitle = 'Confirm Deletion';
  @Input() confirmMessage = 'Are you sure you wish to proceed with the deletion?';

  @Output() delete = new EventEmitter();

  constructor(
    private _confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit() {}

  confirmDelete(): void {
    this._confirmDialogService.displayConfirmDialog(this.confirmMessage, this.confirmTitle).subscribe(
      (confirmed: boolean) => {
        if (confirmed) {
          this.delete.emit();
        }
      }
    )
  }

}
