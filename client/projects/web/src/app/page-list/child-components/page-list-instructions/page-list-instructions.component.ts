import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  selector: 'foodweb-page-list-instructions',
  templateUrl: './page-list-instructions.component.html',
  styleUrls: ['./page-list-instructions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageListInstructionsComponent {

  @HostBinding() class = 'foodweb-page-list-instructions standalone-statement';

}
