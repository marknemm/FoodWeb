import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ConfirmDialogService } from '~web/shared/confirm-dialog/confirm-dialog.service';

@Directive({
  selector: '[foodWebConfirmButton]'
})
export class ConfirmButtonDirective {

  @Input() confirmCondition = true;
  @Input() confirmTitle = 'Confirm Action';
  @Input() confirmMessage = 'Please confirm that you wish to continue.';

  @Output() clickConfirm = new EventEmitter();

  constructor(
    private _confirmDialogService: ConfirmDialogService
  ) {}

  @HostListener('click')
  onClick(): void {
    const confirmObs$: Observable<boolean> = this._genConfirmObs();
    confirmObs$.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.clickConfirm.emit();
      }
    });
  }

  private _genConfirmObs(): Observable<boolean> {
    return (this.confirmCondition)
      ? this._confirmDialogService.displayConfirmDialog(this.confirmMessage, this.confirmTitle)
      : of(true)
  }

}
