import { Component, OnInit } from '@angular/core';
import { TypedFormControl } from '~web/data-structure/typed-form-control';
import { PageTitleService } from '~web/shared/page-title/page-title.service';

@Component({
  selector: 'food-web-compose-message',
  templateUrl: './compose-message.component.html',
  styleUrls: ['./compose-message.component.scss'],
})
export class ComposeMessageComponent implements OnInit {

  readonly messageCtrl = new TypedFormControl<string>();

  constructor(
    pageTitleService: PageTitleService
  ) {
    pageTitleService.title = 'Compose Message';
  }

  ngOnInit() {}

}
